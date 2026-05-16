'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Mail, Key, CreditCard, Phone, ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { resetPasswordAdmin, verifyAdminResetData } from '../../features/auth/lib/auth';

export default function ForgotPasswordPage() {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Step 1 data
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Step 2 (Modal) data
    const [managerCode, setManagerCode] = useState('');
    const [idCard, setIdCard] = useState('');
    const [phone, setPhone] = useState('');

    const [error, setError] = useState('');
    const [modalError, setModalError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const router = useRouter();

    const handleOpenModal = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!email || !idCard || !phone || !newPassword || !confirmPassword) {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        if (newPassword.length < 8) {
            setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
            return;
        }

        setIsLoading(true);
        const isValid = await verifyAdminResetData(email, idCard, phone);
        setIsLoading(false);

        if (!isValid) {
            setError('ข้อมูลอีเมล เลขบัตรพนักงาน หรือเบอร์โทรศัพท์ไม่ถูกต้อง ไม่ผ่านการตรวจสอบ');
            return;
        }

        setShowModal(true);
    };

    const handleConfirmReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalError('');
        setSuccessMsg('');
        setIsLoading(true);

        const success = await resetPasswordAdmin(email, managerCode, idCard, phone, newPassword);

        if (!success) {
            setIsLoading(false);
            setModalError('ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบรหัสผู้ดูแลระบบ, เลขบัตรพนักงาน, และเบอร์โทรศัพท์อีกครั้ง');
            return;
        }

        setShowModal(false);
        setSuccessMsg('เปลี่ยนรหัสผ่านสำเร็จ! กำลังพากลับไปหน้าเข้าสู่ระบบ...');
        
        setTimeout(() => {
            router.push('/login');
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white px-4">
            {/* Background Container */}
            <div className={`w-full max-w-md bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 relative transition-all duration-300 ${showModal ? 'blur-sm scale-[0.98]' : ''}`}>
                <div className="text-center mb-6">
                    <Link href="/" className="inline-block hover:scale-105 transition-transform">
                        <div className="flex items-center justify-center gap-2">
                            <div className="relative h-12 w-12">
                                <Image src="/images/workderLogo.png" alt="WORKDER" fill className="object-contain" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">
                                รีเซ็ตรหัสผ่าน
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm text-slate-500 mt-2">ยืนยันตัวตนด้วยอีเมลเพื่อกำหนดรหัสใหม่</p>
                </div>

                <form onSubmit={handleOpenModal} className="space-y-4">
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
                        <label className="text-sm font-medium text-slate-700 ml-1">เลขบัตรพนักงาน (Employee ID)</label>
                        <div className="relative">
                            <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                value={idCard}
                                onChange={(event) => setIdCard(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="ระบุเลขบัตรพนักงานของคุณ"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">เบอร์โทรศัพท์ (Phone Number)</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="08X-XXX-XXXX"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">รหัสผ่านใหม่</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">ยืนยันรหัสผ่านใหม่</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error ? <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p> : null}
                    {successMsg ? <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200 font-medium">{successMsg}</p> : null}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading || !!successMsg}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            ตั้งรหัสผ่านใหม่ <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                        กลับไปหน้าเข้าสู่ระบบ
                    </Link>
                </div>
            </div>

            {/* Blurred Background Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => { setShowModal(false); setModalError(''); }}
                            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="text-center mb-6 mt-2">
                            <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-2xl mb-4">
                                <Key className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">ยืนยันตัวตนผู้ดูแลระบบ</h3>
                            <p className="text-sm text-slate-500 mt-1">กรุณากรอกรหัสผู้จัดการเพื่อยืนยันการเปลี่ยนรหัสผ่าน</p>
                        </div>

                        <form onSubmit={handleConfirmReset} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700 ml-1">รหัสผู้ดูแลระบบ (Manager Code)</label>
                                <div className="relative">
                                    <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={managerCode}
                                        onChange={(event) => setManagerCode(event.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all uppercase"
                                        placeholder="MGR-XXX"
                                    />
                                </div>
                            </div>

                            {modalError ? <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 text-center">{modalError}</p> : null}

                            <div className="pt-3 flex flex-col gap-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors disabled:opacity-70"
                                >
                                    {isLoading ? 'กำลังตรวจสอบ...' : 'ตกลง'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setModalError(''); }}
                                    disabled={isLoading}
                                    className="w-full rounded-xl bg-transparent py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
