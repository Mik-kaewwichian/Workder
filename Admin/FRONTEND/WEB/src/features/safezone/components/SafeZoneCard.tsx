'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, DollarSign, Clock, ShieldCheck, Heart } from 'lucide-react';
import { SafeZoneJob } from '../data/items';
import { getAuthSession, type AuthSession } from '../../auth/lib/auth';

interface SafeZoneCardProps {
    job: SafeZoneJob;
}

export default function SafeZoneCard({ job }: SafeZoneCardProps) {
    const router = useRouter();
    const [session, setSession] = useState<AuthSession | null>(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    useEffect(() => {
        setSession(getAuthSession());
    }, []);

    const handleApplyClick = () => {
        if (!session) {
            router.push('/login');
            return;
        }

        if (!session.profileCompleted) {
            setShowRegisterModal(true);
            return;
        }

        router.push('/dashboard');
    };

    return (
        <>
            <div className="group rounded-2xl bg-white p-6 shadow-sm border border-pink-100 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <ShieldCheck className="h-24 w-24 text-pink-600" />
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-xs font-bold text-pink-600 border border-pink-100">
                                <ShieldCheck className="h-3 w-3" /> Safezone Verified
                            </span>
                            <span className="text-xs text-slate-400">• {job.posted}</span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-pink-600 transition-colors">{job.title}</h3>
                        <p className="text-slate-500 font-medium mb-3">{job.company}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                            <div className="flex items-center gap-1"><MapPin className="h-4 w-4 text-slate-400" /> {job.location}</div>
                            <div className="flex items-center gap-1 font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                <DollarSign className="h-4 w-4 text-slate-400" /> {job.salary}
                            </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {job.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-white text-xs font-medium text-slate-600 border border-slate-200 shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                        <button
                            type="button"
                            onClick={handleApplyClick}
                            className="whitespace-nowrap rounded-full bg-pink-600/90 backdrop-blur-sm text-white px-6 py-2 text-sm font-bold hover:bg-pink-700 shadow-lg shadow-pink-200 transition-all border border-white/20"
                        >
                            {session ? 'สมัครงาน' : 'เข้าสู่ระบบเพื่อสมัคร'}
                        </button>
                        <button className="text-xs text-slate-400 hover:text-pink-600 flex items-center gap-1 transition-colors">
                            <Heart className="h-3 w-3" /> บันทึก
                        </button>
                    </div>
                </div>
            </div>

            {showRegisterModal ? (
                <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setShowRegisterModal(false)}>
                    <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-100 shadow-2xl p-6 md:p-7" onClick={(event) => event.stopPropagation()}>
                        <p className="text-xs font-semibold text-amber-700">ก่อนเริ่มสมัครงาน</p>
                        <h3 className="text-xl font-bold text-slate-900 mt-1">ยังไม่ได้กรอกข้อมูลส่วนตัว</h3>
                        <p className="text-sm text-slate-600 mt-2">
                            ตำแหน่ง <span className="font-semibold">{job.title}</span> ต้องกรอกข้อมูลส่วนตัวหรือลงทะเบียนก่อน เพื่อเริ่มงานได้
                        </p>

                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowRegisterModal(false)}
                                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                ปิด
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowRegisterModal(false);
                                    router.push('/profile/register');
                                }}
                                className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                            >
                                ลงทะเบียน
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
