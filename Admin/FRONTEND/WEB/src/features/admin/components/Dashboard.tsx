'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Users,
    Briefcase,
    DollarSign,
    TrendingUp,
    Activity,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    MoreHorizontal
} from 'lucide-react';
import { getAuthSession } from '@/features/auth/lib/auth';
import { getJobs } from '@/features/jobs/lib/jobs';
import AnalyticsChart from './AnalyticsChart';

type Registration = {
    id: string;
    role: 'worker' | 'employer';
    firstName: string;
    lastName: string;
    email: string;
    registeredAt: string;
    status: 'pending' | 'approved' | 'rejected';
};

export default function AdminDashboard() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    });
    const [finances, setFinances] = useState({
        income: 0,
        expense: 0,
        incomeChange: 0,
        expenseChange: 0,
    });

    useEffect(() => {
        const session = getAuthSession();
        if (!session || session.role !== 'admin') {
            return;
        }

        const stored = localStorage.getItem('registrations');
        let regData = [];
        if (stored) {
            regData = JSON.parse(stored);
            setRegistrations(regData.slice(0, 4)); // Show only last 4
            setStats({
                total: regData.length,
                pending: regData.filter((r: Registration) => r.status === 'pending').length,
                approved: regData.filter((r: Registration) => r.status === 'approved').length,
                rejected: regData.filter((r: Registration) => r.status === 'rejected').length,
            });
        }

        // Calculate dynamic finances based on actual platform usage
        const jobs = getJobs();
        const employersCount = regData.filter((r: Registration) => r.role === 'employer').length;
        const workersCount = regData.filter((r: Registration) => r.role === 'worker').length;

        // Since the app has not launched yet, there are no real transactions.
        const calculatedIncome = 0;
        const calculatedExpense = 0;

        // Fluctuations based on today's date so it changes but stays stable for the day
        const incomeFluctuation = 0;
        const expenseFluctuation = 0;

        setFinances({
            income: calculatedIncome,
            expense: calculatedExpense,
            incomeChange: incomeFluctuation,
            expenseChange: expenseFluctuation,
        });
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="pb-12">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">📊 Dashboard Overview</h1>
                        <p className="text-slate-500 mt-1">จัดการระบบและมอนิเตอร์ลงทะเบียนใหม่</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/admin/registrations" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20">
                            ดูรายละเอียดลงทะเบียน
                        </Link>
                    </div>
                </div>

                {/* Financial Overview (Today) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg shadow-green-500/30 text-white flex flex-col justify-between">
                        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10" />
                        <div className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-white/10" />
                        <div className="relative flex items-center justify-between mb-2">
                            <span className="text-emerald-50 text-base font-semibold">รายได้ (วันนี้)</span>
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-sm">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="relative flex items-end justify-between">
                            <div>
                                <h3 className="text-4xl font-bold">฿{finances.income.toLocaleString()}</h3>
                                <p className="text-[10px] text-emerald-100 mt-1 max-w-[200px] leading-tight opacity-80">
                                    รายได้จากค่าธรรมเนียมงาน 10-30%, โซนปลอดภัย (Safezone) และ พรีเมียม (Premium)
                                </p>
                            </div>
                            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full whitespace-nowrap mb-1">
                                รอเปิดให้บริการ
                            </span>
                        </div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-2xl shadow-lg shadow-red-500/30 text-white flex flex-col justify-between">
                        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10" />
                        <div className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-white/10" />
                        <div className="relative flex items-center justify-between mb-2">
                            <span className="text-rose-50 text-base font-semibold">รายจ่าย (วันนี้)</span>
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-sm">
                                <DollarSign className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="relative flex items-end justify-between mt-auto">
                            <h3 className="text-4xl font-bold">฿{finances.expense.toLocaleString()}</h3>
                            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full whitespace-nowrap mb-1">
                                รอเปิดให้บริการ
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Analytics Chart */}
                <AnalyticsChart />

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: 'รวมลงทะเบียน', value: String(stats.total), icon: <Users className="h-6 w-6 text-blue-600" />, color: 'bg-blue-50' },
                        { title: 'รอตรวจสอบ', value: String(stats.pending), icon: <AlertCircle className="h-6 w-6 text-yellow-600" />, color: 'bg-yellow-50' },
                        { title: 'อนุมัติแล้ว', value: String(stats.approved), icon: <CheckCircle2 className="h-6 w-6 text-green-600" />, color: 'bg-green-50' },
                        { title: 'ปฏิเสธ', value: String(stats.rejected), icon: <Activity className="h-6 w-6 text-red-600" />, color: 'bg-red-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.color}`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Recent Registration Activity Feed */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">📋 ลงทะเบียนล่าสุด</h2>
                            <Link href="/admin/registrations" className="text-sm text-blue-600 font-medium hover:underline">ดูทั้งหมด</Link>
                        </div>
                        {registrations.length === 0 ? (
                            <p className="text-slate-500 text-center py-8">ยังไม่มีการลงทะเบียน</p>
                        ) : (
                            <div className="space-y-4">
                                {registrations.map((reg) => (
                                    <div key={reg.id} className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                                        <div className={`mt-1 p-2 rounded-full ${reg.role === 'worker' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                            {reg.role === 'worker' ? <Users className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-slate-900">{reg.firstName} {reg.lastName}</h4>
                                            <p className="text-xs text-slate-500">{reg.email}</p>
                                            <p className="text-xs text-slate-400 mt-1">{reg.role === 'worker' ? '👤 สมัครงาน' : '💼 โพสงาน'}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${reg.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                reg.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {reg.status === 'pending' ? 'รอตรวจสอบ' : reg.status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}
                                            </span>
                                            <span className="text-xs text-slate-400 mt-1">{formatDate(reg.registeredAt)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions & Status */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-blue-200" />
                                สถานะระบบ
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-blue-100">ฐานข้อมูล</span>
                                        <span className="text-green-200 font-semibold">✓ ทำงาน</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-blue-100">API</span>
                                        <span className="text-green-200 font-semibold">✓ ทำงาน</span>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-blue-500">
                                    <p className="text-xs text-blue-100">ระบบออนไลน์และพร้อมใช้งาน</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <h3 className="font-bold text-slate-900 mb-4">🔗 ลิงก์ด่วน</h3>
                            <div className="space-y-2">
                                <Link href="/admin/registrations" className="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 text-slate-700 text-sm font-medium transition-colors">
                                    <Users className="h-4 w-4 text-blue-500" />
                                    <span>ดูรายการลงทะเบียน</span>
                                </Link>
                                <button className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors text-left">
                                    <Activity className="h-4 w-4 text-slate-500" />
                                    <span>รายงานระบบ</span>
                                </button>
                                <button className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors text-left">
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                    <span>การแจ้งเตือน</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

