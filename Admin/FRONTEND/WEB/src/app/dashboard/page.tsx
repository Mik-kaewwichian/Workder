'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthSession, getAuthSession } from '../../features/auth/lib/auth';

export default function DashboardRedirect() {
    const router = useRouter();

    useEffect(() => {
        const session = getAuthSession();

        if (!session || session.role !== 'admin') {
            clearAuthSession();
            router.replace('/login');
            return;
        }

        router.replace('/admin/dashboard');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                <p className="text-slate-500 text-sm">กำลังเข้าสู่ระบบ...</p>
            </div>
        </div>
    );
}