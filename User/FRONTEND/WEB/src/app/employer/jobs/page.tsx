'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import {
    Briefcase, Clock, CheckCircle, XCircle, Plus, Loader2,
    Users, Eye, MapPin, MoreVertical,
} from 'lucide-react';
import api from '../../../lib/api';
import { getAuthSession } from '../../../features/auth/lib/auth';

type Job = {
    id: number;
    title: string;
    type: string;
    status: string;
    payAmount: number;
    description?: string;
    lat?: number;
    lng?: number;
    createdAt: string;
    _count?: { applications: number };
};

const TYPE_MAP: Record<string, string> = {
    urgent: 'งานด่วน', parttime: 'Part-time', fulltime: 'Full-time', safezone: 'Safezone',
};

const STATUS_TABS = ['ทั้งหมด', 'เปิดรับ', 'ปิดรับ'];

export default function MyJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ทั้งหมด');
    const [togglingId, setTogglingId] = useState<number | null>(null);

    useEffect(() => {
        const session = getAuthSession();
        if (!session) return;
        api.get(`/jobs?postedById=${session.userId}`)
            .then(({ data }) => setJobs(Array.isArray(data) ? data : []))
            .catch(() => setJobs([]))
            .finally(() => setLoading(false));
    }, []);

    const toggleStatus = async (job: Job) => {
        const next = job.status === 'open' ? 'closed' : 'open';
        setTogglingId(job.id);
        try {
            await api.patch(`/jobs/${job.id}`, { status: next });
            setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, status: next } : j));
        } catch { /* ignore */ }
        finally { setTogglingId(null); }
    };

    const filtered = jobs.filter((job) => {
        if (activeTab === 'เปิดรับ') return job.status === 'open';
        if (activeTab === 'ปิดรับ') return job.status !== 'open';
        return true;
    });

    const openCount = jobs.filter((j) => j.status === 'open').length;
    const closedCount = jobs.length - openCount;

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Briefcase className="h-6 w-6 text-slate-700" /> งานของฉัน
                            </h1>
                            <p className="text-slate-500 text-sm mt-0.5">ประกาศงานทั้งหมดที่คุณโพสต์</p>
                        </div>
                        <Link
                            href="/employer/jobs/create"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 text-sm transition-colors shadow-sm"
                        >
                            <Plus size={18} /> โพสต์งานใหม่
                        </Link>
                    </div>

                    {/* Stats */}
                    {!loading && jobs.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                                <p className="text-2xl font-bold text-slate-800">{jobs.length}</p>
                                <p className="text-xs text-slate-500 mt-0.5">ทั้งหมด</p>
                            </div>
                            <div className="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
                                <p className="text-2xl font-bold text-green-700">{openCount}</p>
                                <p className="text-xs text-slate-500 mt-0.5">เปิดรับ</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-center">
                                <p className="text-2xl font-bold text-slate-500">{closedCount}</p>
                                <p className="text-xs text-slate-500 mt-0.5">ปิดรับ</p>
                            </div>
                        </div>
                    )}

                    {/* Filter tabs */}
                    <div className="flex gap-2 mb-5">
                        {STATUS_TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                                    }`}
                            >
                                {tab}
                                {tab === 'เปิดรับ' && openCount > 0 && ` (${openCount})`}
                                {tab === 'ปิดรับ' && closedCount > 0 && ` (${closedCount})`}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-12 flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                            <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                            {jobs.length === 0 ? (
                                <>
                                    <p className="text-slate-600 font-medium mb-1">ยังไม่มีประกาศงาน</p>
                                    <p className="text-slate-400 text-sm mb-4">เริ่มต้นโพสต์งานเพื่อหาคนทำงาน</p>
                                    <Link href="/employer/jobs/create" className="text-blue-600 font-semibold text-sm hover:underline">
                                        + สร้างประกาศงานแรก
                                    </Link>
                                </>
                            ) : (
                                <p className="text-slate-500">ไม่มีงานในหมวดนี้</p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((job) => {
                                const label = TYPE_MAP[job.type] ?? job.type;
                                const isOpen = job.status === 'open';
                                const applicants = job._count?.applications ?? 0;
                                const isToggling = togglingId === job.id;

                                return (
                                    <div key={job.id} className="bg-white rounded-xl border border-slate-200 hover:shadow-sm transition-shadow p-5">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isOpen ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        {isOpen ? '● เปิดรับ' : '○ ปิดรับ'}
                                                    </span>
                                                    <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
                                                        {label}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-slate-900 text-base truncate">{job.title}</h3>
                                            </div>
                                            <p className="text-lg font-bold text-blue-600 shrink-0">{job.payAmount.toLocaleString()}฿</p>
                                        </div>

                                        {job.description && (
                                            <p className="text-sm text-slate-500 line-clamp-2 mb-3">{job.description}</p>
                                        )}

                                        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} /> {formatDate(job.createdAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users size={12} /> {applicants} คนสมัคร
                                            </span>
                                            {job.lat && job.lng && (
                                                <span className="flex items-center gap-1 text-green-600">
                                                    <MapPin size={12} /> ปักหมุดแล้ว
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-2 flex-wrap">
                                            <Link
                                                href={`/workboard/${job.id}`}
                                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                            >
                                                <Eye size={13} /> ดูรายละเอียด
                                            </Link>
                                            <Link
                                                href={`/employer/candidates?jobId=${job.id}`}
                                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                            >
                                                <Users size={13} /> ดูผู้สมัคร {applicants > 0 && `(${applicants})`}
                                            </Link>
                                            <button
                                                onClick={() => toggleStatus(job)}
                                                disabled={isToggling}
                                                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-60 ${isOpen
                                                    ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                    }`}
                                            >
                                                {isToggling ? (
                                                    <Loader2 size={13} className="animate-spin" />
                                                ) : isOpen ? (
                                                    <><XCircle size={13} /> ปิดรับสมัคร</>
                                                ) : (
                                                    <><CheckCircle size={13} /> เปิดรับสมัคร</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
