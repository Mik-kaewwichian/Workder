'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import {
    ShieldCheck,
    Loader2,
    User,
    CheckCircle2,
    AlertTriangle,
    Clock,
    RefreshCw,
    PackageCheck,
    XCircle,
    Camera,
} from 'lucide-react';
import ProofPhotoModal from '../../components/ProofPhotoModal';
import { getAuthSession, type AuthSession } from '../../features/auth/lib/auth';
import { formatThb } from '../../features/payments/lib/wallet-api';
import {
    cancelEscrow,
    confirmEscrow,
    disputeEscrow,
    listEscrows,
    markWorkDone,
    type Escrow,
} from '../../features/payments/lib/escrow-api';

const STATUS: Record<string, { label: string; cls: string }> = {
    HELD: { label: 'กันเงินไว้แล้ว', cls: 'bg-blue-100 text-blue-700' },
    PENDING_CONFIRMATION: { label: 'รอผู้ว่าจ้างยืนยัน', cls: 'bg-amber-100 text-amber-700' },
    RELEASED: { label: 'จ่ายเงินแล้ว', cls: 'bg-emerald-100 text-emerald-700' },
    REFUNDED: { label: 'คืนเงินแล้ว', cls: 'bg-slate-100 text-slate-600' },
    DISPUTED: { label: 'มีข้อพิพาท', cls: 'bg-rose-100 text-rose-700' },
};

function EscrowCard({
    escrow,
    userId,
    onChanged,
}: {
    escrow: Escrow;
    userId: number;
    onChanged: () => void;
}) {
    const [busy, setBusy] = useState(false);
    const [showProofModal, setShowProofModal] = useState(false);
    const isEmployer = escrow.employerId === userId;
    const isWorker = escrow.workerId === userId;
    const net = escrow.amount - escrow.feeAmount;
    const st = STATUS[escrow.status] ?? { label: escrow.status, cls: 'bg-slate-100' };

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

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-bold text-slate-800">{escrow.job.title}</p>
                    <p className="text-xs text-slate-400">
                        {isEmployer ? 'คุณเป็นผู้ว่าจ้าง' : 'คุณเป็นผู้รับงาน'} · งาน #
                        {escrow.jobId}
                    </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${st.cls}`}>
                    {st.label}
                </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-lg bg-slate-50 py-2">
                    <p className="text-[11px] text-slate-400">มูลค่างาน</p>
                    <p className="font-bold text-slate-700">{formatThb(escrow.amount)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 py-2">
                    <p className="text-[11px] text-slate-400">ค่าธรรมเนียม</p>
                    <p className="font-bold text-rose-600">-{formatThb(escrow.feeAmount)}</p>
                </div>
                <div className="rounded-lg bg-emerald-50 py-2">
                    <p className="text-[11px] text-slate-400">ผู้รับงานได้รับ</p>
                    <p className="font-bold text-emerald-700">{formatThb(net)}</p>
                </div>
            </div>

            {escrow.status === 'PENDING_CONFIRMATION' && escrow.autoReleaseAt && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-600">
                    <Clock className="h-3.5 w-3.5" />
                    ปล่อยเงินอัตโนมัติ {new Date(escrow.autoReleaseAt).toLocaleString('th-TH')}
                </p>
            )}
            {escrow.status === 'DISPUTED' && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-rose-600">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {escrow.disputeReason || 'อยู่ระหว่างการตรวจสอบโดยทีมงาน'}
                </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
                {isWorker && escrow.status === 'HELD' && (
                    <button
                        disabled={busy}
                        onClick={() => setShowProofModal(true)}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Camera className="h-4 w-4" /> ทำงานเสร็จแล้ว (ส่งหลักฐาน)
                    </button>
                )}
                {isEmployer && escrow.status === 'PENDING_CONFIRMATION' && (
                    <>
                        <button
                            disabled={busy}
                            onClick={() => run(() => confirmEscrow(escrow.id))}
                            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                            <CheckCircle2 className="h-4 w-4" /> ยืนยันจ่ายเงิน
                        </button>
                        <button
                            disabled={busy}
                            onClick={() => {
                                const reason = window.prompt('ระบุปัญหาที่พบ (อย่างน้อย 5 ตัวอักษร)');
                                if (reason && reason.trim().length >= 5) {
                                    run(() => disputeEscrow(escrow.id, reason.trim()));
                                }
                            }}
                            className="flex items-center gap-1.5 rounded-xl border border-rose-300 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                        >
                            <AlertTriangle className="h-4 w-4" /> แจ้งปัญหา
                        </button>
                    </>
                )}
                {isEmployer && escrow.status === 'HELD' && (
                    <button
                        disabled={busy}
                        onClick={() => {
                            if (window.confirm('ยกเลิกงานนี้และคืนเงินเข้ากระเป๋า?')) {
                                run(() => cancelEscrow(escrow.id));
                            }
                        }}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                        <XCircle className="h-4 w-4" /> ยกเลิก & คืนเงิน
                    </button>
                )}
            </div>

            {/* Proof photo upload modal — shown when worker presses work done */}
            {showProofModal && (
                <ProofPhotoModal
                    jobTitle={escrow.job.title}
                    busy={busy}
                    onConfirm={(photos) => {
                        run(() => markWorkDone(escrow.id, photos));
                        setShowProofModal(false);
                    }}
                    onCancel={() => setShowProofModal(false)}
                />
            )}
        </div>
    );
}

function EscrowContent({ session }: { session: AuthSession }) {
    const userId = Number(session.userId);
    const [escrows, setEscrows] = useState<Escrow[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            setEscrows(await listEscrows());
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
                <div className="mb-5 flex items-center justify-between">
                    <h1 className="flex items-center gap-2 text-2xl font-black text-slate-800">
                        <ShieldCheck className="h-6 w-6 text-blue-600" /> งานที่กันเงินไว้
                    </h1>
                    <button
                        onClick={load}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-blue-600"
                    >
                        <RefreshCw className="h-3.5 w-3.5" /> รีเฟรช
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
                    </div>
                ) : escrows.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
                        <ShieldCheck className="h-10 w-10" />
                        <p className="text-sm">ยังไม่มีงานที่กันเงินไว้</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {escrows.map((e) => (
                            <EscrowCard
                                key={e.id}
                                escrow={e}
                                userId={userId}
                                onChanged={load}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function EscrowPage() {
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
                    <p className="text-slate-500">กรุณาเข้าสู่ระบบ</p>
                    <Link
                        href="/login"
                        className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                    >
                        เข้าสู่ระบบ
                    </Link>
                </div>
            ) : (
                <EscrowContent session={session} />
            )}
        </>
    );
}
