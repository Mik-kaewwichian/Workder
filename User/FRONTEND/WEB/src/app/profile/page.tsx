'use client';

import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import {
    UserRound, MapPin, Briefcase, ShieldCheck,
    Calendar, CheckCircle2, Loader2, Edit2, X, Save, Camera, Star,
} from 'lucide-react';
import api from '../../lib/api';
import { getAuthSession, setAuthSession, type AuthSession } from '../../features/auth/lib/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

type UserProfile = {
    id: number;
    email: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    role: string;
    occupation: string | null;
    education: string | null;
    certificates: string | null;
    province: string | null;
    district: string | null;
    subDistrict: string | null;
    birthDate: string | null;
    profileCompleted: boolean;
    createdAt: string;
    avatar: string | null;
    banner: string | null;
};

type ReviewAuthor = { id: number; firstName: string | null; lastName: string | null; avatar: string | null };

type UserReview = {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    author: ReviewAuthor;
};

type EditForm = {
    firstName: string;
    lastName: string;
    occupation: string;
    education: string;
    certificates: string;
    province: string;
    district: string;
    subDistrict: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fullName = (u: UserProfile) =>
    [u.firstName, u.lastName].filter(Boolean).join(' ') || 'ไม่ระบุชื่อ';

const initials = (u: UserProfile) =>
    (u.firstName?.charAt(0) ?? u.email?.charAt(0) ?? '?').toUpperCase();

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });

const memberSince = (iso: string) =>
    new Date(iso).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({
    user,
    onClose,
    onSaved,
}: {
    user: UserProfile;
    onClose: () => void;
    onSaved: (updated: UserProfile) => void;
}) {
    const [form, setForm] = useState<EditForm>({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        occupation: user.occupation ?? '',
        education: user.education ?? '',
        certificates: user.certificates ?? '',
        province: user.province ?? '',
        district: user.district ?? '',
        subDistrict: user.subDistrict ?? '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const set = (key: keyof EditForm, val: string) =>
        setForm((prev) => ({ ...prev, [key]: val }));

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const { data } = await api.patch<UserProfile>(`/users/${user.id}`, {
                firstName: form.firstName || undefined,
                lastName: form.lastName || undefined,
                occupation: form.occupation || undefined,
                education: form.education || undefined,
                certificates: form.certificates || undefined,
                province: form.province || undefined,
                district: form.district || undefined,
                subDistrict: form.subDistrict || undefined,
            });
            onSaved(data);
        } catch {
            setError('บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">แก้ไขโปรไฟล์</h2>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">ชื่อ</label>
                            <input
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                                value={form.firstName}
                                onChange={(e) => set('firstName', e.target.value)}
                                placeholder="ชื่อจริง"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">นามสกุล</label>
                            <input
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                                value={form.lastName}
                                onChange={(e) => set('lastName', e.target.value)}
                                placeholder="นามสกุล"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">อาชีพ</label>
                        <input
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                            value={form.occupation}
                            onChange={(e) => set('occupation', e.target.value)}
                            placeholder="เช่น ช่างไฟฟ้า, แม่บ้าน"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">การศึกษา</label>
                        <input
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                            value={form.education}
                            onChange={(e) => set('education', e.target.value)}
                            placeholder="เช่น ปริญญาตรี, ม.6"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">ใบรับรอง / ทักษะพิเศษ</label>
                        <input
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                            value={form.certificates}
                            onChange={(e) => set('certificates', e.target.value)}
                            placeholder="เช่น ใบอนุญาตขับรถ, ใบ ว."
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">จังหวัด</label>
                            <input
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                                value={form.province}
                                onChange={(e) => set('province', e.target.value)}
                                placeholder="จังหวัด"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">อำเภอ</label>
                            <input
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                                value={form.district}
                                onChange={(e) => set('district', e.target.value)}
                                placeholder="อำเภอ"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">ตำบล</label>
                            <input
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                                value={form.subDistrict}
                                onChange={(e) => set('subDistrict', e.target.value)}
                                placeholder="ตำบล"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Banner Upload ─────────────────���───────────────────────────────────���──────

function BannerUpload({
    userId,
    banner,
    onUploaded,
}: {
    userId: number;
    banner: string | null;
    onUploaded: (banner: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('ขนาดรูปภาพต้องไม่เกิน 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (ev) => {
            const base64 = ev.target?.result as string;
            setUploading(true);
            try {
                await api.patch(`/users/${userId}`, { banner: base64 });
                onUploaded(base64);
            } catch {
                alert('อัปโหลดรูปไม่สำเร็จ');
            } finally {
                setUploading(false);
                if (inputRef.current) inputRef.current.value = '';
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div
            className="relative h-24 cursor-pointer group"
            onClick={() => inputRef.current?.click()}
        >
            {banner ? (
                <img src={banner} alt="banner" className="h-full w-full object-cover" />
            ) : (
                <div className="h-full w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? (
                    <Loader2 size={20} className="text-white animate-spin" />
                ) : (
                    <div className="flex items-center gap-2 text-white text-xs font-semibold">
                        <Camera size={16} /> เปลี่ยนรูปปก
                    </div>
                )}
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
    );
}

// ─── Avatar Button ───���──────────────────���──────────────────────────────��──────

function AvatarUpload({
    profile,
    onUploaded,
}: {
    profile: UserProfile;
    onUploaded: (avatar: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const initial = initials(profile);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            alert('ขนาดรูปภาพต้องไม่เกิน 3MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (ev) => {
            const base64 = ev.target?.result as string;
            setUploading(true);
            try {
                await api.patch(`/users/${profile.id}`, { avatar: base64 });
                onUploaded(base64);
            } catch {
                alert('อัปโหลดรูปไม่สำเร็จ');
            } finally {
                setUploading(false);
                if (inputRef.current) inputRef.current.value = '';
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="relative group cursor-pointer" onClick={() => inputRef.current?.click()}>
            <div className="h-20 w-20 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                {profile.avatar ? (
                    <img src={profile.avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                    <span className="text-3xl font-bold text-blue-600 bg-blue-50 w-full h-full flex items-center justify-center">
                        {initial}
                    </span>
                )}
            </div>
            <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? (
                    <Loader2 size={20} className="text-white animate-spin" />
                ) : (
                    <Camera size={20} className="text-white" />
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
            />
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const formatShortDate = (iso: string) =>
    new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

function StarRow({ value, size = 12 }: { value: number; size?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    size={size}
                    className={s <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}
                />
            ))}
        </div>
    );
}

export default function MyProfilePage() {
    const [session, setSession] = useState<AuthSession | null | 'loading'>('loading');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [reviews, setReviews] = useState<UserReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        const s = getAuthSession();
        setSession(s);
        if (!s) return;

        Promise.all([
            api.get<UserProfile>(`/users/${s.userId}`),
            api.get<UserReview[]>(`/user-reviews/user/${s.userId}`),
        ])
            .then(([profileRes, reviewsRes]) => {
                setProfile(profileRes.data);
                setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
            })
            .catch(() => setProfile(null))
            .finally(() => setLoading(false));
    }, []);

    const handleSaved = (updated: UserProfile) => {
        setProfile(updated);
        setEditOpen(false);

        const s = getAuthSession();
        if (s) {
            setAuthSession({
                ...s,
                name: [updated.firstName, updated.lastName].filter(Boolean).join(' ') || undefined,
            });
        }
    };

    if (session === 'loading' || loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-slate-50 flex justify-center pt-32">
                    <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
                </div>
            </>
        );
    }

    if (!session) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
                    <UserRound size={40} className="text-slate-300" />
                    <p className="text-slate-500">กรุณาเข้าสู่ระบบ</p>
                    <Link href="/login" className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors">
                        เข้าสู่ระบบ
                    </Link>
                </div>
            </>
        );
    }

    if (!profile) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
                    <p className="text-slate-500 text-sm">ไม่พบข้อมูลโปรไฟล์</p>
                </div>
            </>
        );
    }

    const name = fullName(profile);
    const location = [profile.subDistrict, profile.district, profile.province].filter(Boolean).join(', ');

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 pb-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">

                    {/* Header card */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-4">
                        <BannerUpload
                            userId={profile.id}
                            banner={profile.banner}
                            onUploaded={(banner) => setProfile((p) => p ? { ...p, banner } : p)}
                        />

                        <div className="px-6 pb-6">
                            <div className="flex items-end justify-between -mt-10 mb-4">
                                <AvatarUpload
                                    profile={profile}
                                    onUploaded={(avatar) => setProfile((p) => p ? { ...p, avatar } : p)}
                                />
                                <button
                                    onClick={() => setEditOpen(true)}
                                    className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
                                >
                                    <Edit2 size={14} /> แก้ไข
                                </button>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
                                {profile.profileCompleted && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
                                        <ShieldCheck size={11} /> ยืนยันตัวตนแล้ว
                                    </span>
                                )}
                            </div>

                            {profile.occupation && (
                                <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
                                    <Briefcase size={13} /> {profile.occupation}
                                </p>
                            )}

                            {location && (
                                <p className="text-slate-400 text-xs mt-1 flex items-center gap-1.5">
                                    <MapPin size={12} /> {location}
                                </p>
                            )}

                            <p className="text-slate-400 text-xs mt-1 flex items-center gap-1.5">
                                <Calendar size={12} /> สมาชิกตั้งแต่ {memberSince(profile.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* KYC banner if not completed */}
                    {!profile.profileCompleted && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold text-amber-800">ยังไม่ได้ยืนยันตัวตน</p>
                                <p className="text-xs text-amber-600 mt-0.5">ยืนยันตัวตนเพื่อรับงานได้เต็มรูปแบบ</p>
                            </div>
                            <Link
                                href="/profile/register"
                                className="shrink-0 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-xl transition-colors"
                            >
                                ยืนยันตัวตน
                            </Link>
                        </div>
                    )}

                    {/* Reviews received */}
                    {reviews.length > 0 && (
                        <div className="mb-4 space-y-3">
                            <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                                <Star size={15} className="fill-amber-400 text-amber-400" />
                                รีวิวที่ได้รับ ({reviews.length})
                                {reviews.length > 0 && (
                                    <span className="text-amber-500 font-bold">
                                        {(Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10)} ★
                                    </span>
                                )}
                            </h2>
                            {reviews.map((review) => {
                                const authorName = [review.author.firstName, review.author.lastName].filter(Boolean).join(' ') || 'ผู้ใช้งาน';
                                const authorInitial = (review.author.firstName?.charAt(0) ?? '?').toUpperCase();
                                return (
                                    <div key={review.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-start gap-3">
                                        <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0">
                                            {review.author.avatar ? (
                                                <img src={review.author.avatar} alt={authorName} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                                    {authorInitial}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 text-sm">{authorName}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <StarRow value={review.rating} />
                                                <span className="text-xs text-slate-400">{formatShortDate(review.createdAt)}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{review.comment}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Account info */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5">
                            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <UserRound size={15} className="text-blue-500" /> ข้อมูลบัญชี
                            </h2>
                            <div className="space-y-3 text-sm">
                                <Row label="อีเมล" value={profile.email} />
                                <Row label="เบอร์โทร" value={profile.phone} />
                                <Row
                                    label="วันเกิด"
                                    value={profile.birthDate ? formatDate(profile.birthDate) : null}
                                />
                                <Row
                                    label="บทบาท"
                                    value={profile.role === 'employer' ? 'นายจ้าง' : 'ลูกจ้าง'}
                                />
                            </div>
                        </div>

                        {/* Work info */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5">
                            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <Briefcase size={15} className="text-blue-500" /> ข้อมูลการทำงาน
                            </h2>
                            <div className="space-y-3 text-sm">
                                <Row label="อาชีพ" value={profile.occupation} />
                                <Row label="การศึกษา" value={profile.education} />
                                <Row label="ใบรับรอง" value={profile.certificates} />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5">
                            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <MapPin size={15} className="text-blue-500" /> ที่อยู่
                            </h2>
                            <div className="space-y-3 text-sm">
                                <Row label="จังหวัด" value={profile.province} />
                                <Row label="อำเภอ" value={profile.district} />
                                <Row label="ตำบล" value={profile.subDistrict} />
                            </div>
                        </div>

                        {/* KYC status */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5">
                            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <ShieldCheck size={15} className="text-blue-500" /> สถานะยืนยันตัวตน
                            </h2>
                            {profile.profileCompleted ? (
                                <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-xl px-4 py-3">
                                    <CheckCircle2 size={18} className="shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold">ยืนยันตัวตนแล้ว</p>
                                        <p className="text-xs text-green-600">บัญชีนี้พร้อมรับงาน</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {[
                                        { label: 'บัตรประชาชน', done: false },
                                        { label: 'เซลฟี่พร้อมบัตร', done: false },
                                        { label: 'สแกนใบหน้า', done: false },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-2 text-xs text-slate-500">
                                            <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${item.done ? 'border-green-500 bg-green-500' : 'border-slate-300'}`}>
                                                {item.done && <CheckCircle2 size={10} className="text-white" />}
                                            </div>
                                            {item.label}
                                        </div>
                                    ))}
                                    <Link
                                        href="/profile/register"
                                        className="mt-2 block text-center text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl py-2 transition-colors"
                                    >
                                        เริ่มยืนยันตัวตน →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {editOpen && (
                <EditModal user={profile} onClose={() => setEditOpen(false)} onSaved={handleSaved} />
            )}
        </>
    );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-slate-400 shrink-0">{label}</span>
            <span className="text-slate-700 font-medium text-right">{value || <span className="text-slate-300">-</span>}</span>
        </div>
    );
}
