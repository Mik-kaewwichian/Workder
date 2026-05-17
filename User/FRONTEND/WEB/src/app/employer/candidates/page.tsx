'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import { ArrowLeft, Users, Briefcase, CheckCircle2, XCircle, Clock, Loader2, MessageSquare, UserRound } from 'lucide-react';
import api from '../../../lib/api';
import { getAuthSession } from '../../../features/auth/lib/auth';

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

function CandidatesContent() {
    const params = useSearchParams();
    const router = useRouter();
    const jobIdParam = params.get('jobId');
    const [chattingId, setChattingId] = useState<number | null>(null);

    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(jobIdParam ? parseInt(jobIdParam) : null);
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    useEffect(() => {
        const session = getAuthSession();
        if (!session) return;
        api.get(`/jobs?postedById=${session.userId}`)
            .then(({ data }) => {
                setJobs(Array.isArray(data) ? data : []);
                if (!selectedJobId && Array.isArray(data) && data.length > 0) {
                    setSelectedJobId(data[0].id);
                }
            })
            .catch(() => setJobs([]))
            .finally(() => setLoadingJobs(false));
    }, []);

    useEffect(() => {
        if (!selectedJobId) return;
        setLoadingApplicants(true);
        api.get(`/applications/job/${selectedJobId}`)
            .then(({ data }) => setApplicants(Array.isArray(data) ? data : []))
            .catch(() => setApplicants([]))
            .finally(() => setLoadingApplicants(false));
    }, [selectedJobId]);

    const updateStatus = async (applicationId: number, status: 'accepted' | 'rejected') => {
        setUpdatingId(applicationId);
        try {
            await api.patch(`/applications/${applicationId}/status`, { status });
            setApplicants((prev) => prev.map((a) => a.id === applicationId ? { ...a, status } : a));
        } catch { /* ignore */ }
        finally { setUpdatingId(null); }
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
                                {jobs.map((job) => (
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
                                            <div className="min-w-0">
                                                <p className={`font-semibold text-sm truncate ${selectedJobId === job.id ? 'text-blue-700' : 'text-slate-800'}`}>
                                                    {job.title}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5">{job.payAmount}฿ • {job.type}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
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
                                    return (
                                        <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
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
                                                {app.message && <p className="text-xs text-slate-600 mt-1 italic">"{app.message}"</p>}
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
                                                            onClick={() => updateStatus(app.id, 'accepted')}
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
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
