'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase, ImagePlus, X, Loader2, CheckCircle2, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import api from '../../../../lib/api';
import { getAuthSession } from '../../../../features/auth/lib/auth';

const LocationPicker = dynamic(
    () => import('../../../../features/map/components/LocationPicker'),
    { ssr: false, loading: () => <div className="h-[280px] rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm">กำลังโหลดแผนที่...</div> }
);

const JOB_TYPES = [
    { value: 'urgent', label: 'งานด่วน' },
    { value: 'parttime', label: 'พาร์ทไทม์' },
    { value: 'fulltime', label: 'งานประจำ' },
    { value: 'safezone', label: 'งานความปลอดภัย' },
];

const JOB_CATEGORIES = [
    'ก่อสร้าง', 'ซ่อมบำรุง', 'ทำความสะอาด', 'ขนส่ง / เดลิเวอรี่',
    'งานครัว / อาหาร', 'ดูแลผู้สูงอายุ / เด็ก', 'เกษตรกรรม', 'งานออฟฟิศ',
    'ไฟฟ้า / ประปา', 'ช่างยนต์', 'รักษาความปลอดภัย', 'อื่นๆ',
];

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

type ImageSlot = { preview: string; base64: string } | null;
type LatLng = { lat: number; lng: number };

export default function CreateJobPage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const [location, setLocation] = useState<LatLng | null>(null);
    const [images, setImages] = useState<[ImageSlot, ImageSlot, ImageSlot]>([null, null, null]);
    const fileRef0 = useRef<HTMLInputElement>(null);
    const fileRef1 = useRef<HTMLInputElement>(null);
    const fileRef2 = useRef<HTMLInputElement>(null);
    const fileRefs = [fileRef0, fileRef1, fileRef2];

    const [form, setForm] = useState({
        title: '',
        type: 'parttime',
        category: '',
        payAmount: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImagePick = async (index: number, file: File | null) => {
        if (!file) return;
        const base64 = await fileToBase64(file);
        setImages((prev) => {
            const next: [ImageSlot, ImageSlot, ImageSlot] = [...prev] as any;
            next[index] = { preview: URL.createObjectURL(file), base64 };
            return next;
        });
    };

    const clearImage = (index: number) => {
        setImages((prev) => {
            const next: [ImageSlot, ImageSlot, ImageSlot] = [...prev] as any;
            next[index] = null;
            return next;
        });
        if (fileRefs[index].current) fileRefs[index].current!.value = '';
    };

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setError('');

        if (!location) {
            setError('กรุณาปักหมุดสถานที่ทำงานบนแผนที่');
            return;
        }

        const session = getAuthSession();
        if (!session) { router.push('/login'); return; }

        setIsSaving(true);
        try {
            await api.post('/jobs', {
                title: form.title,
                type: form.type,
                description: form.description,
                payAmount: parseInt(form.payAmount, 10),
                lat: location.lat,
                lng: location.lng,
                image1: images[0]?.base64 ?? null,
                image2: images[1]?.base64 ?? null,
                image3: images[2]?.base64 ?? null,
                postedBy: { connect: { id: Number(session.userId) } },
            });
            setDone(true);
            setTimeout(() => router.push('/employer/dashboard'), 1200);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-8 pb-16 px-4">
            <div className="max-w-2xl mx-auto">
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

                    {/* Type & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                รูปแบบงาน <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700"
                            >
                                {JOB_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">ประเภทงาน</label>
                            <select
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
                    </div>

                    {/* Pay Amount */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            ค่าจ้าง (บาท) <span className="text-red-500">*</span>
                        </label>
                        <input
                            required
                            name="payAmount"
                            type="number"
                            min="1"
                            value={form.payAmount}
                            onChange={handleChange}
                            placeholder="เช่น 500"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">รายละเอียดงาน</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="อธิบายรายละเอียดงาน, คุณสมบัติที่ต้องการ, ระยะเวลาทำงาน ฯลฯ"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                        />
                    </div>

                    {/* Location Picker — required */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            สถานที่ทำงาน <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-slate-400 mb-2">แตะบนแผนที่เพื่อปักหมุด หรือกด "ตำแหน่งของฉัน"</p>
                        <LocationPicker value={location} onChange={setLocation} height={280} />
                        {location ? (
                            <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                                <MapPin size={12} />
                                ปักหมุดแล้ว: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                            </p>
                        ) : (
                            <p className="mt-2 text-xs text-amber-500 flex items-center gap-1">
                                <MapPin size={12} />
                                ยังไม่ได้ปักหมุดสถานที่ (จำเป็น)
                            </p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            รูปภาพประกอบงาน (สูงสุด 3 รูป)
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {([0, 1, 2] as const).map((i) => (
                                <div
                                    key={i}
                                    className="relative aspect-square rounded-xl border-2 border-dashed border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                                    onClick={() => !images[i] && fileRefs[i].current?.click()}
                                >
                                    {images[i] ? (
                                        <>
                                            <img src={images[i]!.preview} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); clearImage(i); }}
                                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80"
                                            >
                                                <X size={12} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center text-slate-400">
                                            <ImagePlus size={24} className="mx-auto mb-1" />
                                            <p className="text-xs">รูปที่ {i + 1}</p>
                                        </div>
                                    )}
                                    <input
                                        ref={fileRefs[i]}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImagePick(i, e.target.files?.[0] ?? null)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSaving || done}
                        className="w-full rounded-xl bg-blue-600 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {done ? (
                            <><CheckCircle2 className="h-5 w-5" /> โพสต์งานสำเร็จ!</>
                        ) : isSaving ? (
                            <><Loader2 className="h-5 w-5 animate-spin" /> กำลังโพสต์...</>
                        ) : (
                            'โพสต์งาน'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
