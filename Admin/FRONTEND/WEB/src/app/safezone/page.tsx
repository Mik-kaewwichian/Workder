'use client';

import SafeZoneList from '../../features/safezone/components/SafeZoneList';
import Navbar from '../../components/Navbar';
import { ShieldCheck } from 'lucide-react';

export default function SafeZonePage() {
    return (
        <div className="min-h-screen bg-pink-50/30 pb-20 font-sans text-slate-900">
            <Navbar />

            <div className="pt-24 px-6 md:px-12 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-sm font-bold text-pink-600 mb-6 border border-pink-200 shadow-sm">
                        <ShieldCheck className="h-4 w-4" />
                        OFFICIAL PARTNER
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">
                        Safezone Jobs
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg text-slate-600">
                        งานที่ผ่านการตรวจสอบความปลอดภัย 100% จากทีมงาน WORKDER
                        พร้อมระบบคุ้มครองค่าจ้างและการดูแลตลอดการทำงาน
                    </p>
                    <div className="mt-8">
                        <button onClick={() => window.location.href = '/safezone/register'} className="rounded-full bg-pink-600/90 backdrop-blur-md border border-white/20 px-8 py-3 text-white font-bold shadow-lg shadow-pink-300/50 hover:bg-pink-700 hover:shadow-pink-300 hover:-translate-y-1 transition-all">
                            สมัครเป็นพาร์ทเนอร์ Safezone
                        </button>
                    </div>
                </div>

                {/* Content */}
                <SafeZoneList />
            </div>
        </div>
    );
}
