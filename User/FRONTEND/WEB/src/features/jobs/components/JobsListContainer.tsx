'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { getAuthSession, type AuthSession } from '../../auth/lib/auth';
import FilterSidebar from './FilterSidebar';
import JobCard from './JobCard';

export default function JobsListContainer() {
    const router = useRouter();
    const jobs = [
        { title: "Senior React Developer", company: "TechFlow Inc.", location: "Bangkok (Hybrid)", salary: "80k - 120k", type: "Full-time", posted: "2d ago", tags: ["React", "Next.js", "TypeScript"] },
        { title: "Personal Driver (VIP)", company: "Private Owner", location: "Bangkok", salary: "35k - 50k", type: "Safezone", posted: "1d ago", tags: ["Driving License", "English", "Service Mind"] },
        { title: "Full Stack Developer (Lead)", company: "Global Corp", location: "Remote", salary: "150k+", type: "Premium", posted: "3h ago", tags: ["Node.js", "React", "AWS"] },
        { title: "UX/UI Designer", company: "Creative Studio", location: "Remote", salary: "45k - 60k", type: "Contract", posted: "1d ago", tags: ["Figma", "UI Design", "User Research"] },
        { title: "Backend Engineer (Go)", company: "FinTech Sol", location: "Bangkok", salary: "90k - 150k", type: "Full-time", posted: "3d ago", tags: ["Go", "PostgreSQL", "Docker"] },
        { title: "Elderly Care Assistant", company: "Home Care", location: "Nonthaburi", salary: "40k - 60k", type: "Safezone", posted: "5h ago", tags: ["Nursing", "Patience", "Care"] },
        { title: "Digital Marketing Specialist", company: "GrowFast Agency", location: "Chiang Mai", salary: "35k - 50k", type: "Full-time", posted: "5h ago", tags: ["SEO", "Ads", "Content"] },
        { title: "Project Manager", company: "SoftDev Team", location: "Bangkok", salary: "60k - 90k", type: "Full-time", posted: "1w ago", tags: ["Agile", "Scrum", "Leadership"] },
        { title: "Freelance Graphic Designer", company: "StartUp Hub", location: "Remote", salary: "20k - 30k", type: "Part-time", posted: "2d ago", tags: ["Photoshop", "Illustrator", "Branding"] },
    ];

    const [session, setSession] = useState<AuthSession | null>(null);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [pendingJobTitle, setPendingJobTitle] = useState<string | null>(null);

    useEffect(() => {
        setSession(getAuthSession());
    }, []);

    const toggleType = (type: string) => {
        setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const filteredJobs = jobs.filter(job => selectedTypes.length === 0 || selectedTypes.includes(job.type));

    const handleApply = (jobTitle: string) => {
        if (!session) {
            router.push('/login');
            return;
        }

        if (!session.profileCompleted) {
            setPendingJobTitle(jobTitle);
            return;
        }

        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">

            <Navbar />

            <div className="mx-auto max-w-7xl px-6 pt-10">
                <div className="flex flex-col md:flex-row gap-8">

                    <FilterSidebar selectedTypes={selectedTypes} toggleType={toggleType} />

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold text-slate-900">งานทั้งหมด <span className="text-slate-400 text-lg font-normal">({filteredJobs.length} งาน)</span></h1>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="ค้นหางาน..."
                                    className="pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-64"
                                />
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredJobs.map((job, index) => (
                                <JobCard key={index} job={job} onApply={handleApply} />
                            ))}
                        </div>
                    </main>

                </div>
            </div>

            {pendingJobTitle ? (
                <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setPendingJobTitle(null)}>
                    <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-100 shadow-2xl p-6 md:p-7" onClick={(event) => event.stopPropagation()}>
                        <p className="text-xs font-semibold text-amber-700">ก่อนเริ่มสมัครงาน</p>
                        <h3 className="text-xl font-bold text-slate-900 mt-1">ยังไม่ได้กรอกข้อมูลส่วนตัว</h3>
                        <p className="text-sm text-slate-600 mt-2">
                            ตำแหน่ง <span className="font-semibold">{pendingJobTitle}</span> ต้องกรอกข้อมูลส่วนตัวหรือลงทะเบียนก่อน เพื่อเริ่มงานได้
                        </p>

                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setPendingJobTitle(null)}
                                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                ปิด
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPendingJobTitle(null);
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
        </div>
    );
}
