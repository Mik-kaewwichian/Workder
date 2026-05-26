'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, UserRound, ShieldCheck, ArrowRight, ChevronDown } from 'lucide-react';

interface Props {
    onClose: () => void;
}

const STEPS = [
    { icon: '📝', label: 'กรอกชื่อ-นามสกุล และที่อยู่' },
    { icon: '🪪', label: 'อัปโหลดภาพบัตรประชาชน' },
    { icon: '🤳', label: 'ถ่ายเซลฟี่คู่บัตร' },
];

export default function NeedRegistrationModal({ onClose }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                {/* Close */}
                <div className="flex justify-end px-4 pt-4">
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100">
                        <X size={18} />
                    </button>
                </div>

                {/* Icon */}
                <div className="flex justify-center pb-2">
                    <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                        <UserRound size={32} className="text-amber-500" />
                    </div>
                </div>

                {/* Title + description */}
                <div className="px-6 pb-2 text-center">
                    <h2 className="text-lg font-bold text-slate-900 mb-2">
                        ต้องลงทะเบียนก่อนสมัครงาน
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        เพื่อความปลอดภัยของทุกฝ่าย ผู้รับงานต้องยืนยันตัวตนด้วยข้อมูลส่วนตัวและบัตรประชาชน
                        ก่อนจึงจะสมัครงานได้
                    </p>
                </div>

                {/* Collapsible steps */}
                <div className="mx-6 my-4 rounded-xl border border-slate-100 overflow-hidden">
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                        <span>ขั้นตอนการลงทะเบียน</span>
                        <ChevronDown
                            size={16}
                            className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {open && (
                        <div className="divide-y divide-slate-100">
                            {STEPS.map(({ icon, label }) => (
                                <div key={label} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 bg-white">
                                    <span className="text-base">{icon}</span>
                                    {label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Trust note */}
                <div className="mx-6 mb-4 flex items-start gap-2 bg-blue-50 rounded-xl px-3 py-2.5">
                    <ShieldCheck size={15} className="text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                        ข้อมูลของคุณถูกเข้ารหัสและใช้เพื่อยืนยันตัวตนเท่านั้น ไม่เปิดเผยต่อบุคคลภายนอก
                    </p>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex flex-col gap-2">
                    <Link
                        href="/profile/register"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors active:scale-95"
                    >
                        ไปลงทะเบียนเลย <ArrowRight size={15} />
                    </Link>
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                    >
                        ยังไม่ตอนนี้
                    </button>
                </div>
            </div>
        </div>
    );
}
