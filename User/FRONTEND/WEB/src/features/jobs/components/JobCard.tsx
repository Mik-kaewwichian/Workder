'use client';

import React from 'react';
import { MapPin, DollarSign, Clock, Briefcase, Gem, Heart } from 'lucide-react';

interface Job {
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    posted: string;
    tags: string[];
}

interface JobCardProps {
    job: Job;
    onApply: (jobTitle: string) => void;
}

export default function JobCard({ job, onApply }: JobCardProps) {
    const getTagStyle = (tag: string) => {
        switch (tag) {
            case 'งานด่วน': return 'bg-red-100 text-red-600 border-red-200';
            case 'พาร์ทไทม์': return 'bg-green-100 text-green-600 border-green-200';
            case 'งานประจำ': return 'bg-purple-100 text-purple-600 border-purple-200';
            case 'เซฟโซน': return 'bg-pink-50 text-pink-600 border-pink-200 ring-1 ring-pink-300 shadow-sm shadow-pink-100';
            case 'พรีเมียม': return 'bg-gradient-to-r from-amber-200 to-yellow-400 text-slate-900 border-yellow-500 shadow-lg shadow-yellow-500/20 font-bold';
            default: return 'bg-blue-50 text-blue-600 border-blue-100';
        }
    };

    const getJobIcon = (tag: string) => {
        if (tag === 'Premium') return <Gem className="h-5 w-5 animate-pulse text-yellow-600" />;
        if (tag === 'เซฟโซน') return <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />;
        return <Briefcase className="h-4 w-4 text-slate-400" />;
    };

    return (
        <div className={`group rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md transition-all cursor-pointer ${job.type === 'เซฟโซน' ? 'border-pink-200 hover:border-pink-300' :
            job.type === 'พรีเมียม' ? 'border-yellow-200 hover:border-yellow-300 bg-gradient-to-r from-yellow-50/30 to-white' :
                'border-slate-100 hover:border-blue-200'
            }`}>
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <p className="text-slate-500 font-medium mb-2">{job.company}</p>

                    <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-4">
                        <div className="flex items-center gap-1"><MapPin className="h-4 w-4 text-slate-400" /> {job.location}</div>
                        <div className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-slate-400" /> {job.salary}</div>
                        <div className="flex items-center gap-1">
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium border ${getTagStyle(job.type)}`}>
                                {getJobIcon(job.type)} {job.type}
                            </span>
                        </div>
                        <div className="flex items-center gap-1"><Clock className="h-4 w-4 text-slate-400" /> {job.posted}</div>
                    </div>

                    <div className="flex gap-2">
                        {job.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => onApply(job.title)}
                    className="shrink-0 rounded-full border border-blue-600 text-blue-600 px-6 py-2 text-sm font-bold hover:bg-blue-600 hover:text-white transition-all"
                >
                    สมัครงาน
                </button>
            </div>
        </div>
    );
}
