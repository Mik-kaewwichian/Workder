'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Bell,
    MessageSquare,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { useNotifications } from '../../../contexts/NotificationContext';

export default function AdminNotificationsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tab = searchParams.get('tab');
    const [activeTab, setActiveTab] = React.useState<'messages' | 'notifications'>((tab as 'messages' | 'notifications') || 'notifications');

    const {
        channels,
        chats,
        markNotificationAsRead,
        markChatAsRead,
        markAllAsRead,
        unreadNotificationsCount,
        unreadMessagesCount
    } = useNotifications();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="h-6 w-6 text-slate-700" />
                        ศูนย์ข้อความ (ผู้ดูแลระบบ)
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">จัดการข้อความและการแจ้งเตือนระบบ</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={markAllAsRead}
                        className="text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl transition-colors shadow-sm"
                    >
                        อ่านทั้งหมด
                    </button>
                    <button
                        onClick={() => router.push('/admin/dashboard')}
                        className="text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        กลับสู่หน้าหลัก
                    </button>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-white border border-slate-200 shadow-sm rounded-xl">
                <button
                    onClick={() => setActiveTab('messages')}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'messages'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                >
                    <MessageSquare className="h-4 w-4" />
                    ข้อความระบบ
                    {unreadMessagesCount > 0 && (
                        <span className="inline-flex items-center justify-center bg-blue-600 text-white text-[10px] h-5 w-5 rounded-full shadow-sm">
                            {unreadMessagesCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'notifications'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                >
                    <Bell className="h-4 w-4" />
                    การแจ้งเตือนระบบ
                    {unreadNotificationsCount > 0 && (
                        <span className="inline-flex items-center justify-center bg-red-500 text-white text-[10px] h-5 w-5 rounded-full shadow-sm">
                            {unreadNotificationsCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {activeTab === 'notifications' ? (
                    <div className="divide-y divide-slate-100">
                        {channels.map((channel) => (
                            <div
                                key={channel.id}
                                onClick={() => markNotificationAsRead(channel.id)}
                                className={`block transition-colors cursor-pointer ${channel.unreadCount > 0 ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}
                            >
                                <div className="p-4 sm:p-5 flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${channel.color} flex items-center justify-center shadow-sm relative`}>
                                        {channel.icon}
                                        {channel.unreadCount > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                                {channel.unreadCount}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`text-base truncate pr-2 ${channel.unreadCount > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                                {channel.name}
                                            </h3>
                                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full flex-shrink-0">
                                                {channel.timestamp}
                                            </span>
                                        </div>

                                        <p className={`text-sm mb-1 truncate ${channel.unreadCount > 0 ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                            {channel.lastMessage}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 self-center">
                                        <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                                            <ChevronRight className="h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {channels.length === 0 && (
                            <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center">
                                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                    <Bell className="h-8 w-8 text-slate-300" />
                                </div>
                                <p className="font-semibold text-slate-600">ยังไม่มีการแจ้งเตือนระดับระบบ</p>
                                <p className="mt-1 text-xs">การแจ้งเตือนเกี่ยวกับการผู้ใช้งาน แจ้งปัญหา จะแสดงที่นี่</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Messages / Chats Tab Content */
                    <div className="divide-y divide-slate-100">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => markChatAsRead(chat.id)}
                                className={`flex items-start gap-4 p-4 sm:p-5 transition-colors cursor-pointer ${chat.unread > 0 ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'}`}
                            >
                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${chat.avatar} flex items-center justify-center font-bold text-lg relative border border-white shadow-sm`}>
                                    {chat.name.charAt(0)}
                                    {chat.unread > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`text-base truncate ${chat.unread > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                            {chat.name}
                                        </h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${chat.unread > 0 ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-slate-100 text-slate-500 font-medium'}`}>
                                            {chat.time}
                                        </span>
                                    </div>
                                    <p className={`text-sm truncate ${chat.unread > 0 ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                        {chat.message}
                                    </p>
                                </div>
                                {chat.unread > 0 && (
                                    <span className="self-center h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-md shadow-blue-500/30">
                                        {chat.unread}
                                    </span>
                                )}
                            </div>
                        ))}
                        {chats.length === 0 && (
                            <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center">
                                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                    <MessageSquare className="h-8 w-8 text-slate-300" />
                                </div>
                                <p className="font-semibold text-slate-600">ยังไม่มีข้อความส่งถึงผู้ดูแลระบบ</p>
                                <p className="mt-1 text-xs">ข้อความติดต่อสอบถามจากผู้ใช้งานจะแสดงที่นี่</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="text-center pt-4">
                <p className="text-xs font-semibold text-slate-400 bg-slate-100 inline-block px-3 py-1.5 rounded-lg border border-slate-200">
                    ข้อมูลแจ้งเตือนและข้อความในฐานะผู้ดูแลระบบ จะถูกเก็บถาวรในฐานข้อมูลเพื่อการตรวจสอบ
                </p>
            </div>
        </div>
    );
}
