'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Briefcase, Plus, Search, MapPin, Users, CheckCircle2, XCircle,
    Loader2, Clock, ChevronRight, Eye, Star, Wrench,
    Phone, X, Trash2, UserCheck,
} from 'lucide-react';
import api from '../../lib/api';
import { getAuthSession, type AuthSession } from '../../features/auth/lib/auth';

// ─── Types ───────────────────────────────────────────────────────────────────

type Job = {
    id: number; title: string; type: string; status: string; payAmount: number;
    description?: string; image1?: string; image2?: string; image3?: string;
    createdAt: string;
    postedBy?: { id: number; firstName?: string; lastName?: string };
    _count?: { applications: number };
};

type WorkerPost = {
    id: number; headline: string; skills: string; description?: string;
    expectedPay?: number; available: boolean; createdAt: string;
    worker: { id: number; firstName?: string; lastName?: string; phone?: string };
};

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPE_MAP: Record<string, string> = {
    urgent: 'งานด่วน', parttime: 'Part-time', fulltime: 'Full-time', safezone: 'Safezone',
};
const TYPE_COLOR: Record<string, string> = {
    'งานด่วน': 'bg-red-100 text-red-600',
    'Part-time': 'bg-green-100 text-green-600',
    'Full-time': 'bg-blue-100 text-blue-600',
    'Safezone': 'bg-pink-100 text-pink-600',
};
const SKILL_SUGGESTIONS = [
    'ช่างไฟฟ้า', 'ช่างประปา', 'ช่างแอร์', 'ช่างยนต์', 'ทำความสะอาด',
    'ทำสวน', 'ทาสี', 'งานก่อสร้าง', 'ขับรถ', 'แม่บ้าน',
    'ดูแลผู้สูงอายุ', 'งานครัว', 'รักษาความปลอดภัย', 'งานออฟฟิศ',
];

// ─── Post Skill Modal ─────────────────────────────────────────────────────────

function PostSkillModal({ onClose, onPosted, session }: {
    onClose: () => void;
    onPosted: (post: WorkerPost) => void;
    session: AuthSession;
}) {
    const [form, setForm] = useState({ headline: '', skills: '', description: '', expectedPay: '' });
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        const allSkills = [
            ...selectedSkills,
            ...form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        ].filter((v, i, a) => a.indexOf(v) === i).join(', ');

        if (!allSkills) { setError('กรุณาเลือกหรือพิมพ์ทักษะอย่างน้อย 1 อย่าง'); return; }
        setError('');
        setSubmitting(true);
        try {
            const { data } = await api.post('/worker-posts', {
                workerId: Number(session.userId),
                headline: form.headline,
                skills: allSkills,
                description: form.description || undefined,
                expectedPay: form.expectedPay ? parseInt(form.expectedPay) : undefined,
            });
            onPosted(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'เกิดข้อผิดพลาด');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-100 px-6 pt-5 pb-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">โพสต์ทักษะของฉัน</h2>
                        <p className="text-xs text-slate-500 mt-0.5">บอกนายจ้างว่าคุณทำอะไรได้บ้าง</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                    {/* Headline */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            ชื่อโปรไฟล์ / ตำแหน่ง <span className="text-red-500">*</span>
                        </label>
                        <input
                            required
                            value={form.headline}
                            onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))}
                            placeholder="เช่น ช่างไฟฟ้า 5 ปีประสบการณ์, แม่บ้านพร้อมทำงานทันที"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                    </div>

                    {/* Quick skill tags */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            ทักษะของฉัน <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {SKILL_SUGGESTIONS.map((skill) => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => toggleSkill(skill)}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${selectedSkills.includes(skill)
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                        <input
                            value={form.skills}
                            onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
                            placeholder="พิมพ์ทักษะเพิ่มเติม คั่นด้วยจุลภาค เช่น ตัดหญ้า, ทาสี"
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                    </div>

                    {/* Expected pay */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">ค่าจ้างที่ต้องการ (บาท/วัน)</label>
                        <input
                            type="number"
                            min="1"
                            value={form.expectedPay}
                            onChange={(e) => setForm((p) => ({ ...p, expectedPay: e.target.value }))}
                            placeholder="เช่น 500 (ถ้าไม่ระบุจะแสดงว่า ต่อรองได้)"
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">แนะนำตัวเพิ่มเติม</label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            placeholder="บอกประสบการณ์ พื้นที่ที่รับงาน หรือข้อมูลเพิ่มเติม..."
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

                    <div className="flex gap-3 pb-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                            ยกเลิก
                        </button>
                        <button type="submit" disabled={submitting}
                            className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
                            {submitting && <Loader2 size={14} className="animate-spin" />}
                            โพสต์เลย
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// ─── Worker Post Card ─────────────────────────────────────────────────────────

function WorkerPostCard({ post, isOwn, onDelete, onToggle, onHire, hiringWorkerId }: {
    post: WorkerPost;
    isOwn?: boolean;
    onDelete?: (id: number) => void;
    onToggle?: (id: number, available: boolean) => void;
    onHire?: (post: WorkerPost) => void;
    hiringWorkerId?: number | null;
}) {
    const name = [post.worker.firstName, post.worker.lastName].filter(Boolean).join(' ') || 'คนทำงาน';
    const initial = name.charAt(0);
    const skills = post.skills.split(',').map((s) => s.trim()).filter(Boolean);

    return (
        <div className={`bg-white rounded-2xl border ${post.available ? 'border-slate-200' : 'border-slate-100 opacity-60'} p-4 flex flex-col gap-3`}>
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {initial}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{post.headline}</h3>
                        {!post.available && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">ไม่ว่าง</span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{name}</p>
                </div>
                <div className="text-right shrink-0">
                    {post.expectedPay ? (
                        <p className="font-bold text-blue-600 text-sm">{post.expectedPay.toLocaleString()}฿</p>
                    ) : (
                        <p className="text-xs text-slate-400 font-medium">ต่อรองได้</p>
                    )}
                </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 6).map((skill) => (
                    <span key={skill} className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        {skill}
                    </span>
                ))}
                {skills.length > 6 && (
                    <span className="text-[11px] text-slate-400 px-2 py-0.5">+{skills.length - 6}</span>
                )}
            </div>

            {/* Description */}
            {post.description && (
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{post.description}</p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(post.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                </span>
                {isOwn ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onToggle?.(post.id, !post.available)}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${post.available
                                ? 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-600'
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                }`}
                        >
                            {post.available ? 'ตั้งว่าไม่ว่าง' : 'ตั้งว่าว่างงาน'}
                        </button>
                        <button
                            onClick={() => onDelete?.(post.id)}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        >
                            <Trash2 size={11} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        {post.worker.phone && (
                            <a
                                href={`tel:${post.worker.phone}`}
                                className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full transition-colors"
                            >
                                <Phone size={11} /> โทรหา
                            </a>
                        )}
                        {onHire && (
                            <button
                                onClick={() => onHire(post)}
                                disabled={hiringWorkerId === post.worker.id}
                                className="flex items-center gap-1 text-[11px] font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-full transition-colors disabled:opacity-60"
                            >
                                {hiringWorkerId === post.worker.id
                                    ? <Loader2 size={11} className="animate-spin" />
                                    : <UserCheck size={11} />
                                }
                                จ้าง
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Skill Board tab content ──────────────────────────────────────────────────

function SkillBoard({ session }: { session: AuthSession | null }) {
    const router = useRouter();
    const [posts, setPosts] = useState<WorkerPost[]>([]);
    const [myPosts, setMyPosts] = useState<WorkerPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [hiringWorkerId, setHiringWorkerId] = useState<number | null>(null);
    const isWorker = session && session.role !== 'employer';
    const isEmployer = session?.role === 'employer';

    useEffect(() => {
        api.get('/worker-posts')
            .then(({ data }) => setPosts(Array.isArray(data) ? data : []))
            .catch(() => setPosts([]))
            .finally(() => setLoading(false));

        if (session && session.role !== 'employer') {
            api.get(`/worker-posts/worker/${session.userId}`)
                .then(({ data }) => setMyPosts(Array.isArray(data) ? data : []))
                .catch(() => {});
        }
    }, []);

    const handlePosted = (post: WorkerPost) => {
        setPosts((prev) => [post, ...prev]);
        setMyPosts((prev) => [post, ...prev]);
        setShowModal(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('ลบโพสต์นี้?')) return;
        try {
            await api.delete(`/worker-posts/${id}`);
            setPosts((prev) => prev.filter((p) => p.id !== id));
            setMyPosts((prev) => prev.filter((p) => p.id !== id));
        } catch { /* ignore */ }
    };

    const handleToggle = async (id: number, available: boolean) => {
        try {
            await api.patch(`/worker-posts/${id}`, { available });
            const update = (prev: WorkerPost[]) => prev.map((p) => p.id === id ? { ...p, available } : p);
            setPosts(update);
            setMyPosts(update);
        } catch { /* ignore */ }
    };

    const handleHire = async (post: WorkerPost) => {
        if (!session) return;
        setHiringWorkerId(post.worker.id);
        try {
            const { data } = await api.post('/chat/conversations', {
                employerId: Number(session.userId),
                workerId: post.worker.id,
            });
            router.push(`/messages?conversationId=${data.id}`);
        } catch {
            setHiringWorkerId(null);
        }
    };

    const filtered = posts.filter((p) =>
        !search || p.headline.toLowerCase().includes(search.toLowerCase()) ||
        p.skills.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Top bar */}
            <div className="flex gap-3 mb-5">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาทักษะหรือชื่อโปรไฟล์..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                </div>
                {isWorker && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
                    >
                        <Plus size={16} /> โพสต์ทักษะ
                    </button>
                )}
                {!session && (
                    <Link href="/login" className="flex items-center gap-2 bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors">
                        เข้าสู่ระบบ
                    </Link>
                )}
            </div>

            {/* My posts strip (workers only) */}
            {isWorker && myPosts.length > 0 && (
                <div className="mb-5 bg-blue-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">โพสต์ของฉัน</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {myPosts.map((p) => (
                            <WorkerPostCard
                                key={p.id} post={p} isOwn
                                onDelete={handleDelete} onToggle={handleToggle}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* All posts */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <Wrench className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">ยังไม่มีโปรไฟล์แรงงาน</p>
                    {isWorker && (
                        <button onClick={() => setShowModal(true)} className="text-blue-600 text-sm hover:underline mt-2">
                            + โพสต์ทักษะของคุณ
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <p className="text-sm text-slate-500 mb-4">{filtered.length} โปรไฟล์แรงงาน</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((post) => (
                            <WorkerPostCard
                                key={post.id}
                                post={post}
                                onHire={isEmployer ? handleHire : undefined}
                                hiringWorkerId={hiringWorkerId}
                            />
                        ))}
                    </div>
                </>
            )}

            {showModal && session && (
                <PostSkillModal
                    session={session}
                    onClose={() => setShowModal(false)}
                    onPosted={handlePosted}
                />
            )}

        </div>
    );
}

// ─── Job Board tab content ────────────────────────────────────────────────────

const FILTER_TABS = ['ทั้งหมด', 'งานด่วน', 'Part-time', 'Full-time', 'Safezone'];

function JobBoard({ session }: { session: AuthSession | null }) {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('ทั้งหมด');
    const [applyingIds, setApplyingIds] = useState<Set<number>>(new Set());
    const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());

    const isEmployer = session?.role === 'employer';
    const isWorker = session && !isEmployer;

    useEffect(() => {
        const url = isEmployer ? `/jobs?postedById=${session!.userId}` : '/jobs';
        api.get(url)
            .then(({ data }) => setJobs(Array.isArray(data) ? (isEmployer ? data : data.filter((j: Job) => j.status === 'open')) : []))
            .catch(() => setJobs([]))
            .finally(() => setLoading(false));
    }, []);

    const toggleStatus = async (job: Job) => {
        const next = job.status === 'open' ? 'closed' : 'open';
        try {
            await api.patch(`/jobs/${job.id}`, { status: next });
            setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, status: next } : j));
        } catch { /* ignore */ }
    };

    const handleApply = async (job: Job) => {
        if (!session) { window.location.href = '/login'; return; }
        if (appliedIds.has(job.id) || applyingIds.has(job.id)) return;
        setApplyingIds((prev) => new Set(prev).add(job.id));
        try {
            await api.post('/applications', { jobId: job.id, workerId: Number(session.userId) });
            setAppliedIds((prev) => new Set(prev).add(job.id));
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            if (msg === 'Already applied to this job') setAppliedIds((prev) => new Set(prev).add(job.id));
            else alert(msg || 'เกิดข้อผิดพลาด');
        } finally {
            setApplyingIds((prev) => { const s = new Set(prev); s.delete(job.id); return s; });
        }
    };

    const filtered = jobs.filter((job) => {
        const label = TYPE_MAP[job.type] ?? job.type;
        return (activeFilter === 'ทั้งหมด' || label === activeFilter) &&
            (!search || job.title.toLowerCase().includes(search.toLowerCase()));
    });

    return (
        <div>
            {/* Search + action */}
            <div className="flex gap-3 mb-5">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่องาน..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                </div>
                {isEmployer ? (
                    <Link href="/employer/jobs/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
                        <Plus size={16} /> โพสต์งาน
                    </Link>
                ) : !session ? (
                    <Link href="/login" className="flex items-center gap-2 bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors">
                        เข้าสู่ระบบ <ChevronRight size={16} />
                    </Link>
                ) : (
                    <Link href="/map" className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-blue-400 transition-colors">
                        <MapPin size={16} /> แผนที่
                    </Link>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {FILTER_TABS.map((tab) => (
                    <button key={tab} onClick={() => setActiveFilter(tab)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeFilter === tab
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">{jobs.length === 0 ? 'ยังไม่มีประกาศงาน' : 'ไม่พบงานที่ตรงกัน'}</p>
                    {isEmployer && jobs.length === 0 && (
                        <Link href="/employer/jobs/create" className="text-blue-600 text-sm hover:underline mt-2 block">+ โพสต์งานแรก</Link>
                    )}
                </div>
            ) : (
                <>
                    <p className="text-sm text-slate-500 mb-4">{filtered.length} รายการ</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((job) => {
                            const label = TYPE_MAP[job.type] ?? job.type;
                            const thumb = job.image1 || job.image2 || job.image3;
                            const isApplying = applyingIds.has(job.id);
                            const isApplied = appliedIds.has(job.id);
                            const isOpen = job.status === 'open';

                            return (
                                <div key={job.id} className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all overflow-hidden flex flex-col">
                                    {thumb ? (
                                        <div className="h-36 w-full overflow-hidden bg-slate-100">
                                            <img src={thumb} alt={job.title} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="h-36 w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                                            <Briefcase className="h-10 w-10 text-blue-300" />
                                        </div>
                                    )}
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 flex-1">{job.title}</h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${TYPE_COLOR[label] ?? 'bg-slate-100 text-slate-600'}`}>
                                                {label}
                                            </span>
                                        </div>
                                        {isEmployer && (
                                            <span className={`text-[10px] font-semibold mb-1 ${isOpen ? 'text-green-600' : 'text-slate-400'}`}>
                                                ● {isOpen ? 'เปิดรับ' : 'ปิดรับ'}
                                            </span>
                                        )}
                                        {job.description && (
                                            <p className="text-xs text-slate-400 line-clamp-2 mb-2">{job.description}</p>
                                        )}
                                        <p className="text-lg font-bold text-blue-600 mt-auto mb-3">{job.payAmount.toLocaleString()}฿</p>

                                        {isEmployer ? (
                                            <div className="flex gap-2 flex-wrap">
                                                <Link href={`/workboard/${job.id}`} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                                                    <Eye size={11} /> ดู
                                                </Link>
                                                <button onClick={() => toggleStatus(job)}
                                                    className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors ${isOpen ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                                    {isOpen ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                                                    {isOpen ? 'เปิดรับ' : 'ปิดรับ'}
                                                </button>
                                                <Link href={`/employer/candidates?jobId=${job.id}`} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                                    <Users size={11} /> ผู้สมัคร
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Link href={`/workboard/${job.id}`} className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                                                    <Eye size={13} /> ดูรายละเอียด
                                                </Link>
                                                <button onClick={() => handleApply(job)} disabled={isApplying || isApplied}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-2 rounded-xl transition-all active:scale-95 ${isApplied ? 'bg-green-100 text-green-700 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60'}`}>
                                                    {isApplying ? <Loader2 size={14} className="animate-spin" /> : isApplied ? <><CheckCircle2 size={14} /> สมัครแล้ว</> : 'สมัคร'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = 'jobs' | 'skills';

export default function WorkboardPage() {
    const [session, setSession] = useState<AuthSession | null | 'loading'>('loading');
    const [tab, setTab] = useState<Tab>('jobs');

    useEffect(() => { setSession(getAuthSession()); }, []);

    const resolvedSession = session === 'loading' ? null : session;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                    {/* Page header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">Workboard</h1>
                        <p className="text-slate-500 text-sm mt-1">ประกาศงานและโปรไฟล์แรงงานทั้งหมด</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit mb-6">
                        <button
                            onClick={() => setTab('jobs')}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'jobs' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            <Briefcase size={15} /> ประกาศงาน
                        </button>
                        <button
                            onClick={() => setTab('skills')}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'skills' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            <Wrench size={15} /> แรงงาน / ทักษะ
                        </button>
                    </div>

                    {session === 'loading' ? (
                        <div className="flex justify-center pt-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
                    ) : tab === 'jobs' ? (
                        <JobBoard session={resolvedSession} />
                    ) : (
                        <SkillBoard session={resolvedSession} />
                    )}
                </div>
            </div>
        </>
    );
}
