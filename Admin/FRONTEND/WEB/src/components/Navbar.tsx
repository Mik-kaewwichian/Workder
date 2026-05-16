'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home as HomeIcon, Briefcase, ShieldCheck, Map as MapIcon, Crown, Info, ArrowRight, UserRound, Bell, Wallet, CircleHelp, Settings, ChevronDown, LogOut, X, LayoutDashboard, Users, MessageSquare, CheckCircle2 } from 'lucide-react';

import { usePathname, useRouter } from 'next/navigation';
import { clearAuthSession, getAuthSession, setAuthSession, AUTH_STORAGE_KEY, type AuthSession } from '../features/auth/lib/auth';
import { useNotifications } from '../contexts/NotificationContext';


export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [session, setSession] = useState<AuthSession | null>(null);
    const { totalUnreadCount } = useNotifications();
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'ลูกจ้าง' | 'นายจ้าง' | null>(null);
    const accountMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSession(getAuthSession());
    }, []);

    // Keep session in sync when route changes or other tabs update auth
    useEffect(() => {
        setSession(getAuthSession());
    }, [pathname]);

    useEffect(() => {
        const onStorage = (ev: StorageEvent) => {
            if (ev.key === AUTH_STORAGE_KEY || ev.key === null) {
                setSession(getAuthSession());
            }
        };

        window.addEventListener('storage', onStorage);

        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const isEmployer = session?.role === 'employer';
    const isAdmin = session?.role === 'admin';
    const canImpersonate = isAdmin || session?.originalRole === 'admin';

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!accountMenuRef.current?.contains(event.target as Node)) {
                setIsAccountMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleProtectedMenuClick = (targetPath: string) => {
        setIsAccountMenuOpen(false);

        if (!session?.profileCompleted) {
            setIsProfileModalOpen(true);
            return;
        }

        router.push(targetPath);
    };

    const userMenuItems = [
        { label: 'โปรไฟล์', icon: <UserRound className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); setIsProfileModalOpen(true); }, comingSoon: false },
        { label: 'การแจ้งเตือน', icon: <Bell className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); router.push('/notifications'); }, comingSoon: false },
        { label: 'ข้อความ', icon: <MessageSquare className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); router.push('/notifications?tab=messages'); }, comingSoon: false },
        { label: 'งานของฉัน', icon: <Briefcase className="h-4 w-4" />, onClick: () => handleProtectedMenuClick('/dashboard'), comingSoon: false },
        { label: 'About', icon: <Info className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); router.push('/about'); }, comingSoon: false },
        { label: 'MyWallet', icon: <Wallet className="h-4 w-4" />, onClick: () => handleProtectedMenuClick('/dashboard'), comingSoon: false },
        { label: 'Help', icon: <CircleHelp className="h-4 w-4" />, onClick: () => setIsAccountMenuOpen(false), comingSoon: true },
        { label: 'Setting', icon: <Settings className="h-4 w-4" />, onClick: () => setIsAccountMenuOpen(false), comingSoon: true },
        { label: 'เปลี่ยนบทบาท', icon: <Users className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); setIsRoleModalOpen(true); }, comingSoon: false },
    ];

    const adminMenuItems = [
        { label: 'โปรไฟล์', icon: <UserRound className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); setIsProfileModalOpen(true); }, comingSoon: false },
        { label: 'เพิ่มผู้ใช้งาน', icon: <Users className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); router.push('/admin/users'); }, comingSoon: false },
        { label: 'ภาพรวมระบบ', icon: <LayoutDashboard className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); router.push('/admin/dashboard'); }, comingSoon: false },
        { label: 'จัดการผู้ใช้งาน', icon: <Users className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); router.push('/admin/users'); }, comingSoon: false },
        { label: 'การแจ้งเตือน', icon: <Bell className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); router.push('/admin/notifications'); }, comingSoon: false },
        { label: 'ข้อความ', icon: <MessageSquare className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); router.push('/admin/notifications?tab=messages'); }, comingSoon: false },
        { label: 'Setting', icon: <Settings className="h-4 w-4" />, onClick: () => setIsAccountMenuOpen(false), comingSoon: true },
    ];

    const menuItems = session?.role === 'admin' ? adminMenuItems : userMenuItems;

    const handleNavigation = (path: string, sectionId?: string) => {
        if (sectionId) {
            if (pathname === '/') {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
            } else {
                router.push(`/#${sectionId}`);
            }
        } else {
            router.push(path);
        }
    };

    type NavItemType = {
        name: string;
        icon: React.ReactNode;
        href?: string;
        className?: string;
        action?: () => void;
    };

    const employerNavItems: NavItemType[] = [
        { name: 'หน้าหลัก', icon: <LayoutDashboard className="w-4 h-4" />, href: '/' },
        { name: 'ค้นหาช่าง', icon: <MapIcon className="w-4 h-4" />, href: '/employer/map' },
        { name: 'งานของฉัน', icon: <Briefcase className="w-4 h-4" />, href: '/employer/jobs' },
        { name: 'ข้อความ', icon: <MessageSquare className="w-4 h-4" />, href: '/notifications?tab=messages' },
    ];

    const employeeNavItems: NavItemType[] = [
        { name: 'หน้าหลัก', icon: <HomeIcon className="w-4 h-4" />, href: '/' },
        { name: 'หางาน', icon: <Briefcase className="w-4 h-4" />, href: '/work' },
        { name: 'Safezone', icon: <ShieldCheck className="w-4 h-4" />, href: '/safezone', className: 'text-pink-600 hover:bg-pink-50' },
        { name: 'แผนที่', icon: <MapIcon className="w-4 h-4" />, href: '/map' },
        { name: 'Premium', icon: <Crown className="w-4 h-4" />, href: '/premium', className: 'text-amber-500 hover:bg-amber-50 hover:ring-1 hover:ring-amber-200' },
    ];

    const adminNavItems: NavItemType[] = [
        { name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, href: '/admin/dashboard' },
        { name: 'Users', icon: <Users className="w-4 h-4" />, href: '/admin/users' },
        { name: 'Messages', icon: <MessageSquare className="w-4 h-4" />, href: '/admin/messages' },
    ];

    let navItems: NavItemType[] = employeeNavItems;
    if (isAdmin) navItems = adminNavItems;
    else if (isEmployer) navItems = employerNavItems;
    else if (!session) navItems = [
        { name: 'หน้าหลัก', icon: <HomeIcon className="w-4 h-4" />, href: '/' },
        { name: 'หางาน', icon: <Briefcase className="w-4 h-4" />, href: '/work' },
        { name: 'Safezone', icon: <ShieldCheck className="w-4 h-4" />, href: '/safezone', className: 'text-pink-600 hover:bg-pink-50' },
        { name: 'แผนที่', icon: <MapIcon className="w-4 h-4" />, href: '/map' },
        { name: 'Premium', icon: <Crown className="w-4 h-4" />, href: '/premium', className: 'text-amber-500 hover:bg-amber-50 hover:ring-1 hover:ring-amber-200' },
        { name: 'เกี่ยวกับเรา', icon: <Info className="w-4 h-4" />, href: '/about' },
    ];

    const isEmployerMenu = session?.role === 'employer';
    // Rename to avoid conflict if necessary, but here we just need accessible vars for the dropdown
    const employerMenuItems = [
        { label: 'โปรไฟล์', icon: <UserRound className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); setIsProfileModalOpen(true); }, comingSoon: false },
        { label: 'การแจ้งเตือน', icon: <Bell className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); router.push('/notifications'); }, comingSoon: false },
        { label: 'My Wallet', icon: <Wallet className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); router.push('/employer/wallet'); }, comingSoon: false },
        { label: 'จัดการงาน', icon: <Briefcase className="h-4 w-4" />, onClick: () => router.push('/employer/jobs'), comingSoon: false },
        { label: 'About', icon: <Info className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); router.push('/about'); }, comingSoon: false },
        { label: 'Help', icon: <CircleHelp className="h-4 w-4" />, onClick: () => setIsAccountMenuOpen(false), comingSoon: true },
        { label: 'Setting', icon: <Settings className="h-4 w-4" />, onClick: () => setIsAccountMenuOpen(false), comingSoon: true },
        { label: 'เปลี่ยนบทบาท', icon: <Users className="h-4 w-4" />, onClick: () => { setIsAccountMenuOpen(false); setIsRoleModalOpen(true); }, comingSoon: false },
    ];


    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white/60 backdrop-blur-xl transition-all duration-300">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center">
                        <div className="relative flex h-16 w-16 items-center justify-center -mr-2 -mt-2">
                            <Image src="/images/workderLogo.png" alt="WORKDER" width={64} height={64} />
                        </div>
                        <span className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">
                            {session?.role === 'admin' ? 'WORKDER Admin' : 'WORKDER'}
                        </span>
                    </Link>

                    <div className="hidden items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-white/50 backdrop-blur-md md:flex">
                        {navItems.map((item) => (
                            item.href ? (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-5 py-2 text-base font-medium rounded-full hover:shadow-sm transition-all ${item.className || 'text-slate-600 hover:text-blue-600 hover:bg-white'}`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            ) : (
                                <button
                                    key={item.name}
                                    onClick={item.action}
                                    className={`flex items-center gap-2 px-5 py-2 text-base font-medium rounded-full hover:shadow-sm transition-all ${item.className || 'text-slate-600 hover:text-blue-600 hover:bg-white'}`}
                                >
                                    {item.icon}
                                    {item.name}
                                </button>
                            )
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {session ? (
                            <>
                                <Link href={isAdmin ? "/admin/notifications" : "/notifications"} className="relative mr-2 text-slate-600 hover:text-blue-600 transition-colors">
                                    <Bell className="h-6 w-6" />
                                    {totalUnreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white animate-pulse">
                                            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                                        </span>
                                    )}
                                </Link>

                                <div className="relative" ref={accountMenuRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                                        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 hover:border-blue-300 hover:bg-blue-50 transition-all"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                                            <UserRound className="h-4 w-4" />
                                        </div>
                                        <span className="hidden md:block text-base font-semibold text-slate-700">
                                            {isEmployer ? 'นายจ้าง' : (isAdmin ? 'Admin' : 'ลูกจ้าง')}
                                        </span>
                                        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isAccountMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-1 shadow-xl">
                                            <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-base font-semibold text-slate-800">
                                                        {isEmployer ? 'ผู้ประกอบการ' : (isAdmin ? 'ผู้ดูแลระบบ' : 'ผู้หางาน')}
                                                    </p>
                                                    {session.profileCompleted && (
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full border border-green-200">
                                                            <ShieldCheck className="w-3 h-3" /> ยืนยันตัวตนแล้ว
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-500 truncate">{session.email}</p>

                                                {session.profileCompleted ? (
                                                    <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-2 text-xs font-medium text-blue-700 flex items-start gap-1.5">
                                                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                                                        <span>บัญชีนี้พร้อมใช้งาน สามารถ{isEmployer ? 'ลงประกาศงานหาคน' : 'กดรับงาน'}ได้ทันที</span>
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 bg-amber-50 border border-amber-100 rounded-lg p-2 text-xs font-medium text-amber-700 flex items-start gap-1.5">
                                                        <Info className="w-4 h-4 text-amber-600 shrink-0 -mt-0.5" />
                                                        <span>ยังไม่ได้ยืนยันตัวตน กรุณาไปที่หน้าโปรไฟล์เพื่อลงทะเบียนก่อนรับงาน</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="py-1">
                                                {(isAdmin ? adminMenuItems : (isEmployer ? employerMenuItems : userMenuItems)).map((item, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={item.onClick}
                                                        className="w-full text-left px-4 py-2 text-base text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                                                    >
                                                        {item.icon}
                                                        {item.label}
                                                        {item.comingSoon && <span className="text-[10px] text-slate-400 ml-auto">เร็วๆ นี้</span>}
                                                    </button>
                                                ))}

                                                {canImpersonate && (
                                                    <>
                                                        <div className="border-t border-slate-100 my-2"></div>
                                                        <div className="px-3 py-1">
                                                            <p className="text-xs font-semibold text-slate-400 mb-1">สลับมุมมอง (Admin)</p>
                                                            {!isAdmin && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (session) {
                                                                            const newSession: AuthSession = { ...session, role: 'admin', originalRole: undefined };
                                                                            setAuthSession(newSession);
                                                                            window.location.reload();
                                                                        }
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 text-base text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                                                                >
                                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-purple-500 text-purple-500">
                                                                        <Crown className="w-3 h-3" />
                                                                    </div>
                                                                    กลับเป็น Admin
                                                                </button>
                                                            )}
                                                            {session?.role !== 'user' && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (session) {
                                                                            const newSession: AuthSession = { ...session, role: 'user', originalRole: 'admin' };
                                                                            setAuthSession(newSession);
                                                                            window.location.reload();
                                                                        }
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 text-base text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                                                                >
                                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-blue-500 text-blue-500">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                                                    </div>
                                                                    ดูฝั่งลูกจ้าง
                                                                </button>
                                                            )}
                                                            {session?.role !== 'employer' && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (session) {
                                                                            const newSession: AuthSession = { ...session, role: 'employer', originalRole: 'admin' };
                                                                            setAuthSession(newSession);
                                                                            window.location.reload();
                                                                        }
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 text-base text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                                                                >
                                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-green-500 text-green-500">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
                                                                    </div>
                                                                    ดูฝั่งนายจ้าง
                                                                </button>
                                                            )}
                                                        </div>
                                                    </>
                                                )}

                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button
                                                    onClick={() => {
                                                        clearAuthSession();
                                                        setSession(null);
                                                        router.push('/login');
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-base text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-bold"
                                                >
                                                    <LogOut className="h-5 w-5" />
                                                    ออกจากระบบ
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="hidden text-base font-semibold text-slate-600 hover:text-blue-600 md:block">
                                    เข้าสู่ระบบ
                                </Link>
                                <Link href="/register" className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-slate-900 px-6 py-2.5 text-base font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30">
                                    <span className="relative z-10">เริ่มต้นใช้งาน</span>
                                    <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    <div className="absolute inset-0 -z-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav >
            <div className="h-16" />

            {
                isProfileModalOpen ? (
                    <div className="fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsProfileModalOpen(false)}>
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                setIsProfileModalOpen(false);
                                router.push('/profile/register');
                            }}
                            className="rounded-3xl bg-blue-600 px-16 py-6 text-2xl font-bold text-white shadow-2xl shadow-blue-500/40 hover:bg-blue-700 transition-colors"
                        >
                            ลงทะเบียน
                        </button>
                    </div>
                ) : null
            }

            {
                isRoleModalOpen ? (
                    <div className="fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsRoleModalOpen(false)}>
                        <div className="w-full max-w-md rounded-3xl border border-white/50 bg-white/95 p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-slate-900">เปลี่ยนบทบาท</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsRoleModalOpen(false)}
                                    className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 transition-colors"
                                    aria-label="close-role-modal"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <p className="text-base text-slate-600 mb-4">เลือกได้ 2 บทบาทเท่านั้น</p>

                            <div className="space-y-3">
                                {(['ลูกจ้าง', 'นายจ้าง'] as const).map((role) => {
                                    const mappedRole = role === 'นายจ้าง' ? 'employer' : 'user';
                                    const isActive = session?.role === mappedRole;

                                    return (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => {
                                                if (session) {
                                                    const newSession: AuthSession = { ...session, role: mappedRole };
                                                    setAuthSession(newSession);
                                                    window.location.reload();
                                                }
                                            }}
                                            className={`w-full rounded-xl border px-4 py-3 text-left text-base font-semibold transition-colors ${isActive
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : null
            }
        </>
    );
}
