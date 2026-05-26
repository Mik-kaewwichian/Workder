'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import {
    ArrowLeft, Briefcase, MapPin, Star, Users, Clock, CheckCircle2,
    Loader2, ChevronLeft, ChevronRight, Phone, User, MessageSquare,
} from 'lucide-react';
import api from '../../../lib/api';
import { getAuthSession } from '../../../features/auth/lib/auth';
import NeedRegistrationModal from '../../../components/NeedRegistrationModal';
import ApplyModal from '../../../components/ApplyModal';

// ─── Types ───────────────────────────────────────────────────────────────────

type Review = {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    author: { id: number; firstName?: string; lastName?: string };
};

type JobDetail = {
    id: number;
    title: string;
    type: string;
    status: string;
    payAmount: number;
    description?: string;
    lat?: number;
    lng?: number;
    image1?: string;
    image2?: string;
    image3?: string;
    createdAt: string;
    postedBy?: { id: number; firstName?: string; lastName?: string; phone?: string };
    reviews: Review[];
    _count?: { applications: number };
};

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPE_MAP: Record<string, string> = {
    urgent: 'งานด่วน', parttime: 'พาร์ทไทม์', fulltime: 'ฟูลไทม์', safezone: 'เซฟโซน',
};
const TYPE_COLOR: Record<string, string> = {
    'งานด่วน': 'bg-red-100 text-red-600',
    'พาร์ทไทม์': 'bg-green-100 text-green-600',
    'ฟูลไทม์': 'bg-blue-100 text-blue-600',
    'เซฟโซน': 'bg-pink-100 text-pink-600',
};

function StarRow({ rating }: { rating: number }) {
    return (
        <span className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={14}
                    className={n <= rating ? 'text-amber-400' : 'text-slate-200'}
                    fill={n <= rating ? 'currentColor' : 'none'}
                />
            ))}
        </span>
    );
}

// ─── Mini map showing job location ───────────────────────────────────────────

function JobLocationMap({ lat, lng }: { lat: number; lng: number }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        if (!document.querySelector('link[data-leaflet]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.setAttribute('data-leaflet', '1');
            document.head.appendChild(link);
        }

        const init = () => {
            const L = (window as any).L;
            if (!ref.current) return;
            const map = L.map(ref.current, { zoomControl: false, dragging: false, scrollWheelZoom: false })
                .setView([lat, lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            const icon = L.divIcon({
                className: '',
                html: `<div style="width:32px;height:32px;background:#2563eb;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3)"><div style="width:8px;height:8px;background:white;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(45deg)"></div></div>`,
                iconSize: [32, 32], iconAnchor: [16, 32],
            });
            L.marker([lat, lng], { icon }).addTo(map);
            return () => map.remove();
        };

        if ((window as any).L) { const cleanup = init(); return cleanup; }
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        s.onload = () => init();
        document.head.appendChild(s);
    }, [lat, lng]);

    return <div ref={ref} className="w-full h-48 rounded-xl overflow-hidden border border-slate-200" />;
}

// ─── Image gallery ────────────────────────────────────────────────────────────

function ImageGallery({ images }: { images: string[] }) {
    const [idx, setIdx] = useState(0);
    if (images.length === 0) return null;

    return (
        <div className="relative rounded-2xl overflow-hidden bg-slate-100" style={{ aspectRatio: '16/9' }}>
            <img src={images[idx]} alt="" className="w-full h-full object-cover" />
            {images.length > 1 && (
                <>
                    <button
                        onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => setIdx((i) => (i + 1) % images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60"
                    >
                        <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIdx(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-white scale-125' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JobDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [job, setJob] = useState<JobDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [applyError, setApplyError] = useState('');
    const [chatting, setChatting] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);

    const session = typeof window !== 'undefined' ? getAuthSession() : null;
    const isEmployer = session?.role === 'employer';
    const isOwnJob = !!session && !!job?.postedBy?.id && job.postedBy.id === Number(session.userId);

    useEffect(() => {
        api.get(`/jobs/${id}`)
            .then(({ data }) => setJob(data))
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));

        // Pre-check if this worker already applied — show "สมัครแล้ว" immediately on load
        if (session && session.role !== 'employer') {
            api.get(`/applications/worker/${session.userId}`)
                .then(({ data }) => {
                    if (Array.isArray(data) && data.some((a: { job?: { id: number } }) => a.job?.id === Number(id))) {
                        setApplied(true);
                    }
                })
                .catch(() => {/* non-critical */});
        }
    }, [id]);

    // Gate: check auth + profile, then open the experience modal
    const handleApply = () => {
        if (!session) { router.push('/login'); return; }
        if (!session.profileCompleted) { setShowRegisterModal(true); return; }
        setApplyError('');
        setShowApplyModal(true);
    };

    // Actual submit — called by ApplyModal after experience is filled in
    const submitApply = async (experience: string) => {
        setApplying(true);
        setApplyError('');
        try {
            await api.post('/applications', { jobId: Number(id), workerId: Number(session!.userId), message: experience });
            setApplied(true);
            setShowApplyModal(false);
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            if (msg === 'Already applied to this job') { setApplied(true); setShowApplyModal(false); }
            else if (msg === 'You cannot apply to your own job') throw new Error('คุณไม่สามารถสมัครงานที่คุณโพสต์เองได้');
            else if (msg === 'PROFILE_INCOMPLETE') { setShowRegisterModal(true); setShowApplyModal(false); }
            else throw new Error(msg || 'เกิดข้อผิดพลาด');
        } finally {
            setApplying(false);
        }
    };

    const handleChat = async () => {
        if (!session) { router.push('/login'); return; }
        if (!job?.postedBy?.id) { setApplyError('ไม่พบข้อมูลนายจ้าง'); return; }
        setChatting(true);
        try {
            const { data } = await api.post('/chat/conversations', {
                jobId: Number(id),
                employerId: job.postedBy.id,
                workerId: Number(session.userId),
            });
            router.push(`/messages?conversationId=${data.id}`);
        } catch {
            setApplyError('ไม่สามารถเริ่มแชทได้');
            setChatting(false);
        }
    };

    const images = [job?.image1, job?.image2, job?.image3].filter(Boolean) as string[];
    const label = job ? (TYPE_MAP[job.type] ?? job.type) : '';
    const employer = job?.postedBy
        ? [job.postedBy.firstName, job.postedBy.lastName].filter(Boolean).join(' ') || 'นายจ้าง'
        : 'นายจ้าง';
    const avgRating = job && job.reviews.length > 0
        ? (job.reviews.reduce((s, r) => s + r.rating, 0) / job.reviews.length).toFixed(1)
        : null;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-6 pb-20">
                <div className="max-w-2xl mx-auto px-4">

                    {/* Back */}
                    <button
                        onClick={() => router.back()}
                        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={18} /> กลับ Workboard
                    </button>

                    {loading && (
                        <div className="flex justify-center py-24">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    )}

                    {notFound && (
                        <div className="text-center py-24">
                            <p className="text-slate-500 font-medium mb-3">ไม่พบงานนี้</p>
                            <Link href="/workboard" className="text-blue-600 text-sm hover:underline">กลับ Workboard</Link>
                        </div>
                    )}

                    {job && (
                        <div className="space-y-5">

                            {/* Image gallery */}
                            {images.length > 0 && <ImageGallery images={images} />}

                            {/* Header card */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <h1 className="text-xl font-bold text-slate-900 leading-tight">{job.title}</h1>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${TYPE_COLOR[label] ?? 'bg-slate-100 text-slate-600'}`}>
                                        {label}
                                    </span>
                                </div>

                                {/* Pay */}
                                <p className="text-3xl font-bold text-blue-600 mb-4">
                                    {job.payAmount.toLocaleString()}<span className="text-lg font-semibold text-blue-400">฿</span>
                                </p>

                                {/* Meta row */}
                                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <User size={14} /> {employer}
                                        {job.postedBy?.phone && (
                                            <a href={`tel:${job.postedBy.phone}`} className="ml-1 flex items-center gap-1 text-blue-600 hover:underline">
                                                <Phone size={12} /> {job.postedBy.phone}
                                            </a>
                                        )}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Users size={14} /> {job._count?.applications ?? 0} คนสมัคร
                                    </span>
                                    {avgRating && (
                                        <span className="flex items-center gap-1.5">
                                            <Star size={14} className="text-amber-400" fill="currentColor" /> {avgRating} ({job.reviews.length} รีวิว)
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={14} />
                                        {new Date(job.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>

                                {/* Status badge */}
                                <div className="mt-3">
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'open' ? 'bg-green-500' : 'bg-slate-400'}`} />
                                        {job.status === 'open' ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            {job.description && (
                                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                                    <h2 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide text-slate-500">รายละเอียดงาน</h2>
                                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
                                </div>
                            )}

                            {/* Location map */}
                            {job.lat && job.lng && (
                                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                                    <h2 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide text-slate-500 flex items-center gap-2">
                                        <MapPin size={14} /> สถานที่ทำงาน
                                    </h2>
                                    <JobLocationMap lat={job.lat} lng={job.lng} />
                                    <p className="mt-2 text-xs text-slate-400">{job.lat.toFixed(5)}, {job.lng.toFixed(5)}</p>
                                </div>
                            )}

                            {/* Reviews */}
                            {job.reviews.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                                    <h2 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide text-slate-500 flex items-center gap-2">
                                        <Star size={14} className="text-amber-400" fill="currentColor" />
                                        รีวิวจากผู้ทำงาน ({job.reviews.length})
                                    </h2>
                                    <div className="space-y-4">
                                        {job.reviews.map((r) => {
                                            const name = [r.author.firstName, r.author.lastName].filter(Boolean).join(' ') || 'ผู้ใช้งาน';
                                            return (
                                                <div key={r.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-semibold text-sm text-slate-800">{name}</span>
                                                        <StarRow rating={r.rating} />
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {new Date(r.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Owner notice — this is your own job posting */}
            {job && isOwnJob && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3">
                    <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm truncate">{job.title}</p>
                        <p className="text-blue-600 font-bold">{job.payAmount.toLocaleString()}฿</p>
                    </div>
                    <span className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 text-slate-500 font-bold text-sm">
                        นี่คืองานที่คุณโพสต์
                    </span>
                    <button
                        onClick={() => router.push(`/employer/candidates?jobId=${job.id}`)}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors active:scale-95"
                    >
                        ดูผู้สมัคร
                    </button>
                </div>
            )}

            {/* Sticky apply bar — workers only, not own job */}
            {job && !isEmployer && !isOwnJob && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3">
                    <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm truncate">{job.title}</p>
                        <p className="text-blue-600 font-bold">{job.payAmount.toLocaleString()}฿</p>
                    </div>
                    <button
                        onClick={handleChat}
                        disabled={chatting}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 disabled:opacity-60 transition-colors active:scale-95"
                    >
                        {chatting ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                        แชท
                    </button>
                    {job.status !== 'open' ? (
                        <span className="px-6 py-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm">ปิดรับแล้ว</span>
                    ) : applied ? (
                        <span className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-100 text-green-700 font-bold text-sm">
                            <CheckCircle2 size={16} /> สมัครแล้ว
                        </span>
                    ) : (
                        <button
                            onClick={handleApply}
                            disabled={applying}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-60 transition-colors active:scale-95"
                        >
                            {applying ? <Loader2 size={16} className="animate-spin" /> : null}
                            สมัครงาน
                        </button>
                    )}
                    {applyError && (
                        <p className="absolute bottom-full left-4 right-4 mb-1 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-1.5 border border-red-100">{applyError}</p>
                    )}
                </div>
            )}

            {showRegisterModal && (
                <NeedRegistrationModal onClose={() => setShowRegisterModal(false)} />
            )}

            {showApplyModal && job && (
                <ApplyModal
                    job={job}
                    onClose={() => setShowApplyModal(false)}
                    onApply={submitApply}
                />
            )}
        </>
    );
}
