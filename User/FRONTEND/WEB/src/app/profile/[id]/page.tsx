'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import {
    UserRound, MapPin, Briefcase, GraduationCap, Award, ShieldCheck,
    Calendar, Loader2, MessageSquare, Wrench, Star, X, Send,
    CheckCircle2, XCircle,
} from 'lucide-react';
import api from '../../../lib/api';
import { getAuthSession } from '../../../features/auth/lib/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewAuthor = { id: number; firstName: string | null; lastName: string | null; avatar: string | null };

type UserReview = {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    author: ReviewAuthor;
};

type PublicProfile = {
    id: number;
    firstName: string | null;
    lastName: string | null;
    role: string;
    province: string | null;
    district: string | null;
    occupation: string | null;
    education: string | null;
    certificates: string | null;
    profileCompleted: boolean;
    createdAt: string;
    completedJobsCount: number;
    avgRating: number | null;
    reviewCount: number;
    reviews: UserReview[];
    workerPosts: { id: number; headline: string; skills: string; description: string | null; expectedPay: number | null }[];
    avatar?: string | null;
    banner?: string | null;
};

type ApplicationInfo = {
    id: number;
    status: string;
    job: { id: number; title: string; postedById: number; status: string };
    worker: { id: number; firstName: string | null; lastName: string | null };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fullName = (p: { firstName: string | null; lastName: string | null }) =>
    [p.firstName, p.lastName].filter(Boolean).join(' ') || 'ผู้ใช้งาน';

const initials = (p: { firstName: string | null }) =>
    (p.firstName?.charAt(0) ?? '?').toUpperCase();

const memberSince = (iso: string) =>
    new Date(iso).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

// ─── Star Row ─────────────────────────────────────────────────────────────────

function StarRow({ value, size = 16, interactive = false, onChange }: {
    value: number;
    size?: number;
    interactive?: boolean;
    onChange?: (v: number) => void;
}) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    size={size}
                    className={`transition-colors ${interactive ? 'cursor-pointer' : ''} ${
                        s <= (interactive ? hover || value : value)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200 fill-slate-200'
                    }`}
                    onMouseEnter={() => interactive && setHover(s)}
                    onMouseLeave={() => interactive && setHover(0)}
                    onClick={() => interactive && onChange?.(s)}
                />
            ))}
        </div>
    );
}

// ─── Review Modal ─────────────────────────────────────────────────────────────

function ReviewModal({
    targetId,
    authorId,
    onClose,
    onSubmitted,
}: {
    targetId: number;
    authorId: number;
    onClose: () => void;
    onSubmitted: (review: UserReview) => void;
}) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (rating === 0) { setError('กรุณาเลือกคะแนน'); return; }
        if (!comment.trim()) { setError('กรุณาเขียนความคิดเห็น'); return; }

        setSubmitting(true);
        setError('');
        try {
            const { data } = await api.post<UserReview>('/user-reviews', {
                authorId,
                targetId,
                rating,
                comment: comment.trim(),
            });
            onSubmitted(data);
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            setError(msg === 'You have already reviewed this user' ? 'คุณรีวิวผู้ใช้นี้ไปแล้ว' : 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">เขียนรีวิว</h2>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-2">คะแนน</p>
                        <div className="flex items-center gap-3">
                            <StarRow value={rating} size={32} interactive onChange={setRating} />
                            {rating > 0 && (
                                <span className="text-sm font-bold text-amber-500">
                                    {['', 'แย่มาก', 'แย่', 'พอใช้', 'ดี', 'ดีมาก'][rating]}
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-2">ความคิดเห็น</p>
                        <textarea
                            rows={4}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
                            placeholder="เขียนรีวิวเกี่ยวกับผู้ใช้งานนี้..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        ส่งรีวิว
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({ review, currentUserId, onDeleted }: {
    review: UserReview;
    currentUserId?: number;
    onDeleted: (id: number) => void;
}) {
    const [deleting, setDeleting] = useState(false);
    const isOwn = currentUserId === review.author.id;

    const handleDelete = async () => {
        if (!confirm('ลบรีวิวนี้?')) return;
        setDeleting(true);
        try {
            await api.delete(`/user-reviews/${review.id}?requesterId=${currentUserId}`);
            onDeleted(review.id);
        } catch {
            setDeleting(false);
        }
    };

    const authorName = fullName(review.author);
    const authorInitial = initials(review.author);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start gap-3">
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
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <p className="font-semibold text-slate-900 text-sm">{authorName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <StarRow value={review.rating} size={12} />
                                <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
                            </div>
                        </div>
                        {isOwn && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="text-xs text-red-400 hover:text-red-600 transition-colors shrink-0"
                            >
                                {deleting ? <Loader2 size={12} className="animate-spin" /> : 'ลบ'}
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{review.comment}</p>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const APP_STATUS_LABEL: Record<string, string> = {
    pending: 'รอการพิจารณา', accepted: 'รับเข้าทำงานแล้ว', rejected: 'ปฏิเสธแล้ว',
};
const APP_STATUS_COLOR: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
};

function PublicProfileContent() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const applicationId = searchParams.get('applicationId');
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [chatting, setChatting] = useState(false);
    const [reviewOpen, setReviewOpen] = useState(false);
    const [application, setApplication] = useState<ApplicationInfo | null>(null);
    const [deciding, setDeciding] = useState(false);

    const session = getAuthSession();
    const currentUserId = session ? Number(session.userId) : undefined;

    useEffect(() => {
        api.get<PublicProfile>(`/users/${id}/public`)
            .then(({ data }) => setProfile(data))
            .catch(() => setProfile(null))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!applicationId) return;
        api.get<ApplicationInfo>(`/applications/${applicationId}`)
            .then(({ data }) => setApplication(data))
            .catch(() => setApplication(null));
    }, [applicationId]);

    const decide = async (status: 'accepted' | 'rejected') => {
        if (!application) return;
        setDeciding(true);
        try {
            await api.patch(`/applications/${application.id}/status`, { status });
            router.push(`/employer/candidates?jobId=${application.job.id}`);
        } catch {
            setDeciding(false);
        }
    };

    const startChat = async () => {
        if (!session || !profile) return;
        setChatting(true);
        try {
            const { data } = await api.post('/chat/conversations', {
                employerId: Number(session.userId),
                workerId: profile.id,
            });
            router.push(`/messages?conversationId=${data.id}`);
        } catch {
            setChatting(false);
        }
    };

    const handleReviewSubmitted = (review: UserReview) => {
        setReviewOpen(false);
        setProfile((p) => p ? {
            ...p,
            reviews: [review, ...p.reviews],
            reviewCount: p.reviewCount + 1,
            avgRating: p.reviews.length === 0
                ? review.rating
                : Math.round(((p.avgRating! * p.reviewCount + review.rating) / (p.reviewCount + 1)) * 10) / 10,
        } : p);
    };

    const handleReviewDeleted = (reviewId: number) => {
        setProfile((p) => {
            if (!p) return p;
            const remaining = p.reviews.filter((r) => r.id !== reviewId);
            const avg = remaining.length
                ? Math.round((remaining.reduce((s, r) => s + r.rating, 0) / remaining.length) * 10) / 10
                : null;
            return { ...p, reviews: remaining, reviewCount: remaining.length, avgRating: avg };
        });
    };

    if (loading) return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 flex justify-center pt-32">
                <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
            </div>
        </>
    );

    if (!profile) return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
                <UserRound size={40} className="text-slate-300" />
                <p className="text-slate-500 text-sm">ไม่พบโปรไฟล์นี้</p>
                <Link href="/" className="text-blue-600 text-sm hover:underline">กลับหน้าหลัก</Link>
            </div>
        </>
    );

    const name = fullName(profile);
    const initial = initials(profile);
    const location = [profile.district, profile.province].filter(Boolean).join(', ');
    const isOwnProfile = currentUserId === profile.id;
    const canReview = !!session && !isOwnProfile;
    const alreadyReviewed = profile.reviews.some((r) => r.author.id === currentUserId);
    const canDecide = !!application
        && application.job.postedById === currentUserId
        && application.worker.id === profile.id;

    return (
        <>
            <Navbar />
            <div className={`min-h-screen bg-slate-50 ${canDecide ? 'pb-32' : 'pb-16'}`}>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">

                    {/* Header card */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-4">
                        {profile.banner ? (
                            <img src={profile.banner} alt="banner" className="h-24 w-full object-cover" />
                        ) : (
                            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600" />
                        )}

                        <div className="px-6 pb-6">
                            <div className="flex items-end justify-between -mt-10 mb-4">
                                <div className="h-20 w-20 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt="avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-indigo-600 bg-indigo-50 w-full h-full flex items-center justify-center">
                                            {initial}
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {canReview && !alreadyReviewed && (
                                        <button
                                            onClick={() => setReviewOpen(true)}
                                            className="flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-4 py-2.5 rounded-xl transition-colors"
                                        >
                                            <Star size={14} className="fill-amber-400 text-amber-400" /> รีวิว
                                        </button>
                                    )}
                                    {canReview && session?.role === 'employer' && (
                                        <button
                                            onClick={startChat}
                                            disabled={chatting}
                                            className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2.5 rounded-xl transition-colors"
                                        >
                                            {chatting ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
                                            แชท
                                        </button>
                                    )}
                                    {isOwnProfile && (
                                        <Link href="/profile" className="text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors">
                                            แก้ไขโปรไฟล์
                                        </Link>
                                    )}
                                </div>
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

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                            <p className="text-3xl font-bold text-blue-600">{profile.completedJobsCount}</p>
                            <p className="text-xs text-slate-500 mt-1">งานที่เสร็จ</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                                <p className="text-3xl font-bold text-amber-500">
                                    {profile.avgRating ?? '-'}
                                </p>
                                {profile.avgRating && <Star size={18} className="fill-amber-400 text-amber-400 mb-1" />}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">คะแนนเฉลี่ย</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                            <p className="text-3xl font-bold text-indigo-600">{profile.reviewCount}</p>
                            <p className="text-xs text-slate-500 mt-1">รีวิว</p>
                        </div>
                    </div>

                    {/* Work info */}
                    {(profile.education || profile.certificates) && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
                            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <GraduationCap size={15} className="text-blue-500" /> ข้อมูลการทำงาน
                            </h2>
                            <div className="space-y-3 text-sm">
                                {profile.education && (
                                    <div className="flex items-start gap-2">
                                        <GraduationCap size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs text-slate-400">การศึกษา</p>
                                            <p className="text-slate-700 font-medium">{profile.education}</p>
                                        </div>
                                    </div>
                                )}
                                {profile.certificates && (
                                    <div className="flex items-start gap-2">
                                        <Award size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs text-slate-400">ใบรับรอง / ทักษะ</p>
                                            <p className="text-slate-700 font-medium">{profile.certificates}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Worker posts */}
                    {profile.workerPosts.length > 0 && (
                        <div className="space-y-3 mb-4">
                            <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                                <Wrench size={15} className="text-blue-500" /> โพสต์รับงาน
                            </h2>
                            {profile.workerPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/workboard/${post.id}`}
                                    className="block bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all"
                                >
                                    <p className="font-bold text-slate-900 text-sm">{post.headline}</p>
                                    {post.description && (
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{post.description}</p>
                                    )}
                                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                                        {post.skills.split(',').filter(Boolean).map((s) => (
                                            <span key={s} className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-100">
                                                {s.trim()}
                                            </span>
                                        ))}
                                        {post.expectedPay && (
                                            <span className="ml-auto text-xs font-bold text-slate-700">
                                                ฿{post.expectedPay.toLocaleString()}/วัน
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Reviews section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Star size={15} className="text-amber-400 fill-amber-400" />
                                รีวิว ({profile.reviewCount})
                                {profile.avgRating && (
                                    <span className="text-amber-500 font-bold">{profile.avgRating} ★</span>
                                )}
                            </h2>
                            {canReview && !alreadyReviewed && (
                                <button
                                    onClick={() => setReviewOpen(true)}
                                    className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"
                                >
                                    + เขียนรีวิว
                                </button>
                            )}
                            {alreadyReviewed && (
                                <span className="text-xs text-slate-400">คุณรีวิวแล้ว</span>
                            )}
                        </div>

                        {profile.reviews.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                                <Star size={32} className="text-slate-200 fill-slate-200 mx-auto mb-2" />
                                <p className="text-slate-400 text-sm">ยังไม่มีรีวิว</p>
                                {canReview && !alreadyReviewed && (
                                    <button
                                        onClick={() => setReviewOpen(true)}
                                        className="mt-3 text-xs font-bold text-blue-600 hover:underline"
                                    >
                                        เป็นคนแรกที่รีวิว
                                    </button>
                                )}
                            </div>
                        ) : (
                            profile.reviews.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                    currentUserId={currentUserId}
                                    onDeleted={handleReviewDeleted}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {reviewOpen && session && (
                <ReviewModal
                    targetId={profile.id}
                    authorId={Number(session.userId)}
                    onClose={() => setReviewOpen(false)}
                    onSubmitted={handleReviewSubmitted}
                />
            )}

            {canDecide && application && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-slate-400">ผู้สมัครงาน</p>
                            <p className="text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                                <Briefcase size={13} className="text-blue-600 shrink-0" />
                                {application.job.title}
                            </p>
                        </div>
                        {application.status === 'pending' ? (
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => decide('rejected')}
                                    disabled={deciding}
                                    className="flex items-center gap-1.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 px-4 py-2.5 rounded-xl transition-colors"
                                >
                                    <XCircle size={15} /> ปฏิเสธ
                                </button>
                                <button
                                    onClick={() => decide('accepted')}
                                    disabled={deciding}
                                    className="flex items-center gap-1.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 px-5 py-2.5 rounded-xl transition-colors"
                                >
                                    {deciding ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                                    รับเข้าทำงาน
                                </button>
                            </div>
                        ) : (
                            <span className={`text-sm font-bold px-4 py-2.5 rounded-xl shrink-0 ${APP_STATUS_COLOR[application.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                {APP_STATUS_LABEL[application.status] ?? application.status}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default function PublicProfilePage() {
    return (
        <Suspense fallback={
            <>
                <Navbar />
                <div className="min-h-screen bg-slate-50 flex justify-center pt-32">
                    <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
                </div>
            </>
        }>
            <PublicProfileContent />
        </Suspense>
    );
}
