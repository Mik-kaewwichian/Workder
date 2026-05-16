'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Lock, Mail, Facebook, Chrome, Smartphone, Star, TrendingUp, Bell } from 'lucide-react';
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
        setIsLoading(true);

        const session = await loginWithEmailPassword(email, password);

        if (!session) {
            setIsLoading(false);
            setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            return;
        }

        setAuthSession(session);

        if (session.role === 'employer') {
            router.push('/employer/dashboard');
        } else {
            router.push('/dashboard');
        }
    };

    const handleGoBack = () => {
        if (window.history.length > 1) {
            router.back();
            return;
        }

        router.push('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
            {/* Background Decorations & Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-100/40 blur-3xl animate-pulse delay-1000"></div>

                {/* Floating Card: Income */}
                <div className="absolute top-20 left-[10%] bg-white p-4 rounded-2xl shadow-xl shadow-blue-100 animate-float hidden md:block border border-blue-50 pointer-events-auto cursor-default hover:scale-110 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">รายได้วันนี้</p>
                            <p className="font-bold text-slate-900">+฿1,500.00</p>
                        </div>
                    </div>
                </div>

                {/* Floating Card: New Job */}
                <div className="absolute bottom-32 right-[15%] bg-white p-4 rounded-2xl shadow-xl shadow-purple-100 animate-float delay-700 hidden md:block border border-purple-50 pointer-events-auto cursor-default hover:scale-110 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg relative">
                            <Bell className="h-6 w-6 text-purple-600" />
                            <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">มีงานใหม่เข้ามา!</p>
                            <p className="text-xs text-slate-500">UX/UI Designer needed...</p>
                        </div>
                    </div>
                </div>

                {/* Floating Card: Review */}
                <div className="absolute top-1/2 left-[5%] transform -translate-y-1/2 bg-white p-3 rounded-2xl shadow-xl shadow-amber-100 animate-float delay-500 hidden lg:block border border-amber-50 pointer-events-auto cursor-default hover:scale-110 transition-transform duration-300">
                    <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                    </div>
                    <p className="text-xs font-medium text-slate-700">"บริการดีมาก งานไวสุดๆ"</p>
                </div>

                {/* Floating Card: Skill Badge (New) */}
                <div className="absolute top-32 right-[8%] bg-white p-3 rounded-2xl shadow-xl shadow-indigo-100 animate-float delay-200 hidden lg:block border border-indigo-50 pointer-events-auto cursor-default hover:scale-110 transition-transform duration-300">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-100 p-1.5 rounded-lg">
                            <Chrome className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">Python Expert</p>
                            <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">Passed</span>
                        </div>
                    </div>
                </div>

                {/* Floating Card: Message (New) */}
                <div className="absolute bottom-20 left-[20%] bg-white p-3 pl-4 pr-6 rounded-2xl shadow-xl shadow-pink-100 animate-float delay-1000 hidden md:block border border-pink-50 pointer-events-auto cursor-default hover:scale-110 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-xs font-bold text-pink-500">SJ</div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">Sarah J.</p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[100px]">สนใจจ้างงานคุณค่ะ...</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/50 relative z-10 mx-4">
                <button
                    type="button"
                    onClick={handleGoBack}
                    className="absolute top-8 left-8 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600"
                    aria-label="ย้อนกลับ"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4 hover:scale-105 transition-transform">
                        <div className="flex items-center justify-center gap-2">
                            <div className="relative h-12 w-12">
                                <Image src="/images/workderLogo.png" alt="WORKDER" fill className="object-contain" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">
                                WORKDER
                            </span>
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">ยินดีต้อนรับกลับมา! 👋</h1>
                    <p className="text-slate-500 mt-2">เข้าสู่ระบบเพื่อจัดการงานและโอกาสของคุณ</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">อีเมล</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                required
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
                            <Link href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">ลืมรหัสผ่าน?</Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="password"
                                required
                                autoComplete="new-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error ? <p className="text-sm text-red-600">{error}</p> : null}


                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-400">หรือดำเนินการต่อด้วย</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
                        <Chrome className="h-5 w-5 text-[#4285F4]" />
                        Google
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
                        <Facebook className="h-5 w-5 text-[#1877F2]" />
                        Facebook
                    </button>
                </div>

                <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition-all">
                    <Smartphone className="h-4 w-4" />
                    เข้าสู่ระบบด้วยวิธีอื่น
                </button>

                <div className="mt-8 text-center text-sm text-slate-500">
                    ยังไม่มีบัญชีผู้ใช้?{' '}
                    <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                        สมัครสมาชิกฟรี
                    </Link>
                </div>
            </div>
        </div>
    );
}
