'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import {
    ArrowLeft, Briefcase, Camera, CheckCircle2, XCircle, Clock,
    Loader2, PackageCheck, AlertTriangle, ShieldCheck, RefreshCw,
    ChevronRight, UserRound,
} from 'lucide-react';
import ProofPhotoModal from '../../components/ProofPhotoModal';
import ConfirmPaymentModal from '../../components/ConfirmPaymentModal';
import api from '../../lib/api';
import { getAuthSession } from '../../features/auth/lib/auth';
import {
    listEscrows, markWorkDone, confirmEscrow, disputeEscrow, cancelEscrow,
    type Escrow,
} from '../../features/payments/lib/escrow-api';
import { formatThb } from '../../features/payments/lib/wallet-api';

// ── Helpers ────────────────────────────────────────────────────────────────

function displayName(u?: { firstName?: string | null; lastName?: string | null } | null, fallback = 'ไม่ระบุชื่อ') {
    const name = [u?.firstName, u?.lastName].filter(Boolean).join(' ');
    return name || fallback;
}

// ── Status Stepper ─────────────────────────────────────────────────────────

type StepState = 'done' | 'current' | 'upcoming';

function StatusStepper({ steps }: { steps: { label: string; state: StepState }[] }) {
    return (
        <div className="flex items-center gap-0 mt-3 mb-1">
            {steps.map((step, i) => (
                <React.Fragment key={i}>
                    {/* Step dot + label */}
                    <div className="flex flex-col items-center gap-1 min-w-0">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                            step.state === 'done' ? 'bg-emerald-500 text-white' :
                            step.state === 'current' ? 'bg-blue-600 text-white ring-2 ring-blue-200' :
                            'bg-slate-200 text-slate-400'
                        }`}>
                            {step.state === 'done' ? (
                                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (i + 1)}
                        </div>
                        <span className={`text-[9px] font-semibold text-center leading-tight max-w-[52px] ${
                            step.state === 'done' ? 'text-emerald-600' :
                            step.state === 'current' ? 'text-blue-700' :
                            'text-slate-400'
                        }`}>
                            {step.label}
                        </span>
                    </div>
                    {/* Connector line */}
                    {i < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mb-3 mx-1 rounded-full transition-colors ${
                            steps[i + 1].state !== 'upcoming' || step.state === 'done' ? 'bg-emerald-400' : 'bg-slate-200'
                        }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

function workerSteps(status: Escrow['status']): { label: string; state: StepState }[] {
    const order = ['HELD', 'PENDING_CONFIRMATION', 'RELEASED'] as const;
    const idx = order.indexOf(status as typeof order[number]);
    return [
        { label: 'รับงานแล้ว', state: 'done' },
        { label: 'กำลังทำงาน', state: idx === 0 ? 'current' : (idx > 0 ? 'done' : 'upcoming') },
        { label: 'ส่งหลักฐาน', state: idx === 1 ? 'current' : (idx > 1 ? 'done' : 'upcoming') },
        { label: 'ได้รับเงิน', state: idx === 2 ? 'current' : 'upcoming' },
    ];
}

function employerSteps(status: Escrow['status']): { label: string; state: StepState }[] {
    const order = ['HELD', 'PENDING_CONFIRMATION', 'RELEASED'] as const;
    const idx = order.indexOf(status as typeof order[number]);
    return [
        { label: 'รับ Worker', state: 'done' },
        { label: 'Worker ทำงาน', state: idx === 0 ? 'current' : (idx > 0 ? 'done' : 'upcoming') },
        { label: 'ส่งหลักฐาน', state: idx === 1 ? 'current' : (idx > 1 ? 'done' : 'upcoming') },
        { label: 'จ่ายเงินแล้ว', state: idx === 2 ? 'current' : 'upcoming' },
    ];
}

// ── Worker Job Card ────────────────────────────────────────────────────────

function WorkerJobCard({
    escrow,
    busy,
    onMarkDone,
}: {
    escrow: Escrow;
    busy: boolean;
    onMarkDone: (escrowId: number, jobTitle: string) => void;
}) {
    const employerName = displayName(escrow.employer, 'นายจ้าง');
    const net = escrow.amount - escrow.feeAmount;

    // Parse proof photos
    let proofUrls: string[] = [];
    if (escrow.proofPhotos) {
        try { proofUrls = JSON.parse(escrow.proofPhotos); } catch { /* ignore */ }
    }

    return (
        <div className={`bg-white rounded-2xl border overflow-hidden ${
            escrow.status === 'PENDING_CONFIRMATION' ? 'border-amber-300' :
            escrow.status === 'RELEASED' ? 'border-emerald-200' :
            'border-slate-200'
        }`}>
            {/* Card header */}
            <div className="px-4 pt-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <Link
                            href={`/workboard/${escrow.jobId}`}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors leading-tight line-clamp-2"
                        >
                            {escrow.job.title}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                            <UserRound size={11} /> {employerName}
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-blue-600">{formatThb(net)}</p>
                        <p className="text-[10px] text-slate-400">รับสุทธิ</p>
                    </div>
                </div>

                {/* Status stepper */}
                <StatusStepper steps={workerSteps(escrow.status)} />
            </div>

            {/* Status-specific action area */}
            {escrow.status === 'HELD' && (
                <div className="border-t border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-xs text-blue-700 font-semibold mb-2 flex items-center gap-1.5">
                        <ShieldCheck size={13} /> เงิน {formatThb(escrow.amount)} ถูกกันไว้รอคุณแล้ว
                    </p>
                    <button
                        disabled={busy}
                        onClick={() => onMarkDone(escrow.id, escrow.job.title)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {busy ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                        ทำงานเสร็จแล้ว — ส่งหลักฐาน
                    </button>
                </div>
            )}

            {escrow.status === 'PENDING_CONFIRMATION' && (
                <div className="border-t border-amber-200 bg-amber-50 px-4 py-3 space-y-2">
                    <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                        <Clock size={13} /> รอนายจ้างยืนยัน — คุณจะได้รับ {formatThb(net)}
                    </p>
                    {escrow.autoReleaseAt && (
                        <p className="text-[11px] text-amber-500 flex items-center gap-1">
                            <Clock size={10} /> ปล่อยอัตโนมัติ {new Date(escrow.autoReleaseAt).toLocaleString('th-TH')}
                        </p>
                    )}
                    {/* Proof photos I submitted */}
                    {proofUrls.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">
                                หลักฐานที่ส่งไป ({proofUrls.length} รูป)
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {proofUrls.map((url, i) => (
                                    <a key={i} href={url} target="_blank" rel="noreferrer"
                                        className="block w-14 h-14 rounded-lg overflow-hidden border border-amber-300 hover:opacity-80 transition-opacity"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={url} alt={`proof-${i}`} className="w-full h-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {escrow.status === 'RELEASED' && (
                <div className="border-t border-emerald-100 bg-emerald-50 px-4 py-3">
                    <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 size={13} /> ได้รับเงินแล้ว {formatThb(net)}
                        <span className="text-[10px] font-normal text-emerald-500">
                            (หักค่าธรรมเนียม {formatThb(escrow.feeAmount)})
                        </span>
                    </p>
                </div>
            )}

            {escrow.status === 'REFUNDED' && (
                <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <XCircle size={13} /> งานถูกยกเลิก — เงินคืนนายจ้างแล้ว
                    </p>
                </div>
            )}

            {escrow.status === 'DISPUTED' && (
                <div className="border-t border-rose-100 bg-rose-50 px-4 py-3">
                    <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                        <AlertTriangle size={13} /> อยู่ระหว่างการตรวจสอบโดยทีมงาน
                    </p>
                    {escrow.disputeReason && (
                        <p className="text-[11px] text-rose-400 mt-0.5">"{escrow.disputeReason}"</p>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Employer Job Card ──────────────────────────────────────────────────────

function EmployerJobCard({
    escrow,
    busy,
    onConfirmPay,
    onDispute,
    onCancel,
}: {
    escrow: Escrow;
    busy: boolean;
    onConfirmPay: (escrow: Escrow) => void;
    onDispute: (escrowId: number) => void;
    onCancel: (escrowId: number) => void;
}) {
    const workerName = displayName(escrow.worker, 'ผู้รับงาน');

    // Parse proof photos
    let proofUrls: string[] = [];
    if (escrow.proofPhotos) {
        try { proofUrls = JSON.parse(escrow.proofPhotos); } catch { /* ignore */ }
    }

    return (
        <div className={`bg-white rounded-2xl border overflow-hidden ${
            escrow.status === 'PENDING_CONFIRMATION' ? 'border-amber-300 shadow-amber-100 shadow-sm' :
            escrow.status === 'RELEASED' ? 'border-emerald-200' :
            'border-slate-200'
        }`}>
            {/* Card header */}
            <div className="px-4 pt-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <Link
                            href={`/employer/candidates?jobId=${escrow.jobId}`}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors leading-tight line-clamp-2"
                        >
                            {escrow.job.title}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                            <UserRound size={11} /> {workerName}
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-blue-600">{formatThb(escrow.amount)}</p>
                        <p className="text-[10px] text-slate-400">ค่าจ้าง</p>
                    </div>
                </div>

                {/* Status stepper */}
                <StatusStepper steps={employerSteps(escrow.status)} />
            </div>

            {/* HELD — waiting for worker to start/finish */}
            {escrow.status === 'HELD' && (
                <div className="border-t border-blue-100 bg-blue-50 px-4 py-3 space-y-2">
                    <p className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
                        <ShieldCheck size={13} /> เงิน {formatThb(escrow.amount)} ถูกกันไว้ใน Escrow
                    </p>
                    <button
                        disabled={busy}
                        onClick={() => onCancel(escrow.id)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                    >
                        {busy ? <Loader2 size={11} className="animate-spin" /> : <XCircle size={11} />}
                        ยกเลิก & คืนเงิน
                    </button>
                </div>
            )}

            {/* PENDING_CONFIRMATION — worker sent proof, employer must act */}
            {escrow.status === 'PENDING_CONFIRMATION' && (
                <div className="border-t border-amber-200 bg-amber-50 px-4 py-3 space-y-3">
                    <div className="flex items-center gap-1.5">
                        <PackageCheck size={14} className="text-amber-600" />
                        <p className="text-xs font-bold text-amber-700">
                            {workerName} แจ้งว่างานเสร็จแล้ว — กรุณาตรวจสอบและยืนยัน
                        </p>
                    </div>

                    {escrow.autoReleaseAt && (
                        <p className="text-[11px] text-amber-500 flex items-center gap-1">
                            <Clock size={10} />
                            หากไม่ดำเนินการ เงินจะปล่อยอัตโนมัติ {new Date(escrow.autoReleaseAt).toLocaleString('th-TH')}
                        </p>
                    )}

                    {/* Proof photos from worker */}
                    {proofUrls.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1.5">
                                หลักฐานจากผู้รับงาน ({proofUrls.length} รูป)
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {proofUrls.map((url, i) => (
                                    <a key={i} href={url} target="_blank" rel="noreferrer"
                                        className="block w-16 h-16 rounded-xl overflow-hidden border border-amber-300 hover:opacity-80 transition-opacity"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={url} alt={`proof-${i}`} className="w-full h-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            disabled={busy}
                            onClick={() => onConfirmPay(escrow)}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                        >
                            {busy ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            ยืนยันจ่ายเงิน {formatThb(escrow.amount)}
                        </button>
                        <button
                            disabled={busy}
                            onClick={() => onDispute(escrow.id)}
                            className="flex items-center gap-1.5 rounded-xl border border-rose-300 px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50 transition-colors"
                        >
                            <AlertTriangle size={14} /> แจ้งปัญหา
                        </button>
                    </div>
                </div>
            )}

            {escrow.status === 'RELEASED' && (
                <div className="border-t border-emerald-100 bg-emerald-50 px-4 py-3">
                    <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 size={13} /> จ่ายเงินแล้ว {formatThb(escrow.amount)} ให้ {workerName}
                    </p>
                </div>
            )}

            {escrow.status === 'REFUNDED' && (
                <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <XCircle size={13} /> ยกเลิกแล้ว — เงินคืนเข้ากระเป๋าคุณแล้ว
                    </p>
                </div>
            )}

            {escrow.status === 'DISPUTED' && (
                <div className="border-t border-rose-100 bg-rose-50 px-4 py-3">
                    <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                        <AlertTriangle size={13} /> อยู่ระหว่างการตรวจสอบโดยทีมงาน
                    </p>
                    {escrow.disputeReason && (
                        <p className="text-[11px] text-rose-400 mt-0.5">"{escrow.disputeReason}"</p>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Section wrapper ────────────────────────────────────────────────────────

function Section({ title, badge, children }: { title: string; badge?: number; children: React.ReactNode }) {
    return (
        <section>
            <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h2>
                {badge !== undefined && badge > 0 && (
                    <span className="h-5 min-w-5 px-1.5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {badge}
                    </span>
                )}
            </div>
            <div className="space-y-3">{children}</div>
        </section>
    );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function MyJobsPage() {
    const [escrows, setEscrows] = useState<Escrow[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<number | null>(null);

    // Proof photo modal (worker submits)
    const [proofModal, setProofModal] = useState<{ escrowId: number; jobTitle: string } | null>(null);

    // Confirm payment modal (employer approves)
    const [confirmModal, setConfirmModal] = useState<{ escrow: Escrow } | null>(null);

    const userId = (() => {
        const s = getAuthSession();
        return s ? Number(s.userId) : null;
    })();

    const load = useCallback(async () => {
        try {
            const list = await listEscrows();
            setEscrows(list);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const run = async (escrowId: number, fn: () => Promise<unknown>) => {
        setBusyId(escrowId);
        try {
            await fn();
            await load();
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'ดำเนินการไม่สำเร็จ';
            window.alert(msg);
        } finally {
            setBusyId(null);
        }
    };

    const handleMarkDone = async (photos: string[]) => {
        if (!proofModal) return;
        await run(proofModal.escrowId, () => markWorkDone(proofModal.escrowId, photos));
        setProofModal(null);
    };

    const handleConfirmPay = async () => {
        if (!confirmModal) return;
        await run(confirmModal.escrow.id, () => confirmEscrow(confirmModal.escrow.id));
        setConfirmModal(null);
    };

    const handleDispute = async (escrowId: number) => {
        const reason = window.prompt('ระบุปัญหาที่พบ (อย่างน้อย 5 ตัวอักษร)');
        if (reason && reason.trim().length >= 5) {
            await run(escrowId, () => disputeEscrow(escrowId, reason.trim()));
        }
    };

    const handleCancel = async (escrowId: number) => {
        if (window.confirm('ยกเลิกงานนี้และคืนเงินเข้ากระเป๋าของคุณ?')) {
            await run(escrowId, () => cancelEscrow(escrowId));
        }
    };

    // Split by role — active statuses for each view
    const ACTIVE = ['HELD', 'PENDING_CONFIRMATION'] as const;
    const DONE = ['RELEASED', 'REFUNDED', 'DISPUTED'] as const;

    const asWorker = {
        active: escrows.filter((e) => e.workerId === userId && (ACTIVE as readonly string[]).includes(e.status)),
        done: escrows.filter((e) => e.workerId === userId && (DONE as readonly string[]).includes(e.status)),
    };

    const asEmployer = {
        active: escrows.filter((e) => e.employerId === userId && (ACTIVE as readonly string[]).includes(e.status)),
        done: escrows.filter((e) => e.employerId === userId && (DONE as readonly string[]).includes(e.status)),
    };

    const urgentCount = asEmployer.active.filter((e) => e.status === 'PENDING_CONFIRMATION').length;
    const hasAnything = asWorker.active.length + asWorker.done.length + asEmployer.active.length + asEmployer.done.length > 0;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-20 pb-16">
                <div className="max-w-2xl mx-auto px-4">

                    {/* Page header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="p-2 text-slate-500 hover:text-slate-800 bg-white rounded-full border border-slate-200">
                                <ArrowLeft size={18} />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-blue-600" />
                                    งานของฉัน
                                    {urgentCount > 0 && (
                                        <span className="h-5 min-w-5 px-1.5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                                            {urgentCount}
                                        </span>
                                    )}
                                </h1>
                                <p className="text-sm text-slate-500">ติดตามสถานะงานทั้งหมดของคุณ</p>
                            </div>
                        </div>
                        <button
                            onClick={load}
                            className="p-2 text-slate-400 hover:text-blue-600 bg-white rounded-full border border-slate-200 transition-colors"
                        >
                            <RefreshCw size={16} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        </div>
                    ) : !hasAnything ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                            <Briefcase className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                            <p className="text-slate-600 font-semibold mb-1">ยังไม่มีงานที่กำลังดำเนินการ</p>
                            <p className="text-slate-400 text-sm mb-5">งานจะแสดงที่นี่หลังจากนายจ้างรับคุณ</p>
                            <Link href="/workboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
                                หางาน <ChevronRight size={14} />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-8">

                            {/* ── งานที่ฉันรับทำ (Worker) ───────────────── */}
                            {(asWorker.active.length > 0 || asWorker.done.length > 0) && (
                                <Section title="งานที่ฉันรับทำ">
                                    {asWorker.active.map((e) => (
                                        <WorkerJobCard
                                            key={e.id}
                                            escrow={e}
                                            busy={busyId === e.id}
                                            onMarkDone={(id, title) => setProofModal({ escrowId: id, jobTitle: title })}
                                        />
                                    ))}
                                    {asWorker.done.map((e) => (
                                        <WorkerJobCard
                                            key={e.id}
                                            escrow={e}
                                            busy={busyId === e.id}
                                            onMarkDone={(id, title) => setProofModal({ escrowId: id, jobTitle: title })}
                                        />
                                    ))}
                                </Section>
                            )}

                            {/* ── งานที่ฉันจ้าง (Employer) ──────────────── */}
                            {(asEmployer.active.length > 0 || asEmployer.done.length > 0) && (
                                <Section title="งานที่ฉันจ้าง" badge={urgentCount}>
                                    {asEmployer.active.map((e) => (
                                        <EmployerJobCard
                                            key={e.id}
                                            escrow={e}
                                            busy={busyId === e.id}
                                            onConfirmPay={(esc) => setConfirmModal({ escrow: esc })}
                                            onDispute={handleDispute}
                                            onCancel={handleCancel}
                                        />
                                    ))}
                                    {asEmployer.done.map((e) => (
                                        <EmployerJobCard
                                            key={e.id}
                                            escrow={e}
                                            busy={busyId === e.id}
                                            onConfirmPay={(esc) => setConfirmModal({ escrow: esc })}
                                            onDispute={handleDispute}
                                            onCancel={handleCancel}
                                        />
                                    ))}
                                </Section>
                            )}

                            {/* Footer link */}
                            <div className="text-center pt-2">
                                <Link
                                    href="/escrow"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    <ShieldCheck size={12} /> ดูประวัติ Escrow ทั้งหมด <ChevronRight size={12} />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Proof photo upload modal (Worker) */}
            {proofModal && (
                <ProofPhotoModal
                    jobTitle={proofModal.jobTitle}
                    busy={busyId === proofModal.escrowId}
                    onConfirm={handleMarkDone}
                    onCancel={() => setProofModal(null)}
                />
            )}

            {/* Confirm payment modal (Employer) */}
            {confirmModal && (
                <ConfirmPaymentModal
                    amount={confirmModal.escrow.amount}
                    workerName={displayName(confirmModal.escrow.worker, 'ผู้รับงาน')}
                    busy={busyId === confirmModal.escrow.id}
                    onConfirm={handleConfirmPay}
                    onCancel={() => setConfirmModal(null)}
                />
            )}
        </>
    );
}
