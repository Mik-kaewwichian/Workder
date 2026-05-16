'use client';

import React from 'react';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import { Briefcase, Clock, CheckCircle, XCircle, MoreVertical, Plus } from 'lucide-react';

export default function JobStatusPage() {
    // Mock Data
    const jobs = [
        { id: 1, title: 'หาช่างซ่อมท่อประปา', location: 'สุขุมวิท 21', budget: '500 - 1,000 บาท', status: 'OPEN', applicants: 3, posted: '2 ชม. ที่แล้ว' },
        { id: 2, title: 'ต้องการแม่บ้านทำความสะอาด', location: 'คอนโด Regent Home', budget: '300 บาท/ชม.', status: 'IN_PROGRESS', applicants: 5, posted: '1 วันที่แล้ว', worker: 'สมศรี สะอาด' },
        { id: 3, title: 'ช่างไฟ เดินสายไฟใหม่', location: 'ร้านกาแฟ Ari', budget: '2,500 บาท', status: 'COMPLETED', applicants: 12, posted: '3 วันที่แล้ว', worker: 'ประวิทย์ ไฟฟ้า' },
        { id: 4, title: 'คนสวน ตัดหญ้าหน้าบ้าน', location: 'หมู่บ้าน Pleno', budget: '500 บาท', status: 'CANCELLED', applicants: 0, posted: '1 สัปดาห์ที่แล้ว' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN': return <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">เปิดรับสมัคร</span>;
            case 'IN_PROGRESS': return <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><Clock size={12} /> กำลังดำเนินการ</span>;
            case 'COMPLETED': return <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={12} /> เสร็จสิ้น</span>;
            case 'CANCELLED': return <span className="bg-red-50 text-red-500 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><XCircle size={12} /> ยกเลิก</span>;
            default: return null;
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Briefcase className="h-6 w-6 text-slate-700" />
                            จัดการงานของคุณ
                        </h1>
                        <Link href="/employer/jobs/create" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-sm transition-colors shadow-sm">
                            <Plus size={18} />
                            โพสต์งานใหม่
                        </Link>
                    </div>

                    {/* Filter Tabs (Mock) */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        <button className="bg-white border border-slate-200 text-slate-800 font-medium px-4 py-2 rounded-full text-sm hover:bg-slate-50 shadow-sm whitespace-nowrap">ทั้งหมด</button>
                        <button className="bg-slate-100 text-slate-500 font-medium px-4 py-2 rounded-full text-sm hover:bg-slate-200 whitespace-nowrap">เปิดรับสมัคร (1)</button>
                        <button className="bg-slate-100 text-slate-500 font-medium px-4 py-2 rounded-full text-sm hover:bg-slate-200 whitespace-nowrap">กำลังดำเนินการ (1)</button>
                        <button className="bg-slate-100 text-slate-500 font-medium px-4 py-2 rounded-full text-sm hover:bg-slate-200 whitespace-nowrap">เสร็จสิ้น (1)</button>
                    </div>

                    {/* Job List */}
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {getStatusBadge(job.status)}
                                            <span className="text-xs text-slate-400">• {job.posted}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-slate-600 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Briefcase size={16} className="text-slate-400" />
                                        {job.budget}
                                    </div>
                                    <div className="hidden sm:block text-slate-300">|</div>
                                    <div className="flex items-center gap-1">
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">
                                            {job.location}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-50 pt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {job.status === 'IN_PROGRESS' || job.status === 'COMPLETED' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                                                    {job.worker?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">ผู้รับงาน</p>
                                                    <p className="text-sm font-semibold text-slate-900">{job.worker}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex -space-x-2">
                                                {[...Array(Math.min(3, job.applicants))].map((_, i) => (
                                                    <div key={i} className="h-8 w-8 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-slate-500">
                                                        ?
                                                    </div>
                                                ))}
                                                {job.applicants > 0 && (
                                                    <span className="text-sm text-slate-500 ml-3 self-center hover:underline cursor-pointer">
                                                        {job.applicants} ผู้สมัคร
                                                    </span>
                                                )}
                                                {job.applicants === 0 && (
                                                    <span className="text-sm text-slate-400 italic">ยังไม่มีผู้สมัคร</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <button className="text-blue-600 font-semibold text-sm hover:underline">
                                        จัดการ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
}
