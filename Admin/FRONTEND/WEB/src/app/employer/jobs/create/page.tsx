'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { saveJob } from '../../../../features/jobs/lib/jobs';

const JOB_CATEGORIES = [
    'ก่อสร้าง', 'ซ่อมบำรุง', 'ทำความสะอาด', 'ขนส่ง / เดลิเวอรี่',
    'งานครัว / อาหาร', 'ดูแลผู้สูงอายุ / เด็ก', 'เกษตรกรรม', 'งานออฟฟิศ',
    'ไฟฟ้า / ประปา', 'ช่างยนต์', 'รักษาความปลอดภัย', 'อื่นๆ',
];

export default function CreateJobPage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState({
        title: '',
        category: '',
        location: '',
        wage: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        saveJob(form);

        setTimeout(() => {
            setIsSaving(false);
            router.push('/employer/dashboard');
        }, 600);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-8 pb-16 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    ย้อนกลับ
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">นายจ้าง</p>
                        <h1 className="text-2xl font-bold text-slate-900">โพสต์งานใหม่</h1>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">

                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            ตำแหน่งงาน <span className="text-red-500">*</span>
                        </label>
                        <input
                            required
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="เช่น ช่างไฟฟ้า, คนขับรถ, แม่บ้าน"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            ประเภทงาน <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700"
                        >
                            <option value="">เลือกประเภทงาน</option>
                            {JOB_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location & Wage */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                สถานที่ / จังหวัด <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="เช่น กรุงเทพฯ, เชียงใหม่"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                ค่าจ้าง <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                name="wage"
                                value={form.wage}
                                onChange={handleChange}
                                placeholder="เช่น 500 บาท/วัน, 15,000 บาท/เดือน"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            รายละเอียดงาน
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={5}
                            placeholder="อธิบายรายละเอียดงาน, คุณสมบัติที่ต้องการ, ระยะเวลาทำงาน ฯลฯ"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full rounded-xl bg-blue-600 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                                กำลังโพสต์...
                            </>
                        ) : (
                            'โพสต์งาน'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
