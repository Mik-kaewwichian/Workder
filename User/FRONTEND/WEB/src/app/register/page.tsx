'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, User, Briefcase, Mail, Lock, CheckCircle2, Chrome, Facebook, Smartphone } from 'lucide-react';
import api from '../../lib/api';
import { setAuthSession } from '../../features/auth/lib/auth';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSocialLoading, setIsSocialLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'worker' | 'employer' | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nickname: '',
        birthDate: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const roleForApi = selectedRole === 'employer' ? 'employer' : 'user';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const completeSocialAuth = (payload: {
        accessToken: string;
        user: {
            id: number;
            email: string;
            role: 'user' | 'employer' | string;
            profileCompleted: boolean;
            firstName?: string | null;
            lastName?: string | null;
        };
    }) => {
        const normalizedRole = payload.user.role === 'employer' ? 'employer' : 'user';

        setAuthSession({
            userId: payload.user.id,
            email: payload.user.email,
            role: normalizedRole,
            profileCompleted: payload.user.profileCompleted,
            employerRegistered: normalizedRole === 'employer',
            name: [payload.user.firstName, payload.user.lastName].filter(Boolean).join(' ').trim() || undefined,
            accessToken: payload.accessToken,
        });

        window.location.href = '/dashboard';
    };

    const handleGoogleSignUp = () => {
        const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
        if (!googleClientId) {
            alert('ยังไม่ได้ตั้งค่า Google Client ID');
            return;
        }

        const google = (window as any).google;
        if (!google?.accounts?.id) {
            alert('ไม่สามารถโหลด Google Sign-In');
            return;
        }

        google.accounts.id.initialize({
            client_id: googleClientId,
            callback: async (response: { credential?: string }) => {
                if (!response?.credential) {
                    alert('ไม่พบ Google credential');
                    return;
                }

                try {
                    setIsSocialLoading(true);
                    const { data } = await api.post('/auth/oauth/google', {
                        idToken: response.credential,
                        role: roleForApi,
                    });

                    completeSocialAuth(data);
                } catch (error: any) {
                    alert(error?.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครด้วย Google');
                } finally {
                    setIsSocialLoading(false);
                }
            },
        });

        google.accounts.id.prompt();
    };

    const handleFacebookSignUp = () => {
        const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim();
        if (!facebookAppId) {
            alert('ยังไม่ได้ตั้งค่า Facebook App ID');
            return;
        }

        const fb = (window as any).FB;
        if (!fb) {
            alert('ไม่สามารถโหลด Facebook SDK');
            return;
        }

        fb.login(
            async (response: { authResponse?: { accessToken: string; userID: string } }) => {
                if (!response?.authResponse) {
                    return;
                }

                try {
                    setIsSocialLoading(true);
                    const { data } = await api.post('/auth/oauth/facebook', {
                        accessToken: response.authResponse.accessToken,
                        userID: response.authResponse.userID,
                        role: roleForApi,
                    });

                    completeSocialAuth(data);
                } catch (error: any) {
                    alert(error?.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครด้วย Facebook');
                } finally {
                    setIsSocialLoading(false);
                }
            },
            { scope: 'public_profile,email' },
        );
    };

    useEffect(() => {
        const googleScript = document.createElement('script');
        googleScript.src = 'https://accounts.google.com/gsi/client';
        googleScript.async = true;
        googleScript.defer = true;
        document.head.appendChild(googleScript);

        const facebookScript = document.createElement('script');
        facebookScript.src = 'https://connect.facebook.net/th_TH/sdk.js';
        facebookScript.async = true;
        facebookScript.defer = true;

        (window as any).fbAsyncInit = () => {
            const fb = (window as any).FB;
            const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim();

            if (fb && facebookAppId) {
                fb.init({
                    appId: facebookAppId,
                    cookie: true,
                    xfbml: false,
                    version: 'v19.0',
                });
            }
        };

        document.head.appendChild(facebookScript);

        return () => {
            if (googleScript.parentNode) {
                googleScript.parentNode.removeChild(googleScript);
            }
            if (facebookScript.parentNode) {
                facebookScript.parentNode.removeChild(facebookScript);
            }
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRole) {
            alert('กรุณาเลือกบทบาท');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('รหัสผ่านไม่ตรงกัน');
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/users', {
                email: formData.email,
                role: roleForApi,
                firstName: formData.firstName,
                lastName: formData.lastName,
                birthDate: formData.birthDate,
                password: formData.password,
            });

            alert('ลงทะเบียนสำเร็จ! เข้าสู่ระบบได้เลย');
            window.location.href = '/login';
        } catch {
            alert('เกิดข้อผิดพลาดในการลงทะเบียน (อีเมลนี้อาจถูกใช้งานไปแล้ว)');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans text-slate-900 selection:bg-blue-500 selection:text-white py-10">
            {/* Background Decorations & Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-100/40 blur-3xl animate-pulse delay-1000"></div>

                {/* Floating Card: Users */}
                <div className="absolute top-24 right-[10%] bg-white p-4 rounded-2xl shadow-xl shadow-blue-100 animate-float hidden lg:block border border-blue-50 pointer-events-auto cursor-default hover:scale-110 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`h-8 w-8 rounded-full border-2 border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=${i + 10}')] bg-cover`}></div>
                            ))}
                            <div className="h-8 w-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">+1k</div>
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">ผู้ใช้งานใหม่</p>
                            <p className="text-xs text-slate-500">ไว้วางใจเรา</p>
                        </div>
                    </div>
                </div>

                {/* Floating Card: Success */}
                <div className="absolute bottom-[20%] left-[8%] bg-white p-3 rounded-2xl shadow-xl shadow-green-100 animate-float delay-500 hidden md:block border border-green-50 pointer-events-auto cursor-default hover:scale-110 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">อนุมัติไวมาก!</p>
                            <p className="text-xs text-slate-500">เริ่มงานได้ทันที</p>
                        </div>
                    </div>
                </div>

                {/* Floating Card: Category (New) */}
                <div className="absolute top-1/2 left-[5%] transform -translate-y-1/2 bg-white p-3 rounded-2xl shadow-xl shadow-orange-100 animate-float delay-700 hidden lg:block border border-orange-50 pointer-events-auto cursor-default hover:scale-110 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                            <Briefcase className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">งานกราฟิก</p>
                            <p className="text-[10px] text-slate-500">500+ งานว่าง</p>
                        </div>
                    </div>
                </div>

                {/* Floating Card: Location (New) */}
                <div className="absolute bottom-32 right-[20%] bg-white p-3 rounded-2xl shadow-xl shadow-cyan-100 animate-float delay-200 hidden md:block border border-cyan-50 pointer-events-auto cursor-default hover:scale-110 transition-transform duration-300">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center">
                            <span className="text-lg">🌏</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">Remote Work</p>
                            <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">Available</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/50 relative z-10 mx-4">
                <Link href="/" className="absolute top-8 left-8 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600">
                    <ArrowRight className="h-5 w-5 rotate-180" />
                </Link>

                <div className="text-center mb-8 pt-4">
                    <Link href="/" className="inline-block mb-6">
                        <div className="flex items-center justify-center gap-2">
                            <div className="relative h-12 w-12">
                                <Image src="/images/workderLogo.png" alt="WORKDER" fill className="object-contain" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">
                                WORKDER
                            </span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">สร้างบัญชีผู้ใช้ใหม่</h1>
                    <p className="text-slate-500 mt-2">เข้าถึงโอกาสงานคุณภาพง่ายๆ เริ่มต้นได้ทันที</p>
                </div>

                {/* Role Selection */}
                {!selectedRole ? (
                    <div className="space-y-4 mb-8">
                        <p className="text-sm font-semibold text-slate-700 text-center">เลือกบทบาทของคุณ</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setSelectedRole('worker')}
                                className="p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-start gap-3 text-left"
                            >
                                <div className="bg-blue-100 p-3 rounded-lg h-fit">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">สมัครงาน</p>
                                    <p className="text-xs text-slate-500">ช่างหรือบริการ</p>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRole('employer')}
                                className="p-5 rounded-2xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all flex items-start gap-3 text-left"
                            >
                                <div className="bg-purple-100 p-3 rounded-lg h-fit">
                                    <Briefcase className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">โพสงาน</p>
                                    <p className="text-xs text-slate-500">นายจ้างหรืองกาน</p>
                                </div>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {selectedRole === 'worker' ? (
                                <>
                                    <User className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm font-semibold text-blue-900">สมัครงาน</span>
                                </>
                            ) : (
                                <>
                                    <Briefcase className="h-5 w-5 text-purple-600" />
                                    <span className="text-sm font-semibold text-purple-900">โพสงาน</span>
                                </>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedRole(null)}
                            className="text-xs text-slate-600 hover:text-slate-800 underline"
                        >
                            เปลี่ยน
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">ชื่อ</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="สมชาย"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">นามสกุล</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="ใจดี"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">ชื่อเล่น</label>
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleInputChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="ชาย"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">วัน/เดือน/ปีเกิด</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">อีเมล</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">รหัสผ่าน</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="อย่างน้อย 8 ตัวอักษร"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">ยืนยันรหัสผ่าน</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="ยืนยันรหัสผ่าน"
                            />
                        </div>
                    </div>

                    <div className="flex items-start gap-3 mt-4">
                        <input type="checkbox" id="terms" required className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="terms" className="text-sm text-slate-500">
                            ฉันยอมรับ <Link href="#" className="font-semibold text-blue-600 hover:text-blue-700">เงื่อนไขการให้บริการ</Link> และ <Link href="#" className="font-semibold text-blue-600 hover:text-blue-700">นโยบายความเป็นส่วนตัว</Link> ของ WORKDER
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || isSocialLoading}
                        className="w-full rounded-xl bg-blue-600 text-white py-3.5 text-sm font-bold shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-blue-500/40"
                    >
                        {isLoading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชีผู้ใช้'}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-400">หรือสมัครด้วย</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={isSocialLoading}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Chrome className="h-5 w-5 text-[#4285F4]" />
                        Google
                    </button>
                    <button
                        type="button"
                        onClick={handleFacebookSignUp}
                        disabled={isSocialLoading}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Facebook className="h-5 w-5 text-[#1877F2]" />
                        Facebook
                    </button>
                </div>

                <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition-all">
                    <Smartphone className="h-4 w-4" />
                    สมัครสมาชิกด้วยวิธีอื่น
                </button>

                <div className="mt-8 text-center text-sm text-slate-500">
                    มีบัญชีผู้ใช้แล้ว?{' '}
                    <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                        เข้าสู่ระบบ
                    </Link>
                </div>
            </div>
        </div>
    );
}
