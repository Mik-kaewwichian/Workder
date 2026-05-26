'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import {
    ArrowLeft, Users, Briefcase, CheckCircle2, XCircle, Clock,
    Loader2, MessageSquare, UserRound, PackageCheck, AlertTriangle, ShieldCheck, Wallet,
    UserCheck,
} from 'lucide-react';
import api from '../../../lib/api';
import { getAuthSession } from '../../../features/auth/lib/auth';
import {
    listEscrows, confirmEscrow, disputeEscrow, cancelEscrow,
    type Escrow,
} from '../../../features/payments/lib/escrow-api';
import { formatThb, getWalletSummary } from '../../../features/payments/lib/wallet-api';
import InsufficientFundsModal from '../../../components/InsufficientFundsModal';
import ConfirmPaymentModal from '../../../components/ConfirmPaymentModal';

type Applicant = {
    id: number;
    status: string;
    createdAt: string;
    message?: string;
    worker: { id: number; firstName?: string; lastName?: string; email?: string; phone?: string };
};

type Job = { id: number; title: string; payAmount: number; type: string; status: string };

const STATUS_COLOR: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
};
const STATUS_LABEL: Record<string, string> = {
    pending: 'รอการพิจารณา', accepted: 'รับแล้ว', rejected: 'ปฏิเสธแล้ว',
};

// ── Confirm Worker Modal ───────────────────────────────────────────────────

function ConfirmWorkerModal({
    workerName,
    jobTitle,
    payAmount,
    onConfirm,
    onCancel,
    busy,
}: {
    workerName: string;
    jobTitle: string;
    payAmount: number;
    onConfirm: () => void;
    onCancel: () => void;
    busy: boolean;
}) {
    const [reviewed, setReviewed] = useState(false);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header accent */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                            <UserCheck size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-blue-100 uppercase tracking-wide">ยืนยันการรับงาน</p>
                            <p className="text-base font-bold">{workerName}</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    <p className="text-sm text-slate-700 leading-relaxed">
                        คุณกำลังจะรับ <span className="font-bold text-slate-900">{workerName}</span> เข้าทำงาน{' '}
                        <span className="font-bold text-slate-900">"{jobTitle}"</span>
                    </p>

                    <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 space-y-1.5">
                        <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                            <ShieldCheck size={13} className="text-amber-600" /> เงินจะถูกกันไว้ใน Escrow
                        </p>
                        <p className="text-xs text-amber-700">
                            ยอด <span className="font-bold">{payAmount.toLocaleString()} ฿</span> จะถูกหักจากกระเป๋าของคุณทันที
                            และจะปล่อยให้ผู้รับงานเมื่องานเสร็จ
                        </p>
                    </div>

                    {/* Confirmation checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer select-none group">
                        <div className="relative mt-0.5 shrink-0">
                            <input
                                type="checkbox"
                                checked={reviewed}
                                onChange={(e) => setReviewed(e.target.checked)}
                                className="sr-only"
                            />
                            <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${reviewed ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                                {reviewed && (
                                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <span className={`text-sm leading-relaxed font-medium transition-colors ${reviewed ? 'text-slate-800' : 'text-slate-500'}`}>
                            ท่านได้ตรวจสอบการทำงานแล้วใช่หรือไม่?
                        </span>
                    </label>
                </div>

                {/* Footer */}
                <div className="px-6 pb-5 flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={busy}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={busy || !reviewed}
                        className="flex-1 py-2.5 rounded-xl bg-green-600 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {busy ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <CheckCircle2 size={14} />
                        )}
                        {busy ? 'กำลังดำเนินการ...' : 'ยืนยัน รับเข้าทำงาน'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Escrow action panel (Employer side) ────────────────────────────────────

function EscrowActionPanel({ escrow, workerName, onChanged }: { escrow: Escrow; workerName: string; onChanged: () => void }) {
    const [busy, setBusy] = useState(false);
    const [showConfirmPayment, setShowConfirmPayment] = useState(false);

    const run = async (fn: () => Promise<unknown>) => {
        setBusy(true);
        try {
            await fn();
            onChanged();
        } catch (e: unknown) {
            const msg =
                (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                'ดำเนินการไม่สำเร็จ';
            window.alert(msg);
        } finally {
            setBusy(false);
        }
    };

    // Worker marked job done → employer must act
    if (escrow.status === 'PENDING_CONFIRMATION') {
        // Parse proof photos
        let proofUrls: string[] = [];
        if (escrow.proofPhotos) {
            try { proofUrls = JSON.parse(escrow.proofPhotos); } catch { /* ignore */ }
        }

        return (
            <>
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                        <PackageCheck size={14} className="text-amber-600" />
                        <p className="text-xs font-bold text-amber-700">ผู้รับงานแจ้งว่างานเสร็จแล้ว — กรุณาตรวจสอบและยืนยัน</p>
                    </div>
                    {escrow.autoReleaseAt && (
                        <p className="text-[11px] text-amber-500 mb-2 flex items-center gap-1">
                            <Clock size={10} />
                            หากไม่ดำเนินการ เงินจะปล่อยอัตโนมัติ {new Date(escrow.autoReleaseAt).toLocaleString('th-TH')}
                        </p>
                    )}
                    {/* Proof photos from worker */}
                    {proofUrls.length > 0 && (
                        <div className="mb-3">
                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">
                                หลักฐานการทำงาน ({proofUrls.length} รูป)
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {proofUrls.map((url, i) => (
                                    <a key={i} href={url} target="_blank" rel="noreferrer" className="block w-16 h-16 rounded-lg overflow-hidden border border-amber-300 hover:opacity-80 transition-opacity">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={url} alt={`proof-${i}`} className="w-full h-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                        <button
                            disabled={busy}
                            onClick={() => setShowConfirmPayment(true)}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                        >
                            <CheckCircle2 size={12} /> ยืนยันจ่ายเงิน {formatThb(escrow.amount)}
                        </button>
                        <button
                            disabled={busy}
                            onClick={() => {
                                const reason = window.prompt('ระบุปัญหาที่พบ (อย่างน้อย 5 ตัวอักษร)');
                                if (reason && reason.trim().length >= 5) {
                                    run(() => disputeEscrow(escrow.id, reason.trim()));
                                }
                            }}
                            className="flex items-center gap-1.5 rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50 transition-colors"
                        >
                            <AlertTriangle size={12} /> แจ้งปัญหา
                        </button>
                    </div>
                </div>

                {showConfirmPayment && (
                    <ConfirmPaymentModal
                        amount={escrow.amount}
                        workerName={workerName}
                        busy={busy}
                        onConfirm={async () => {
                            await run(() => confirmEscrow(escrow.id));
                            setShowConfirmPayment(false);
                        }}
                        onCancel={() => setShowConfirmPayment(false)}
                    />
                )}
            </>
        );
    }

    // Escrow held, job in progress — employer can cancel before work starts
    if (escrow.status === 'HELD') {
        return (
            <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-xs font-semibold text-blue-700 flex items-center gap-1">
                        <ShieldCheck size={12} /> เงินถูกกันไว้ {formatThb(escrow.amount)} — รอผู้รับงานเริ่มงาน
                    </p>
                    <button
                        disabled={busy}
                        onClick={() => {
                            if (window.confirm('ยกเลิกงานนี้และคืนเงินเข้ากระเป๋าของคุณ?')) {
                                run(() => cancelEscrow(escrow.id));
                            }
                        }}
                        className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                    >
                        <XCircle size={12} /> ยกเลิก & คืนเงิน
                    </button>
                </div>
            </div>
        );
    }

    if (escrow.status === 'RELEASED') {
        return (
            <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={12} /> จ่ายเงินแล้ว {formatThb(escrow.amount)} ให้ผู้รับงาน
                </p>
            </div>
        );
    }

    if (escrow.status === 'REFUNDED') {
        return (
            <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                    <XCircle size={12} /> คืนเงินแล้ว — งานถูกยกเลิก
                </p>
            </div>
        );
    }

    if (escrow.status === 'DISPUTED') {
        return (
            <div className="mt-3 rounded-xl border border-rose-100 bg-rose-50 p-3">
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                    <AlertTriangle size={12} /> อยู่ระหว่างการตรวจสอบโดยทีมงาน
                </p>
                {escrow.disputeReason && (
                    <p className="text-[11px] text-rose-400 mt-0.5">"{escrow.disputeReason}"</p>
                )}
            </div>
        );
    }

    return null;
}

// ── Page content ───────────────────────────────────────────────────────────

function CandidatesContent() {
    const params = useSearchParams();
    const router = useRouter();
    const jobIdParam = params.get('jobId');
    const [chattingId, setChattingId] = useState<number | null>(null);

    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(jobIdParam ? parseInt(jobIdParam) : null);
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [escrowMap, setEscrowMap] = useState<Map<number, Escrow>>(new Map());
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [walletBalance, setWalletBalance] = useState<number | null>(null); // satang
    const [insufficientModal, setInsufficientModal] = useState<{ required: number; jobTitle: string } | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ applicationId: number; workerName: string } | null>(null);

    // Load jobs + escrows + wallet together on mount
    useEffect(() => {
        const session = getAuthSession();
        if (!session) return;
        Promise.all([
            api.get(`/jobs?postedById=${session.userId}`),
            listEscrows(),
            getWalletSummary().catch(() => null),
        ]).then(([jobsRes, escrows, wallet]) => {
            const jobList = Array.isArray(jobsRes.data) ? jobsRes.data : [];
            setJobs(jobList);
            if (!selectedJobId && jobList.length > 0) setSelectedJobId(jobList[0].id);
            const map = new Map<number, Escrow>();
            for (const e of escrows) map.set(e.applicationId, e);
            setEscrowMap(map);
            if (wallet) setWalletBalance(wallet.balance);
        }).catch(() => setJobs([])).finally(() => setLoadingJobs(false));
    }, []);

    const refreshWallet = async () => {
        try {
            const w = await getWalletSummary();
            setWalletBalance(w.balance);
        } catch { /* ignore */ }
    };

    // Reload applicants when selected job changes
    useEffect(() => {
        if (!selectedJobId) return;
        setLoadingApplicants(true);
        api.get(`/applications/job/${selectedJobId}`)
            .then(({ data }) => setApplicants(Array.isArray(data) ? data : []))
            .catch(() => setApplicants([]))
            .finally(() => setLoadingApplicants(false));
    }, [selectedJobId]);

    // Reload escrows after any escrow action
    const reloadEscrows = async () => {
        try {
            const escrows = await listEscrows();
            const map = new Map<number, Escrow>();
            for (const e of escrows) map.set(e.applicationId, e);
            setEscrowMap(map);
        } catch { /* ignore */ }
    };

    const updateStatus = async (applicationId: number, status: 'accepted' | 'rejected') => {
        // Pre-check wallet balance before attempting to accept
        if (status === 'accepted') {
            const job = jobs.find((j) => j.id === selectedJobId);
            if (job && walletBalance !== null) {
                const required = job.payAmount * 100; // THB → satang
                if (walletBalance < required) {
                    setInsufficientModal({ required, jobTitle: job.title });
                    return;
                }
            }
        }

        setUpdatingId(applicationId);
        try {
            await api.patch(`/applications/${applicationId}/status`, { status });
            setApplicants((prev) => prev.map((a) => a.id === applicationId ? { ...a, status } : a));
            // Refresh escrows so the new HELD panel appears immediately
            await reloadEscrows();
            await refreshWallet(); // balance went down after escrow hold
        } catch (err: unknown) {
            const code = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            if (code === 'INSUFFICIENT_FUNDS') {
                // Fallback for race conditions (e.g. balance changed since page load)
                const job = jobs.find((j) => j.id === selectedJobId);
                if (job) {
                    setInsufficientModal({ required: job.payAmount * 100, jobTitle: job.title });
                }
                await refreshWallet();
            } else {
                window.alert('ดำเนินการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
            }
        } finally {
            setUpdatingId(null);
        }
    };

    const startChat = async (workerId: number) => {
        const session = getAuthSession();
        if (!session || !selectedJobId) return;
        setChattingId(workerId);
        try {
            const { data } = await api.post('/chat/conversations', {
                jobId: selectedJobId,
                employerId: Number(session.userId),
                workerId,
            });
            router.push(`/messages?conversationId=${data.id}`);
        } catch {
            setChattingId(null);
        }
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });

    const selectedJob = jobs.find((j) => j.id === selectedJobId);

    // Count pending-confirmation across all jobs for the job selector badge
    const pendingConfirmCount = (jobId: number) =>
        applicants.filter((a) => a.status === 'accepted' && escrowMap.get(a.id)?.status === 'PENDING_CONFIRMATION' && selectedJobId === jobId).length;

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center gap-3 mb-6">
                    <Link href="/employer/dashboard" className="p-2 text-slate-500 hover:text-slate-800 bg-white rounded-full border border-slate-200">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Users className="h-5 w-5 text-rose-500" /> ผู้สมัครงาน
                        </h1>
                        <p className="text-sm text-slate-500">เลือกงานเพื่อดูรายชื่อผู้สมัคร</p>
                    </div>
                </div>

                {/* Wallet balance banner — warns if it can't cover selected job's escrow */}
                {walletBalance !== null && selectedJob && (() => {
                    const required = selectedJob.payAmount * 100;
                    const insufficient = walletBalance < required;
                    return (
                        <div className={`mb-6 rounded-2xl border px-4 py-3 flex items-center justify-between gap-3 ${insufficient ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${insufficient ? 'bg-amber-100' : 'bg-blue-50'}`}>
                                    {insufficient
                                        ? <AlertTriangle className="h-5 w-5 text-amber-600" />
                                        : <Wallet className="h-5 w-5 text-blue-600" />}
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-sm font-bold ${insufficient ? 'text-amber-800' : 'text-slate-800'}`}>
                                        ยอดในกระเป๋า: {formatThb(walletBalance)}
                                    </p>
                                    <p className={`text-xs mt-0.5 ${insufficient ? 'text-amber-700' : 'text-slate-500'}`}>
                                        {insufficient
                                            ? `ไม่พอสำหรับมัดจำงานนี้ (ต้องการ ${formatThb(required)} • ขาด ${formatThb(required - walletBalance)})`
                                            : `เพียงพอสำหรับมัดจำงานนี้ (${formatThb(required)})`}
                                    </p>
                                </div>
                            </div>
                            {insufficient && (
                                <Link
                                    href="/wallet"
                                    className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                    <Wallet size={13} /> เติมเงิน
                                </Link>
                            )}
                        </div>
                    );
                })()}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Job Selector */}
                    <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">งานของคุณ</h3>
                        {loadingJobs ? (
                            <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-blue-500" /></div>
                        ) : jobs.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-400 text-sm">
                                ยังไม่มีงาน<br />
                                <Link href="/employer/jobs/create" className="text-blue-600 hover:underline mt-2 block">+ โพสต์งานใหม่</Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {jobs.map((job) => {
                                    const hasPendingConfirm = pendingConfirmCount(job.id) > 0;
                                    return (
                                        <button
                                            key={job.id}
                                            onClick={() => setSelectedJobId(job.id)}
                                            className={`w-full text-left rounded-xl border p-4 transition-all ${selectedJobId === job.id
                                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                                }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <Briefcase size={16} className={selectedJobId === job.id ? 'text-blue-600 mt-0.5' : 'text-slate-400 mt-0.5'} />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-1">
                                                        <p className={`font-semibold text-sm truncate ${selectedJobId === job.id ? 'text-blue-700' : 'text-slate-800'}`}>
                                                            {job.title}
                                                        </p>
                                                        {hasPendingConfirm && (
                                                            <span className="flex-shrink-0 h-2 w-2 rounded-full bg-amber-400" title="มีงานรอยืนยัน" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5">{job.payAmount}฿ • {job.type}</p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Applicants Panel */}
                    <div className="md:col-span-2">
                        {selectedJob && (
                            <div className="mb-3 bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3">
                                <Briefcase size={18} className="text-blue-600" />
                                <div>
                                    <p className="font-semibold text-slate-900">{selectedJob.title}</p>
                                    <p className="text-xs text-slate-500">{selectedJob.payAmount}฿ • {applicants.length} คนสมัคร</p>
                                </div>
                            </div>
                        )}

                        {loadingApplicants ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-12 flex justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                            </div>
                        ) : !selectedJobId ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
                                เลือกงานทางซ้ายเพื่อดูผู้สมัคร
                            </div>
                        ) : applicants.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                                <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm">ยังไม่มีผู้สมัครงานนี้</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {applicants.map((app) => {
                                    const name = [app.worker.firstName, app.worker.lastName].filter(Boolean).join(' ') || 'ไม่ระบุชื่อ';
                                    const initial = name.charAt(0);
                                    const isUpdating = updatingId === app.id;
                                    const escrow = escrowMap.get(app.id);
                                    // Highlight cards where employer action is needed
                                    const needsAction = escrow?.status === 'PENDING_CONFIRMATION';

                                    return (
                                        <div
                                            key={app.id}
                                            className={`bg-white rounded-xl border p-4 ${needsAction ? 'border-amber-300 shadow-amber-100 shadow-sm' : 'border-slate-200'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <Link href={`/profile/${app.worker.id}`} className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0 hover:ring-2 hover:ring-blue-400 transition-all">
                                                    {initial}
                                                </Link>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <Link href={`/profile/${app.worker.id}`} className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">{name}</Link>
                                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[app.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                                            {STATUS_LABEL[app.status] ?? app.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5">{app.worker.email ?? ''} {app.worker.phone ? `• ${app.worker.phone}` : ''}</p>
                                                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1"><Clock size={10} /> สมัครเมื่อ {formatDate(app.createdAt)}</p>
                                                </div>
                                                <div className="flex gap-2 flex-shrink-0">
                                                    <Link
                                                        href={`/profile/${app.worker.id}?applicationId=${app.id}`}
                                                        className="flex items-center gap-1 text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                                                    >
                                                        <UserRound size={12} /> ดูโปรไฟล์
                                                    </Link>
                                                    <button
                                                        disabled={chattingId === app.worker.id}
                                                        onClick={() => startChat(app.worker.id)}
                                                        className="flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
                                                    >
                                                        {chattingId === app.worker.id ? <Loader2 size={12} className="animate-spin" /> : <MessageSquare size={12} />}
                                                        แชท
                                                    </button>
                                                    {app.status === 'pending' && (
                                                        <>
                                                            <button
                                                                disabled={isUpdating}
                                                                onClick={() => {
                                                                    const name = [app.worker.firstName, app.worker.lastName].filter(Boolean).join(' ') || 'ไม่ระบุชื่อ';
                                                                    setConfirmModal({ applicationId: app.id, workerName: name });
                                                                }}
                                                                className="flex items-center gap-1 text-xs font-semibold bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                                            >
                                                                {isUpdating ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                                                รับ
                                                            </button>
                                                            <button
                                                                disabled={isUpdating}
                                                                onClick={() => updateStatus(app.id, 'rejected')}
                                                                className="flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors"
                                                            >
                                                                <XCircle size={12} /> ปฏิเสธ
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Work experience submitted by the worker */}
                                            {app.message && (
                                                <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">ประสบการณ์ทำงาน</p>
                                                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{app.message}</p>
                                                </div>
                                            )}

                                            {/* Escrow lifecycle panel — shown for accepted applicants */}
                                            {escrow && <EscrowActionPanel escrow={escrow} workerName={name} onChanged={reloadEscrows} />}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {insufficientModal && walletBalance !== null && (
                <InsufficientFundsModal
                    currentBalance={walletBalance}
                    requiredAmount={insufficientModal.required}
                    jobTitle={insufficientModal.jobTitle}
                    onClose={() => setInsufficientModal(null)}
                />
            )}

            {confirmModal && (() => {
                const job = jobs.find((j) => j.id === selectedJobId);
                return (
                    <ConfirmWorkerModal
                        workerName={confirmModal.workerName}
                        jobTitle={job?.title ?? ''}
                        payAmount={job?.payAmount ?? 0}
                        busy={updatingId === confirmModal.applicationId}
                        onConfirm={async () => {
                            await updateStatus(confirmModal.applicationId, 'accepted');
                            setConfirmModal(null);
                        }}
                        onCancel={() => setConfirmModal(null)}
                    />
                );
            })()}
        </div>
    );
}

export default function CandidatesPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={
                <div className="min-h-screen bg-slate-50 pt-20 flex justify-center items-start pt-32">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
            }>
                <CandidatesContent />
            </Suspense>
        </>
    );
}
