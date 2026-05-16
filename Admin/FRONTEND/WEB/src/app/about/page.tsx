'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import { Target, Users, ShieldCheck, Zap, Globe2, Mail, MapPin, Phone } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
            <Navbar />

            <main className="pt-24 pb-20 px-6">
                {/* Hero Section */}
                <section className="mx-auto max-w-7xl text-center mb-20">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-sm font-medium text-blue-700 backdrop-blur-md mb-8">
                        เกี่ยวกับเรา
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                        ขับเคลื่อนอนาคตของการทำงาน <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">ด้วยเทคโนโลยีและมนุษยธรรม</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-slate-600 leading-relaxed">
                        WORKDER คือแพลตฟอร์มที่เชื่อว่า "งานที่ดี" คือจุดเริ่มต้นของชีวิตที่ดี <br />
                        เรามุ่งมั่นที่จะสร้างพื้นที่ปลอดภัยและโอกาสที่เท่าเทียมสำหรับทุกคน
                    </p>
                </section>

                {/* Mission & Vision Grid */}
                <section className="mx-auto max-w-7xl grid md:grid-cols-2 gap-8 mb-20">
                    <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform">
                        <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
                            <Target className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">ภารกิจของเรา (Mission)</h2>
                        <p className="text-slate-600 leading-relaxed">
                            ลดช่องว่างในการเข้าถึงโอกาสงานคุณภาพ และช่วยให้ผู้จ้างงานค้นพบคนเก่งได้ง่ายขึ้น
                            ผ่านระบบ Matching ที่แม่นยำและเป็นธรรม เราต้องการให้ทุกการจ้างงานเป็นเรื่องง่าย ปลอดภัย และโปร่งใส
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform">
                        <div className="h-12 w-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600 mb-6">
                            <Globe2 className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">วิสัยทัศน์ (Vision)</h2>
                        <p className="text-slate-600 leading-relaxed">
                            เป็นโครงสร้างพื้นฐานด้านแรงงานดิจิทัลแห่งอนาคต ที่ซึ่ง "ระยะทาง" และ "พรมแดน" ไม่ใช่อุปสรรคในการทำงานร่วมกันอีกต่อไป
                            สร้างมาตรฐานใหม่ของคุณภาพชีวิตการทำงานในยุคดิจิทัล
                        </p>
                    </div>
                </section>

                {/* Core Values */}
                <section className="mx-auto max-w-7xl mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12">ค่านิยมหลักของเรา</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-6">
                            <div className="mx-auto h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mb-4">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Trust First</h3>
                            <p className="text-slate-500">ความเชื่อใจคือรากฐาน (ผ่านฟีเจอร์ Safezone)</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="mx-auto h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                                <Zap className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Maximum Efficiency</h3>
                            <p className="text-slate-500">รวดเร็วและมีประสิทธิภาพสูงสุด</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">People Centric</h3>
                            <p className="text-slate-500">มุ่งเน้นคนเป็นศูนย์กลางในการพัฒนา</p>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="mx-auto max-w-4xl bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-8 md:p-12 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Globe2 className="h-48 w-48 text-white" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-6">ติดต่อเรา</h2>
                        <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                            หากมีข้อสงสัยหรือต้องการสอบถามข้อมูลเพิ่มเติม ทีมงานของเราพร้อมดูแลคุณ หรือต้องการร่วมเป็นพาร์ทเนอร์ทางธุรกิจ
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
                                <Mail className="h-5 w-5 text-blue-400" />
                                <span>support@workder.io</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
                                <Phone className="h-5 w-5 text-green-400" />
                                <span>02-345-6789</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
                                <MapPin className="h-5 w-5 text-red-400" />
                                <span>KhonKaen, Thailand</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
                <p>© {new Date().getFullYear()} WORKDER Platform. All rights reserved.</p>
            </footer>
        </div>
    );
}
