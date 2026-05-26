'use client';

import React, { useState } from 'react';
import { CheckCircle2, Loader2, PackageCheck, ShieldCheck } from 'lucide-react';
import { formatThb } from '../features/payments/lib/wallet-api';

export default function ConfirmPaymentModal({
    amount,
    workerName,
    onConfirm,
    onCancel,
    busy,
}: {
    amount: number;
    workerName: string;
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
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                            <PackageCheck size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wide">ยืนยันการจ่ายเงิน</p>
                            <p className="text-base font-bold">{workerName}</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 space-y-1.5">
                        <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <ShieldCheck size={13} className="text-emerald-600" /> จ่ายเงินให้ผู้รับงาน
                        </p>
                        <p className="text-sm font-bold text-emerald-700">{formatThb(amount)}</p>
                        <p className="text-xs text-emerald-600">
                            เงินจะถูกปล่อยจาก Escrow ไปยังกระเป๋าของผู้รับงานทันที การกระทำนี้ไม่สามารถยกเลิกได้
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
                            <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${reviewed ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-300 group-hover:border-emerald-400'}`}>
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
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {busy ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <CheckCircle2 size={14} />
                        )}
                        {busy ? 'กำลังดำเนินการ...' : 'ยืนยันจ่ายเงิน'}
                    </button>
                </div>
            </div>
        </div>
    );
}
