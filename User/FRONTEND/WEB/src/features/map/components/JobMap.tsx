'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { MapPin, Loader2, AlertCircle, ChevronUp, Navigation } from 'lucide-react';
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

const JobMapLeaflet = dynamic<{
    jobs: Job[];
    mapHeight: number;
    userLocation: UserLocation | null;
    radiusKm: number;
    onJobClick?: (id: number) => void;
}>(
    () => import('./JobMapLeaflet'),
    {
        ssr: false,
        loading: () => (
            <div style={{ width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                กำลังโหลดแผนที่...
            </div>
        ),
    }
);

const NAVBAR_H = 64;

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
    const [radiusKm, setRadiusKm] = useState(10);
    const [showSlider, setShowSlider] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const session = typeof window !== 'undefined' ? getAuthSession() : null;

    // Fetch real jobs from API
    useEffect(() => {
        api.get('/jobs')
            .then(({ data }) => {
                if (Array.isArray(data) && data.length > 0) {
                    setAllJobs(data.filter((j: any) => j.status !== 'completed').map(mapApiJob));
                }
            })
            .catch(() => {/* keep demo data */});
    }, []);

    // Map fills full viewport minus navbar
    useEffect(() => {
        const calc = () => setMapHeight(window.innerHeight - NAVBAR_H);
        calc();
        window.addEventListener('resize', calc);
        return () => window.removeEventListener('resize', calc);
    }, []);

    // Request geolocation
    useEffect(() => {
        if (!navigator.geolocation) { setLocationStatus('denied'); return; }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setLocationStatus('granted');
            },
            () => setLocationStatus('denied'),
            { timeout: 8000 },
        );
    }, []);

    // Filter + annotate jobs by radius
    const jobs: Job[] = userLocation
        ? allJobs
            .filter((job) => {
                if (!job.hasRealLocation) return true;          // no coords → always show
                if (radiusKm === 0) return true;                // 0 = show all
                return haversineKm(userLocation.lat, userLocation.lng, job.lat, job.lng) <= radiusKm;
            })
            .map((job) => {
                if (!job.hasRealLocation) return { ...job, distance: '—' };
                const km = haversineKm(userLocation.lat, userLocation.lng, job.lat, job.lng);
                return { ...job, distance: km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km` };
            })
        : allJobs;

    const radiusLabel = radiusKm === 0 ? 'ทุกระยะ' : `${radiusKm} กม.`;

    return (
        <>
            <Navbar />

            {/* Map container — fills remaining viewport */}
            <div className="relative bg-slate-100" style={{ height: mapHeight }}>

                {/* Leaflet map */}
                {mapHeight > 0 && locationStatus !== 'loading' && (
                    <JobMapLeaflet
                        jobs={jobs}
                        mapHeight={mapHeight}
                        userLocation={userLocation}
                        radiusKm={radiusKm}
                        onJobClick={(id) => router.push(`/workboard/${id}`)}
                    />
                )}

                {/* Loading overlay */}
                {locationStatus === 'loading' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">กำลังระบุตำแหน่ง...</p>
                        </div>
                    </div>
                )}

                {/* ── Distance control — floating overlay ─────────────────────────── */}
                {locationStatus !== 'loading' && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-2">

                        {/* Slider panel */}
                        {showSlider && (
                            <div className="bg-white rounded-2xl shadow-2xl px-5 py-4 w-72 border border-slate-100">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">รัศมีการค้นหา</span>
                                    <span className="text-base font-extrabold text-blue-600">{radiusLabel}</span>
                                </div>

                                <input
                                    type="range"
                                    min={0}
                                    max={10}
                                    step={1}
                                    value={radiusKm}
                                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                                    className="w-full h-2 rounded-full accent-blue-600 cursor-pointer"
                                />

                                {/* Tick marks */}
                                <div className="flex justify-between mt-1.5 px-0.5">
                                    {[0, 2, 4, 6, 8, 10].map((v) => (
                                        <span key={v} className={`text-[10px] font-semibold ${v === radiusKm ? 'text-blue-600' : 'text-slate-400'}`}>
                                            {v === 0 ? 'ทั้งหมด' : `${v}`}
                                        </span>
                                    ))}
                                </div>

                                {/* Location denied note */}
                                {locationStatus === 'denied' && (
                                    <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                                        <AlertCircle size={12} />
                                        ไม่พบตำแหน่งของคุณ — แสดงงานทั้งหมด
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Toggle pill button */}
                        <button
                            onClick={() => setShowSlider((v) => !v)}
                            className="flex items-center gap-2 bg-white/95 backdrop-blur-sm shadow-xl rounded-full px-5 py-2.5 border border-slate-200 text-sm font-bold text-slate-700 hover:bg-white transition-all active:scale-95"
                        >
                            {locationStatus === 'denied'
                                ? <AlertCircle size={15} className="text-amber-500" />
                                : <Navigation size={15} className="text-blue-500" />
                            }
                            <span>รัศมี {radiusLabel}</span>
                            <ChevronUp
                                size={15}
                                className={`text-slate-400 transition-transform duration-200 ${showSlider ? '' : 'rotate-180'}`}
                            />
                        </button>
                    </div>
                )}

                {/* Job count badge — top-left overlay */}
                {locationStatus !== 'loading' && (
                    <div className="absolute top-3 left-3 z-[1000]">
                        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md border border-slate-100">
                            <MapPin size={12} className="text-blue-500" />
                            <span className="text-xs font-bold text-slate-700">{jobs.length} งาน</span>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}
