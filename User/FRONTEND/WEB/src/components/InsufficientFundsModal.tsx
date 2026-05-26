'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Wallet, ArrowRight, X } from 'lucide-react';
import { formatThb } from '../features/payments/lib/wallet-api';

export default function InsufficientFundsModal({
    currentBalance,
    requiredAmount,
    jobTitle,
    onClose,
}: {
    currentBalance: number; // satang
    requiredAmount: number; // satang
    jobTitle?: string;
    onClose: () => void;
}) {
    const router = useRouter();
    const shortfall = Math.max(0, requiredAmount - currentBalance);

    return (
        <div
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100 relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-white/70 transition-colors"
                    >
                        <X size={18} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">ยอดเงินในกระเป๋าไม่พอ</h2>
                            <p className="text-xs text-slate-600 mt-0.5">ต้องเติมเงินก่อนจึงจะรับผู้สมัครได้</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {jobTitle && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">งาน</p>
                            <p className="text-sm font-semibold text-slate-700 line-clamp-2">{jobTitle}</p>
                        </div>
                    )}

                    <div className="space-y-2.5">
                        <Row label="ยอดในกระเป๋า" value={formatThb(currentBalance)} colour="text-slate-700" />
                        <Row label="ต้องการ (มัดจำค่าจ้าง)" value={formatThb(requiredAmount)} colour="text-slate-700" />
                        <div className="h-px bg-slate-200 my-1" />
                        <Row label="ขาดอีก" value={formatThb(shortfall)} colour="text-red-600" bold />
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                        ระบบจะกันเงินจำนวนนี้ไว้ใน Escrow เพื่อรับประกันค่าจ้างให้ผู้รับงาน
                        เงินจะถูกโอนให้หลังจากคุณยืนยันว่างานเสร็จสมบูรณ์
                    </p>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="button"
                            onClick={() => { onClose(); router.push('/wallet'); }}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
                        >
                            <Wallet size={15} /> เติมเงิน <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Row({ label, value, colour, bold = false }: { label: string; value: string; colour: string; bold?: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span className={`text-sm ${bold ? 'font-bold' : 'font-medium'} ${colour}`}>{label}</span>
            <span className={`text-base ${bold ? 'font-bold' : 'font-semibold'} ${colour}`}>{value}</span>
        </div>
    );
}
