'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserRound, Camera } from 'lucide-react';
import dynamic from 'next/dynamic';
import { getAuthSession, setAuthSession, type AuthSession } from '../../../features/auth/lib/auth';
import api from '../../../lib/api';

const ThaiAddressFields = dynamic(() => import('../../../components/ThaiAddressFields'), {
    ssr: false,
    loading: () => <div className="p-4 text-center text-sm text-slate-500 border border-slate-200 rounded-xl bg-slate-50 animate-pulse">กำลังโหลดระบบค้นหาที่อยู่...</div>
});

export default function ProfileRegisterPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [session, setSession] = useState<AuthSession | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Text Fields
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        idCard: '',
        birthDate: '',
        address: '',
        occupation: '',
        income: '',
        education: '',
        certificates: '',
    });

    const [addressObj, setAddressObj] = useState({
        subdistrict: '',
        district: '',
        province: '',
        postalCode: ''
    });

    // Image base64 fields
    const [images, setImages] = useState({
        idCardFront: null as string | null,
        idCardBack: null as string | null,
        idCardSelfie: null as string | null,
        faceScan: null as string | null,
    });

    // PDPA & Consent
    const [consents, setConsents] = useState({
        personalData: null as boolean | null,
        marketing: null as boolean | null,
        creditData: null as boolean | null,
    });


    useEffect(() => {
        const currentSession = getAuthSession();
        if (!currentSession) {
            router.replace('/login');
            return;
        }

        setSession(currentSession);
    }, [router]);

    const handleImageSelect = (key: keyof typeof images) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('ขนาดรูปภาพต้องไม่เกิน 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImages((prev) => ({ ...prev, [key]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = (id: string) => {
        document.getElementById(id)?.click();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!session) {
            return;
        }

        setIsSaving(true);

        try {
            await api.patch(`/users/${session.userId}`, {
                firstName: form.firstName,
                lastName: form.lastName,
                idCard: form.idCard,
                birthDate: form.birthDate ? new Date(form.birthDate).toISOString() : null,
                address: form.address,
                province: addressObj.province,
                district: addressObj.district,
                subDistrict: addressObj.subdistrict,
                zipCode: addressObj.postalCode,
                occupation: form.occupation,
                income: form.income ? parseInt(form.income, 10) : null,
                education: form.education,
                certificates: form.certificates,
                idCardFront: images.idCardFront,
                idCardBack: images.idCardBack,
                idCardSelfie: images.idCardSelfie,
                faceScan: images.faceScan,
                profileCompleted: true
            });

            const updatedSession: AuthSession = {
                ...session,
                profileCompleted: true,
                name: `${form.firstName} ${form.lastName}`.trim(),
            };

            setAuthSession(updatedSession);
            setIsSaving(false);
            router.push('/dashboard');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white py-10 px-4">
            <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    ย้อนกลับ
                </button>

                <div className="mb-6 pb-4 border-b border-slate-100">
                    <p className="text-sm text-slate-500 font-medium">ยืนยันตัวตนระดับสูง (KYC)</p>
                    <h1 className="text-2xl font-bold text-slate-900">อัปเดตข้อมูลส่วนตัวให้สมบูรณ์</h1>
                    <p className="text-sm text-slate-500 mt-1">ข้อมูลเหล่านี้จำเป็นต่อการรักษาความปลอดภัยและสร้างความน่าเชื่อถือให้กับบัญชีของคุณ</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section 1: ข้อมูลพื้นฐาน */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-800">1. ข้อมูลพื้นฐาน</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                required
                                value={form.firstName}
                                onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
                                placeholder="ชื่อจริง (ภาษาไทย)"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                            <input
                                required
                                value={form.lastName}
                                onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
                                placeholder="นามสกุล (ภาษาไทย)"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                required
                                value={form.idCard}
                                onChange={(event) => setForm((prev) => ({ ...prev, idCard: event.target.value }))}
                                placeholder="เลขประจำตัวประชาชน (13 หลัก)"
                                maxLength={13}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                            <div className="relative">
                                <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-slate-500 font-medium z-10">วัน/เดือน/ปีเกิด</label>
                                <input
                                    required
                                    type="date"
                                    value={form.birthDate}
                                    onChange={(event) => setForm((prev) => ({ ...prev, birthDate: event.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: ข้อมูลที่อยู่ติดต่อได้จริง */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">2. ข้อมูลที่อยู่ติดต่อได้จริง</h2>

                        <div className="space-y-4 relative z-20">
                            <ThaiAddressFields value={addressObj} onChange={setAddressObj} />
                        </div>

                        <textarea
                            required
                            value={form.address}
                            onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                            placeholder="รายละเอียดที่อยู่ (บ้านเลขที่, หมู่, อาคาร, ซอย, ถนน)"
                            rows={2}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-none"
                        />
                    </div>

                    {/* Section 3: ประวัติการศึกษาและการทำงาน */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">3. ประวัติการศึกษาและรายได้</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                required
                                value={form.occupation}
                                onChange={(event) => setForm((prev) => ({ ...prev, occupation: event.target.value }))}
                                placeholder="อาชีพปัจจุบัน (เช่น พนักงานบริษัท, รับจ้างอิสระ)"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                            <div className="relative">
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    value={form.income}
                                    onChange={(event) => setForm((prev) => ({ ...prev, income: event.target.value }))}
                                    placeholder="รายได้เฉลี่ยต่อเดือน"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                                <span className="absolute right-4 top-3 text-slate-400 text-sm">บาท</span>
                            </div>
                        </div>

                        <input
                            required
                            value={form.education}
                            onChange={(event) => setForm((prev) => ({ ...prev, education: event.target.value }))}
                            placeholder="ระดับการศึกษาสูงสุด (เช่น ปริญญาตรี มหาวิทยาลัย... สาขา...)"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                        <textarea
                            value={form.certificates}
                            onChange={(event) => setForm((prev) => ({ ...prev, certificates: event.target.value }))}
                            placeholder="ใบประกอบวิชาชีพ / ใบประกาศนียบัตร / ความชำนาญเฉพาะด้าน (บรรยายและระบุวันที่หมดอายุถ้ามี)"
                            rows={2}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-none"
                        />
                    </div>

                    {/* Section 4: เอกสารยืนยันตัวตน */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">4. เอกสารยืนยันตัวตน (อัปโหลดรูปภาพ)</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* ID Card Front */}
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => triggerFileInput('file-idCardFront')}>
                                <input type="file" id="file-idCardFront" className="hidden" accept="image/*" onChange={handleImageSelect('idCardFront')} />
                                {images.idCardFront ? (
                                    <img src={images.idCardFront} alt="ID Card Front" className="h-32 w-full object-cover rounded-lg" />
                                ) : (
                                    <div className="h-32 flex flex-col items-center justify-center text-slate-500">
                                        <Camera className="h-8 w-8 mb-2 text-slate-400" />
                                        <span className="text-sm font-medium">ด้านหน้าบัตรประชาชน</span>
                                    </div>
                                )}
                            </div>

                            {/* ID Card Back */}
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => triggerFileInput('file-idCardBack')}>
                                <input type="file" id="file-idCardBack" className="hidden" accept="image/*" onChange={handleImageSelect('idCardBack')} />
                                {images.idCardBack ? (
                                    <img src={images.idCardBack} alt="ID Card Back" className="h-32 w-full object-cover rounded-lg" />
                                ) : (
                                    <div className="h-32 flex flex-col items-center justify-center text-slate-500">
                                        <Camera className="h-8 w-8 mb-2 text-slate-400" />
                                        <span className="text-sm font-medium">ด้านหลังบัตรประชาชน</span>
                                    </div>
                                )}
                            </div>

                            {/* ID Card Selfie */}
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => triggerFileInput('file-idCardSelfie')}>
                                <input type="file" id="file-idCardSelfie" className="hidden" accept="image/*" onChange={handleImageSelect('idCardSelfie')} />
                                {images.idCardSelfie ? (
                                    <img src={images.idCardSelfie} alt="ID Card Selfie" className="h-32 w-full object-cover rounded-lg" />
                                ) : (
                                    <div className="h-32 flex flex-col items-center justify-center text-slate-500">
                                        <Camera className="h-8 w-8 mb-2 text-slate-400" />
                                        <span className="text-sm font-medium">ถ่ายเซลฟี่คู่กับบัตรประชาชน</span>
                                    </div>
                                )}
                            </div>

                            {/* Face Scan */}
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => triggerFileInput('file-faceScan')}>
                                <input type="file" id="file-faceScan" className="hidden" accept="image/*" onChange={handleImageSelect('faceScan')} />
                                {images.faceScan ? (
                                    <img src={images.faceScan} alt="Face Scan" className="h-32 w-full object-cover rounded-lg" />
                                ) : (
                                    <div className="h-32 flex flex-col items-center justify-center text-slate-500">
                                        <Camera className="h-8 w-8 mb-2 text-slate-400" />
                                        <span className="text-sm font-medium">สแกนใบหน้า (รูปถ่ายหน้าตรง)</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section 5: ความยินยอมและข้อตกลง (PDPA & Consent) */}
                    <div className="space-y-6 pt-4 border-t border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">5. ความยินยอมและข้อตกลงการใช้ข้อมูล</h2>

                        <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6 space-y-6 shadow-sm">

                            {/* item 1 */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-800">ความยินยอมในการให้ข้อมูลส่วนบุคคล</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    ข้อมูลส่วนบุคคลของลูกค้าทุกท่านเป็นสิ่งสำคัญต่อเรา เราขอรับรองว่าข้อมูลของท่านจะได้รับการปกป้อง และรักษาเป็นอย่างดี การอนุญาตให้เข้าถึงข้อมูลจะไม่มีผลกระทบใดๆ ต่อผลิตภัณฑ์หรือบริการที่พึงได้รับ
                                </p>
                                <div className="flex items-center gap-6 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="personalData"
                                            checked={consents.personalData === true}
                                            onChange={() => setConsents(prev => ({ ...prev, personalData: true }))}
                                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                        />
                                        <span className={`text-sm ${consents.personalData === true ? 'text-blue-700 font-medium' : 'text-slate-700'}`}>ยินยอม</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="personalData"
                                            checked={consents.personalData === false}
                                            onChange={() => setConsents(prev => ({ ...prev, personalData: false }))}
                                            className="w-4 h-4 text-red-600 border-slate-300 focus:ring-red-500"
                                        />
                                        <span className={`text-sm ${consents.personalData === false ? 'text-red-600 font-medium' : 'text-slate-700'}`}>ไม่ยินยอม</span>
                                    </label>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* item 2 */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-800">ความยินยอมให้นำข้อมูลนำไปใช้พัฒนา ให้เกิดการพัฒนาสินค้า หรือบริการให้ดียิ่งขึ้น</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    เพื่อให้ท่านได้รับความพึงพอใจต่อบริการของเราอย่างต่อเนื่อง ทางบริษัทจะปรับปรุงและพัฒนาสินค้าและบริการให้ดียิ่งขึ้น โดยอาจพึ่งข้อมูลของท่านในการวิเคราะห์ วิจัย และทำสถิติ เพียงท่านมอบความเห็นพ้องและอนุญาตให้บริษัทจัดเก็บ ใช้ และเปิดเผยข้อมูลของท่าน ตามวัตถุประสงค์ที่ได้ระบุไว้
                                </p>
                                <div className="flex items-center gap-6 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="marketing"
                                            checked={consents.marketing === true}
                                            onChange={() => setConsents(prev => ({ ...prev, marketing: true }))}
                                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                        />
                                        <span className={`text-sm ${consents.marketing === true ? 'text-blue-700 font-medium' : 'text-slate-700'}`}>ยินยอม</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="marketing"
                                            checked={consents.marketing === false}
                                            onChange={() => setConsents(prev => ({ ...prev, marketing: false }))}
                                            className="w-4 h-4 text-red-600 border-slate-300 focus:ring-red-500"
                                        />
                                        <span className={`text-sm ${consents.marketing === false ? 'text-red-600 font-medium' : 'text-slate-700'}`}>ไม่ยินยอม</span>
                                    </label>
                                </div>
                                {consents.marketing === false && (
                                    <p className="text-xs text-red-500 mt-1 font-medium">ทางเราอาจจะพัฒนาสินค้าและบริการไม่ตรงตามความต้องการของท่าน โปรดพิจารณา</p>
                                )}
                            </div>

                            <hr className="border-slate-100" />

                            {/* item 3 */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-800">สมัครรับหนังสือแจ้งการนำส่งข้อมูลเครดิต รูปแบบอิเล็กทรอนิกส์</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    ข้าพเจ้าประสงค์ให้บริษัทฯ นำส่งหนังสือแจ้งการนำส่งข้อมูลเครดิตครั้งแรก หรือหนังสือแจ้งการนำส่งข้อมูลเครดิตรายปี ตามแต่กรณี ตามที่พระราชบัญญัติการประกอบธุรกิจข้อมูลเครดิตกำหนดให้นำส่งเป็นหนังสือ ในรูปแบบอิเล็กทรอนิกส์ ผ่านช่องทางที่อยู่อีเมล (E-mail address) ที่ข้าพเจ้าได้ให้ไว้ข้างต้น โดยให้มีผลกับทุกสินเชื่อที่ข้าพเจ้ามีอยู่กับบริษัทฯ รวบรวม นำไปใช้และเปิดเผยข้อมูลของท่าน เพื่อใช้นำเสนอผลิตภัณฑ์
                                </p>
                                <div className="flex items-center gap-6 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="creditData"
                                            checked={consents.creditData === true}
                                            onChange={() => setConsents(prev => ({ ...prev, creditData: true }))}
                                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                        />
                                        <span className={`text-sm ${consents.creditData === true ? 'text-blue-700 font-medium' : 'text-slate-700'}`}>ยินยอม</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="creditData"
                                            checked={consents.creditData === false}
                                            onChange={() => setConsents(prev => ({ ...prev, creditData: false }))}
                                            className="w-4 h-4 text-red-600 border-slate-300 focus:ring-red-500"
                                        />
                                        <span className={`text-sm ${consents.creditData === false ? 'text-red-600 font-medium' : 'text-slate-700'}`}>ไม่ยินยอม</span>
                                    </label>
                                </div>
                                {consents.creditData === false && (
                                    <p className="text-xs text-red-500 mt-1 font-medium">ท่านอาจพลาดข้อเสนอพิเศษ โปรโมชั่น หรือ บริการใหม่ๆ จากเรา</p>
                                )}
                            </div>

                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSaving || !images.idCardFront || !images.idCardBack || !images.idCardSelfie || !images.faceScan || consents.personalData !== true || consents.marketing !== true || consents.creditData !== true}
                            className="w-full rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
                        >
                            {isSaving ? 'กำลังบันทึกข้อมูลและอัปโหลดรูปภาพ...' : 'ยืนยันตัวตนและบันทึกข้อมูล'}
                        </button>
                        {(!images.idCardFront || !images.idCardBack || !images.idCardSelfie || !images.faceScan) && (
                            <p className="text-center text-xs text-red-500 mt-2">กรุณาอัปโหลดรูปภาพยืนยันตัวตนให้ครบทั้ง 4 รูปเพื่อดำเนินการต่อ</p>
                        )}
                        {(consents.personalData !== true || consents.marketing !== true || consents.creditData !== true) && (
                            <p className="text-center text-xs text-red-500 mt-1">กรุณากดยินยอมข้อตกลงและนโยบายความเป็นส่วนตัวทั้ง 3 ข้อเพื่อดำเนินการต่อ</p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
