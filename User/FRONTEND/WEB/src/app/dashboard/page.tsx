'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthSession } from '@/features/auth/lib/auth';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const session = getAuthSession();

        if (session?.role === 'employer') {
            router.replace('/employer/dashboard');
            return;
        }

        router.replace('/work');
    }, [router]);

    return <div className="min-h-screen bg-slate-50" />;
}