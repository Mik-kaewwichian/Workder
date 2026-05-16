'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { getAuthSession, type AuthSession } from '@/features/auth/lib/auth';

type CreateAdminPayload = {
    email: string;
    password: string;
    role: 'admin';
    firstName?: string;
    lastName?: string;
    managerCode?: string;
    workStatus?: string;
    roleRank?: number;
};

type AdminUserItem = {
    id: number;
    role: 'admin' | 'user' | 'employer';
    roleRank?: number | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    subDistrict?: string | null;
    district?: string | null;
    province?: string | null;
    zipCode?: string | null;
    idCardSelfie?: string | null;
    faceScan?: string | null;
    createdAt?: string;
    workStatus?: string | null;
};

type UserActivityLogItem = {
    id: number;
    action: string;
    targetEmail?: string | null;
    targetRole?: string | null;
    createdAt: string;
};

const ROLE_RANK_OPTIONS = [
    { value: '1', label: '1 ผู้จัดการ/ผู้บริหาร' },
    { value: '2', label: '2 ผู้ช่วย' },
    { value: '3', label: '3 พนักงานแอดมินทั่วไป' },
] as const;

const getRoleRankLabel = (roleRank?: number | null) => {
    if (roleRank === 1) return 'ผู้จัดการ/ผู้บริหาร';
    if (roleRank === 2) return 'ผู้ช่วย';
    if (roleRank === 3) return 'พนักงานแอดมินทั่วไป';
    return 'ไม่ระบุ';
};

const formatEmployeeId = (id: number) => String(id).padStart(9, '0');

export default function AdminAddAdminPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState<'admin'>('admin');
    const [status, setStatus] = useState('active');
    const [adminId, setAdminId] = useState('');
    const [roleRank, setRoleRank] = useState('3');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [users, setUsers] = useState<AdminUserItem[]>([]);
    const [activityLogs, setActivityLogs] = useState<UserActivityLogItem[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [employeeSearch, setEmployeeSearch] = useState('');
    const [session, setSession] = useState<AuthSession | null>(null);

    const loadDashboardData = async () => {
        try {
            const [usersResponse, logsResponse] = await Promise.all([
                api.get<AdminUserItem[]>('/users'),
                api.get<UserActivityLogItem[]>('/users/activity/logs'),
            ]);

            setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
            setActivityLogs(Array.isArray(logsResponse.data) ? logsResponse.data : []);
        } catch {
            setUsers([]);
            setActivityLogs([]);
        }
    };

    useEffect(() => {
        setSession(getAuthSession());
        loadDashboardData();
    }, []);

    const attendanceSummary = useMemo(() => {
        const admins = users.filter((item) => item.role === 'admin');
        const totalEmployees = admins.length;
        const presentCount = admins.filter((item) => {
            const status = (item.workStatus ?? '').trim().toLowerCase();
            return status === 'working' || status === 'ทำงาน' || status === 'active';
        }).length;
        const absentCount = admins.filter((item) => {
            const status = (item.workStatus ?? '').trim().toLowerCase();
            return status === 'absent' || status === 'ขาด';
        }).length;
        const lateCount = admins.filter((item) => {
            const status = (item.workStatus ?? '').trim().toLowerCase();
            return status === 'late' || status === 'สาย';
        }).length;

        return {
            totalEmployees,
            presentCount,
            absentCount,
            lateCount,
            workingToday: presentCount,
        };
    }, [users]);

    const adminEmployees = useMemo(() => {
        return users
            .filter((item) => item.role === 'admin')
            .sort((left, right) => (left.roleRank ?? 999) - (right.roleRank ?? 999));
    }, [users]);

    const currentRoleRank = useMemo(() => Number(session?.roleRank ?? 999), [session?.roleRank]);
    const isAssistant = currentRoleRank === 2;

    const availableRoleRankOptions = useMemo(() => {
        if (isAssistant) {
            return ROLE_RANK_OPTIONS.filter((option) => option.value === '2' || option.value === '3');
        }
        return ROLE_RANK_OPTIONS;
    }, [isAssistant]);

    const filteredAdminEmployees = useMemo(() => {
        const keyword = employeeSearch.trim().toLowerCase();

        if (!keyword) {
            return adminEmployees;
        }

        return adminEmployees.filter((employee) => {
            const displayName = `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim().toLowerCase();
            const emailText = (employee.email ?? '').toLowerCase();
            const rankText = `${employee.roleRank ?? ''} ${getRoleRankLabel(employee.roleRank)}`.toLowerCase();
            const employeeIdText = String(employee.id);
            const formattedEmployeeIdText = formatEmployeeId(employee.id);

            return (
                displayName.includes(keyword)
                || emailText.includes(keyword)
                || rankText.includes(keyword)
                || employeeIdText.includes(keyword)
                || formattedEmployeeIdText.includes(keyword)
            );
        });
    }, [adminEmployees, employeeSearch]);

    useEffect(() => {
        if (!adminEmployees.length) {
            setSelectedEmployeeId(null);
            return;
        }

        if (selectedEmployeeId && !adminEmployees.some((item) => item.id === selectedEmployeeId)) {
            setSelectedEmployeeId(null);
        }
    }, [adminEmployees, selectedEmployeeId]);

    const selectedEmployee = useMemo(
        () => adminEmployees.find((item) => item.id === selectedEmployeeId) ?? null,
        [adminEmployees, selectedEmployeeId],
    );

    const selectedEmployeeStatusStats = useMemo(() => {
        if (!selectedEmployee) {
            return { workedDays: 0, lateCount: 0, absentCount: 0, everLate: false, everAbsent: false };
        }

        const employeeLogs = activityLogs.filter((log) => (log.targetEmail ?? '').toLowerCase() === (selectedEmployee.email ?? '').toLowerCase());
        const lateCount = employeeLogs.filter((log) => log.action.toLowerCase().includes('late') || log.action.includes('สาย')).length;
        const absentCount = employeeLogs.filter((log) => log.action.toLowerCase().includes('absent') || log.action.includes('ขาด')).length;
        const currentStatus = (selectedEmployee.workStatus ?? '').trim().toLowerCase();
        const everLate = lateCount > 0 || currentStatus === 'late' || currentStatus === 'สาย';
        const everAbsent = absentCount > 0 || currentStatus === 'absent' || currentStatus === 'ขาด';

        const createdDate = selectedEmployee.createdAt ? new Date(selectedEmployee.createdAt) : null;
        const workedDays = createdDate
            ? Math.max(1, Math.ceil((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)))
            : 0;

        return { workedDays, lateCount, absentCount, everLate, everAbsent };
    }, [activityLogs, selectedEmployee]);

    const selectedEmployeeAnalysis = useMemo(() => {
        if (!selectedEmployee) {
            return 'ยังไม่มีข้อมูลพนักงานให้วิเคราะห์';
        }

        if (selectedEmployeeStatusStats.everAbsent) {
            return 'ควรติดตามวินัยการมาปฏิบัติงานอย่างใกล้ชิด เนื่องจากมีประวัติขาดงาน';
        }

        if (selectedEmployeeStatusStats.everLate) {
            return 'มีความเสี่ยงเรื่องเวลาเข้างาน ควรวางแผนติดตามและโค้ชการทำงาน';
        }

        return 'ภาพรวมการทำงานอยู่ในเกณฑ์ดี และมีความสม่ำเสมอในการเข้างาน';
    }, [selectedEmployee, selectedEmployeeStatusStats]);

    const handleCreateAdmin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
            return;
        }

        if (role !== 'admin') {
            setError('หน้านี้ใช้สำหรับเพิ่มผู้ดูแลระบบเท่านั้น');
            return;
        }

        if (!status.trim()) {
            setError('กรุณาระบุสถานะ');
            return;
        }

        if (!adminId.trim()) {
            setError('กรุณากรอกรหัสผู้จัดการ');
            return;
        }

        setIsSubmitting(true);

        const parsedRoleRank = Number(roleRank);
        if (![1, 2, 3].includes(parsedRoleRank)) {
            setError('ลำดับบทบาทต้องเป็น 1, 2 หรือ 3 เท่านั้น');
            setIsSubmitting(false);
            return;
        }

        if (isAssistant && parsedRoleRank === 1) {
            setError('ผู้ช่วยสามารถเพิ่มเฉพาะผู้ใช้งานระดับ 2 และ 3 เท่านั้น');
            setIsSubmitting(false);
            return;
        }

        const payload: CreateAdminPayload = {
            email: email.trim().toLowerCase(),
            password,
            role,
            firstName: firstName.trim() || undefined,
            lastName: lastName.trim() || undefined,
            managerCode: adminId.trim() || undefined,
            workStatus: status.trim() || undefined,
            roleRank: parsedRoleRank,
        };

        try {
            await api.post('/users', payload);
            setSuccess(`เพิ่มแอดมินสำเร็จ: ${payload.email}`);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setFirstName('');
            setLastName('');
            setRole('admin');
            setStatus('active');
            setAdminId('');
            setRoleRank('3');
            await loadDashboardData();
        } catch (submitError: any) {
            const apiMessage = submitError?.response?.data?.message;

            if (Array.isArray(apiMessage)) {
                setError(apiMessage.join(', '));
            } else if (typeof apiMessage === 'string') {
                setError(apiMessage);
            } else {
                setError('ไม่สามารถเพิ่มแอดมินได้ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">เพิ่มผู้ดูแลระบบ</h1>
                        <p className="mt-2 text-slate-500">สร้างบัญชีผู้ดูแลระบบใหม่สำหรับเข้าใช้งานแผงแอดมิน</p>
                    </div>
                    <Link
                        href="/admin/admins"
                        className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        แก้ไขข้อมูลผู้ใช้งาน
                    </Link>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">ชื่อ</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                placeholder="เช่น สมชาย"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">นามสกุล</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                placeholder="เช่น ใจดี"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">อีเมล</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">รหัสผ่าน</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            placeholder="อย่างน้อย 8 ตัวอักษร"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">ยืนยันรหัสผ่าน</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">บทบาท</label>
                        <input
                            type="text"
                            required
                            value={role}
                            onChange={(event) => setRole(event.target.value === 'admin' ? 'admin' : 'admin')}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            placeholder="admin"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">ลำดับบทบาท</label>
                        <select
                            value={roleRank}
                            onChange={(event) => setRoleRank(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        >
                            {availableRoleRankOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">สถานะ</label>
                        <input
                            type="text"
                            required
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            placeholder="เช่น active"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">รหัสผู้จัดการ</label>
                        <input
                            type="text"
                            required
                            value={adminId}
                            onChange={(event) => setAdminId(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            placeholder="กรอกรหัสผู้จัดการ"
                        />
                    </div>

                        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
                        {success ? <p className="text-sm font-medium text-emerald-600">{success}</p> : null}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? 'กำลังเพิ่มแอดมิน...' : 'เพิ่มผู้ดูแลระบบ'}
                        </button>
                    </form>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900">ประวัติการเพิ่ม/ลบผู้ใช้งาน</h2>
                    <p className="mt-1 text-sm text-slate-500">รายการล่าสุดของการเพิ่มและการลบผู้ใช้งานในระบบ</p>

                    <div className="mt-4 space-y-2">
                        {activityLogs.length === 0 ? (
                            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">ยังไม่มีประวัติการทำรายการ</p>
                        ) : (
                            activityLogs.slice(0, 12).map((log) => {
                                const actionLabel = log.action === 'delete' ? 'ลบผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน';
                                const actionClasses = log.action === 'delete'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-emerald-100 text-emerald-700';

                                return (
                                    <div key={log.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                {log.targetEmail ?? '-'}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                บทบาท: {log.targetRole ?? '-'}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${actionClasses}`}>
                                                {actionLabel}
                                            </span>
                                            <p className="mt-1 text-[11px] text-slate-500">
                                                {new Date(log.createdAt).toLocaleString('th-TH')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <aside className="space-y-4 xl:sticky xl:top-6 xl:h-fit">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900">สรุปการทำงานวันนี้</h3>
                    <p className="mt-1 text-xs text-slate-500">อ้างอิงจากสถานะของพนักงานในระบบ</p>

                    <div className="mt-4 space-y-2.5 text-sm">
                        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                            <span className="text-slate-600">วันนี้มาทำงาน</span>
                            <span className="font-bold text-slate-900">{attendanceSummary.workingToday} คน</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                            <span className="text-slate-600">พนักงานทั้งหมด</span>
                            <span className="font-bold text-slate-900">{attendanceSummary.totalEmployees} คน</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
                            <span className="text-emerald-700">เข้างาน</span>
                            <span className="font-bold text-emerald-700">{attendanceSummary.presentCount} คน</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2">
                            <span className="text-red-700">ขาด</span>
                            <span className="font-bold text-red-700">{attendanceSummary.absentCount} คน</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2">
                            <span className="text-amber-700">สาย</span>
                            <span className="font-bold text-amber-700">{attendanceSummary.lateCount} คน</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900">รายชื่อพนักงาน</h3>
                    <p className="mt-1 text-xs text-slate-500">คลิกชื่อเพื่อดูข้อมูลรายบุคคล</p>

                    <div className="mt-3">
                        <input
                            type="text"
                            value={employeeSearch}
                            onChange={(event) => setEmployeeSearch(event.target.value)}
                            placeholder="ค้นหาชื่อ อีเมล รหัสพนักงาน หรือลำดับบทบาท"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>

                    <div className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
                        {filteredAdminEmployees.length === 0 ? (
                            <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">ยังไม่มีข้อมูลพนักงาน</p>
                        ) : (
                            filteredAdminEmployees.map((employee) => {
                                const displayName = `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim() || employee.email || `Admin #${employee.id}`;
                                const isActive = selectedEmployeeId === employee.id;

                                return (
                                    <button
                                        key={employee.id}
                                        type="button"
                                        onClick={() => setSelectedEmployeeId((previous) => (previous === employee.id ? null : employee.id))}
                                        className={`w-full rounded-xl border px-3 py-2 text-left transition ${isActive
                                            ? 'border-blue-300 bg-blue-50'
                                            : 'border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <p className="truncate text-sm font-semibold text-slate-800">{displayName}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">รหัสพนักงาน: {formatEmployeeId(employee.id)}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">ลำดับบทบาท: {employee.roleRank ?? '-'} ({getRoleRankLabel(employee.roleRank)})</p>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900">ข้อมูลพนักงานรายบุคคล</h3>
                    {!selectedEmployee ? (
                        <p className="mt-2 text-sm text-slate-500">เลือกชื่อพนักงานจากรายการด้านบน</p>
                    ) : (
                        <div className="mt-4 space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-14 w-14 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                                    {selectedEmployee.faceScan || selectedEmployee.idCardSelfie ? (
                                        <img
                                            src={selectedEmployee.faceScan || selectedEmployee.idCardSelfie || ''}
                                            alt="employee"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-500">
                                            {(selectedEmployee.firstName?.[0] || selectedEmployee.email?.[0] || 'A').toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-slate-900">
                                        {`${selectedEmployee.firstName ?? ''} ${selectedEmployee.lastName ?? ''}`.trim() || selectedEmployee.email || '-'}
                                    </p>
                                    <p className="truncate text-xs text-slate-500">{selectedEmployee.email ?? '-'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="rounded-lg bg-slate-50 px-3 py-2">
                                    <p className="text-slate-500">มาทำงาน</p>
                                    <p className="font-bold text-slate-900">{selectedEmployeeStatusStats.workedDays} วัน</p>
                                </div>
                                <div className="rounded-lg bg-slate-50 px-3 py-2">
                                    <p className="text-slate-500">ลำดับบทบาท</p>
                                    <p className="font-bold text-slate-900">{selectedEmployee.roleRank ?? '-'} ({getRoleRankLabel(selectedEmployee.roleRank)})</p>
                                </div>
                                <div className="rounded-lg bg-amber-50 px-3 py-2">
                                    <p className="text-amber-700">เคยสายไหม</p>
                                    <p className="font-bold text-amber-700">{selectedEmployeeStatusStats.lateCount} ครั้ง</p>
                                </div>
                                <div className="rounded-lg bg-red-50 px-3 py-2">
                                    <p className="text-red-700">เคยขาดไหม</p>
                                    <p className="font-bold text-red-700">{selectedEmployeeStatusStats.absentCount} ครั้ง</p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                <p className="text-xs font-semibold text-slate-600">วิเคราะห์ตลอดการทำงาน</p>
                                <p className="mt-1 text-sm text-slate-700">{selectedEmployeeAnalysis}</p>
                            </div>

                            <div className="rounded-lg border border-slate-200 px-3 py-2">
                                <p className="text-xs font-semibold text-slate-600">ช่องทางการติดต่อ</p>
                                <p className="mt-1 text-xs text-slate-700">โทร: {selectedEmployee.phone ?? '-'}</p>
                                <p className="text-xs text-slate-700">อีเมล: {selectedEmployee.email ?? '-'}</p>
                                <p className="mt-1 text-xs text-slate-700">
                                    ที่อยู่: {[selectedEmployee.address, selectedEmployee.subDistrict, selectedEmployee.district, selectedEmployee.province, selectedEmployee.zipCode].filter(Boolean).join(' ') || '-'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}