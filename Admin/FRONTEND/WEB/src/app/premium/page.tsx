'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import { Crown, CheckCircle2, Star, Zap, Shield } from 'lucide-react';

export default function PremiumPage() {
    return (
        <div className="min-h-screen bg-slate-900 font-sans text-white pb-20">
            <Navbar />

            <div className="pt-32 px-6 max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-bold text-amber-400 mb-8 border border-amber-500/20 shadow-lg shadow-amber-900/50">
                    <Crown className="h-4 w-4" />
                    WORKDER PREMIUM
                </div>

                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                    Unlock Your Full <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600">
                        Career Potential
                    </span>
                </h1>

                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-16">
                    Join the elite ranks of professionals. Get exclusive access to top-tier jobs,
                    priority support, and advanced tools to accelerate your success.
                </p>

                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                    {/* Lite Plan */}
                    <div className="flex flex-col p-6 rounded-3xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-all text-left group">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-slate-300">Lite</h3>
                            <div className="text-3xl font-bold mt-2">฿199 <span className="text-sm font-normal text-slate-500">/ เดือน</span></div>
                        </div>
                        <ul className="space-y-4 mb-8 text-slate-400 text-sm flex-1">
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-slate-500 shrink-0" /> เข้าถึงงานทั่วไปไม่จำกัด</li>
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-slate-500 shrink-0" /> สร้างโปรไฟล์พื้นฐาน</li>
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-slate-500 shrink-0" /> ส่งใบสมัครได้ 10 ครั้ง/วัน</li>
                        </ul>
                        <button className="w-full py-3 rounded-xl border border-slate-600 font-bold hover:bg-slate-700 transition-all text-sm">
                            เลือกแพ็กเกจนี้
                        </button>
                    </div>

                    {/* Plus Plan */}
                    <div className="flex flex-col p-6 rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-900/20 to-slate-800/50 text-left relative overflow-hidden group hover:border-blue-400 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <div className="mb-4 relative z-10">
                            <h3 className="text-xl font-bold text-blue-400">Plus</h3>
                            <div className="text-3xl font-bold mt-2">฿399 <span className="text-sm font-normal text-slate-500">/ เดือน</span></div>
                        </div>
                        <ul className="space-y-4 mb-8 text-slate-300 text-sm flex-1 relative z-10">
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" /> <b>ทุกอย่างในแพ็กเกจ Lite</b></li>
                            <li className="flex items-start gap-3"><Zap className="h-5 w-5 text-blue-400 shrink-0" /> สมัครงานด่วน (Fast Track)</li>
                            <li className="flex items-start gap-3"><Star className="h-5 w-5 text-blue-400 shrink-0" /> ดันโปรไฟล์ให้เด่นขึ้น</li>
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" /> ส่งใบสมัครไม่จำกัด</li>
                        </ul>
                        <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all text-sm shadow-lg shadow-blue-900/20 relative z-10">
                            เลือกแพ็กเกจนี้
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="flex flex-col p-6 rounded-3xl border-2 border-amber-500 bg-gradient-to-b from-slate-800 to-slate-900 text-left relative shadow-2xl shadow-amber-900/20 transform md:-translate-y-4 z-10">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600"></div>
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                            ขายดีที่สุด
                        </div>
                        <div className="mb-6 mt-2">
                            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 flex items-center gap-2">
                                Pro <Crown className="h-6 w-6 text-amber-500" />
                            </h3>
                            <div className="text-4xl font-black mt-2 text-white">฿999 <span className="text-sm font-normal text-slate-400">/ เดือน</span></div>
                        </div>
                        <ul className="space-y-4 mb-8 text-slate-200 text-sm flex-1">
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" /> <b>ทุกอย่างในแพ็กเกจ Plus</b></li>
                            <li className="flex items-start gap-3 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 -mx-2">
                                <Shield className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-rose-400 font-bold block">แถมฟรี! Safezone Access</span>
                                    <span className="text-xs text-rose-300/80">เข้าถึงงานที่ผ่านการตรวจสอบแล้ว</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3"><Zap className="h-5 w-5 text-amber-400 shrink-0" /> <b>เพิ่มเงื่อนไขการจ้างได้เอง</b> (Custom Conditions)</li>
                            <li className="flex items-start gap-3"><Crown className="h-5 w-5 text-amber-400 shrink-0" /> ผู้ช่วยส่วนตัว Workder Admin</li>
                        </ul>
                        <button className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-600 text-slate-900 font-bold shadow-lg shadow-amber-900/40 hover:scale-105 transition-all text-base">
                            สมัครสมาชิก Pro
                        </button>
                    </div>
                </div>

                <div className="mt-12 text-left text-slate-500 text-xs space-y-4 max-w-4xl mx-auto border-t border-slate-800 pt-8">
                    <p>
                        ความพร้อมในการใช้งานฟีเจอร์ต่างๆ ขึ้นอยู่กับการตรวจสอบประวัติและเอกสารประกอบการสมัคร บางเนื้อหาอาจต้องใช้เวลาในการตรวจสอบ 24-48 ชั่วโมง ดูรายละเอียดเพิ่มเติมได้ใน<a href="#" className="underline hover:text-slate-400 mx-1">ข้อกำหนดการใช้งาน</a>ของเรา
                    </p>
                    <p>
                        มีเพียงบุคคลที่เป็นเจ้าของบัญชีเท่านั้นที่สามารถใช้สิทธิ์ประโยชน์นี้ได้ ไม่สามารถโอนสิทธิ์หรือแชร์บัญชีให้กับผู้อื่น รับงานได้พร้อมกัน 5 งานสำหรับสมาชิก Pro, 3 งานสำหรับสมาชิก Plus, และ 1 งานสำหรับสมาชิก Lite
                    </p>
                    <p>
                        การเข้าถึง Safezone และงาน Exclusive สงวนสิทธิ์เฉพาะสมาชิกที่มีประวัติใสสะอาดและผ่านเกณฑ์การประเมินเท่านั้น บริษัทขอสงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไขโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                    </p>
                </div>
            </div>
        </div>
    );
}
