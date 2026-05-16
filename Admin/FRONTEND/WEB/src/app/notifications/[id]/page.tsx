'use client';

import React from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import {
    ArrowLeft,
    Gift,
    Megaphone,
    CreditCard,
    Zap,
    Clock,
    MoreVertical
} from 'lucide-react';

type ChannelDetails = {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
};

const channelMap: Record<string, ChannelDetails> = {
    'promotions': {
        id: 'promotions',
        name: 'โปรโมชั่นจาก WORKDER',
        icon: <Gift className="h-5 w-5 text-white" />,
        color: 'bg-orange-500'
    },
    'updates': {
        id: 'updates',
        name: 'อัปเดตจากระบบ',
        icon: <Megaphone className="h-5 w-5 text-white" />,
        color: 'bg-blue-500'
    },
    'payments': {
        id: 'payments',
        name: 'รายการชำระเงิน',
        icon: <CreditCard className="h-5 w-5 text-white" />,
        color: 'bg-green-500'
    },
    'activity': {
        id: 'activity',
        name: 'กิจกรรมของคุณ',
        icon: <Zap className="h-5 w-5 text-white" />,
        color: 'bg-purple-500'
    }
};

const messages = [
    {
        id: 1,
        title: 'ลด 50% ค่าธรรมเนียมสำหรับงานแรกของคุณ!',
        body: 'ใช้โค้ด WELCOME50 รับส่วนลดค่าธรรมเนียมทันทีสำหรับการจ้างงานหรือรับงานครั้งแรกของคุณ โปรโมชั่นนี้ใช้ได้ถึงสิ้นเดือนนี้เท่านั้น อย่าพลาดโอกาสดีๆ แบบนี้!',
        timestamp: '10:30 วันนี้',
        isRead: false,
        image: null
    },
    {
        id: 2,
        title: 'แนะนำเพื่อนรับ 500฿',
        body: 'ชวนเพื่อนมาสมัครและทำงานครบ 3 งาน รับโบนัสทันทีคนละ 500 บาท ยิ่งชวนมากยิ่งได้มาก!',
        timestamp: 'เมื่อวาน 14:20',
        isRead: true,
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=500' // Placeholder
    },
    {
        id: 3,
        title: 'Flash Deal: Boost Post งานคนสวนเพียง 99฿',
        body: 'โปรโมทงานของคุณให้เห็นมากขึ้น 5 เท่า เพียง 99 บาท จากปกติ 299 บาท เฉพาะวันนี้เวลา 18:00 - 21:00 น.',
        timestamp: '2 วันที่แล้ว',
        isRead: true,
        image: null
    }
];

export default function NotificationChannelPage() {
    const params = useParams<{ id: string }>();
    const channel = channelMap[params.id];

    if (!channel) {
        return notFound();
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-20 pb-12">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="sticky top-16 z-10 bg-slate-50/80 backdrop-blur-md px-4 py-4 sm:px-6 mb-2 flex items-center gap-4 border-b border-slate-200/50">
                        <Link href="/notifications" className="p-2 -ml-2 rounded-full hover:bg-white hover:shadow-sm text-slate-500 hover:text-slate-700 transition-all">
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                        <div className={`w-10 h-10 rounded-full ${channel.color} flex items-center justify-center shadow-sm`}>
                            {channel.icon}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-lg font-bold text-slate-900">{channel.name}</h1>
                        </div>
                        <button className="p-2 rounded-full hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-600">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages List */}
                    <div className="px-4 sm:px-6 space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`bg-white rounded-xl p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md ${!msg.isRead ? 'ring-1 ring-blue-100 bg-blue-50/30' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`text-base ${!msg.isRead ? 'font-bold text-blue-900' : 'font-semibold text-slate-900'}`}>
                                        {msg.title}
                                    </h3>
                                    {!msg.isRead && (
                                        <span className="h-2 w-2 rounded-full bg-red-500 mt-2"></span>
                                    )}
                                </div>

                                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                    {msg.body}
                                </p>

                                {msg.image && (
                                    <div className="mb-3 rounded-lg overflow-hidden h-40 w-full relative bg-slate-100">
                                        {/* Using a div placeholder for images to avoid Next.js Image config issues for external URLs in this demo */}
                                        <div className="absolute inset-0 bg-cover bg-center opacity-90 hover:opacity-100 transition-opacity" style={{ backgroundImage: `url(${msg.image})` }} />
                                    </div>
                                )}

                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <Clock className="h-3 w-3" />
                                    {msg.timestamp}
                                </div>
                            </div>
                        ))}

                        <div className="text-center pt-8 pb-4 text-xs text-slate-400">
                            สิ้นสุดการแจ้งเตือน
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
