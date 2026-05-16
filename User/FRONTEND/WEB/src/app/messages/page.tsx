'use client';

import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import {
    MessageSquare, Send, Loader2, ArrowLeft, Briefcase, Phone, User,
} from 'lucide-react';
import api from '../../lib/api';
import { getAuthSession, type AuthSession } from '../../features/auth/lib/auth';

// ─── Types ───────────────────────────────────────────────────────────────────

type Party = { id: number; firstName?: string; lastName?: string; phone?: string };

type ConversationSummary = {
    id: number;
    jobId: number | null;
    jobTitle: string | null;
    role: 'employer' | 'worker';
    other: Party;
    lastMessage: { id: number; text: string; senderId: number; createdAt: string } | null;
    unreadCount: number;
    updatedAt: string;
};

type Message = {
    id: number;
    conversationId: number;
    senderId: number;
    text: string;
    createdAt: string;
};

type ConversationThread = {
    id: number;
    jobId: number | null;
    jobTitle: string | null;
    role: 'employer' | 'worker';
    other: Party;
    messages: Message[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const partyName = (p?: Party) =>
    (p && [p.firstName, p.lastName].filter(Boolean).join(' ')) || 'ผู้ใช้งาน';

const timeOf = (iso: string) =>
    new Date(iso).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

const dayOf = (iso: string) =>
    new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });

// ─── Thread panel ─────────────────────────────────────────────────────────────

function ThreadPanel({
    conversationId,
    userId,
    onBack,
    onSent,
}: {
    conversationId: number;
    userId: number;
    onBack: () => void;
    onSent: () => void;
}) {
    const [thread, setThread] = useState<ConversationThread | null>(null);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const load = useCallback(
        async (silent = false) => {
            if (!silent) setLoading(true);
            try {
                const { data } = await api.get(
                    `/chat/conversations/${conversationId}?userId=${userId}`,
                );
                setThread(data);
            } catch {
                if (!silent) setThread(null);
            } finally {
                if (!silent) setLoading(false);
            }
        },
        [conversationId, userId],
    );

    useEffect(() => {
        load();
        const t = setInterval(() => load(true), 4000);
        return () => clearInterval(t);
    }, [load]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [thread?.messages.length]);

    const handleSend = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        const body = text.trim();
        if (!body || sending) return;
        setSending(true);
        setText('');
        try {
            await api.post('/chat/messages', {
                conversationId,
                senderId: userId,
                text: body,
            });
            await load(true);
            onSent();
        } catch {
            setText(body);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!thread) {
        return (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                ไม่พบบทสนทนานี้
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white">
                <button
                    onClick={onBack}
                    className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                    {partyName(thread.other).charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 text-sm truncate">
                        {partyName(thread.other)}
                        <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            {thread.role === 'employer' ? 'ผู้สมัคร' : 'นายจ้าง'}
                        </span>
                    </p>
                    {thread.jobId ? (
                        <Link
                            href={`/workboard/${thread.jobId}`}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 truncate"
                        >
                            <Briefcase size={11} /> {thread.jobTitle}
                        </Link>
                    ) : (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Briefcase size={11} /> การติดต่อทั่วไป
                        </span>
                    )}
                </div>
                {thread.other.phone && (
                    <a
                        href={`tel:${thread.other.phone}`}
                        className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors shrink-0"
                    >
                        <Phone size={12} /> โทร
                    </a>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-slate-50">
                {thread.messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                        <MessageSquare size={32} className="text-slate-300" />
                        เริ่มพูดคุยเกี่ยวกับงานนี้ได้เลย
                    </div>
                ) : (
                    thread.messages.map((m, i) => {
                        const mine = m.senderId === userId;
                        const prev = thread.messages[i - 1];
                        const showDay =
                            !prev ||
                            new Date(prev.createdAt).toDateString() !==
                                new Date(m.createdAt).toDateString();
                        return (
                            <React.Fragment key={m.id}>
                                {showDay && (
                                    <div className="text-center my-3">
                                        <span className="text-[11px] text-slate-400 bg-slate-200/60 px-2.5 py-0.5 rounded-full">
                                            {dayOf(m.createdAt)}
                                        </span>
                                    </div>
                                )}
                                <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                                            mine
                                                ? 'bg-blue-600 text-white rounded-br-sm'
                                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap break-words leading-relaxed">
                                            {m.text}
                                        </p>
                                        <p
                                            className={`text-[10px] mt-1 ${
                                                mine ? 'text-blue-200' : 'text-slate-400'
                                            }`}
                                        >
                                            {timeOf(m.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Composer */}
            <form
                onSubmit={handleSend}
                className="flex items-center gap-2 px-4 py-3 border-t border-slate-200 bg-white"
            >
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="พิมพ์ข้อความ..."
                    className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
                <button
                    type="submit"
                    disabled={sending || !text.trim()}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors shrink-0"
                >
                    {sending ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Send size={16} />
                    )}
                </button>
            </form>
        </div>
    );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function MessagesContent({ session }: { session: AuthSession }) {
    const params = useSearchParams();
    const router = useRouter();
    const userId = Number(session.userId);

    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<number | null>(
        params.get('conversationId') ? Number(params.get('conversationId')) : null,
    );

    const loadList = useCallback(
        async (silent = false) => {
            if (!silent) setLoading(true);
            try {
                const { data } = await api.get(`/chat/conversations?userId=${userId}`);
                setConversations(Array.isArray(data) ? data : []);
            } catch {
                if (!silent) setConversations([]);
            } finally {
                if (!silent) setLoading(false);
            }
        },
        [userId],
    );

    useEffect(() => {
        loadList();
        const t = setInterval(() => loadList(true), 6000);
        return () => clearInterval(t);
    }, [loadList]);

    const openConversation = (id: number) => {
        setActiveId(id);
        router.replace(`/messages?conversationId=${id}`);
        setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-4">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-5">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="h-6 w-6 text-blue-600" /> ข้อความ
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        พูดคุยรายละเอียดงานกับ{session.role === 'employer' ? 'ผู้สมัครงาน' : 'นายจ้าง'}ก่อนเริ่มงาน
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex h-[calc(100vh-220px)] min-h-[480px]">
                    {/* Conversation list */}
                    <div
                        className={`w-full md:w-80 border-r border-slate-200 flex flex-col ${
                            activeId !== null ? 'hidden md:flex' : 'flex'
                        }`}
                    >
                        <div className="px-4 py-3 border-b border-slate-200">
                            <p className="text-sm font-bold text-slate-700">
                                บทสนทนา ({conversations.length})
                            </p>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                                </div>
                            ) : conversations.length === 0 ? (
                                <div className="px-4 py-12 text-center text-sm text-slate-400">
                                    <MessageSquare
                                        size={32}
                                        className="text-slate-300 mx-auto mb-2"
                                    />
                                    ยังไม่มีบทสนทนา
                                    <p className="text-xs mt-1">
                                        เริ่มแชทได้จากหน้ารายละเอียดงานหรือผู้สมัคร
                                    </p>
                                </div>
                            ) : (
                                conversations.map((c) => {
                                    const active = c.id === activeId;
                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => openConversation(c.id)}
                                            className={`w-full text-left px-4 py-3 border-b border-slate-100 flex gap-3 transition-colors ${
                                                active
                                                    ? 'bg-blue-50'
                                                    : 'hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                                                {partyName(c.other).charAt(0)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="font-bold text-sm text-slate-900 truncate">
                                                        {partyName(c.other)}
                                                    </p>
                                                    {c.lastMessage && (
                                                        <span className="text-[10px] text-slate-400 shrink-0">
                                                            {timeOf(c.lastMessage.createdAt)}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                                                    <Briefcase size={10} /> {c.jobTitle ?? 'การติดต่อทั่วไป'}
                                                </p>
                                                <div className="flex items-center justify-between gap-2 mt-0.5">
                                                    <p
                                                        className={`text-xs truncate ${
                                                            c.unreadCount > 0
                                                                ? 'text-slate-800 font-semibold'
                                                                : 'text-slate-500'
                                                        }`}
                                                    >
                                                        {c.lastMessage
                                                            ? (c.lastMessage.senderId ===
                                                              userId
                                                                  ? 'คุณ: '
                                                                  : '') +
                                                              c.lastMessage.text
                                                            : 'ยังไม่มีข้อความ'}
                                                    </p>
                                                    {c.unreadCount > 0 && (
                                                        <span className="shrink-0 h-5 min-w-5 px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                                                            {c.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Thread */}
                    <div
                        className={`flex-1 flex-col min-w-0 ${
                            activeId !== null ? 'flex' : 'hidden md:flex'
                        }`}
                    >
                        {activeId !== null ? (
                            <ThreadPanel
                                key={activeId}
                                conversationId={activeId}
                                userId={userId}
                                onBack={() => {
                                    setActiveId(null);
                                    router.replace('/messages');
                                }}
                                onSent={() => loadList(true)}
                            />
                        ) : (
                            <div className="flex-1 hidden md:flex flex-col items-center justify-center text-slate-400 gap-2">
                                <MessageSquare size={40} className="text-slate-300" />
                                <p className="text-sm">เลือกบทสนทนาเพื่อเริ่มแชท</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MessagesPage() {
    const [session, setSession] = useState<AuthSession | null | 'loading'>('loading');

    useEffect(() => {
        setSession(getAuthSession());
    }, []);

    return (
        <>
            <Navbar />
            {session === 'loading' ? (
                <div className="min-h-screen bg-slate-50 flex justify-center pt-32">
                    <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
                </div>
            ) : !session ? (
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
                    <User size={40} className="text-slate-300" />
                    <p className="text-slate-500">กรุณาเข้าสู่ระบบเพื่อใช้งานแชท</p>
                    <Link
                        href="/login"
                        className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors"
                    >
                        เข้าสู่ระบบ
                    </Link>
                </div>
            ) : (
                <Suspense
                    fallback={
                        <div className="min-h-screen bg-slate-50 flex justify-center pt-32">
                            <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
                        </div>
                    }
                >
                    <MessagesContent session={session} />
                </Suspense>
            )}
        </>
    );
}
