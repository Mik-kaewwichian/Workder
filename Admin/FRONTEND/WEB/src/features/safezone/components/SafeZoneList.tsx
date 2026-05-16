'use client';

import React from 'react';
import SafeZoneCard from './SafeZoneCard';
import { safeZoneJobs } from '../data/items';
import { ShieldCheck, Search, Filter } from 'lucide-react';

export default function SafeZoneList() {
    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header / Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-pink-50 flex items-center justify-center border border-pink-100">
                        <ShieldCheck className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900">งาน Safezone ทั้งหมด</h2>
                        <p className="text-xs text-slate-500">ผ่านการตรวจสอบความปลอดภัย 100%</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="ค้นหางานปลอดภัย..."
                            className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                        />
                    </div>
                    <button className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-500">
                        <Filter className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {safeZoneJobs.map(job => (
                    <SafeZoneCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    );
}
