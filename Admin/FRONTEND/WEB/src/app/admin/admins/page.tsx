'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { getAuthSession, loginWithEmailPassword, type AuthSession } from '@/features/auth/lib/auth';

type AdminUser = {
    id: number;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    role: 'admin' | 'user' | 'employer';
    profileCompleted?: boolean;
    createdAt?: string;
    managerCode?: string | null;
    workStatus?: string | null;
    roleRank?: number | null;
    phone?: string | null;
    birthDate?: string | null;
    address?: string | null;
    province?: string | null;
    district?: string | null;
    subDistrict?: string | null;
    zipCode?: string | null;
    idCardSelfie?: string | null;
};

type UpdateAdminPayload = {
    email?: string;
    firstName?: string;
    lastName?: string;
    managerCode?: string;
    workStatus?: string;
    roleRank?: number;
    role?: 'admin';
    password?: string;
    idCardSelfie?: string;
    phone?: string;
    birthDate?: string;
    address?: string;
    province?: string;
    district?: string;
    subDistrict?: string;
    zipCode?: string;
};

type WorkStatus = 'working' | 'active' | 'late' | 'absent' | 'leave';

const formatEmployeeId = (id: number) => String(id).padStart(9, '0');

const getRoleRankLabel = (roleRank?: number | null) => {
    if (roleRank === 1) return 'ผู้จัดการ/ผู้บริหาร';
    if (roleRank === 2) return 'ผู้ช่วย';
    if (roleRank === 3) return 'พนักงานแอดมินทั่วไป';
    return 'ไม่ระบุ';
};

const normalizeWorkStatus = (value?: string | null): WorkStatus => {
    const normalized = (value ?? '').trim().toLowerCase();
    if (normalized === 'working' || normalized === 'active' || normalized === 'late' || normalized === 'leave') {
        return normalized;
    }

    if (normalized === 'acsent' || normalized === 'absent') {
        return 'absent';
    }

    return 'working';
};

const getWorkStatusMeta = (status?: string | null) => {
    const value = normalizeWorkStatus(status);

    if (value === 'working') {
        return { value, label: 'working', colorClass: 'bg-emerald-500' };
    }
    if (value === 'active') {
        return { value, label: 'active', colorClass: 'bg-blue-500' };
    }
    if (value === 'late') {
        return { value, label: 'late', colorClass: 'bg-orange-500' };
    }
    if (value === 'absent') {
        return { value, label: 'acsent', colorClass: 'bg-red-500' };
    }

    return { value, label: 'leave', colorClass: 'bg-yellow-400' };
};

const formatThaiDate = (value?: string | null) => {
    if (!value) {
        return '-';
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
        return '-';
    }

    return parsedDate.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const getFullAddress = (user?: AdminUser | null) => {
    if (!user) {
        return '-';
    }

    const fullAddress = [user.address, user.subDistrict, user.district, user.province, user.zipCode]
        .map((item) => (item ?? '').trim())
        .filter(Boolean)
        .join(' ');

    return fullAddress || '-';
};

const normalizePhoneForOtp = (value?: string | null) => {
    const trimmed = (value ?? '').trim();
    if (!trimmed) {
        return '';
    }

    const noSpaces = trimmed.replace(/[\s-]/g, '');
    if (noSpaces.startsWith('+66')) {
        return noSpaces;
    }
    if (noSpaces.startsWith('66')) {
        return `+${noSpaces}`;
    }
    if (noSpaces.startsWith('0')) {
        return `+66${noSpaces.slice(1)}`;
    }
    return noSpaces;
};

export default function AdminAdminsPage() {
    const [session, setSession] = useState<AuthSession | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
    const [formFirstName, setFormFirstName] = useState('');
    const [formLastName, setFormLastName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formBirthDate, setFormBirthDate] = useState('');
    const [formAddress, setFormAddress] = useState('');
    const [formProvince, setFormProvince] = useState('');
    const [formDistrict, setFormDistrict] = useState('');
    const [formSubDistrict, setFormSubDistrict] = useState('');
    const [formZipCode, setFormZipCode] = useState('');
    const [formManagerCode, setFormManagerCode] = useState('');
    const [formOldPassword, setFormOldPassword] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formConfirmPassword, setFormConfirmPassword] = useState('');
    const [formWorkStatus, setFormWorkStatus] = useState('working');
    const [formRoleRank, setFormRoleRank] = useState('3');
    const [managerPasswordConfirm, setManagerPasswordConfirm] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [isProfileSaving, setIsProfileSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [isProfileEditMode, setIsProfileEditMode] = useState(false);
    const [otpEmailCode, setOtpEmailCode] = useState('');
    const [otpPhoneCode, setOtpPhoneCode] = useState('');
    const [otpVerifiedEmailValue, setOtpVerifiedEmailValue] = useState('');
    const [otpVerifiedPhoneValue, setOtpVerifiedPhoneValue] = useState('');
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');

    useEffect(() => {
        setSession(getAuthSession());

        const fetchUsers = async () => {
            try {
                setError('');
                const { data } = await api.get<AdminUser[]>('/users');
                setUsers(Array.isArray(data) ? data : []);
            } catch {
                setError('ไม่สามารถโหลดข้อมูลผู้ดูแลระบบได้');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const adminUsers = useMemo(() => {
        return users
            .filter((item) => item.role === 'admin')
            .sort((left, right) => (left.roleRank ?? 999) - (right.roleRank ?? 999));
    }, [users]);

    const currentUserId = useMemo(() => Number(session?.userId), [session?.userId]);
    const currentRoleRank = Number(session?.roleRank ?? 999);
    const isManager = currentRoleRank === 1;
    const isAssistant = currentRoleRank === 2;
    const isGeneralAdmin = currentRoleRank === 3;

    const visibleAdminUsers = useMemo(() => {
        if (isGeneralAdmin) {
            return adminUsers.filter((item) => item.id === currentUserId);
        }

        return adminUsers;
    }, [adminUsers, currentUserId, isGeneralAdmin]);

    const filteredUsers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return visibleAdminUsers.filter((item) => {
            if (!keyword) {
                return true;
            }

            const fullName = `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim().toLowerCase();
            const email = (item.email ?? '').toLowerCase();
            const employeeId = formatEmployeeId(item.id);
            const roleRankText = `${item.roleRank ?? ''} ${getRoleRankLabel(item.roleRank)}`.toLowerCase();

            return (
                fullName.includes(keyword)
                || email.includes(keyword)
                || String(item.id).includes(keyword)
                || employeeId.includes(keyword)
                || roleRankText.includes(keyword)
            );
        });
    }, [visibleAdminUsers, search]);

    const selectedAdmin = useMemo(() => {
        return visibleAdminUsers.find((item) => item.id === selectedAdminId) ?? null;
    }, [visibleAdminUsers, selectedAdminId]);

    const selectedIsSelf = Boolean(selectedAdmin && selectedAdmin.id === currentUserId);
    const selectedIsManager = Boolean(selectedAdmin && selectedAdmin.roleRank === 1);
    const canEditSelected = Boolean(
        selectedAdmin && (isManager || selectedIsSelf) && !(isAssistant && selectedIsManager)
    );
    const canDeleteSelected = Boolean(selectedAdmin && isManager && !selectedIsSelf);
    const selectedStatusMeta = getWorkStatusMeta(formWorkStatus);
    const primaryManagerCode = adminUsers.find((item) => item.roleRank === 1)?.managerCode?.trim() || '';

    useEffect(() => {
        if (!isGeneralAdmin) {
            return;
        }

        if (currentUserId && selectedAdminId !== currentUserId) {
            setSelectedAdminId(currentUserId);
        }
    }, [currentUserId, isGeneralAdmin, selectedAdminId]);

    useEffect(() => {
        if (!selectedAdmin) {
            return;
        }

        setFormFirstName(selectedAdmin.firstName ?? '');
        setFormLastName(selectedAdmin.lastName ?? '');
        setFormEmail(selectedAdmin.email ?? '');
        setFormPhone(selectedAdmin.phone ?? '');
        setFormBirthDate(selectedAdmin.birthDate ? new Date(selectedAdmin.birthDate).toISOString().slice(0, 10) : '');
        setFormAddress(selectedAdmin.address ?? '');
        setFormProvince(selectedAdmin.province ?? '');
        setFormDistrict(selectedAdmin.district ?? '');
        setFormSubDistrict(selectedAdmin.subDistrict ?? '');
        setFormZipCode(selectedAdmin.zipCode ?? '');
        setFormManagerCode(selectedAdmin.managerCode ?? '');
        setFormOldPassword('');
        setFormPassword('');
        setFormConfirmPassword('');
        setManagerPasswordConfirm('');
        setFormWorkStatus(normalizeWorkStatus(selectedAdmin.workStatus));
        setFormRoleRank(String(selectedAdmin.roleRank ?? 3));
        setOtpEmailCode('');
        setOtpPhoneCode('');
        setOtpVerifiedEmailValue('');
        setOtpVerifiedPhoneValue('');
        setIsProfileEditMode(false);
        setProfileError('');
        setProfileSuccess('');
        setSaveError('');
        setSaveSuccess('');
    }, [selectedAdmin]);

    const currentNormalizedEmail = formEmail.trim().toLowerCase();
    const currentNormalizedPhone = normalizePhoneForOtp(formPhone);
    const originalNormalizedEmail = selectedAdmin?.email?.trim().toLowerCase() || '';
    const originalNormalizedPhone = normalizePhoneForOtp(selectedAdmin?.phone);
    const isEmailChanged = currentNormalizedEmail !== originalNormalizedEmail;
    const isPhoneChanged = currentNormalizedPhone !== originalNormalizedPhone;
    const requiresOtp = isEmailChanged || isPhoneChanged;
    const isEmailOtpSatisfied = !isEmailChanged || otpVerifiedEmailValue === currentNormalizedEmail;
    const isPhoneOtpSatisfied = !isPhoneChanged || otpVerifiedPhoneValue === currentNormalizedPhone;
    const isOtpRequirementSatisfied = isEmailOtpSatisfied && isPhoneOtpSatisfied;
    const canEditProfilePanel = canEditSelected && isProfileEditMode;

    const handleStartProfileEdit = () => {
        if (!selectedAdmin || !canEditSelected) {
            return;
        }

        setIsProfileEditMode(true);
        setProfileError('');
        setProfileSuccess('');
    };

    const handleCancelProfileEdit = () => {
        if (!selectedAdmin) {
            return;
        }

        setFormEmail(selectedAdmin.email ?? '');
        setFormPhone(selectedAdmin.phone ?? '');
        setFormBirthDate(selectedAdmin.birthDate ? new Date(selectedAdmin.birthDate).toISOString().slice(0, 10) : '');
        setFormAddress(selectedAdmin.address ?? '');
        setFormProvince(selectedAdmin.province ?? '');
        setFormDistrict(selectedAdmin.district ?? '');
        setFormSubDistrict(selectedAdmin.subDistrict ?? '');
        setFormZipCode(selectedAdmin.zipCode ?? '');
        setOtpEmailCode('');
        setOtpPhoneCode('');
        setOtpVerifiedEmailValue('');
        setOtpVerifiedPhoneValue('');
        setIsProfileEditMode(false);
        setProfileError('');
        setProfileSuccess('ยกเลิกการแก้ไขข้อมูลส่วนตัวแล้ว');
    };

    const handleSendProfileOtp = async () => {
        if (!selectedAdmin || !canEditProfilePanel) {
            return;
        }

        if (!requiresOtp) {
            setProfileError('ยังไม่มีการเปลี่ยนอีเมลหรือเบอร์โทร จึงไม่ต้องส่ง OTP');
            return;
        }

        if (isEmailChanged && !currentNormalizedEmail) {
            setProfileError('กรุณาระบุอีเมลใหม่ให้ถูกต้องก่อนส่ง OTP');
            return;
        }

        if (isPhoneChanged && !currentNormalizedPhone) {
            setProfileError('กรุณาระบุเบอร์โทรใหม่ก่อนส่ง OTP');
            return;
        }

        setIsSendingOtp(true);
        setProfileError('');
        setProfileSuccess('');

        try {
            const { data } = await api.post(`/users/${selectedAdmin.id}/profile-otp/send`, {
                email: isEmailChanged ? currentNormalizedEmail : undefined,
                phone: isPhoneChanged ? currentNormalizedPhone : undefined,
            });
            if (isEmailChanged) {
                setOtpVerifiedEmailValue('');
                setOtpEmailCode('');
            }
            if (isPhoneChanged) {
                setOtpVerifiedPhoneValue('');
                setOtpPhoneCode('');
            }
            setProfileSuccess('ส่ง OTP เรียบร้อย');
        } catch (sendErr: any) {
            const apiMessage = sendErr?.response?.data?.message;
            if (Array.isArray(apiMessage)) {
                setProfileError(apiMessage.join(', '));
            } else if (typeof apiMessage === 'string') {
                setProfileError(apiMessage);
            } else {
                setProfileError('ส่ง OTP ไม่สำเร็จ กรุณาลองใหม่');
            }
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyProfileOtp = async () => {
        if (!selectedAdmin || !canEditProfilePanel) {
            return;
        }

        if (!requiresOtp) {
            setProfileError('ยังไม่มีการเปลี่ยนอีเมลหรือเบอร์โทร จึงไม่ต้องยืนยัน OTP');
            return;
        }

        const canVerifyEmail = isEmailChanged && Boolean(otpEmailCode.trim());
        const canVerifyPhone = isPhoneChanged && Boolean(otpPhoneCode.trim());

        if (!canVerifyEmail && !canVerifyPhone) {
            setProfileError('กรุณากรอก OTP อย่างน้อย 1 ช่องที่มีการเปลี่ยนข้อมูล');
            return;
        }

        setIsVerifyingOtp(true);
        setProfileError('');
        setProfileSuccess('');

        try {
            await api.post(`/users/${selectedAdmin.id}/profile-otp/verify`, {
                email: isEmailChanged ? currentNormalizedEmail : undefined,
                phone: isPhoneChanged ? currentNormalizedPhone : undefined,
                emailOtp: canVerifyEmail ? otpEmailCode.trim() : undefined,
                phoneOtp: canVerifyPhone ? otpPhoneCode.trim() : undefined,
            });
            if (canVerifyEmail) {
                setOtpVerifiedEmailValue(currentNormalizedEmail);
            }
            if (canVerifyPhone) {
                setOtpVerifiedPhoneValue(currentNormalizedPhone);
            }
            setProfileSuccess('ยืนยัน OTP สำเร็จ');
        } catch (verifyErr: any) {
            const apiMessage = verifyErr?.response?.data?.message;
            if (Array.isArray(apiMessage)) {
                setProfileError(apiMessage.join(', '));
            } else if (typeof apiMessage === 'string') {
                setProfileError(apiMessage);
            } else {
                setProfileError('ยืนยัน OTP ไม่สำเร็จ กรุณาตรวจสอบรหัสอีกครั้ง');
            }
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!selectedAdmin || !canEditProfilePanel) {
            return;
        }

        if (requiresOtp && !isOtpRequirementSatisfied) {
            const pendingChannels = [
                isEmailChanged && !isEmailOtpSatisfied ? 'อีเมล' : null,
                isPhoneChanged && !isPhoneOtpSatisfied ? 'เบอร์โทร' : null,
            ].filter(Boolean).join(' และ ');
            setProfileError(`กรุณายืนยัน OTP ${pendingChannels} ก่อนบันทึกข้อมูลส่วนตัว`);
            return;
        }

        setIsProfileSaving(true);
        setProfileError('');
        setProfileSuccess('');

        try {
            const payload: UpdateAdminPayload = {
                email: currentNormalizedEmail,
                phone: currentNormalizedPhone || undefined,
                address: formAddress.trim() || undefined,
                province: formProvince.trim() || undefined,
                district: formDistrict.trim() || undefined,
                subDistrict: formSubDistrict.trim() || undefined,
                zipCode: formZipCode.trim() || undefined,
            };
            const { data } = await api.patch<AdminUser>(`/users/${selectedAdmin.id}/profile`, payload);
            setUsers((prev) => prev.map((item) => (item.id === selectedAdmin.id ? { ...item, ...data } : item)));
            setProfileSuccess('บันทึกข้อมูลส่วนตัวสำเร็จ');
            setOtpVerifiedEmailValue('');
            setOtpVerifiedPhoneValue('');
            setOtpEmailCode('');
            setOtpPhoneCode('');
            setIsProfileEditMode(false);
        } catch (saveErr: any) {
            const apiMessage = saveErr?.response?.data?.message;
            if (Array.isArray(apiMessage)) {
                setProfileError(apiMessage.join(', '));
            } else if (typeof apiMessage === 'string') {
                setProfileError(apiMessage);
            } else {
                setProfileError('ไม่สามารถบันทึกข้อมูลส่วนตัวได้ กรุณาลองใหม่');
            }
        } finally {
            setIsProfileSaving(false);
        }
    };

    const handleSaveAdmin = async () => {
        if (!selectedAdmin) {
            return;
        }

        if (!canEditSelected) {
            setSaveError('สิทธิ์ไม่เพียงพอ: ลำดับ 1 เท่านั้นที่แก้ข้อมูลผู้อื่นได้');
            return;
        }

        const parsedRoleRank = Number(formRoleRank);
        if (![1, 2, 3].includes(parsedRoleRank)) {
            setSaveError('ระดับ ต้องเป็น 1, 2 หรือ 3 เท่านั้น');
            return;
        }

        if (!formEmail.trim()) {
            setSaveError('กรุณาระบุอีเมล');
            return;
        }



        const isSelfPasswordChange = selectedIsSelf && Boolean(formPassword.trim());

        if (isManager && !isSelfPasswordChange) {
            if (!managerPasswordConfirm.trim()) {
                setSaveError('กรุณากรอกรหัสผ่านผู้จัดการเพื่อยืนยันการบันทึก');
                return;
            }

            const managerAuth = await loginWithEmailPassword(session?.email ?? '', managerPasswordConfirm);
            if (!managerAuth || managerAuth.roleRank !== 1) {
                setSaveError('รหัสผ่านผู้จัดการไม่ถูกต้อง');
                return;
            }
        }

        if (formPassword && formPassword.length < 8) {
            setSaveError('รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร');
            return;
        }

        if (formPassword !== formConfirmPassword) {
            setSaveError('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
            return;
        }

        if (formPassword && selectedIsSelf) {
            if (!formOldPassword.trim()) {
                setSaveError('การเปลี่ยนรหัสผ่านของตัวเองต้องกรอกรหัสผ่านเดิมเพื่อยืนยัน');
                return;
            }

            const selfAuth = await loginWithEmailPassword(formEmail.trim().toLowerCase(), formOldPassword);
            if (!selfAuth || Number(selfAuth.userId) !== selectedAdmin.id) {
                setSaveError('รหัสผ่านเดิมไม่ถูกต้อง');
                return;
            }
        }

        setIsSaving(true);
        setSaveError('');
        setSaveSuccess('');

        const payload: UpdateAdminPayload = {
            role: 'admin',
            email: formEmail.trim().toLowerCase(),
            firstName: formFirstName.trim() || undefined,
            lastName: formLastName.trim() || undefined,
            managerCode: formManagerCode.trim() || undefined,
            roleRank: parsedRoleRank,
            password: formPassword.trim() || undefined,
        };

        try {
            const { data } = await api.patch<AdminUser>(`/users/${selectedAdmin.id}`, payload);
            setUsers((prev) => prev.map((item) => (item.id === selectedAdmin.id ? { ...item, ...data } : item)));
            setFormOldPassword('');
            setFormPassword('');
            setFormConfirmPassword('');
            setManagerPasswordConfirm('');
            setSaveSuccess('บันทึกการแก้ไขข้อมูลผู้ดูแลระบบสำเร็จ');
        } catch (saveErr: any) {
            const apiMessage = saveErr?.response?.data?.message;
            if (Array.isArray(apiMessage)) {
                setSaveError(apiMessage.join(', '));
            } else if (typeof apiMessage === 'string') {
                setSaveError(apiMessage);
            } else {
                setSaveError('ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAdmin = async () => {
        if (!selectedAdmin) {
            return;
        }

        if (!canDeleteSelected) {
            setSaveError('สิทธิ์ไม่เพียงพอ: ลำดับ 1 เท่านั้นที่ลบผู้ใช้งานคนอื่นได้');
            return;
        }

        if (!managerPasswordConfirm.trim()) {
            setSaveError('กรุณากรอกรหัสผ่านผู้จัดการเพื่อยืนยันการลบ');
            return;
        }

        const managerAuth = await loginWithEmailPassword(session?.email ?? '', managerPasswordConfirm);
        if (!managerAuth || managerAuth.roleRank !== 1) {
            setSaveError('รหัสผ่านผู้จัดการไม่ถูกต้อง');
            return;
        }

        if (!confirm(`ยืนยันการลบผู้ใช้งาน ${selectedAdmin.email ?? formatEmployeeId(selectedAdmin.id)} ?`)) {
            return;
        }

        setIsDeleting(true);
        setSaveError('');
        setSaveSuccess('');

        try {
            await api.delete(`/users/${selectedAdmin.id}`);
            setUsers((prev) => prev.filter((item) => item.id !== selectedAdmin.id));
            setSelectedAdminId(null);
            setManagerPasswordConfirm('');
            setSaveSuccess('ลบข้อมูลผู้ใช้งานสำเร็จ');
        } catch (deleteErr: any) {
            const apiMessage = deleteErr?.response?.data?.message;
            if (Array.isArray(apiMessage)) {
                setSaveError(apiMessage.join(', '));
            } else if (typeof apiMessage === 'string') {
                setSaveError(apiMessage);
            } else {
                setSaveError('ไม่สามารถลบข้อมูลผู้ใช้งานได้ กรุณาลองใหม่');
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedAdmin || !canEditSelected) {
            return;
        }

        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setSaveError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
            return;
        }

        try {
            const base64Image = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result || ''));
                reader.onerror = () => reject(new Error('read-file-failed'));
                reader.readAsDataURL(file);
            });

            if (!base64Image) {
                setSaveError('ไม่สามารถอ่านไฟล์รูปภาพได้');
                return;
            }

            setIsUploadingAvatar(true);
            setSaveError('');
            setSaveSuccess('');

            const payload: UpdateAdminPayload = {
                idCardSelfie: base64Image,
            };

            const { data } = await api.patch<AdminUser>(`/users/${selectedAdmin.id}`, payload);
            setUsers((prev) => prev.map((item) => (item.id === selectedAdmin.id ? { ...item, ...data } : item)));
            setSaveSuccess('อัปเดตรูปภาพประจำตัวสำเร็จ');
        } catch {
            setSaveError('ไม่สามารถอัปเดตรูปภาพได้ กรุณาลองใหม่');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const renderProfilePanel = () => {
        if (!selectedAdmin) {
            return (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900">ข้อมูลพนักงาน</h3>
                    <p className="mt-2 text-sm text-slate-500">เลือกรายชื่อผู้ดูแลระบบเพื่อดูข้อมูลส่วนตัว</p>
                </div>
            );
        }

        const fullName = `${selectedAdmin.firstName ?? ''} ${selectedAdmin.lastName ?? ''}`.trim() || '-';
        const avatarFallbackText = (selectedAdmin.firstName?.trim()?.[0]
            || selectedAdmin.email?.trim()?.[0]
            || 'U').toUpperCase();

        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-bold text-slate-900">ข้อมูลพนักงาน</h3>

                <div className="mt-3 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={handleStartProfileEdit}
                        disabled={!canEditSelected || isProfileEditMode || isProfileSaving || isSendingOtp || isVerifyingOtp}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isProfileEditMode ? 'กำลังแก้ไขข้อมูล' : 'แก้ไขข้อมูล'}
                    </button>
                    {isProfileEditMode ? (
                        <button
                            type="button"
                            onClick={handleCancelProfileEdit}
                            disabled={isProfileSaving || isSendingOtp || isVerifyingOtp}
                            className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            ยกเลิกแก้ไข
                        </button>
                    ) : null}
                </div>

                {profileError ? <p className="mt-3 text-sm font-medium text-red-600">{profileError}</p> : null}
                {profileSuccess ? <p className="mt-3 text-sm font-medium text-emerald-600">{profileSuccess}</p> : null}

                <div className="mt-4 flex items-center gap-3">
                    <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                        {selectedAdmin.idCardSelfie ? (
                            <img src={selectedAdmin.idCardSelfie} alt={fullName} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-base font-bold text-slate-500">
                                {avatarFallbackText}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">{fullName}</p>
                        <p className="mt-0.5 text-xs text-slate-500">รหัสพนักงาน: {formatEmployeeId(selectedAdmin.id)}</p>
                    </div>
                </div>

                {!isProfileEditMode ? (
                    <div className="mt-4 space-y-2 text-sm">
                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                            <p className="text-xs font-semibold text-slate-600">ข้อมูลส่วนตัว</p>
                            <p className="mt-1 text-slate-700">อีเมล: {selectedAdmin.email ?? '-'}</p>
                            <p className="mt-0.5 text-slate-700">โทร: {selectedAdmin.phone ?? '-'}</p>
                        </div>

                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                            <p className="text-xs font-semibold text-slate-600">วันเดือนปีเกิด</p>
                            <p className="mt-1 text-slate-700">{formatThaiDate(selectedAdmin.birthDate)}</p>
                        </div>

                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                            <p className="text-xs font-semibold text-slate-600">ที่อยู่</p>
                            <p className="mt-1 text-slate-700">{getFullAddress(selectedAdmin)}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mt-4 space-y-2 text-sm">
                            <div className="rounded-lg bg-slate-50 px-3 py-2">
                                <p className="text-xs font-semibold text-slate-600">ข้อมูลส่วนตัว</p>
                                <div className="mt-2 space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">อีเมล</label>
                                    <input
                                        type="email"
                                        value={formEmail}
                                        onChange={(event) => {
                                            setFormEmail(event.target.value);
                                            setOtpVerifiedEmailValue('');
                                        }}
                                        disabled={!canEditProfilePanel || isProfileSaving || isSendingOtp || isVerifyingOtp}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                                        placeholder="example@email.com"
                                    />
                                </div>
                                <div className="mt-2 space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">เบอร์โทร</label>
                                    <input
                                        type="text"
                                        value={formPhone}
                                        onChange={(event) => {
                                            setFormPhone(event.target.value);
                                            setOtpVerifiedPhoneValue('');
                                        }}
                                        disabled={!canEditProfilePanel || isProfileSaving || isSendingOtp || isVerifyingOtp}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                                        placeholder="08XXXXXXXX"
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg bg-slate-50 px-3 py-2">
                                <p className="text-xs font-semibold text-slate-600">วันเดือนปีเกิด</p>
                                <input
                                    type="text"
                                    value={formatThaiDate(formBirthDate || selectedAdmin.birthDate)}
                                    disabled
                                    className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600 outline-none"
                                />
                                <p className="mt-1 text-[11px] text-slate-500">อิงข้อมูลจากบัตรประชาชน ไม่สามารถแก้ไขได้</p>
                            </div>

                            <div className="rounded-lg bg-slate-50 px-3 py-2">
                                <p className="text-xs font-semibold text-slate-600">ที่อยู่</p>
                                <div className="mt-2 space-y-1.5">
                                    <input
                                        type="text"
                                        value={formAddress}
                                        onChange={(event) => setFormAddress(event.target.value)}
                                        disabled={!canEditProfilePanel || isProfileSaving}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                                        placeholder="บ้านเลขที่/ถนน"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={formSubDistrict}
                                            onChange={(event) => setFormSubDistrict(event.target.value)}
                                            disabled={!canEditProfilePanel || isProfileSaving}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                                            placeholder="ตำบล/แขวง"
                                        />
                                        <input
                                            type="text"
                                            value={formDistrict}
                                            onChange={(event) => setFormDistrict(event.target.value)}
                                            disabled={!canEditProfilePanel || isProfileSaving}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                                            placeholder="อำเภอ/เขต"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={formProvince}
                                            onChange={(event) => setFormProvince(event.target.value)}
                                            disabled={!canEditProfilePanel || isProfileSaving}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                                            placeholder="จังหวัด"
                                        />
                                        <input
                                            type="text"
                                            value={formZipCode}
                                            onChange={(event) => setFormZipCode(event.target.value)}
                                            disabled={!canEditProfilePanel || isProfileSaving}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                                            placeholder="รหัสไปรษณีย์"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {requiresOtp ? (
                            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <p className="text-xs font-semibold text-slate-700">ยืนยัน OTP เฉพาะช่องที่เปลี่ยน</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={handleSendProfileOtp}
                                        disabled={!canEditProfilePanel || isSendingOtp || isVerifyingOtp || isProfileSaving}
                                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {isSendingOtp ? 'กำลังส่ง OTP...' : 'ส่ง OTP'}
                                    </button>
                                    <span className={`inline-flex items-center rounded-lg px-2 py-1 text-[11px] font-semibold ${isOtpRequirementSatisfied ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {isOtpRequirementSatisfied ? 'OTP ครบตามที่ต้องใช้' : 'OTP ยังไม่ครบ'}
                                    </span>
                                </div>

                                <div className="mt-2 space-y-2">
                                    {isEmailChanged ? (
                                        <input
                                            type="text"
                                            value={otpEmailCode}
                                            onChange={(event) => setOtpEmailCode(event.target.value)}
                                            disabled={!canEditProfilePanel || isVerifyingOtp || isProfileSaving}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                                            placeholder="OTP อีเมล 6 หลัก"
                                        />
                                    ) : null}
                                    {isPhoneChanged ? (
                                        <input
                                            type="text"
                                            value={otpPhoneCode}
                                            onChange={(event) => setOtpPhoneCode(event.target.value)}
                                            disabled={!canEditProfilePanel || isVerifyingOtp || isProfileSaving}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                                            placeholder="OTP เบอร์โทร 6 หลัก"
                                        />
                                    ) : null}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleVerifyProfileOtp}
                                    disabled={!canEditProfilePanel || isVerifyingOtp || isProfileSaving || ((!isEmailChanged || !otpEmailCode.trim()) && (!isPhoneChanged || !otpPhoneCode.trim()))}
                                    className="mt-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isVerifyingOtp ? 'กำลังยืนยัน OTP...' : 'ยืนยัน OTP'}
                                </button>
                            </div>
                        ) : null}
                    </>
                )}

                <div className="mt-4">
                    <label
                        htmlFor="admin-avatar-upload"
                        className={`inline-flex cursor-pointer items-center justify-center rounded-xl px-3 py-2 text-xs font-bold text-white transition ${canEditProfilePanel
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'cursor-not-allowed bg-slate-400'
                            }`}
                    >
                        {isUploadingAvatar ? 'กำลังอัปโหลด...' : 'เปลี่ยนรูปภาพประจำตัว'}
                    </label>
                    <input
                        id="admin-avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        disabled={!canEditProfilePanel || isUploadingAvatar || isProfileSaving}
                        className="hidden"
                    />
                </div>

                {isProfileEditMode ? (
                    <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={!canEditProfilePanel || isProfileSaving || isUploadingAvatar || (requiresOtp && !isOtpRequirementSatisfied)}
                        className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isProfileSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลส่วนตัว'}
                    </button>
                ) : null}
            </div>
        );
    };

    const renderEditorPanel = () => {
        if (!selectedAdmin) {
            return (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900">แก้ไขข้อมูลรายบุคคล</h3>
                    <p className="mt-2 text-sm text-slate-500">คลิกรายชื่อผู้ดูแลระบบจากตารางด้านซ้ายเพื่อแก้ไขข้อมูล</p>
                </div>
            );
        }

        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-bold text-slate-900">แก้ไขข้อมูลผู้ดูแลระบบ</h3>
                <p className="mt-1 text-xs text-slate-500">รหัสพนักงาน: {formatEmployeeId(selectedAdmin.id)}</p>
                <p className="mt-1 text-xs text-slate-500">{getRoleRankLabel(currentRoleRank)}</p>
                {!canEditSelected ? (
                    <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                        คุณแก้ข้อมูลบัญชีนี้ไม่ได้ (ลำดับ 1 แก้ได้ทุกบัญชี, ลำดับ 2/3 แก้ได้เฉพาะของตัวเอง)
                    </p>
                ) : null}

                <div className="mt-2 space-y-3">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">ชื่อ</label>
                        <input
                            type="text"
                            value={formFirstName}
                            onChange={(event) => setFormFirstName(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">นามสกุล</label>
                        <input
                            type="text"
                            value={formLastName}
                            onChange={(event) => setFormLastName(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">อีเมล</label>
                        <input
                            type="email"
                            value={formEmail}
                            onChange={(event) => setFormEmail(event.target.value)}
                            disabled={!canEditSelected}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">รหัสผ่านเดิม (สำหรับเปลี่ยนรหัสตัวเอง)</label>
                        <input
                            type="password"
                            value={formOldPassword}
                            onChange={(event) => setFormOldPassword(event.target.value)}
                            disabled={!canEditSelected}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            placeholder="กรอกรหัสผ่านเดิม 1 ครั้ง"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">รหัสผ่านใหม่ (ไม่กรอก = ใช้รหัสเดิม)</label>
                        <input
                            type="password"
                            value={formPassword}
                            onChange={(event) => setFormPassword(event.target.value)}
                            disabled={!canEditSelected}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            placeholder="อย่างน้อย 8 ตัวอักษร"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">ยืนยันรหัสผ่านใหม่</label>
                        <input
                            type="password"
                            value={formConfirmPassword}
                            onChange={(event) => setFormConfirmPassword(event.target.value)}
                            disabled={!canEditSelected}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">สถานะ</label>
                        <div className="relative">
                            <span className={`pointer-events-none absolute left-3 top-1/2 inline-block h-2.5 w-2.5 -translate-y-1/2 rounded-full ${selectedStatusMeta.colorClass}`} />
                            <input
                                type="text"
                                value={selectedStatusMeta.label}
                                disabled
                                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm text-slate-600 outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">ระดับ</label>
                        <input
                            type="text"
                            value={`${formRoleRank} ${getRoleRankLabel(Number(formRoleRank))}`}
                            disabled
                            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none"
                        />
                    </div>
                    {isManager ? (
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">รหัสผ่านผู้จัดการ (ยืนยันก่อนบันทึก/ลบ)</label>
                            <input
                                type="password"
                                value={managerPasswordConfirm}
                                onChange={(event) => setManagerPasswordConfirm(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                placeholder="กรอกรหัสผ่านผู้จัดการ"
                            />
                        </div>
                    ) : null}
                </div>

                {saveError ? <p className="mt-4 text-sm font-medium text-red-600">{saveError}</p> : null}
                {saveSuccess ? <p className="mt-4 text-sm font-medium text-emerald-600">{saveSuccess}</p> : null}

                <button
                    type="button"
                    onClick={handleSaveAdmin}
                    disabled={isSaving || isDeleting || !canEditSelected}
                    className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                </button>

                {isManager ? (
                    <button
                        type="button"
                        onClick={handleDeleteAdmin}
                        disabled={isSaving || isDeleting || !canDeleteSelected}
                        className="mt-2 w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isDeleting ? 'กำลังลบ...' : 'ลบข้อมูลผู้ใช้งาน'}
                    </button>
                ) : null}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className={isGeneralAdmin ? 'xl:col-span-3' : 'xl:col-span-2'}>
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">แก้ไขข้อมูลผู้ดูแลระบบ</h1>
                        <p className="mt-2 text-slate-500">ค้นหาและแก้ไขบัญชีพนักงานที่เป็นผู้ดูแลระบบ</p>
                    </div>
                    {isManager ? (
                        <Link
                            href="/admin/admins/add"
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                            เพิ่มผู้ดูแลระบบ
                        </Link>
                    ) : isAssistant ? (
                        <Link
                            href="/admin/users/add"
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                            เพิ่มผู้ใช้งาน
                        </Link>
                    ) : null}
                </div>

                {!isGeneralAdmin ? (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">ค้นหาผู้ดูแลระบบ</label>
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="ค้นหาด้วยชื่อ, อีเมล, รหัสพนักงาน หรือสิทธิ์"
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>
                ) : null}

                {!isGeneralAdmin ? (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {isLoading ? (
                            <p className="p-6 text-sm text-slate-500">กำลังโหลดข้อมูลผู้ดูแลระบบ...</p>
                        ) : error ? (
                            <p className="p-6 text-sm font-medium text-red-600">{error}</p>
                        ) : filteredUsers.length === 0 ? (
                            <p className="p-6 text-sm text-slate-500">ไม่พบข้อมูลผู้ดูแลระบบตามคำค้นหา</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">รหัสพนักงาน</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">ชื่อ</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">อีเมล</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">สิทธิ์</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">สร้างเมื่อ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredUsers.map((item) => {
                                            const fullName = `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim() || '-';
                                            const createdAt = item.createdAt
                                                ? new Date(item.createdAt).toLocaleString('th-TH')
                                                : '-';
                                            const isSelected = selectedAdminId === item.id;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    onClick={() => setSelectedAdminId((previous) => (previous === item.id ? null : item.id))}
                                                    className={`cursor-pointer transition ${isSelected ? 'bg-blue-50' : 'hover:bg-slate-50/60'}`}
                                                >
                                                    <td className="px-4 py-3 text-sm font-semibold text-slate-700">{formatEmployeeId(item.id)}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">{fullName}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">{item.email ?? '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">{item.roleRank ?? '-'} ({getRoleRankLabel(item.roleRank)})</td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">{createdAt}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : null}

                {isGeneralAdmin ? (
                    <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
                        <div>{renderEditorPanel()}</div>
                        <div>{renderProfilePanel()}</div>
                    </div>
                ) : null}
            </div>

            {!isGeneralAdmin ? (
                <aside className="space-y-4 xl:sticky xl:top-6 xl:h-fit">
                    {renderEditorPanel()}
                    {renderProfilePanel()}
                </aside>
            ) : null}
        </div>
    );
}
