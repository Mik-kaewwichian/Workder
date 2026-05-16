'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    MapPin,
    Plus,
    Briefcase,
    Users,
    TrendingUp,
    ShieldCheck,
    Crown,
    CheckCircle2,
    XCircle,
    Clock,
} from 'lucide-react';
import { getAuthSession, type AuthSession } from '../../auth/lib/auth';
import { getJobs, updateJobStatus, type JobPost } from '../../jobs/lib/jobs';

export default function EmployerDashboard() {
    const [session, setSession] = useState<AuthSession | null>(null);
    const [jobs, setJobs] = useState<JobPost[]>([]);

    useEffect(() => {
        setSession(getAuthSession());
        setJobs(getJobs());
    }, []);

    const displayName = session?.name || 'กิตติธร';

    const toggleStatus = (id: string, current: JobPost['status']) => {
        const next: JobPost['status'] = current === 'เปิดรับ' ? 'ปิดรับ' : 'เปิดรับ';
        updateJobStatus(id, next);
        setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: next } : j)));
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-6 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        สวัสดี, {displayName} 👋
                    </h1>
                    <p className="text-slate-600 mt-1">
                        จัดการงานและหาคนทำงานคุณภาพได้ที่นี่
                    </p>
                </div>

                {/* Ads / Promotions Banner */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <span className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full mb-3 inline-block">
                                แนะนำ
                            </span>
                            <h2 className="text-2xl font-bold mb-2">บูสต์ประกาศงานของคุณ</h2>
                            <p className="text-blue-100 mb-4 text-sm max-w-xs">
                                เพิ่มการมองเห็น 3 เท่า และได้คนทำงานไวขึ้น ด้วยแพ็กเกจบูสต์โพสต์
                            </p>
                            <Link href="/premium" className="inline-block bg-white text-blue-700 font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                                ดูแพ็กเกจ
                            </Link>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10">
                            <TrendingUp size={150} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2">สมัครสมาชิก Premium</h2>
                            <p className="text-orange-100 mb-4 text-sm max-w-xs">
                                ปลดล็อกฟีเจอร์ขั้นสูง ดูเบอร์โทรคนทำงานได้ทันที และไม่มีโฆษณาคั่น
                            </p>
                            <Link href="/premium" className="inline-block bg-white text-orange-600 font-bold py-2 px-4 rounded-lg text-sm hover:bg-orange-50 transition-colors">
                                อัปเกรดเลย
                            </Link>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10">
                            <Crown size={150} />
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Link href="/employer/jobs/create" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col items-center text-center group">
                        <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Plus size={24} />
                        </div>
                        <span className="font-semibold text-slate-800">โพสต์งานใหม่</span>
                    </Link>

                    <Link href="/employer/map" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col items-center text-center group">
                        <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <MapPin size={24} />
                        </div>
                        <span className="font-semibold text-slate-800">ค้นหาคนใกล้ฉัน</span>
                    </Link>

                    <Link href="/employer/jobs" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col items-center text-center group">
                        <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <Briefcase size={24} />
                        </div>
                        <span className="font-semibold text-slate-800">จัดการงาน</span>
                    </Link>

                    <Link href="/employer/candidates" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col items-center text-center group">
                        <div className="h-12 w-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mb-3 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                            <Users size={24} />
                        </div>
                        <span className="font-semibold text-slate-800">ผู้สมัครงาน</span>
                    </Link>
                </div>

                {/* Recent Job Status */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900">สถานะงานล่าสุด</h3>
                        {jobs.length > 0 && (
                            <Link href="/employer/jobs" className="text-sm text-blue-600 hover:underline font-medium">
                                ดูทั้งหมด
                            </Link>
                        )}
                    </div>

                    {jobs.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 mb-4">
                                <Briefcase className="h-8 w-8 text-slate-400" />
                            </div>
                            <h4 className="text-slate-900 font-medium mb-1">ยังไม่มีการเคลื่อนไหว</h4>
                            <p className="text-slate-500 text-sm mb-4">คุณยังไม่ได้โพสต์งานหรือจ้างงานในช่วงนี้</p>
                            <Link href="/employer/jobs/create" className="text-blue-600 font-medium hover:underline text-sm">
                                + สร้างประกาศงานแรกของคุณ
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {jobs.slice(0, 5).map((job) => (
                                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-100 px-5 py-4 flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-slate-900 truncate">{job.title}</span>
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{job.category}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {formatDate(job.createdAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3 w-3" /> {job.applicants} คนสมัคร
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleStatus(job.id, job.status)}
                                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors flex-shrink-0 ${job.status === 'เปิดรับ'
                                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}
                                    >
                                        {job.status === 'เปิดรับ' ? (
                                            <><CheckCircle2 className="h-3.5 w-3.5" /> เปิดรับ</>
                                        ) : (
                                            <><XCircle className="h-3.5 w-3.5" /> ปิดรับ</>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer / Safety Tips */}
                <div className="mt-8 bg-blue-50 rounded-xl p-4 flex items-start gap-4">
                    <ShieldCheck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-800 mb-1">เคล็ดลับความปลอดภัย</h4>
                        <p className="text-sm text-blue-600">
                            WORKDER แนะนำให้ตรวจสอบประวัติคนทำงานก่อนจ้างทุกครั้ง และไม่โอนเงินมัดจำล่วงหน้าหากไม่มีการรับรองจากระบบ
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
