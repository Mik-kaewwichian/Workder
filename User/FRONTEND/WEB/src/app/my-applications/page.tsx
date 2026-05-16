'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { ArrowLeft, Briefcase, Clock, CheckCircle2, XCircle, Loader2, Star } from 'lucide-react';
import api from '../../lib/api';
import { getAuthSession } from '../../features/auth/lib/auth';
import ReviewModal from '../../features/reviews/components/ReviewModal';

type MyApplication = {
    id: number;
    status: string;
    createdAt: string;
    message?: string;
    job: {
        id: number;
        title: string;
        payAmount: number;
        type: string;
        postedBy?: { firstName?: string; lastName?: string };
    };
};

const STATUS_COLOR: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
};
const STATUS_LABEL: Record<string, string> = {
    pending: 'รอการพิจารณา', accepted: 'รับแล้ว', rejected: 'ปฏิเสธแล้ว',
};
const TYPE_MAP: Record<string, string> = {
    urgent: 'งานด่วน', parttime: 'Part-time', fulltime: 'Full-time', safezone: 'Safezone',
};

export default function MyApplicationsPage() {
    const [applications, setApplications] = useState<MyApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewJobId, setReviewJobId] = useState<number | null>(null);
    const [reviewedJobIds, setReviewedJobIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        const session = getAuthSession();
        if (!session) return;
        api.get(`/applications/worker/${session.userId}`)
            .then(({ data }) => setApplications(Array.isArray(data) ? data : []))
            .catch(() => setApplications([]))
            .finally(() => setLoading(false));
    }, []);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

    const handleReviewSubmitted = (jobId: number) => {
        setReviewedJobIds((prev) => new Set(prev).add(jobId));
        setReviewJobId(null);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-20 pb-12">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="flex items-center gap-3 mb-6">
                        <Link href="/" className="p-2 text-slate-500 hover:text-slate-800 bg-white rounded-full border border-slate-200">
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">การสมัครงานของฉัน</h1>
                            <p className="text-sm text-slate-500">ติดตามสถานะการสมัครงานทั้งหมด</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-12 flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                            <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-600 font-medium mb-1">ยังไม่มีการสมัครงาน</p>
                            <p className="text-slate-400 text-sm mb-4">เริ่มต้นค้นหางานและกดสมัครได้เลย</p>
                            <Link href="/map" className="text-blue-600 font-medium hover:underline text-sm">ดูงานในแผนที่</Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {applications.map((app) => {
                                const employer = app.job.postedBy
                                    ? [app.job.postedBy.firstName, app.job.postedBy.lastName].filter(Boolean).join(' ') || 'นายจ้าง'
                                    : 'นายจ้าง';
                                const canReview = app.status === 'accepted';
                                const reviewed = reviewedJobIds.has(app.job.id);

                                return (
                                    <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                                <Briefcase size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-slate-900 truncate">{app.job.title}</h3>
                                                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[app.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                                        {STATUS_LABEL[app.status] ?? app.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5">{employer} • {TYPE_MAP[app.job.type] ?? app.job.type}</p>
                                                <p className="text-sm font-semibold text-blue-600 mt-1">{app.job.payAmount}฿</p>
                                                {app.message && (
                                                    <p className="text-xs text-slate-600 mt-1 italic bg-slate-50 rounded px-2 py-1">"{app.message}"</p>
                                                )}
                                                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                                                    <Clock size={10} /> สมัครเมื่อ {formatDate(app.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status icon row */}
                                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs">
                                                {app.status === 'accepted' && <CheckCircle2 size={14} className="text-green-500" />}
                                                {app.status === 'rejected' && <XCircle size={14} className="text-red-400" />}
                                                {app.status === 'pending' && <Clock size={14} className="text-amber-500" />}
                                                <span className="text-slate-500">{STATUS_LABEL[app.status] ?? app.status}</span>
                                            </div>

                                            {canReview && !reviewed && (
                                                <button
                                                    onClick={() => setReviewJobId(app.job.id)}
                                                    className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <Star size={12} fill="currentColor" /> รีวิวงาน
                                                </button>
                                            )}
                                            {reviewed && (
                                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                                    <CheckCircle2 size={12} /> รีวิวแล้ว
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {reviewJobId && (
                <ReviewModal
                    jobId={reviewJobId}
                    onClose={() => setReviewJobId(null)}
                    onSubmitted={() => handleReviewSubmitted(reviewJobId)}
                />
            )}
        </>
    );
}
