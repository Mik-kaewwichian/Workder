'use client';

import React, { useState } from 'react';
import { Star, X, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../../lib/api';
import { getAuthSession } from '../../auth/lib/auth';

type Props = {
    jobId: number;
    onClose: () => void;
    onSubmitted: () => void;
};

export default function ReviewModal({ jobId, onClose, onSubmitted }: Props) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (rating === 0) { setError('กรุณาเลือกคะแนน'); return; }
        if (!comment.trim()) { setError('กรุณาเขียนความคิดเห็น'); return; }
        const session = getAuthSession();
        if (!session) return;
        setError('');
        setSubmitting(true);
        try {
            await api.post('/reviews', { jobId, authorId: Number(session.userId), rating, comment });
            setDone(true);
            setTimeout(onSubmitted, 1000);
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            if (msg === 'Already reviewed this job') {
                setError('คุณได้รีวิวงานนี้ไปแล้ว');
            } else {
                setError(msg || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
                    <X size={20} />
                </button>

                <h2 className="text-lg font-bold text-slate-900 mb-1">รีวิวงาน</h2>
                <p className="text-sm text-slate-500 mb-5">แชร์ประสบการณ์ของคุณเพื่อช่วยคนอื่น</p>

                {done ? (
                    <div className="py-8 flex flex-col items-center gap-3 text-green-600">
                        <CheckCircle2 size={40} />
                        <p className="font-semibold">ขอบคุณสำหรับรีวิว!</p>
                    </div>
                ) : (
                    <>
                        {/* Star Rating */}
                        <div className="flex items-center gap-1 mb-5 justify-center">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onMouseEnter={() => setHovered(n)}
                                    onMouseLeave={() => setHovered(0)}
                                    onClick={() => setRating(n)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={32}
                                        className={`transition-colors ${n <= (hovered || rating) ? 'text-amber-400' : 'text-slate-200'}`}
                                        fill={n <= (hovered || rating) ? 'currentColor' : 'none'}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-center text-sm text-slate-500 mb-4 -mt-3">
                                {['', 'แย่มาก', 'แย่', 'พอใช้', 'ดี', 'ดีมาก'][rating]}
                            </p>
                        )}

                        {/* Comment */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">ความคิดเห็น</label>
                            <textarea
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="เล่าประสบการณ์การทำงานของคุณ..."
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                            />
                        </div>

                        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>}

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
                            >
                                {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
                                ส่งรีวิว
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
