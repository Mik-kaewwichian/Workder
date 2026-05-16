'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { loginWithEmailPassword, setAuthSession } from '../../features/auth/lib/auth';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
            return;
        }

        setIsLoading(true);

        const session = await loginWithEmailPassword(email, password);

        if (!session) {
            setIsLoading(false);
            setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            return;
        }

        if (session.role !== 'admin') {
            setIsLoading(false);
            setError('เว็บแอดมินอนุญาตเฉพาะบัญชีผู้ดูแลระบบเท่านั้น');
            return;
        }

        setAuthSession(session);
        router.push('/admin/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white px-4">
            <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 relative">
                <div className="text-center mb-2">
                    <div onClick={() => window.location.reload()} className="inline-block cursor-pointer hover:scale-105 transition-transform">
                        <div className="flex items-center justify-center gap-2">
                            <div className="relative h-12 w-12">
                                <Image src="/images/workderLogo.png" alt="WORKDER" fill className="object-contain" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">
                                WORKDER Admin
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">อีเมล</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-sm font-medium text-slate-700">รหัสผ่าน</label>
                            <Link href="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700">ลืมรหัสผ่าน?</Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error ? <p className="text-sm text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">{error}</p> : null}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>
            </div>
        </div>
    );
}
