'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAddUserPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/admins/add');
    }, [router]);

    return (
        <div className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            กำลังย้ายไปหน้า เพิ่มผู้ดูแลระบบ...
        </div>
    );
}
