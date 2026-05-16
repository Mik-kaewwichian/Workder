'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { getAuthSession } from '../../auth/lib/auth';
import { Search, Filter, Star, Phone, ArrowLeft, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';

type Worker = {
    id: number;
    name: string;
    skill: string;
    rating: number;
    distance: string;
    price: string;
    lat: number;
    lng: number;
    photo?: string;
};

const WorkerMapLeaflet = dynamic<{ workers: Worker[]; mapHeight: number; trackedId: number | null }>(
    () => import('./WorkerMapLeaflet'),
    { ssr: false, loading: () => <div style={{ width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>กำลังโหลดแผนที่...</div> }
);

const SEARCH_BAR_H = 57;
const BOTTOM_CARD_H = 148;
const NAVBAR_H = 64;

export default function WorkerMap() {
    const initialWorkers: Worker[] = [
        { id: 1, name: 'สมชาย ช่างไฟ', skill: 'ช่างไฟฟ้า', rating: 4.8, distance: '500m', price: '500฿/ชม.', lat: 13.7563, lng: 100.5018, photo: 'https://i.pravatar.cc/100?img=11' },
        { id: 2, name: 'นิดหน่อย แม่บ้าน', skill: 'ทำความสะอาด', rating: 4.5, distance: '1.2km', price: '300฿/ชม.', lat: 13.7580, lng: 100.5080, photo: 'https://i.pravatar.cc/100?img=47' },
        { id: 3, name: 'ช่างแอร์ สุขุมวิท', skill: 'ล้างแอร์', rating: 4.9, distance: '2.5km', price: '600฿/เครื่อง', lat: 13.7530, lng: 100.4990, photo: 'https://i.pravatar.cc/100?img=53' },
        { id: 4, name: 'พี่ศักดิ์ ประปา', skill: 'ช่างประปา', rating: 4.2, distance: '800m', price: '400฿/จุด', lat: 13.7545, lng: 100.5060, photo: 'https://i.pravatar.cc/100?img=68' },
    ];

    const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
    const [hiredIds, setHiredIds] = useState<Set<number>>(new Set());
    const [trackedId, setTrackedId] = useState<number | null>(null);
    const [mapHeight, setMapHeight] = useState(0);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const session = typeof window !== 'undefined' ? getAuthSession() : null;
    const isRegistered = session?.employerRegistered ?? false;

    useEffect(() => {
        const calc = () => {
            setMapHeight(window.innerHeight - NAVBAR_H - SEARCH_BAR_H - BOTTOM_CARD_H);
        };
        calc();
        window.addEventListener('resize', calc);
        return () => window.removeEventListener('resize', calc);
    }, []);

    const handleHire = (id: number) => {
        if (!isRegistered) {
            setShowRegisterModal(true);
            return;
        }
        setHiredIds((prev) => new Set(prev).add(id));
        setTrackedId(id);
        setTimeout(() => {
            setWorkers((prev) => prev.filter((w) => w.id !== id));
            setHiredIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
            setTrackedId(null);
        }, 60000);
    };

    const trackedWorker = workers.find((w) => w.id === trackedId);

    return (
        <>
            <Navbar />

            {/* Registration Required Modal */}
            {showRegisterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                <AlertCircle className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">ยังไม่ได้ลงทะเบียนนายจ้าง</h3>
                                <p className="text-xs text-slate-500">กรุณายืนยันตัวตนก่อนจ้างงาน</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-5">
                            คุณต้องกรอกข้อมูลบริษัทและยืนยันตัวตนก่อนจึงจะสามารถ
                            <strong>จ้างงาน</strong>หรือ<strong>โพสงาน</strong>ได้
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRegisterModal(false)}
                                className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
                            >
                                ยกเลิก
                            </button>
                            <Link
                                href="/employer/register"
                                className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl text-center hover:bg-blue-700"
                                onClick={() => setShowRegisterModal(false)}
                            >
                                ลงทะเบียน
                            </Link>
                        </div>
                    </div>
                </div>
            )}

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
                            placeholder="ค้นหาช่างใกล้ฉัน..."
                            className="w-full bg-slate-100 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <button className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-full">
                        <Filter size={20} />
                    </button>
                </div>

                {/* ETA Banner — shown when tracking */}
                {trackedWorker && (
                    <div className="bg-blue-600 text-white px-4 py-2.5 flex items-center gap-3 z-10">
                        <Navigation size={18} className="shrink-0 animate-pulse" />
                        <div className="flex-1 text-sm">
                            <span className="font-bold">{trackedWorker.name}</span>
                            {' '}กำลังเดินทางมาหาคุณ
                        </div>
                        <button
                            onClick={() => setTrackedId(null)}
                            className="text-xs bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-full"
                        >
                            ยกเลิก
                        </button>
                    </div>
                )}

                {/* Leaflet Map */}
                {mapHeight > 0 && (
                    <div style={{ height: mapHeight, width: '100%', zIndex: 0 }}>
                        <WorkerMapLeaflet workers={workers} mapHeight={mapHeight} trackedId={trackedId} />
                    </div>
                )}

                {/* Bottom Card */}
                <div className="bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 overflow-x-auto whitespace-nowrap">
                    {workers.length === 0 ? (
                        <div className="text-center text-slate-400 py-4 text-sm">ไม่มีช่างในบริเวณนี้</div>
                    ) : (
                        <div className="inline-flex gap-4 pb-2">
                            {workers.map((worker) => {
                                const isHired = hiredIds.has(worker.id);
                                const isTracked = trackedId === worker.id;
                                return (
                                    <div key={worker.id} className={`inline-block w-64 bg-white border rounded-xl p-3 shadow-sm transition-colors whitespace-normal ${isTracked ? 'border-blue-400 bg-blue-50' : isHired ? 'border-green-300 bg-green-50' : 'border-slate-200 hover:border-blue-500'}`}>
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                                                {worker.photo
                                                    ? <img src={worker.photo} alt={worker.name} className="w-full h-full object-cover" />
                                                    : <span className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">{worker.name.charAt(0)}</span>
                                                }
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">{worker.name}</h4>
                                                <p className="text-xs text-slate-500">{worker.skill}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="flex items-center gap-1 text-xs text-orange-500 font-medium">
                                                        <Star size={10} fill="currentColor" /> {worker.rating}
                                                    </span>
                                                    <span className="text-xs text-slate-400">• {worker.distance}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            {isHired ? (
                                                <button
                                                    onClick={() => setTrackedId(isTracked ? null : worker.id)}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 rounded-lg transition-all ${isTracked ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                                >
                                                    <Navigation size={12} />
                                                    {isTracked ? 'กำลังติดตาม...' : 'ติดตามช่าง'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleHire(worker.id)}
                                                    className="flex-1 bg-blue-600 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
                                                >
                                                    จ้างงาน
                                                </button>
                                            )}
                                            <button className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                                                <Phone size={14} />
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
