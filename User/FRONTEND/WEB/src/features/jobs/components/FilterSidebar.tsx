'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface FilterSidebarProps {
    selectedTypes: string[];
    toggleType: (type: string) => void;
}

export default function FilterSidebar({ selectedTypes, toggleType }: FilterSidebarProps) {

    // Using a more generic handler for the checkbox change to satisfy TypeScript
    const handleCheckboxChange = (type: string) => {
        toggleType(type);
    };

    return (
        <aside className="w-full md:w-64 shrink-0 space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 sticky top-24">
                <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-lg">
                    <Filter className="h-5 w-5 text-blue-600" /> ตัวกรอง
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">ประเภทงาน</label>
                        <div className="space-y-2">
                            {['Full-time', 'Contract', 'Part-time', 'Freelance', 'Safezone', 'Premium'].map((type) => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => handleCheckboxChange(type)}
                                    />
                                    <span className="text-sm text-slate-600">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">เงินเดือน</label>
                        <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>฿10k</span>
                            <span>฿200k+</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
