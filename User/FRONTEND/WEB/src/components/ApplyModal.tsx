'use client';

import React, { useState } from 'react';
import { Briefcase, X, Send, Loader2, AlertCircle } from 'lucide-react';

type Job = { id: number; title: string; payAmount: number; type?: string };

const TYPE_MAP: Record<string, string> = {
    urgent: 'งานด่วน', parttime: 'พาร์ทไทม์', fulltime: 'ฟูลไทม์', safezone: 'เซฟโซน',
};

export default function ApplyModal({
    job,
    onClose,
    onApply,
}: {
    job: Job;
    onClose: () => void;
    onApply: (experience: string) => Promise<void>;
}) {
    const [experience, setExperience] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const MIN_CHARS = 30;
    const remaining = MIN_CHARS - experience.trim().length;
    const isValid = experience.trim().length >= MIN_CHARS;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        setError('');
        setSubmitting(true);
        try {
            await onApply(experience.trim());
        } catch (err: any) {
            setError(err?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900 leading-tight">{job.title}</h2>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-sm font-semibold text-blue-600">{job.payAmount.toLocaleString()}฿</span>
                                    {job.type && (
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                                            {TYPE_MAP[job.type] ?? job.type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-1.5">
                            ประสบการณ์ทำงาน <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-slate-500 mb-2.5">
                            แนะนำตัวเองและระบุประสบการณ์ที่เกี่ยวข้องกับงานนี้ให้นายจ้างพิจารณา
                        </p>
                        <textarea
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            placeholder="เช่น ฉันมีประสบการณ์ช่างไฟฟ้า 3 ปี เคยทำโปรเจกต์ติดตั้งระบบไฟฟ้าภายในบ้านและอาคารพาณิชย์ มีใบรับรองช่างฝีมือแรงงาน..."
                            rows={5}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                        />
                        <div className="flex items-center justify-between mt-1.5">
                            {!isValid && experience.length > 0 ? (
                                <span className="text-xs text-amber-600 flex items-center gap-1">
                                    <AlertCircle size={11} /> ต้องการอีก {remaining} ตัวอักษร
                                </span>
                            ) : isValid ? (
                                <span className="text-xs text-green-600">✓ พร้อมส่ง</span>
                            ) : (
                                <span className="text-xs text-slate-400">ขั้นต่ำ {MIN_CHARS} ตัวอักษร</span>
                            )}
                            <span className="text-xs text-slate-400">{experience.trim().length} ตัวอักษร</span>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <AlertCircle size={14} className="text-red-500 shrink-0" />
                            <p className="text-xs text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid || submitting}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {submitting ? (
                                <><Loader2 size={15} className="animate-spin" /> กำลังส่ง...</>
                            ) : (
                                <><Send size={15} /> ส่งใบสมัคร</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
