'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, X, Clock, User, Briefcase, Mail, Calendar } from 'lucide-react';
import { getAuthSession } from '../../../features/auth/lib/auth';

type Registration = {
    id: string;
    role: 'worker' | 'employer';
    firstName: string;
    lastName: string;
    nickname: string;
    birthDate: string;
    email: string;
    registeredAt: string;
    status: 'pending' | 'approved' | 'rejected';
};

export default function AdminRegistrationsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const session = typeof window !== 'undefined' ? getAuthSession() : null;

    useEffect(() => {
        // ตรวจสอบว่าเป็น admin หรือไม่
        if (!session || session.role !== 'admin') {
            window.location.href = '/';
            return;
        }

        // อ่านข้อมูลลงทะเบียนจาก localStorage
        const stored = localStorage.getItem('registrations');
        if (stored) {
            const data = JSON.parse(stored);
            setRegistrations(data.sort((a: Registration, b: Registration) =>
                new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
            ));
        }
    }, [session]);

    const handleApprove = (id: string) => {
        setRegistrations(prev =>
            prev.map(reg => reg.id === id ? { ...reg, status: 'approved' } : reg)
        );
        const updated = registrations.map(reg => reg.id === id ? { ...reg, status: 'approved' } : reg);
        localStorage.setItem('registrations', JSON.stringify(updated));
    };

    const handleReject = (id: string) => {
        setRegistrations(prev =>
            prev.map(reg => reg.id === id ? { ...reg, status: 'rejected' } : reg)
        );
        const updated = registrations.map(reg => reg.id === id ? { ...reg, status: 'rejected' } : reg);
        localStorage.setItem('registrations', JSON.stringify(updated));
    };

    const filtered = registrations.filter(reg =>
        filter === 'all' ? true : reg.status === filter
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-semibold"><Clock className="h-3 w-3" /> รอตรวจสอบ</span>;
            case 'approved':
                return <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold"><Check className="h-3 w-3" /> อนุมัติ</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold"><X className="h-3 w-3" /> ปฏิเสธ</span>;
            default:
                return null;
        }
    };

    const getRoleBadge = (role: string) => {
        return role === 'worker' ?
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold"><User className="h-3 w-3" /> สมัครงาน</span> :
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-semibold"><Briefcase className="h-3 w-3" /> โพสงาน</span>;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="mx-auto max-w-6xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/dashboard" className="p-2 rounded-lg bg-white hover:bg-slate-100 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">📋 การลงทะเบียนใหม่</h1>
                        <p className="text-slate-500 mt-1">รายการคนที่ลงทะเบียนใหม่ในระบบ</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-sm border border-slate-200 w-fit">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${filter === status
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {status === 'all' ? 'ทั้งหมด' : status === 'pending' ? 'รอตรวจสอบ' : status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}
                            {' '}
                            <span className="text-xs">({registrations.filter(r => status === 'all' ? true : r.status === status).length})</span>
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-sm text-slate-600">รวมลงทะเบียน</p>
                        <p className="text-3xl font-bold text-slate-900">{registrations.length}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 shadow-sm">
                        <p className="text-sm text-yellow-700 font-semibold">รอตรวจสอบ</p>
                        <p className="text-3xl font-bold text-yellow-600">{registrations.filter(r => r.status === 'pending').length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm">
                        <p className="text-sm text-green-700 font-semibold">อนุมัติ</p>
                        <p className="text-3xl font-bold text-green-600">{registrations.filter(r => r.status === 'approved').length}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm">
                        <p className="text-sm text-red-700 font-semibold">ปฏิเสธ</p>
                        <p className="text-3xl font-bold text-red-600">{registrations.filter(r => r.status === 'rejected').length}</p>
                    </div>
                </div>

                {/* Registrations Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            ไม่มีข้อมูลลงทะเบียน
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-100 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">รหัสอ้างอิง</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">ชื่อ-นามสกุล</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">บทบาท</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">อีเมล</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">วัน/เดือน/ปีเกิด</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">ลงทะเบียนเมื่อ</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">สถานะ</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">การทำงาน</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((reg) => (
                                        <tr key={reg.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs font-semibold text-blue-600">{reg.id}</td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-slate-900">{reg.firstName} {reg.lastName}</p>
                                                    <p className="text-xs text-slate-500">{reg.nickname && `(${reg.nickname})`}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{getRoleBadge(reg.role)}</td>
                                            <td className="px-6 py-4 flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-slate-400" />
                                                <span className="text-sm text-slate-600">{reg.email}</span>
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-slate-400" />
                                                <span className="text-sm">{new Date(reg.birthDate).toLocaleDateString('th-TH')}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{formatDate(reg.registeredAt)}</td>
                                            <td className="px-6 py-4">{getStatusBadge(reg.status)}</td>
                                            <td className="px-6 py-4">
                                                {reg.status === 'pending' ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(reg.id)}
                                                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors"
                                                        >
                                                            ✓ อนุมัติ
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(reg.id)}
                                                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
                                                        >
                                                            ✕ ปฏิเสธ
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-500">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
