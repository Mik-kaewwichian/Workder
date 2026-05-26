# Workder Wallet Plan

Escrow + balance wallet, PromptPay (Thai gateway) top-up, bank withdrawals.

## Status (2026-05-18)

- ✅ **Phase 0** — decorators, 6 Prisma models, migration, typed env.
- ✅ **Phase 1** — WalletModule, ledger, PromptPay top-up (Omise + Mock), webhook. Smoke-tested end-to-end.
- ✅ **Phase 2** — EscrowModule, fee deducted from worker payout (10%), 3-day auto-release, dispute/cancel/refund; wired into application accept (atomic hold, INSUFFICIENT_FUNDS rollback); `/escrow` + `/wallet` frontend. Smoke-tested end-to-end.
- ✅ **Phase 3** — Withdrawals: bank-account CRUD (masked), request debits immediately, manual approve→PAID / reject→refund, min & insufficient guards; `/wallet` withdraw modal. Smoke-tested end-to-end. Real Omise Transfers deferred (keyless, like top-up's Omise path).
- ✅ **Phase 4** (scoped) — bank-number masking, admin dispute resolution (`POST /escrow/:id/resolve` release|refund), admin ledger reconciliation (`GET /wallet/admin/reconcile`). Reconcile verified `ok:true` across all wallets after every phase's money movement.
  - **Deferred by choice:** env-driven CORS (still `origin:'*'`), automated test suite (smoke tests cover money paths).
  - **Known TODOs:** `/escrow/sweep` and `/wallet/withdrawals/:id/{approve,reject}` are JWT-guarded but not yet admin-restricted (resolve & reconcile are); real Omise Transfers payout deferred (keyless); production needs a scheduler to call the auto-release sweep + Postgres (SQLite dev only).

## 1. Decisions captured

- **Model:** Job escrow + balance. Employer funds escrow when accepting a worker; released to worker on job completion.
- **Top-up:** Real Thai gateway via **Omise** (PromptPay QR + webhooks). A `PaymentProvider` abstraction keeps a `MockProvider` for dev/tests without keys.
- **Withdrawals:** Yes — users add bank accounts and request payouts.
- **Single account = employer + worker** (per project memory): one `Wallet` per user, used both for paying (escrow hold) and earning (payout).

## 2. Money representation

- Store all wallet/ledger amounts as **integer satang** (1 THB = 100 satang) to avoid float rounding. Mirrors the existing `Int` money convention (`Job.payAmount`, `User.income`).
- `Job.payAmount` is whole baht → escrow base = `payAmount * 100`.
- **Fee model (default, configurable):** platform commission deducted from the worker's payout (`PLATFORM_FEE_BPS`). Employer escrows `payAmount`; worker receives `payAmount - fee`; platform records a `FEE` ledger entry. _Decision point — confirm before Phase 2._

## 3. Data model (new Prisma models)

SQLite has no enums → use `String` with documented constants (matches existing `Job.type`/`status` convention).

- **Wallet** — `id`, `userId @unique`, `balance Int` (satang, available), `createdAt`, `updatedAt`. Auto-created on first access.
- **WalletTransaction** (append-only ledger) — `id`, `walletId`, `type` (`TOPUP | ESCROW_HOLD | ESCROW_RELEASE | ESCROW_REFUND | PAYOUT | FEE | ADJUSTMENT`), `amount Int` (signed satang), `balanceAfter Int`, `refType String?`, `refId Int?`, `description String?`, `createdAt`.
- **Escrow** — `id`, `jobId`, `applicationId @unique`, `employerId`, `workerId`, `amount Int`, `feeAmount Int`, `status` (`HELD | RELEASED | REFUNDED | DISPUTED`), `createdAt`, `releasedAt DateTime?`.
- **TopUp** — `id`, `userId`, `amount Int`, `provider String`, `providerChargeId String? @unique`, `qrPayload String?`, `status` (`PENDING | PAID | EXPIRED | FAILED`), `createdAt`, `paidAt DateTime?`.
- **BankAccount** — `id`, `userId`, `bankCode`, `bankName`, `accountNumber`, `accountName`, `isDefault Boolean`, `createdAt`.
- **Withdrawal** — `id`, `userId`, `amount Int`, `feeAmount Int`, bank snapshot fields, `status` (`REQUESTED | APPROVED | PAID | REJECTED`), `providerTransferId String?`, `createdAt`, `processedAt DateTime?`.
- **User** additions: `wallet Wallet?`, `bankAccounts BankAccount[]`, escrow relations as employer/worker.

Migrate with `pnpm db:user:push` (and a seed update if needed).

## 4. Money lifecycle

1. **Top-up (PromptPay):** `POST /wallet/topups` → create `TopUp` + Omise PromptPay charge → return QR payload → frontend renders QR and polls status (~4s, reuse chat polling pattern) → Omise `charge.complete` webhook → verify signature, mark `PAID`, credit wallet (`TOPUP`). Idempotent on `providerChargeId`.
2. **Escrow hold:** Hooks into existing `ApplicationsService.updateStatus` when status → `accepted`. In a Prisma `$transaction`: compute amount, re-read employer balance, require `balance >= amount`; debit wallet (`ESCROW_HOLD`), create `Escrow(HELD)`. **If insufficient → reject the accept with a "needs top-up" response; application is NOT accepted.**
3. **Escrow release:** Requires a job-completion confirmation step (does not exist today — see Risks). On confirm, in `$transaction`: `Escrow → RELEASED`, credit worker net (`ESCROW_RELEASE`), record `FEE`, set job `completed`.
4. **Escrow refund:** Job/application cancelled before completion → `Escrow → REFUNDED`, credit employer back (`ESCROW_REFUND`).
5. **Withdrawal:** Add `BankAccount` → `POST /wallet/withdrawals` (amount ≤ balance) → debit immediately, status `REQUESTED` → Admin approves (or Omise Transfers) → `PAID`; reject → credit back.

## 5. API surface

New `modules/wallet` (NestJS, mirrors existing module shape: `wallet.{controller,service,module,dto}.ts`):

- `GET /wallet/me` — balance + recent transactions
- `GET /wallet/transactions?cursor=` — paginated ledger
- `POST /wallet/topups`, `GET /wallet/topups/:id`
- `GET /wallet/escrows`
- `POST|GET|DELETE /wallet/bank-accounts`
- `POST|GET /wallet/withdrawals`

Reuse the empty `modules/payments` for the gateway/webhook controller: `POST /payments/webhook/omise` (raw body, **no JWT**, signature-verified). Reuse `infra/payment` for `PaymentProvider` interface → `OmiseProvider` + `MockProvider`. Register `WalletModule` in `app.module.ts`.

## 6. Security (critical — money path)

- **Auth guard already exists** — `JwtAuthGuard` in `modules/auth/jwt-auth.guard.ts` (exported from `AuthModule`); pattern is `@UseGuards(JwtAuthGuard)` + `request.user.{sub,email,role}`. Phase 0 adds `@CurrentUserId()` / `@CurrentUser()` param decorators (`common/decorators`) so wallet code reads userId from the token cleanly. Note: most existing modules (jobs/applications) are *not* guarded and trust client-supplied IDs — **every wallet endpoint must be guarded and derive userId from the token, never the body.**
- All balance mutations inside `$transaction` with balance re-read to prevent double-spend; ledger append-only; periodic reconciliation (sum of ledger == balance).
- Webhook: verify Omise HMAC, enable raw body for that route, idempotency on charge/transfer IDs.
- Lock down CORS origin in production (currently `*` in `main.ts`).
- Mask bank account numbers in API responses.

## 7. Config / env

Add to `User/BACKEND/API/.env` + `.env.example`, and add typed loading in `config/env.ts` (currently a placeholder):

- `PAYMENT_PROVIDER=omise|mock`
- `OMISE_PUBLIC_KEY`, `OMISE_SECRET_KEY`, `OMISE_WEBHOOK_SECRET`
- `PLATFORM_FEE_BPS` (e.g. `1000` = 10%)
- `WITHDRAWAL_MIN_AMOUNT`, `WITHDRAWAL_FEE`

## 8. Frontend (Next.js app router, Thai UI)

- New route `src/app/wallet/page.tsx`: balance card, ledger list, top-up + withdraw, bank accounts. Thai labels (กระเป๋าเงิน, เติมเงิน, ถอนเงิน, ประวัติธุรกรรม).
- Top-up modal: amount → API → render PromptPay QR → poll `GET /wallet/topups/:id` ~4s until `PAID` → toast + refresh.
- Employer accept flow: if balance insufficient when accepting an applicant, surface a top-up prompt and block accept until funded.
- Wallet entry point in nav/profile. All calls via existing `apiClient` (axios, Bearer from `workder_auth_session`).

## 9. Admin side (later phase)

Admin app: approve/reject withdrawals, view escrows, manual adjustments/refunds, dispute resolution, fee reporting.

## 10. Phasing

- **Phase 0 — Foundations:** `@CurrentUserId()`/`@CurrentUser()` decorators (guard already exists); typed env (`config/env.ts`); Prisma schema + `db:user:push`.
- **Phase 1 — Wallet + ledger + top-up:** balance/ledger, Omise + Mock providers, webhook, top-up UI with QR polling.
- **Phase 2 — Escrow:** hold on application accept + add job-completion confirmation + release/refund. _Highest integration risk._
- **Phase 3 — Withdrawals:** bank accounts, withdrawal requests, admin approval / Omise transfers.
- **Phase 4 — Hardening:** reconciliation job, dispute flow, CORS lockdown, tests.

## 11. Risks / open decisions

- **No job-completion state today.** `Job.status` defaults `open`; `Application.status` is `pending|accepted|rejected`. Escrow release needs a completion/confirmation trigger — must be designed in Phase 2 (a recent commit added "job acceptance confirmation"; verify whether a completion step already exists before building).
- **SQLite for dev** — money concurrency relies on `$transaction`; plan a Postgres migration path (serializable isolation) before production/live money.
- **Omise account + KYC** required for live PromptPay and Transfers (payout); `MockProvider` unblocks dev meanwhile.
- **Fee model** (§2) needs product confirmation before Phase 2.
