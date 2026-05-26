'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import {
    Wallet as WalletIcon,
    Plus,
    ArrowDownToLine,
    RefreshCw,
    X,
    CheckCircle2,
    QrCode,
    Loader2,
    User,
    Clock,
    ShieldCheck,
    Landmark,
} from 'lucide-react';
import { getAuthSession, type AuthSession } from '../../features/auth/lib/auth';
import {
    addBankAccount,
    listBankAccounts,
    requestWithdrawal,
    type BankAccount,
} from '../../features/payments/lib/withdraw-api';
import {
    createTopUp,
    formatThb,
    getTopUp,
    getWalletSummary,
    mockCompleteTopUp,
    type TopUp,
    type WalletSummary,
    type WalletTransaction,
} from '../../features/payments/lib/wallet-api';

const TX_LABEL: Record<string, string> = {
    TOPUP: 'เติมเงิน',
    ESCROW_HOLD: 'กันเงินค่าจ้าง',
    ESCROW_RELEASE: 'รับเงินค่าจ้าง',
    ESCROW_REFUND: 'คืนเงินมัดจำ',
    PAYOUT: 'ถอนเงิน',
    FEE: 'ค่าธรรมเนียม',
    ADJUSTMENT: 'ปรับยอด',
};

function TransactionRow({ tx }: { tx: WalletTransaction }) {
    const credit = tx.amount >= 0;
    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div>
                <p className="font-semibold text-slate-800 text-sm">
                    {TX_LABEL[tx.type] ?? tx.type}
                </p>
                <p className="text-xs text-slate-400">
                    {new Date(tx.createdAt).toLocaleString('th-TH')}
                </p>
            </div>
            <div className="text-right">
                <p className={`font-bold text-sm ${credit ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {credit ? '+' : '-'}
                    {formatThb(Math.abs(tx.amount))}
                </p>
                <p className="text-xs text-slate-400">คงเหลือ {formatThb(tx.balanceAfter)}</p>
            </div>
        </div>
    );
}

function TopUpModal({
    onClose,
    onPaid,
}: {
    onClose: () => void;
    onPaid: () => void;
}) {
    const [amount, setAmount] = useState(100);
    const [topUp, setTopUp] = useState<TopUp | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const isMock = topUp?.qrPayload?.startsWith('mock://') ?? false;

    const start = async () => {
        setBusy(true);
        setError(null);
        try {
            setTopUp(await createTopUp(amount));
        } catch {
            setError('สร้างรายการเติมเงินไม่สำเร็จ ลองใหม่อีกครั้ง');
        } finally {
            setBusy(false);
        }
    };

    // Poll the top-up until it is paid (mirrors the 4s chat polling cadence).
    useEffect(() => {
        if (!topUp || topUp.status !== 'PENDING') return;
        pollRef.current = setInterval(async () => {
            try {
                const fresh = await getTopUp(topUp.topUpId);
                setTopUp(fresh);
                if (fresh.status === 'PAID') {
                    onPaid();
                }
            } catch {
                /* keep polling */
            }
        }, 4000);
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [topUp, onPaid]);

    const paid = topUp?.status === 'PAID';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-slate-800">เติมเงินเข้ากระเป๋า</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {!topUp && (
                    <>
                        <label className="text-sm font-semibold text-slate-600">
                            จำนวนเงิน (บาท)
                        </label>
                        <input
                            type="number"
                            min={20}
                            max={100000}
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-lg font-bold focus:border-blue-500 focus:outline-none"
                        />
                        <div className="mt-3 flex gap-2">
                            {[100, 300, 500, 1000].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setAmount(v)}
                                    className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600"
                                >
                                    ฿{v}
                                </button>
                            ))}
                        </div>
                        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
                        <button
                            onClick={start}
                            disabled={busy || amount < 20}
                            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {busy ? 'กำลังสร้าง QR...' : 'สร้าง QR พร้อมเพย์'}
                        </button>
                    </>
                )}

                {topUp && !paid && (
                    <div className="text-center">
                        <p className="text-sm text-slate-500 mb-1">สแกนเพื่อชำระ</p>
                        <p className="text-2xl font-black text-slate-800 mb-4">
                            {formatThb(topUp.amount)}
                        </p>
                        <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
                            {isMock ? (
                                <div className="text-center text-slate-400">
                                    <QrCode className="mx-auto h-16 w-16" />
                                    <p className="mt-2 text-xs">QR จำลอง (โหมดทดสอบ)</p>
                                </div>
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={topUp.qrPayload ?? ''}
                                    alt="PromptPay QR"
                                    className="h-52 w-52 object-contain"
                                />
                            )}
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-amber-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            รอการชำระเงิน...
                        </div>
                        {isMock && (
                            <button
                                onClick={async () => {
                                    await mockCompleteTopUp(topUp.topUpId);
                                    setTopUp(await getTopUp(topUp.topUpId));
                                    onPaid();
                                }}
                                className="mt-4 w-full rounded-xl border border-emerald-300 bg-emerald-50 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
                            >
                                จำลองการชำระเงิน (เฉพาะโหมดทดสอบ)
                            </button>
                        )}
                    </div>
                )}

                {paid && (
                    <div className="py-8 text-center">
                        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
                        <p className="mt-4 text-lg font-bold text-slate-800">เติมเงินสำเร็จ</p>
                        <p className="text-sm text-slate-500">
                            เพิ่ม {formatThb(topUp!.amount)} เข้ากระเป๋าแล้ว
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700"
                        >
                            เสร็จสิ้น
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function WithdrawModal({
    balanceSatang,
    onClose,
    onDone,
}: {
    balanceSatang: number;
    onClose: () => void;
    onDone: () => void;
}) {
    const [banks, setBanks] = useState<BankAccount[] | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({
        bankCode: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
    });
    const [amount, setAmount] = useState(100);
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(async () => {
        const list = await listBankAccounts();
        setBanks(list);
        setAdding(list.length === 0);
        if (list.length && selectedId === null) {
            setSelectedId(list.find((b) => b.isDefault)?.id ?? list[0].id);
        }
    }, [selectedId]);

    useEffect(() => {
        reload();
    }, [reload]);

    const saveBank = async () => {
        setBusy(true);
        setError(null);
        try {
            const created = await addBankAccount(form);
            await reload();
            setSelectedId(created.id);
            setAdding(false);
        } catch {
            setError('เพิ่มบัญชีธนาคารไม่สำเร็จ ตรวจสอบข้อมูลอีกครั้ง');
        } finally {
            setBusy(false);
        }
    };

    const submit = async () => {
        if (!selectedId) return;
        setBusy(true);
        setError(null);
        try {
            await requestWithdrawal(amount, selectedId);
            setDone(true);
            onDone();
        } catch (e: unknown) {
            const code = (e as { response?: { data?: { message?: string } } })?.response?.data
                ?.message;
            setError(
                code === 'AMOUNT_BELOW_MINIMUM'
                    ? 'จำนวนเงินต่ำกว่าขั้นต่ำ (100 บาท)'
                    : code === 'INSUFFICIENT_FUNDS'
                      ? 'ยอดเงินในกระเป๋าไม่พอ'
                      : 'ทำรายการถอนไม่สำเร็จ',
            );
        } finally {
            setBusy(false);
        }
    };

    const input =
        'mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">ถอนเงิน</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {done ? (
                    <div className="py-8 text-center">
                        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
                        <p className="mt-4 text-lg font-bold text-slate-800">
                            ส่งคำขอถอนเงินแล้ว
                        </p>
                        <p className="text-sm text-slate-500">
                            ระบบจะดำเนินการโอนเข้าบัญชีของคุณ
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700"
                        >
                            เสร็จสิ้น
                        </button>
                    </div>
                ) : banks === null ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    </div>
                ) : adding ? (
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-slate-600">เพิ่มบัญชีธนาคาร</p>
                        {(
                            [
                                ['bankCode', 'รหัสธนาคาร (เช่น SCB)'],
                                ['bankName', 'ชื่อธนาคาร'],
                                ['accountNumber', 'เลขที่บัญชี'],
                                ['accountName', 'ชื่อบัญชี'],
                            ] as const
                        ).map(([key, label]) => (
                            <div key={key}>
                                <label className="text-xs text-slate-500">{label}</label>
                                <input
                                    className={input}
                                    value={form[key]}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, [key]: e.target.value }))
                                    }
                                />
                            </div>
                        ))}
                        {error && <p className="text-sm text-rose-600">{error}</p>}
                        <button
                            disabled={busy}
                            onClick={saveBank}
                            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            บันทึกบัญชี
                        </button>
                        {banks.length > 0 && (
                            <button
                                onClick={() => setAdding(false)}
                                className="w-full py-2 text-sm font-semibold text-slate-500"
                            >
                                ยกเลิก
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-slate-600">บัญชีปลายทาง</p>
                        {banks.map((b) => (
                            <button
                                key={b.id}
                                onClick={() => setSelectedId(b.id)}
                                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${
                                    selectedId === b.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-slate-200'
                                }`}
                            >
                                <Landmark className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-bold text-slate-700">
                                        {b.bankName}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {b.accountNumber} · {b.accountName}
                                    </p>
                                </div>
                            </button>
                        ))}
                        <button
                            onClick={() => {
                                setForm({
                                    bankCode: '',
                                    bankName: '',
                                    accountNumber: '',
                                    accountName: '',
                                });
                                setAdding(true);
                            }}
                            className="text-sm font-semibold text-blue-600"
                        >
                            + เพิ่มบัญชีใหม่
                        </button>

                        <label className="block pt-2 text-sm font-semibold text-slate-600">
                            จำนวนเงิน (บาท) · คงเหลือ {formatThb(balanceSatang)}
                        </label>
                        <input
                            type="number"
                            min={100}
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className={input}
                        />
                        {error && <p className="text-sm text-rose-600">{error}</p>}
                        <button
                            disabled={busy || !selectedId || amount < 100}
                            onClick={submit}
                            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {busy ? 'กำลังทำรายการ...' : 'ยืนยันถอนเงิน'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function WalletContent() {
    const [summary, setSummary] = useState<WalletSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [showTopUp, setShowTopUp] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);

    const load = useCallback(async () => {
        try {
            setSummary(await getWalletSummary());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-24">
            <div className="mx-auto max-w-2xl px-4">
                <h1 className="mb-5 flex items-center gap-2 text-2xl font-black text-slate-800">
                    <WalletIcon className="h-6 w-6 text-blue-600" /> กระเป๋าเงิน
                </h1>

                <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
                    <p className="text-sm text-blue-100">ยอดเงินคงเหลือ</p>
                    <p className="mt-1 text-4xl font-black">
                        {loading ? '...' : formatThb(summary?.balance ?? 0)}
                    </p>
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => setShowTopUp(true)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-3 font-bold text-blue-700 hover:bg-blue-50"
                        >
                            <Plus className="h-4 w-4" /> เติมเงิน
                        </button>
                        <button
                            onClick={() => setShowWithdraw(true)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/20 py-3 font-bold text-white hover:bg-white/30"
                        >
                            <ArrowDownToLine className="h-4 w-4" /> ถอนเงิน
                        </button>
                    </div>
                </div>

                <Link
                    href="/escrow"
                    className="mt-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm hover:bg-slate-50"
                >
                    <span className="flex items-center gap-2 font-semibold text-slate-700">
                        <ShieldCheck className="h-5 w-5 text-blue-600" /> งานที่กันเงินไว้ (Escrow)
                    </span>
                    <span className="text-slate-300">›</span>
                </Link>

                <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-bold text-slate-800">ประวัติธุรกรรม</h2>
                        <button
                            onClick={load}
                            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-blue-600"
                        >
                            <RefreshCw className="h-3.5 w-3.5" /> รีเฟรช
                        </button>
                    </div>
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        </div>
                    ) : !summary?.recentTransactions.length ? (
                        <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                            <Clock className="h-8 w-8" />
                            <p className="text-sm">ยังไม่มีรายการ</p>
                        </div>
                    ) : (
                        summary.recentTransactions.map((tx) => (
                            <TransactionRow key={tx.id} tx={tx} />
                        ))
                    )}
                </div>
            </div>

            {showTopUp && (
                <TopUpModal
                    onClose={() => {
                        setShowTopUp(false);
                        load();
                    }}
                    onPaid={load}
                />
            )}

            {showWithdraw && (
                <WithdrawModal
                    balanceSatang={summary?.balance ?? 0}
                    onClose={() => {
                        setShowWithdraw(false);
                        load();
                    }}
                    onDone={load}
                />
            )}
        </div>
    );
}

export default function WalletPage() {
    const [session, setSession] = useState<AuthSession | null | 'loading'>('loading');

    useEffect(() => {
        setSession(getAuthSession());
    }, []);

    return (
        <>
            <Navbar />
            {session === 'loading' ? (
                <div className="flex min-h-screen justify-center bg-slate-50 pt-32">
                    <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
                </div>
            ) : !session ? (
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
                    <User size={40} className="text-slate-300" />
                    <p className="text-slate-500">กรุณาเข้าสู่ระบบเพื่อใช้งานกระเป๋าเงิน</p>
                    <Link
                        href="/login"
                        className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                    >
                        เข้าสู่ระบบ
                    </Link>
                </div>
            ) : (
                <WalletContent />
            )}
        </>
    );
}
