'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import {
    Bell, MessageSquare, ChevronRight, Briefcase, CheckCircle2, XCircle,
} from 'lucide-react';
import { useNotifications, type Notification } from '../../contexts/NotificationContext';

export default function NotificationsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 pt-20" />}>
            <NotificationsPageContent />
        </Suspense>
    );
}

// Icon + colour per notification type
function notificationVisual(type: string) {
    switch (type) {
        case 'application_received':
            return { icon: <Briefcase className="h-5 w-5 text-white" />, color: 'bg-blue-500' };
        case 'application_accepted':
            return { icon: <CheckCircle2 className="h-5 w-5 text-white" />, color: 'bg-green-500' };
        case 'application_rejected':
            return { icon: <XCircle className="h-5 w-5 text-white" />, color: 'bg-rose-500' };
        default:
            return { icon: <Bell className="h-5 w-5 text-white" />, color: 'bg-slate-500' };
    }
}

function formatTime(iso: string) {
    const d = new Date(iso);
    const now = Date.now();
    const diffMin = Math.floor((now - d.getTime()) / 60_000);
    if (diffMin < 1) return 'เมื่อสักครู่';
    if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH} ชั่วโมงที่แล้ว`;
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
}

function NotificationRow({ n, onRead }: { n: Notification; onRead: (id: number) => void }) {
    const { icon, color } = notificationVisual(n.type);
    const isUnread = !n.readAt;
    const Inner = (
        <div className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${isUnread ? 'bg-blue-50/40' : 'hover:bg-slate-50'}`}>
            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${color} flex items-center justify-center shadow-sm relative`}>
                {icon}
                {isUnread && (
                    <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h3 className={`text-base truncate ${isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {n.title}
                    </h3>
                    <span className="text-xs text-slate-500 flex-shrink-0">{formatTime(n.createdAt)}</span>
                </div>
                <p className={`text-sm line-clamp-2 ${isUnread ? 'text-slate-800' : 'text-slate-500'}`}>{n.body}</p>
            </div>
            {n.link && <ChevronRight className="h-4 w-4 text-slate-300 self-center flex-shrink-0" />}
        </div>
    );
    if (n.link) {
        return (
            <Link href={n.link} onClick={() => onRead(n.id)} className="block">
                {Inner}
            </Link>
        );
    }
    return (
        <button type="button" onClick={() => onRead(n.id)} className="block w-full text-left">
            {Inner}
        </button>
    );
}

function NotificationsPageContent() {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');
    const [activeTab, setActiveTab] = React.useState<'messages' | 'notifications'>((tab as 'messages' | 'notifications') || 'notifications');

    const {
        notifications,
        chats,
        markNotificationAsRead,
        markChatAsRead,
        markAllAsRead,
        unreadNotificationsCount,
        unreadMessagesCount,
    } = useNotifications();

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-20 pb-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <MessageSquare className="h-6 w-6 text-slate-700" />
                            ศูนย์ข้อความ
                        </h1>
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            อ่านทั้งหมด
                        </button>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex p-1 bg-slate-200 rounded-xl mb-6">
                        <button
                            onClick={() => setActiveTab('messages')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'messages'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            ข้อความ
                            {unreadMessagesCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center bg-blue-600 text-white text-[10px] h-4 w-4 rounded-full">
                                    {unreadMessagesCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'notifications'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            การแจ้งเตือน
                            {unreadNotificationsCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center bg-red-500 text-white text-[10px] h-4 w-4 rounded-full">
                                    {unreadNotificationsCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        {activeTab === 'notifications' ? (
                            <div className="divide-y divide-slate-100">
                                {notifications.map((n) => (
                                    <NotificationRow key={n.id} n={n} onRead={markNotificationAsRead} />
                                ))}
                                {notifications.length === 0 && (
                                    <div className="p-8 text-center text-slate-400 text-sm">
                                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        ยังไม่มีการแจ้งเตือน
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Messages / Chats Tab Content — stub data */
                            <div className="divide-y divide-slate-100">
                                {chats.map((chat) => (
                                    <Link
                                        key={chat.id}
                                        href={`/notifications/chat/${chat.id}`}
                                        onClick={() => markChatAsRead(chat.id)}
                                        className={`flex items-start gap-4 p-4 sm:p-5 transition-colors ${chat.unread > 0 ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${chat.avatar} flex items-center justify-center font-bold text-lg relative`}>
                                            {chat.name.charAt(0)}
                                            {chat.unread > 0 && (
                                                <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`text-base truncate ${chat.unread > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                                    {chat.name}
                                                </h3>
                                                <span className={`text-xs ${chat.unread > 0 ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                                                    {chat.time}
                                                </span>
                                            </div>
                                            <p className={`text-sm truncate ${chat.unread > 0 ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                                                {chat.message}
                                            </p>
                                        </div>
                                        {chat.unread > 0 && (
                                            <span className="self-center h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                                {chat.unread}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                                {chats.length === 0 && (
                                    <div className="p-8 text-center text-slate-400 text-sm">
                                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        ยังไม่มีข้อความ
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-400">
                            การแจ้งเตือนจะถูกเก็บไว้เป็นเวลา 30 วัน
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
