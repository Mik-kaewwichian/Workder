'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { Search, Filter, Star, MapPin, Briefcase, ArrowLeft } from 'lucide-react';

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
};

const JobMapLeaflet = dynamic<{ jobs: Job[]; mapHeight: number }>(
    () => import('./JobMapLeaflet'),
    { ssr: false, loading: () => <div style={{ width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>กำลังโหลดแผนที่...</div> }
);

const SEARCH_BAR_H = 57;
const BOTTOM_CARD_H = 148;
const NAVBAR_H = 64;

export default function JobMap() {
    const jobs: Job[] = [
        { id: 1, title: 'ช่างไฟฟ้า', company: 'บ้านสุขใจ', salary: '500฿/วัน', type: 'งานด่วน', rating: 4.8, distance: '500m', lat: 13.7563, lng: 100.5018, photo: 'https://i.pravatar.cc/100?img=3' },
        { id: 2, title: 'แม่บ้าน (Part-time)', company: 'คุณอรุณ', salary: '300฿/ครั้ง', type: 'Safezone', rating: 4.5, distance: '1.2km', lat: 13.7580, lng: 100.5080, photo: 'https://i.pravatar.cc/100?img=49' },
        { id: 3, title: 'ช่างแอร์', company: 'ออฟฟิศสาทร', salary: '800฿/เครื่อง', type: 'Premium', rating: 4.9, distance: '2.5km', lat: 13.7530, lng: 100.4990, photo: 'https://i.pravatar.cc/100?img=60' },
        { id: 4, title: 'ช่างประปา', company: 'นิคมอุตสาหกรรม', salary: '600฿/วัน', type: 'Full-time', rating: 4.2, distance: '800m', lat: 13.7545, lng: 100.5060, photo: 'https://i.pravatar.cc/100?img=12' },
    ];

    const [mapHeight, setMapHeight] = useState(0);

    useEffect(() => {
        const calc = () => {
            setMapHeight(window.innerHeight - NAVBAR_H - SEARCH_BAR_H - BOTTOM_CARD_H);
        };
        calc();
        window.addEventListener('resize', calc);
        return () => window.removeEventListener('resize', calc);
    }, []);

    const typeColor: Record<string, string> = {
        'งานด่วน': 'bg-red-100 text-red-600',
        'Safezone': 'bg-pink-100 text-pink-600',
        'Premium': 'bg-amber-100 text-amber-600',
        'Full-time': 'bg-blue-100 text-blue-600',
        'Part-time': 'bg-green-100 text-green-600',
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

                {/* Leaflet Map */}
                {mapHeight > 0 && (
                    <div style={{ height: mapHeight, width: '100%', zIndex: 0 }}>
                        <JobMapLeaflet jobs={jobs} mapHeight={mapHeight} />
                    </div>
                )}

                {/* Bottom Card — Job List */}
                <div className="bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 overflow-x-auto whitespace-nowrap">
                    <div className="inline-flex gap-4 pb-2">
                        {jobs.map((job) => (
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
                                    <div className="flex-1 text-center text-xs font-bold text-blue-600 py-1">
                                        {job.salary}
                                    </div>
                                    <button className="flex-1 bg-blue-600 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all">
                                        สมัครงาน
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
