'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    UserPlus,
    MessageSquare,
    Settings,
    LogOut,
    Bell,
    ChevronRight,
    ChevronDown,
    Menu,
    X,
    UserRound,
    Eye,
    ShieldCheck,
} from 'lucide-react';
import api from '@/lib/api';
import { clearAuthSession, getAuthSession, type AuthSession } from '../../auth/lib/auth';
import { buildUserAppUrl } from '@/lib/app-urls';

type SidebarItem = {
    label: string;
    labelTh: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    activePath?: string;
    matchMode?: 'exact' | 'prefix';
    comingSoon?: boolean;
};

type AdminListItem = {
    id: number;
    email?: string | null;
    role: 'admin' | 'user' | 'employer';
    firstName?: string | null;
    lastName?: string | null;
    workStatus?: string | null;
    roleRank?: number | null;
};

const sidebarItems: SidebarItem[] = [
    {
        label: 'Dashboard',
        labelTh: 'ภาพรวมระบบ',
        icon: LayoutDashboard,
        href: '/admin/dashboard',
        matchMode: 'exact',
    },
    {
        label: 'Add Admins',
        labelTh: 'จัดการผู้ดูแลระบบ',
        icon: UserPlus,
        href: '/admin/admins',
        matchMode: 'exact',
    },
    {
        label: 'Admins',
        labelTh: 'จัดการข้อมูลลูกค้า',
        icon: Users,
        href: '/admin/customers',
        matchMode: 'exact',
    },
    {
        label: 'Messages',
        labelTh: 'ข้อความ',
        icon: MessageSquare,
        href: '/admin/notifications?tab=messages',
        activePath: '/admin/notifications',
        matchMode: 'exact',
    },
    {
        label: 'Settings',
        labelTh: 'ตั้งค่าระบบ',
        icon: Settings,
        href: '/admin/settings',
        matchMode: 'exact',
        comingSoon: true,
    },
];

const getRoleRankLabel = (roleRank?: number | null) => {
    if (roleRank === 1) return 'ผู้จัดการ/ผู้บริหาร';
    if (roleRank === 2) return 'ผู้ช่วย';
    if (roleRank === 3) return 'แอดมินทั่วไป';
    return 'ไม่ระบุ';
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [session, setSession] = useState<AuthSession | null>(null);
    const [isSessionResolved, setIsSessionResolved] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);
    const [adminMembers, setAdminMembers] = useState<AdminListItem[]>([]);
    const adminMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const s = getAuthSession();
        if (!s || s.role !== 'admin') {
            clearAuthSession();
            setIsSessionResolved(true);
            router.replace('/login');
            return;
        }
        setSession(s);
        setIsSessionResolved(true);
    }, [router]);

    useEffect(() => {
        const fetchAdminMembers = async () => {
            try {
                const { data } = await api.get<AdminListItem[]>('/users');
                const admins = (Array.isArray(data) ? data : [])
                    .filter((item) => item.role === 'admin')
                    .sort((left, right) => (left.roleRank ?? 999) - (right.roleRank ?? 999));
                setAdminMembers(admins);
            } catch {
                setAdminMembers([]);
            }
        };

        if (session?.role === 'admin' && Boolean(session.managerCode?.trim())) {
            fetchAdminMembers();
        }
    }, [session?.role, session?.managerCode]);

    const getStatusBadgeClasses = (status: string) => {
        const normalizedStatus = status.trim().toLowerCase();

        if (normalizedStatus === 'leave' || normalizedStatus === 'ลา') {
            return 'bg-amber-500/15 text-amber-300';
        }

        if (normalizedStatus === 'absent' || normalizedStatus === 'ขาด') {
            return 'bg-red-500/15 text-red-300';
        }

        return 'bg-emerald-500/15 text-emerald-300';
    };

    const getStatusLabel = (status?: string | null) => {
        const normalizedStatus = (status ?? '').trim().toLowerCase();

        if (normalizedStatus === 'leave' || normalizedStatus === 'ลา') {
            return 'ลา';
        }

        if (normalizedStatus === 'absent' || normalizedStatus === 'ขาด') {
            return 'ขาด';
        }

        return 'ทำงาน';
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!adminMenuRef.current?.contains(event.target as Node)) {
                setAdminMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const handleLogout = () => {
        clearAuthSession();
        router.push('/login');
    };

    const handleSwitchToUser = () => {
        window.location.assign(buildUserAppUrl('/work'));
    };

    const handleSwitchToEmployer = () => {
        window.location.assign(buildUserAppUrl('/employer/dashboard'));
    };

    const isSidebarItemActive = (item: SidebarItem) => {
        const currentPath = pathname ?? '';
        const activePath = item.activePath ?? item.href.split('?')[0];

        if (item.matchMode === 'prefix') {
            return currentPath === activePath || currentPath.startsWith(`${activePath}/`);
        }

        return currentPath === activePath;
    };

    // Derive page title from pathname
    const currentPage = sidebarItems.find((item) => isSidebarItemActive(item));
    const pageTitle = currentPage?.labelTh ?? 'Admin';

    if (!isSessionResolved) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-sm">
                    กำลังโหลดข้อมูลผู้ดูแลระบบ...
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-sm">
                    กำลังย้ายไปหน้าเข้าสู่ระบบ...
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-100">
            {/* ─── Mobile overlay ─── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ─── Sidebar ─── */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col
                    bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
                    transition-transform duration-300 ease-in-out
                    lg:static lg:translate-x-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Logo area */}
                <div className="flex h-[72px] items-center gap-3 border-b border-white/10 px-6">
                    <div className="relative flex h-10 w-10 items-center justify-center">
                        <Image src="/images/workderLogo.png" alt="WORKDER" width={40} height={40} className="drop-shadow-lg" />
                    </div>
                    <div>
                        <span className="text-lg font-bold tracking-tight text-white">WORKDER</span>
                        <span className="ml-1.5 text-[11px] font-semibold uppercase tracking-widest text-blue-400">Admin</span>
                    </div>
                    {/* Mobile close button */}
                    <button
                        className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        เมนูหลัก
                    </p>
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isSidebarItemActive(item);

                        return (
                            <Link
                                key={item.href}
                                href={item.comingSoon ? '#' : item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                                    ${isActive
                                        ? 'bg-blue-600/20 text-blue-400 shadow-sm shadow-blue-500/10'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }
                                    ${item.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>
                                <span>{item.labelTh}</span>
                                {isActive && (
                                    <ChevronRight className="ml-auto h-4 w-4 text-blue-400" />
                                )}
                                {item.comingSoon && (
                                    <span className="ml-auto rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                                        เร็วๆ นี้
                                    </span>
                                )}
                            </Link>
                        );
                    })}

                    {session.role === 'admin' && Boolean(session.managerCode?.trim()) ? (
                        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">ทีมแอดมิน</p>
                            <div className="space-y-2">
                                {adminMembers.length === 0 ? (
                                    <p className="text-xs text-slate-500">ยังไม่มีรายชื่อผู้ดูแลระบบ</p>
                                ) : (
                                    adminMembers.map((member) => {
                                        const displayName = `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim() || member.email || `Admin #${member.id}`;
                                        const statusLabel = getStatusLabel(member.workStatus);

                                        return (
                                            <div key={member.id} className="rounded-lg border border-white/10 bg-slate-900/40 px-2.5 py-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="truncate text-xs font-semibold text-white">{displayName}</p>
                                                    <span className="shrink-0 text-[10px] font-bold text-blue-300">ลำดับ {member.roleRank ?? '-'} {getRoleRankLabel(member.roleRank)}</span>
                                                </div>
                                                <div className="mt-1 flex items-center justify-between gap-2">
                                                    <p className="truncate text-[10px] text-slate-400">{member.email ?? '-'}</p>
                                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusBadgeClasses(statusLabel)}`}>
                                                        {statusLabel}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ) : null}
                </nav>

                {/* Bottom section — user info + logout */}
                <div className="border-t border-white/10 p-4">
                    <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white shadow-md">
                            {session.email?.charAt(0).toUpperCase() ?? 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">
                                {session.name ?? 'Admin'}
                            </p>
                            <p className="truncate text-xs text-slate-400">{session.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                        <LogOut className="h-4 w-4" />
                        ออกจากระบบ
                    </button>
                </div>
            </aside>

            {/* ─── Main area ─── */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu toggle */}
                        <button
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">{pageTitle}</h1>
                            <p className="text-xs text-slate-400">ระบบจัดการ WORKDER</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Notification bell */}
                        <Link href="/admin/notifications" className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700">
                            <Bell className="h-5 w-5" />
                        </Link>

                        {/* Admin avatar dropdown */}
                        <div className="relative" ref={adminMenuRef}>
                            <button
                                onClick={() => setAdminMenuOpen((prev) => !prev)}
                                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-2 py-1.5 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shadow-sm"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                                    W
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-bold text-slate-800 leading-tight">
                                        Admin
                                    </p>
                                    <p className="text-[11px] font-medium text-slate-500 leading-tight">ผู้ดูแลระบบ</p>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {adminMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50">
                                    {/* Header */}
                                    <div className="px-3 pt-2 pb-3 border-b border-slate-100/80 mb-2">
                                        <p className="text-[15px] font-bold text-slate-800">ผู้ดูแลระบบ</p>
                                        <p className="text-xs font-semibold text-slate-500 truncate">{session.email}</p>
                                    </div>

                                    {/* Menu items */}
                                    <div className="py-1 space-y-1">
                                        <button
                                            onClick={() => { setAdminMenuOpen(false); }}
                                            className="w-full text-left px-3 py-2 text-[14px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                                        >
                                            <UserRound className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                                            โปรไฟล์
                                        </button>
                                        <button
                                            onClick={() => { setAdminMenuOpen(false); router.push('/admin/dashboard'); }}
                                            className="w-full text-left px-3 py-2 text-[14px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                                        >
                                            <LayoutDashboard className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                                            ภาพรวมระบบ
                                        </button>
                                        <button
                                            onClick={() => { setAdminMenuOpen(false); router.push('/admin/admins'); }}
                                            className="w-full text-left px-3 py-2 text-[14px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                                        >
                                            <Users className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                                            จัดการข้อมูลลูกค้า
                                        </button>
                                        <button
                                            onClick={() => { setAdminMenuOpen(false); router.push('/admin/admins/add'); }}
                                            className="w-full text-left px-3 py-2 text-[14px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                                        >
                                            <UserPlus className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                                            เพิ่มผู้ดูแลระบบ
                                        </button>
                                        <button
                                            onClick={() => { setAdminMenuOpen(false); router.push('/admin/messages'); }}
                                            className="w-full text-left px-3 py-2 text-[14px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                                        >
                                            <MessageSquare className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                                            ข้อความ
                                        </button>
                                        <button
                                            onClick={() => { setAdminMenuOpen(false); }}
                                            className="w-full text-left px-3 py-2 text-[14px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                                        >
                                            <Settings className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                                            ตั้งค่าระบบ
                                            <span className="ml-auto text-[10px] font-bold text-slate-400">เร็วๆ นี้</span>
                                        </button>
                                    </div>

                                    {/* Switch role section */}
                                    <div className="border-t border-slate-100/80 my-2 pt-2">
                                        <p className="px-3 pb-2 text-[11px] font-bold text-slate-400">สลับมุมมอง</p>
                                        <div className="space-y-1 gap-1 flex flex-col items-start px-2 w-full">
                                            <button
                                                onClick={() => { setAdminMenuOpen(false); handleSwitchToUser(); }}
                                                className="w-full text-left px-2 py-1.5 text-[14px] font-bold text-slate-700 hover:bg-blue-50/50 rounded-lg flex items-center gap-3 transition-colors"
                                            >
                                                <div className="flex items-center justify-center p-0.5 rounded-full border-[1.5px] border-blue-500 text-blue-500">
                                                    <Eye className="h-3 w-3" strokeWidth={2.5} />
                                                </div>
                                                ดูฝั่งลูกจ้าง
                                            </button>
                                            <button
                                                onClick={() => { setAdminMenuOpen(false); handleSwitchToEmployer(); }}
                                                className="w-full text-left px-2 py-1.5 text-[14px] font-bold text-slate-700 hover:bg-green-50/50 rounded-lg flex items-center gap-3 transition-colors"
                                            >
                                                <div className="flex items-center justify-center p-0.5 rounded-full border-[1.5px] border-green-500 text-green-500">
                                                    <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
                                                </div>
                                                ดูฝั่งนายจ้าง
                                            </button>
                                        </div>
                                    </div>

                                    {/* Logout */}
                                    <div className="border-t border-slate-100/80 my-2 pt-2">
                                        <button
                                            onClick={() => { setAdminMenuOpen(false); handleLogout(); }}
                                            className="w-full text-left px-3 py-2.5 text-[14px] font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" strokeWidth={2} />
                                            ออกจากระบบ
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
