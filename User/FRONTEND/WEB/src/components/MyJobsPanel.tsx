'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
    Briefcase, Loader2, Clock, PackageCheck, AlertTriangle,
    ShieldCheck, RefreshCw, ClipboardList, X, XCircle, CheckCircle2, ChevronRight, Hourglass,
} from 'lucide-react';
import api from '../lib/api';
import {
    listEscrows, markWorkDone, confirmEscrow, disputeEscrow, cancelEscrow,
    type Escrow,
} from '../features/payments/lib/escrow-api';
import { formatThb } from '../features/payments/lib/wallet-api';
import type { AuthSession } from '../features/auth/lib/auth';

type PendingApp = {
    id: number;
    status: string;
    createdAt: string;
    job: { id: number; title: string; payAmount: number; type: string; status: string };
};

export default function MyJobsPanel({
    session,
    onClose,
    onUrgentCount,
}: {
    session: AuthSession;
    onClose: () => void;
    onUrgentCount?: (count: number) => void;
}) {
    const userId = Number(session.userId);
    const [escrows, setEscrows] = useState<Escrow[]>([]);
    const [pendingApps, setPendingApps] = useState<PendingApp[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<number | null>(null);

    const load = useCallback(async () => {
        try {
            const [escrowList, appsRes] = await Promise.all([
                listEscrows(),
                api.get(`/applications/worker/${userId}`).catch(() => ({ data: [] as PendingApp[] })),
            ]);
            setEscrows(escrowList);
            const apps: PendingApp[] = Array.isArray(appsRes.data) ? appsRes.data : [];
            // Only keep applications still waiting on the employer:
            //   pending + job still open.
            // Rejected → filtered. Accepted-someone-else (job→in_progress) → filtered.
            // Job closed/completed → filtered.
            setPendingApps(apps.filter((a) => a.status === 'pending' && a.job?.status === 'open'));
        } finally {
            setLoading(false);
        }
    }, [userId]);

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

    // Split into worker view (jobs I'm doing) and employer view (jobs I posted)
    const asWorker = escrows.filter((e) => e.workerId === userId && ['HELD', 'PENDING_CONFIRMATION'].includes(e.status));
    const asEmployer = escrows.filter((e) => e.employerId === userId && ['HELD', 'PENDING_CONFIRMATION'].includes(e.status));

    const urgentCount = asEmployer.filter((e) => e.status === 'PENDING_CONFIRMATION').length;
    const isEmpty = asWorker.length === 0 && asEmployer.length === 0 && pendingApps.length === 0;

    // Surface urgent count to parent (e.g. Navbar trigger badge)
    useEffect(() => {
        onUrgentCount?.(urgentCount);
    }, [urgentCount, onUrgentCount]);

    if (loading) {
        return (
            <div className="h-full bg-white flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
                    <div className="flex items-center gap-2">
                        <ClipboardList size={15} className="text-blue-600" />
                        <span className="text-sm font-bold text-slate-800">งานของฉัน</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                        <X size={16} />
                    </button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
                <div className="flex items-center gap-2">
                    <ClipboardList size={15} className="text-blue-600" />
                    <span className="text-sm font-bold text-slate-800">งานของฉัน</span>
                    {urgentCount > 0 && (
                        <span className="h-5 min-w-5 px-1.5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {urgentCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={load}
                        className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                    >
                        <RefreshCw size={13} />
                    </button>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-slate-100">
                    {isEmpty && (
                        <div className="px-4 py-8 text-center">
                            <Briefcase className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                            <p className="text-xs text-slate-400">ยังไม่มีงานที่กำลังดำเนินการ</p>
                        </div>
                    )}

                    {/* ── Pending applications: waiting for employer to decide ─ */}
                    {pendingApps.length > 0 && (
                        <div>
                            <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                รอพิจารณา
                            </p>
                            {pendingApps.map((a) => (
                                <div key={a.id} className="px-4 py-3 space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <Link
                                            href={`/workboard/${a.job.id}`}
                                            className="text-sm font-semibold text-slate-800 leading-tight hover:text-blue-600 line-clamp-2"
                                        >
                                            {a.job.title}
                                        </Link>
                                        <span className="text-xs font-bold text-blue-600 shrink-0">
                                            {a.job.payAmount.toLocaleString()}฿
                                        </span>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                        <Hourglass size={9} /> รอผู้ว่าจ้างพิจารณา
                                    </span>
                                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <Clock size={9} />
                                        สมัครเมื่อ {new Date(a.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Worker section: jobs I'm doing ─────────────────────── */}
                    {asWorker.length > 0 && (
                        <div>
                            <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                งานที่กำลังทำ
                            </p>
                            {asWorker.map((e) => {
                                const busy = busyId === e.id;
                                const net = e.amount - e.feeAmount;
                                return (
                                    <div key={e.id} className="px-4 py-3 space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <Link
                                                href={`/workboard/${e.jobId}`}
                                                className="text-sm font-semibold text-slate-800 leading-tight hover:text-blue-600 line-clamp-2"
                                            >
                                                {e.job.title}
                                            </Link>
                                            <span className="text-xs font-bold text-blue-600 shrink-0">
                                                {formatThb(net)}
                                            </span>
                                        </div>

                                        {e.status === 'HELD' && (
                                            <>
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                                    <Clock size={9} /> กำลังทำงาน
                                                </span>
                                                <button
                                                    disabled={busy}
                                                    onClick={() => run(e.id, () => markWorkDone(e.id))}
                                                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                                >
                                                    {busy ? <Loader2 size={12} className="animate-spin" /> : <PackageCheck size={12} />}
                                                    ทำงานเสร็จแล้ว
                                                </button>
                                            </>
                                        )}

                                        {e.status === 'PENDING_CONFIRMATION' && (
                                            <>
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                                    <Clock size={9} /> รอผู้ว่าจ้างยืนยัน
                                                </span>
                                                {e.autoReleaseAt && (
                                                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                                        <Clock size={9} />
                                                        ปล่อยอัตโนมัติ {new Date(e.autoReleaseAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── Employer section: jobs I posted that need action ────── */}
                    {asEmployer.length > 0 && (
                        <div>
                            <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                งานที่โพสต์
                            </p>
                            {asEmployer.map((e) => {
                                const busy = busyId === e.id;
                                const isPending = e.status === 'PENDING_CONFIRMATION';
                                return (
                                    <div
                                        key={e.id}
                                        className={`px-4 py-3 space-y-2 ${isPending ? 'bg-amber-50' : ''}`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <Link
                                                href={`/employer/candidates?jobId=${e.jobId}`}
                                                className="text-sm font-semibold text-slate-800 leading-tight hover:text-blue-600 line-clamp-2"
                                            >
                                                {e.job.title}
                                            </Link>
                                            <span className="text-xs font-bold text-blue-600 shrink-0">
                                                {formatThb(e.amount)}
                                            </span>
                                        </div>

                                        {isPending && (
                                            <>
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                                                    <PackageCheck size={9} /> Worker แจ้งงานเสร็จ 🔔
                                                </span>
                                                {e.autoReleaseAt && (
                                                    <p className="text-[10px] text-amber-600 flex items-center gap-1">
                                                        <Clock size={9} />
                                                        ปล่อยอัตโนมัติ {new Date(e.autoReleaseAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                                    </p>
                                                )}
                                                <div className="flex gap-1.5">
                                                    <button
                                                        disabled={busy}
                                                        onClick={() => run(e.id, () => confirmEscrow(e.id))}
                                                        className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-emerald-600 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        {busy ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle2 size={10} />}
                                                        ยืนยันจ่าย
                                                    </button>
                                                    <button
                                                        disabled={busy}
                                                        onClick={() => {
                                                            const reason = window.prompt('ระบุปัญหา (5+ ตัวอักษร)');
                                                            if (reason && reason.trim().length >= 5) {
                                                                run(e.id, () => disputeEscrow(e.id, reason.trim()));
                                                            }
                                                        }}
                                                        className="flex items-center justify-center gap-1 rounded-lg border border-rose-300 px-2.5 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50 transition-colors"
                                                    >
                                                        <AlertTriangle size={10} /> ปัญหา
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                        {e.status === 'HELD' && (
                                            <>
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                                    <ShieldCheck size={9} /> เงินถูกกันไว้
                                                </span>
                                                <button
                                                    disabled={busy}
                                                    onClick={() => {
                                                        if (window.confirm('ยกเลิกงานและคืนเงิน?')) {
                                                            run(e.id, () => cancelEscrow(e.id));
                                                        }
                                                    }}
                                                    className="w-full flex items-center justify-center gap-1 rounded-lg border border-slate-200 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                                                >
                                                    <XCircle size={10} /> ยกเลิก & คืนเงิน
                                                </button>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer — pinned at bottom */}
            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 shrink-0">
                <Link
                    href="/escrow"
                    className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                >
                    <ShieldCheck size={11} /> ดูประวัติ Escrow ทั้งหมด <ChevronRight size={11} />
                </Link>
            </div>
        </div>
    );
}
