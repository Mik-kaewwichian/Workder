'use client';

import React from 'react';
import Navbar from '../../../components/Navbar';
import { ShieldCheck, CheckCircle2, ArrowRight, FileCheck, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function SafeZoneRegisterPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            <Navbar />

            <div className="pt-32 px-6 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-sm font-bold text-pink-600 mb-6 border border-pink-200 shadow-sm animate-fade-in-up">
                        <ShieldCheck className="h-4 w-4" />
                        Safezone Partner Application
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                        ยกระดับความน่าเชื่อถือ<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">
                            ด้วยสัญลักษณ์ Safezone
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-slate-600">
                        เข้าถึงงานระดับ VIP และได้รับความไว้วางใจจากผู้ว่าจ้างทันทีที่เห็นสัญลักษณ์
                        พร้อมการดูแลพิเศษตลอดการทำงาน
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-pink-100 border border-pink-100 overflow-hidden relative">
                    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-600"></div>

                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row gap-12 items-center">

                            {/* Left Side: Benefits */}
                            <div className="flex-1 space-y-6">
                                <h3 className="text-2xl font-bold text-slate-900">สิทธิพิเศษที่คุณจะได้รับ</h3>
                                <ul className="space-y-4">
                                    {[
                                        "ตราสัญลักษณ์ Safezone บนโปรไฟล์",
                                        "สิทธิ์เข้าถึงงาน VIP และงานค่าตอบแทนสูง",
                                        "การจัดอันดับแนะนำเป็นอันดับต้นๆ (Top Ranking)",
                                        "เจ้าหน้าที่ดูแลส่วนตัวตลอด 24 ชม.",
                                        "ประกันอุบัติเหตุระหว่างปฏิบัติงาน (วงเงิน 100,000 บาท)"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-700">
                                            <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-600">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right Side: Pricing */}
                            <div className="w-full md:w-auto shrink-0 bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-20 bg-pink-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

                                <p className="text-slate-500 font-medium mb-2 relative z-10">ค่าสมัครสมาชิกตลอดชีพ</p>
                                <div className="text-5xl font-black text-slate-900 mb-2 relative z-10 tracking-tight">
                                    ฿1,399
                                </div>
                                <p className="text-xs text-slate-400 mb-8 relative z-10">ชำระครั้งเดียว ไม่มีรายเดือน</p>

                                <div className="space-y-3 text-left bg-white p-4 rounded-xl border border-slate-100 mb-8 shadow-sm relative z-10">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 flex items-center gap-2"><FileCheck className="h-4 w-4" /> ค่าตรวจเอกสาร</span>
                                        <span className="font-semibold text-slate-900">฿400</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 flex items-center gap-2"><UserCheck className="h-4 w-4" /> ค่ายืนยันตัวตน</span>
                                        <span className="font-semibold text-slate-900">฿999</span>
                                    </div>
                                    <div className="h-px bg-slate-100 my-2"></div>
                                    <div className="flex justify-between text-sm font-bold text-pink-600">
                                        <span>รวมสุทธิ</span>
                                        <span>฿1,399</span>
                                    </div>
                                </div>

                                <button className="w-full rounded-full bg-pink-600 py-4 text-white font-bold shadow-lg shadow-pink-200 hover:bg-pink-700 hover:shadow-pink-300 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 relative z-10">
                                    สมัครเลย <ArrowRight className="h-5 w-5" />
                                </button>
                                <p className="text-center text-xs text-slate-400 mt-4 relative z-10">ปลอดภัยด้วยระบบชำระเงินมาตรฐานสากล</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
