'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { Search, Filter, Star, MapPin, Briefcase, ArrowLeft, Loader2, AlertCircle, CheckCircle2, Eye } from 'lucide-react';
import api from '../../../lib/api';
import { getAuthSession } from '../../auth/lib/auth';

type Job = {
    id: number;
    title: string;
    company: string;
    salary: string;
    type: string;
    rating: number;
    distance: string;
    lat: number;
    lng: number;
    photo?: string;
    hasRealLocation?: boolean;
    postedById?: number;
};

type UserLocation = { lat: number; lng: number };

const JobMapLeaflet = dynamic<{ jobs: Job[]; mapHeight: number; userLocation: UserLocation | null; onJobClick?: (id: number) => void }>(
    () => import('./JobMapLeaflet'),
    { ssr: false, loading: () => <div style={{ width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>กำลังโหลดแผนที่...</div> }
);

const SEARCH_BAR_H = 57;
const BOTTOM_CARD_H = 148;
const NAVBAR_H = 64;
const RADIUS_KM = 10;

// Bangkok area demo positions used when a job has no coordinates
const DEMO_POSITIONS: [number, number][] = [
    [13.7563, 100.5018], [13.7580, 100.5080], [13.7530, 100.4990],
    [13.7545, 100.5060], [13.7600, 100.4950], [13.7510, 100.5100],
];

const TYPE_MAP: Record<string, string> = {
    urgent: 'งานด่วน', parttime: 'พาร์ทไทม์', fulltime: 'ฟูลไทม์', safezone: 'เซฟโซน',
};

function mapApiJob(raw: any, index: number): Job {
    const hasRealLocation = !!(raw.lat && raw.lng);
    const [lat, lng] = hasRealLocation
        ? [raw.lat, raw.lng]
        : DEMO_POSITIONS[index % DEMO_POSITIONS.length];
    const postedBy = raw.postedBy;
    const company = postedBy
        ? [postedBy.firstName, postedBy.lastName].filter(Boolean).join(' ') || 'นายจ้าง'
        : 'นายจ้าง';
    return {
        id: raw.id,
        title: raw.title,
        company,
        salary: `${raw.payAmount}฿`,
        type: TYPE_MAP[raw.type] ?? raw.type,
        rating: 4.5,
        distance: '—',
        lat,
        lng,
        hasRealLocation,
        postedById: postedBy?.id,
    };
}

const DEMO_JOBS: Job[] = [
    { id: 1, title: 'ช่างไฟฟ้า', company: 'บ้านสุขใจ', salary: '500฿/วัน', type: 'งานด่วน', rating: 4.8, distance: '500m', lat: 13.7563, lng: 100.5018, photo: 'https://i.pravatar.cc/100?img=3' },
    { id: 2, title: 'แม่บ้าน (พาร์ทไทม์)', company: 'คุณอรุณ', salary: '300฿/ครั้ง', type: 'เซฟโซน', rating: 4.5, distance: '1.2km', lat: 13.7580, lng: 100.5080, photo: 'https://i.pravatar.cc/100?img=49' },
    { id: 3, title: 'ช่างแอร์', company: 'ออฟฟิศสาทร', salary: '800฿/เครื่อง', type: 'Premium', rating: 4.9, distance: '2.5km', lat: 13.7530, lng: 100.4990, photo: 'https://i.pravatar.cc/100?img=60' },
    { id: 4, title: 'ช่างประปา', company: 'นิคมอุตสาหกรรม', salary: '600฿/วัน', type: 'ฟูลไทม์', rating: 4.2, distance: '800m', lat: 13.7545, lng: 100.5060, photo: 'https://i.pravatar.cc/100?img=12' },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function JobMap() {
    const router = useRouter();
    const [allJobs, setAllJobs] = useState<Job[]>(DEMO_JOBS);
    const [mapHeight, setMapHeight] = useState(0);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [locationStatus, setLocationStatus] = useState<'loading' | 'granted' | 'denied'>('loading');
    const [applyingIds, setApplyingIds] = useState<Set<number>>(new Set());
    const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());
    const [workerBusy, setWorkerBusy] = useState(false);
    const [activeJobId, setActiveJobId] = useState<number | null>(null);

    const session = typeof window !== 'undefined' ? getAuthSession() : null;

    // Fetch real jobs + pre-populate applied IDs so refresh doesn't reset state
    useEffect(() => {
        api.get('/jobs')
            .then(({ data }) => {
                if (Array.isArray(data) && data.length > 0) {
                    setAllJobs(data.filter((j: any) => j.status !== 'completed').map(mapApiJob));
                }
            })
            .catch(() => {/* API unavailable — keep demo data */});

        if (session && session.role !== 'employer') {
            // Restore which jobs this worker already applied to
            api.get(`/applications/worker/${session.userId}`)
                .then(({ data }) => {
                    if (Array.isArray(data)) {
                        setAppliedIds(new Set(
                            data.map((a: { job?: { id: number } }) => a.job?.id).filter(Boolean) as number[]
                        ));
                    }
                })
                .catch(() => {});

            // Get live workerStatus so we can block applying while busy
            if (session.accessToken) {
                api.get('/auth/me')
                    .then(({ data }) => {
                        setWorkerBusy(data.workerStatus === 'WORKING');
                        setActiveJobId(data.activeJobId ?? null);
                    })
                    .catch(() => {});
            }
        }
    }, []);

    useEffect(() => {
        const calc = () => {
            setMapHeight(window.innerHeight - NAVBAR_H - SEARCH_BAR_H - BOTTOM_CARD_H);
        };
        calc();
        window.addEventListener('resize', calc);
        return () => window.removeEventListener('resize', calc);
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus('denied');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setLocationStatus('granted');
            },
            () => setLocationStatus('denied'),
            { timeout: 8000 }
        );
    }, []);

    const jobs: Job[] = userLocation
        ? allJobs
            .filter((job) => !job.hasRealLocation || haversineKm(userLocation.lat, userLocation.lng, job.lat, job.lng) <= RADIUS_KM)
            .map((job) => {
                if (!job.hasRealLocation) return { ...job, distance: '—' };
                const km = haversineKm(userLocation.lat, userLocation.lng, job.lat, job.lng);
                const distStr = km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
                return { ...job, distance: distStr };
            })
        : allJobs;

    const handleApply = async (job: Job) => {
        if (!session) { router.push('/login'); return; }
        if (!session.profileCompleted) { router.push('/register'); return; }
        if (workerBusy) {
            alert(`คุณกำลังทำงานอยู่แล้ว กรุณาทำงานปัจจุบันให้เสร็จก่อน`);
            return;
        }
        if (appliedIds.has(job.id) || applyingIds.has(job.id)) return;

        setApplyingIds((prev) => new Set(prev).add(job.id));
        try {
            await api.post('/applications', { jobId: job.id, workerId: Number(session.userId) });
            setAppliedIds((prev) => new Set(prev).add(job.id));
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            if (msg === 'Already applied to this job') {
                setAppliedIds((prev) => new Set(prev).add(job.id));
            } else if (msg === 'You cannot apply to your own job') {
                alert('คุณไม่สามารถสมัครงานที่คุณโพสต์เองได้');
            } else if (msg === 'WORKER_BUSY') {
                setWorkerBusy(true);
                alert('คุณกำลังทำงานอยู่แล้ว กรุณาทำงานปัจจุบันให้เสร็จก่อน');
            } else {
                alert(msg || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
            }
        } finally {
            setApplyingIds((prev) => { const s = new Set(prev); s.delete(job.id); return s; });
        }
    };

    const typeColor: Record<string, string> = {
        'งานด่วน': 'bg-red-100 text-red-600',
        'เซฟโซน': 'bg-pink-100 text-pink-600',
        'Premium': 'bg-amber-100 text-amber-600',
        'ฟูลไทม์': 'bg-blue-100 text-blue-600',
        'พาร์ทไทม์': 'bg-green-100 text-green-600',
    };

    return (
        <>
            <Navbar />
            <div className="bg-slate-50 flex flex-col">

                {/* Search Bar */}
                <div className="bg-white px-4 py-3 shadow-sm z-10 flex items-center gap-3">
                    <Link href="/" className="p-2 -ml-2 text-slate-500 hover:text-slate-800">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="ค้นหางานใกล้ฉัน..."
                            className="w-full bg-slate-100 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <button className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-full">
                        <Filter size={20} />
                    </button>
                </div>

                {/* Location status banner */}
                {locationStatus === 'loading' && (
                    <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center gap-2 text-sm text-blue-700">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        กำลังระบุตำแหน่งของคุณ...
                    </div>
                )}
                {locationStatus === 'denied' && (
                    <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center gap-2 text-sm text-amber-700">
                        <AlertCircle className="h-4 w-4" />
                        ไม่สามารถระบุตำแหน่งได้ — แสดงงานทั้งหมด
                    </div>
                )}
                {locationStatus === 'granted' && (
                    <div className="bg-green-50 border-b border-green-100 px-4 py-2 flex items-center gap-2 text-sm text-green-700">
                        <MapPin className="h-4 w-4" />
                        แสดงงานในรัศมี {RADIUS_KM} กม. จากตำแหน่งของคุณ
                    </div>
                )}

                {/* Leaflet Map */}
                {mapHeight > 0 && locationStatus !== 'loading' && (
                    <div style={{ height: mapHeight, width: '100%', zIndex: 0 }}>
                        <JobMapLeaflet
                            jobs={jobs}
                            mapHeight={mapHeight}
                            userLocation={userLocation}
                            onJobClick={(id) => router.push(`/workboard/${id}`)}
                        />
                    </div>
                )}
                {mapHeight > 0 && locationStatus === 'loading' && (
                    <div style={{ height: mapHeight }} className="flex items-center justify-center bg-slate-100">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">กำลังระบุตำแหน่ง...</p>
                        </div>
                    </div>
                )}

                {/* Bottom Card — Job List */}
                <div className="bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 overflow-x-auto whitespace-nowrap">
                    {jobs.length === 0 ? (
                        <div className="py-4 text-center text-slate-400 text-sm">
                            ไม่พบงานในรัศมี {RADIUS_KM} กม. จากตำแหน่งของคุณ
                        </div>
                    ) : (
                        <div className="inline-flex gap-4 pb-2">
                            {jobs.map((job) => {
                                const isApplying = applyingIds.has(job.id);
                                const isApplied = appliedIds.has(job.id);
                                const isOwnJob = !!session && job.postedById === Number(session.userId);
                                return (
                                    <div key={job.id} className="inline-block w-64 bg-white border border-slate-200 hover:border-blue-500 rounded-xl p-3 shadow-sm transition-colors whitespace-normal">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                <Briefcase size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h4 className="font-bold text-slate-900 text-sm truncate">{job.title}</h4>
                                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${typeColor[job.type] ?? 'bg-slate-100 text-slate-600'}`}>
                                                        {job.type}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500">{job.company}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="flex items-center gap-1 text-xs text-orange-500 font-medium">
                                                        <Star size={10} fill="currentColor" /> {job.rating}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                                        <MapPin size={10} /> {job.distance}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            {/* View detail button — always shown */}
                                            <Link
                                                href={`/workboard/${job.id}`}
                                                className="flex items-center justify-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                            >
                                                <Eye size={11} /> ดู
                                            </Link>

                                            {isOwnJob ? (
                                                <span className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-1.5 rounded-lg bg-slate-100 text-slate-500 cursor-default">
                                                    งานของคุณ
                                                </span>
                                            ) : workerBusy ? (
                                                <span className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-1.5 rounded-lg bg-amber-100 text-amber-700 cursor-not-allowed">
                                                    <Briefcase size={11} /> กำลังทำงาน
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleApply(job)}
                                                    disabled={isApplying || isApplied}
                                                    className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold py-1.5 rounded-lg active:scale-95 transition-all
                                                        ${isApplied
                                                            ? 'bg-green-100 text-green-700 cursor-default'
                                                            : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60'
                                                        }`}
                                                >
                                                    {isApplying ? (
                                                        <Loader2 size={12} className="animate-spin" />
                                                    ) : isApplied ? (
                                                        <><CheckCircle2 size={12} /> สมัครแล้ว</>
                                                    ) : 'สมัครงาน'}
                                                </button>
                                            )}
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
