'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Printer, Trash2 } from 'lucide-react';
import api from '@/lib/api';

type User = {
    id: number;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    role: 'admin' | 'user' | 'employer';
    profileCompleted?: boolean;
    workStatus?: string | null;
    occupation?: string | null;
    certificates?: string | null;
    rating?: number | null;
    reviewCount?: number | null;
    createdAt?: string;
};

type Job = {
    id: number;
    title?: string | null;
    type?: string | null;
    status?: string | null;
    payAmount?: number | null;
    category?: string | null;
    createdAt?: string;
    updatedAt?: string;
    postedById?: number | null;
    workerId?: number | null;
    userId?: number | null;
    assignedToId?: number | null;
};

type UserActivityLogItem = {
    id: number;
    action: string;
    targetUserId?: number | null;
    targetEmail?: string | null;
    targetRole?: string | null;
    createdAt: string;
};

type TimelineItem = {
    id: string;
    type: 'accept_job' | 'post_job' | 'system';
    title: string;
    detail?: string;
    amount?: number;
    at: string;
};

type DailySummary = {
    dateKey: string;
    totalActivities: number;
    postedJobs: number;
    acceptedJobs: number;
    totalJobValue: number;
};

type DailySnapshot = {
    userId: number;
    generatedAt: string;
    summary: DailySummary;
};

type SnapshotStore = Record<string, Record<string, DailySnapshot>>;

const SNAPSHOT_STORAGE_KEY = 'admin-customers-daily-snapshots-v2';

const getDateKey = (value?: string | Date) => {
    const date = value ? new Date(value) : new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDateTime = (value?: string) => {
    if (!value) {
        return '-';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '-';
    }

    return date.toLocaleString('th-TH');
};

const formatMoney = (amount: number) => `฿${amount.toLocaleString('th-TH')}`;

const formatCustomerId = (id: number) => `WD${String(id).padStart(5, '0')}`;

const formatEmployeeId = (id: number) => String(id).padStart(9, '0');

const getDisplayId = (id: number, role: string) => (role === 'admin' ? formatEmployeeId(id) : formatCustomerId(id));

export default function AdminCustomersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [activityLogs, setActivityLogs] = useState<UserActivityLogItem[]>([]);
    const [dailySnapshots, setDailySnapshots] = useState<SnapshotStore>({});
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState('');

    const loadCustomersData = async (isManualRefresh = false) => {
        if (isManualRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        setError('');

        const [usersResult, jobsResult, logsResult] = await Promise.allSettled([
            api.get<User[]>('/users'),
            api.get<Job[]>('/jobs'),
            api.get<UserActivityLogItem[]>('/users/activity/logs'),
        ]);

        const usersLoaded = usersResult.status === 'fulfilled';
        const jobsLoaded = jobsResult.status === 'fulfilled';
        const logsLoaded = logsResult.status === 'fulfilled';

        setUsers(usersLoaded && Array.isArray(usersResult.value.data) ? usersResult.value.data : []);
        setJobs(jobsLoaded && Array.isArray(jobsResult.value.data) ? jobsResult.value.data : []);
        setActivityLogs(logsLoaded && Array.isArray(logsResult.value.data) ? logsResult.value.data : []);

        if (!usersLoaded) {
            setError('ไม่สามารถเชื่อมต่อ API ลูกค้าได้ (http://localhost:4000/users) กรุณาเปิด Admin API ก่อน');
        } else if (!jobsLoaded || !logsLoaded) {
            const missingParts = [
                !jobsLoaded ? 'งาน' : '',
                !logsLoaded ? 'ประวัติกิจกรรม' : '',
            ].filter(Boolean).join(', ');
            setError(`โหลดได้บางส่วน: ${missingParts} ไม่พร้อมใช้งาน`);
        }

        if (isManualRefresh) {
            setIsRefreshing(false);
        } else {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCustomersData();

        try {
            const storedSnapshots = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
            if (storedSnapshots) {
                const parsedSnapshots = JSON.parse(storedSnapshots);
                setDailySnapshots(parsedSnapshots && typeof parsedSnapshots === 'object' ? parsedSnapshots : {});
            }
        } catch {
            setDailySnapshots({});
        }
    }, []);

    const filteredUsers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return users.filter((item) => {
            if (!keyword) {
                return true;
            }

            const fullName = `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim().toLowerCase();
            const email = (item.email ?? '').toLowerCase();

            return fullName.includes(keyword) || email.includes(keyword) || String(item.id).includes(keyword);
        });
    }, [users, search]);

    const selectedUser = useMemo(() => users.find((user) => user.id === selectedUserId) ?? null, [users, selectedUserId]);

    const selectedUserJobs = useMemo(() => {
        if (!selectedUser) {
            return [] as Job[];
        }

        return jobs.filter((job) => {
            const postedBySelected = job.postedById === selectedUser.id;
            const assignedToSelected =
                job.workerId === selectedUser.id ||
                job.userId === selectedUser.id ||
                job.assignedToId === selectedUser.id;

            if (selectedUser.role === 'employer') {
                return postedBySelected;
            }

            return assignedToSelected;
        });
    }, [jobs, selectedUser]);

    const getRoleLabel = (role: string) => {
        const roleMap: Record<string, string> = {
            admin: 'ผู้ดูแลระบบ',
            user: 'ผู้ใช้งาน',
            employer: 'นายจ้าง',
        };
        return roleMap[role] || role;
    };

    const todayKey = getDateKey();

    const todayTimeline = useMemo<TimelineItem[]>(() => {
        if (!selectedUser) {
            return [];
        }

        const todayUserLogs: TimelineItem[] = activityLogs
            .filter((log) => {
                const sameUser =
                    log.targetUserId === selectedUser.id ||
                    (log.targetEmail ?? '').toLowerCase() === (selectedUser.email ?? '').toLowerCase();
                return sameUser && getDateKey(log.createdAt) === todayKey;
            })
            .map((log) => {
                const actionText = (log.action || '').toLowerCase();
                const title = actionText === 'create'
                    ? 'สร้างบัญชีผู้ใช้งาน'
                    : actionText === 'delete'
                        ? 'ลบบัญชีผู้ใช้งาน'
                        : `กิจกรรมระบบ: ${log.action}`;

                return {
                    id: `log-${log.id}`,
                    type: 'system',
                    title,
                    detail: log.targetRole ? `บทบาท: ${getRoleLabel(log.targetRole)}` : undefined,
                    at: log.createdAt,
                };
            });

        const postedToday: TimelineItem[] = jobs
            .filter((job) => job.postedById === selectedUser.id && getDateKey(job.createdAt) === todayKey)
            .map((job) => ({
                id: `post-${job.id}`,
                type: 'post_job',
                title: 'โพสต์งาน',
                detail: job.title || `งาน #${job.id}`,
                amount: Number(job.payAmount) || 0,
                at: job.createdAt || new Date().toISOString(),
            }));

        const acceptedStatuses = new Set(['accepted', 'hired', 'in_progress', 'completed', 'closed']);
        const acceptedToday: TimelineItem[] = jobs
            .filter((job) => {
                const assigned =
                    job.workerId === selectedUser.id ||
                    job.userId === selectedUser.id ||
                    job.assignedToId === selectedUser.id;
                const status = (job.status || '').toLowerCase();
                const timestamp = job.updatedAt || job.createdAt;
                return assigned && acceptedStatuses.has(status) && getDateKey(timestamp) === todayKey;
            })
            .map((job) => ({
                id: `accept-${job.id}`,
                type: 'accept_job',
                title: 'รับงาน',
                detail: job.title || `งาน #${job.id}`,
                amount: Number(job.payAmount) || 0,
                at: job.updatedAt || job.createdAt || new Date().toISOString(),
            }));

        return [...todayUserLogs, ...postedToday, ...acceptedToday].sort(
            (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
        );
    }, [activityLogs, jobs, selectedUser, todayKey]);

    const todaySummary = useMemo((): DailySummary => {
        const postedJobs = todayTimeline.filter((item) => item.type === 'post_job').length;
        const acceptedJobs = todayTimeline.filter((item) => item.type === 'accept_job').length;
        const totalJobValue = todayTimeline
            .filter((item) => item.type === 'post_job' || item.type === 'accept_job')
            .reduce((sum, item) => sum + (item.amount || 0), 0);

        return {
            dateKey: todayKey,
            totalActivities: todayTimeline.length,
            postedJobs,
            acceptedJobs,
            totalJobValue,
        };
    }, [todayKey, todayTimeline]);

    const customerInsights = useMemo(() => {
        if (!selectedUser) {
            return {
                signupDateLabel: '-',
                totalAcceptedJobs: 0,
                profileStatusLabel: '-',
                skillsAndCategories: '-',
                ratingLabel: '-',
                reviewLabel: '-',
                totalMoneyLabel: '฿0',
                hiringVolumeLabel: '฿0',
            };
        }

        const signupDateLabel = formatDateTime(selectedUser.createdAt);
        const acceptedStatuses = new Set(['accepted', 'hired', 'in_progress', 'completed', 'closed']);
        const totalAcceptedJobs = selectedUserJobs.filter((job) => acceptedStatuses.has((job.status || '').toLowerCase())).length;

        const profileStatusLabel = selectedUser.profileCompleted ? 'สมบูรณ์' : 'ยังไม่สมบูรณ์';

        const skillsSource = [
            selectedUser.occupation,
            selectedUser.certificates,
            ...selectedUserJobs.map((job) => job.category || job.type),
        ]
            .filter((value): value is string => Boolean(value && value.trim()))
            .map((value) => value.trim());

        const uniqueSkills = [...new Set(skillsSource)];
        const skillsAndCategories = uniqueSkills.length > 0 ? uniqueSkills.join(', ') : '-';

        const ratingLabel = typeof selectedUser.rating === 'number' ? selectedUser.rating.toFixed(1) : '-';
        const reviewLabel = `${typeof selectedUser.reviewCount === 'number' ? selectedUser.reviewCount : 0} รีวิว`;

        const totalMoney = selectedUserJobs.reduce((sum, job) => sum + (Number(job.payAmount) || 0), 0);
        const totalMoneyLabel = formatMoney(totalMoney);

        const hiringVolume = selectedUser.role === 'employer'
            ? selectedUserJobs
                .filter((job) => ['open', 'accepted', 'hired', 'in_progress', 'completed', 'closed'].includes((job.status || '').toLowerCase()))
                .reduce((sum, job) => sum + (Number(job.payAmount) || 0), 0)
            : 0;

        const hiringVolumeLabel = formatMoney(hiringVolume);

        return {
            signupDateLabel,
            totalAcceptedJobs,
            profileStatusLabel,
            skillsAndCategories,
            ratingLabel,
            reviewLabel,
            totalMoneyLabel,
            hiringVolumeLabel,
        };
    }, [selectedUser, selectedUserJobs]);

    const todaySavedSnapshot = useMemo(() => {
        if (!selectedUser) {
            return null;
        }

        return dailySnapshots[todayKey]?.[String(selectedUser.id)] || null;
    }, [dailySnapshots, selectedUser, todayKey]);

    useEffect(() => {
        if (!selectedUser) {
            return;
        }

        const nextSnapshots: SnapshotStore = {
            ...dailySnapshots,
            [todaySummary.dateKey]: {
                ...(dailySnapshots[todaySummary.dateKey] || {}),
                [String(selectedUser.id)]: {
                    userId: selectedUser.id,
                    generatedAt: new Date().toISOString(),
                    summary: todaySummary,
                },
            },
        };

        setDailySnapshots(nextSnapshots);

        try {
            localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(nextSnapshots));
        } catch {
            // ignore storage errors
        }
    }, [selectedUser, todaySummary]);

    const handleDeleteUser = async () => {
        if (!selectedUser) {
            return;
        }

        if (!confirm(`คุณแน่ใจหรือว่าต้องการลบผู้ใช้ ${selectedUser.email}?`)) {
            return;
        }

        setIsDeleting(true);
        setDeleteError('');
        setDeleteSuccess('');

        try {
            await api.delete(`/users/${selectedUser.id}`);
            setDeleteSuccess(`ลบผู้ใช้ ${selectedUser.email} สำเร็จ`);
            setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
            setSelectedUserId(null);
            setTimeout(() => setDeleteSuccess(''), 3000);
        } catch (err: any) {
            const message = err?.response?.data?.message || 'ไม่สามารถลบผู้ใช้ได้';
            setDeleteError(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const buildReportText = () => {
        if (!selectedUser) {
            return '';
        }

        const header = [
            'รายงานตรวจสอบการทำงานลูกค้ารายวัน',
            `วันที่สรุป: ${todaySummary.dateKey}`,
            `ลูกค้า: ${selectedUser.firstName ?? '-'} ${selectedUser.lastName ?? ''}`.trim(),
            `รหัส: ${getDisplayId(selectedUser.id, selectedUser.role)}`,
            `อีเมล: ${selectedUser.email ?? '-'}`,
            `บทบาท: ${getRoleLabel(selectedUser.role)}`,
            '',
            'สรุปวันนี้',
            `- กิจกรรมทั้งหมด: ${todaySummary.totalActivities}`,
            `- โพสต์งาน: ${todaySummary.postedJobs}`,
            `- รับงาน: ${todaySummary.acceptedJobs}`,
            `- มูลค่างานรวม: ${formatMoney(todaySummary.totalJobValue)}`,
            '',
            'กิจกรรมวันนี้',
        ];

        const lines = todayTimeline.length === 0
            ? ['- ไม่พบกิจกรรมวันนี้']
            : todayTimeline.map((item) => {
                const amountText = typeof item.amount === 'number' ? ` | ${formatMoney(item.amount)}` : '';
                const detailText = item.detail ? ` | ${item.detail}` : '';
                return `- ${formatDateTime(item.at)} | ${item.title}${detailText}${amountText}`;
            });

        return [...header, ...lines].join('\n');
    };

    const handlePrintReport = () => {
        window.print();
    };

    const handleExportReport = () => {
        if (!selectedUser) {
            return;
        }

        const content = buildReportText();
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `customer-work-report-${selectedUser.id}-${todaySummary.dateKey}.txt`;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">จัดการข้อมูลลูกค้า</h1>
                        <p className="mt-2 text-slate-500">ค้นหาและดูประวัติการทำงานของลูกค้า</p>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">ค้นหาลูกค้า</label>
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="ค้นหาด้วยชื่อ, อีเมล หรือรหัส"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {isLoading ? (
                        <p className="p-6 text-sm text-slate-500">กำลังโหลดข้อมูลลูกค้า...</p>
                    ) : error ? (
                        <div className="p-6">
                            <p className="text-sm font-medium text-red-600">{error}</p>
                            <button
                                type="button"
                                onClick={() => loadCustomersData(true)}
                                disabled={isRefreshing}
                                className="mt-3 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isRefreshing ? 'กำลังลองใหม่...' : 'ลองโหลดใหม่'}
                            </button>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <p className="p-6 text-sm text-slate-500">ไม่พบข้อมูลลูกค้าตามคำค้นหา</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">ชื่อ</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">อีเมล</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">บทบาท</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">สร้างเมื่อ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.map((item) => {
                                        const fullName = `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim() || '-';
                                        const createdAt = formatDateTime(item.createdAt);
                                        const isSelected = selectedUserId === item.id;

                                        return (
                                            <tr
                                                key={item.id}
                                                onClick={() => setSelectedUserId(isSelected ? null : item.id)}
                                                className={`cursor-pointer transition ${isSelected ? 'bg-blue-50' : 'hover:bg-slate-50/60'}`}
                                            >
                                                <td className="px-4 py-3 text-sm text-slate-700">{getDisplayId(item.id, item.role)}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{fullName}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.email ?? '-'}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                                        {getRoleLabel(item.role)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{createdAt}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-1">
                {selectedUser ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:border-none print:shadow-none">
                        <h3 className="text-base font-bold text-slate-900">ข้อมูลลูกค้า (ตรวจสอบการทำงาน)</h3>
                        <div className="mt-4 space-y-3 text-sm">
                            <div>
                                <p className="text-xs font-semibold text-slate-600">รหัส</p>
                                <p className="mt-1 text-slate-900">{getDisplayId(selectedUser.id, selectedUser.role)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-600">ชื่อ</p>
                                <p className="mt-1 text-slate-900">{selectedUser.firstName ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-600">นามสกุล</p>
                                <p className="mt-1 text-slate-900">{selectedUser.lastName ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-600">อีเมล</p>
                                <p className="mt-1 text-slate-900">{selectedUser.email ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-600">บทบาท</p>
                                <p className="mt-1">
                                    <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                        {getRoleLabel(selectedUser.role)}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-600">วันที่สมัคร</p>
                                <p className="mt-1 text-slate-900">{customerInsights.signupDateLabel}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-600">จำนวนงานที่รับทั้งหมด</p>
                                <p className="mt-1 text-slate-900">{customerInsights.totalAcceptedJobs} งาน</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-600">สถานะโปรไฟล์</p>
                                <p className="mt-1">
                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${selectedUser.profileCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {customerInsights.profileStatusLabel}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-600">หมวดหมู่งาน/ทักษะ</p>
                                <p className="mt-1 text-slate-900">{customerInsights.skillsAndCategories}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-600">การให้คะแนน/รีวิว</p>
                                <p className="mt-1 text-slate-900">{customerInsights.ratingLabel} ({customerInsights.reviewLabel})</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-600">ยอดเงินทั้งหมด/ยอดการจ้างงาน</p>
                                <p className="mt-1 text-slate-900">{customerInsights.totalMoneyLabel} / {customerInsights.hiringVolumeLabel}</p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs font-semibold text-slate-700">ประวัติการทำงาน/กิจกรรมวันนี้</p>
                            <div className="mt-2 space-y-2">
                                {todayTimeline.length === 0 ? (
                                    <p className="text-xs text-slate-500">ไม่พบกิจกรรมของวันนี้</p>
                                ) : (
                                    todayTimeline.map((item) => (
                                        <div key={item.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                                            <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                                            <p className="mt-1 text-[11px] text-slate-500">
                                                {formatDateTime(item.at)}
                                                {item.detail ? ` • ${item.detail}` : ''}
                                                {typeof item.amount === 'number' ? ` • ${formatMoney(item.amount)}` : ''}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3">
                            <p className="text-xs font-semibold text-slate-700">สรุปประจำวัน</p>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                <div className="rounded-lg bg-slate-50 px-3 py-2">กิจกรรม: {todaySummary.totalActivities}</div>
                                <div className="rounded-lg bg-slate-50 px-3 py-2">โพสต์งาน: {todaySummary.postedJobs}</div>
                                <div className="rounded-lg bg-slate-50 px-3 py-2">รับงาน: {todaySummary.acceptedJobs}</div>
                                <div className="rounded-lg bg-slate-50 px-3 py-2">มูลค่างานรวม: {formatMoney(todaySummary.totalJobValue)}</div>
                            </div>
                            <p className="mt-2 text-[11px] text-slate-500">
                                {todaySavedSnapshot
                                    ? `บันทึกล่าสุด: ${formatDateTime(todaySavedSnapshot.generatedAt)}`
                                    : 'ยังไม่มีบันทึกสรุปรายวัน'}
                            </p>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-2 print:hidden">
                            <button
                                type="button"
                                onClick={handlePrintReport}
                                className="inline-flex items-center justify-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
                            >
                                <Printer className="h-4 w-4" />
                                พิมพ์เอกสาร
                            </button>
                            <button
                                type="button"
                                onClick={handleExportReport}
                                className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-700 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
                            >
                                <Download className="h-4 w-4" />
                                ส่งออกไฟล์
                            </button>
                        </div>

                        {deleteError && <p className="mt-4 text-sm font-medium text-red-600">{deleteError}</p>}
                        {deleteSuccess && <p className="mt-4 text-sm font-medium text-emerald-600">{deleteSuccess}</p>}

                        <button
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <Trash2 className="h-4 w-4" />
                            {isDeleting ? 'กำลังลบ...' : 'ลบ'}
                        </button>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">เลือกลูกค้าจากตารางด้านข้างเพื่อดูรายละเอียดและตรวจสอบการทำงาน</p>
                    </div>
                )}
            </div>
        </div>
    );
}
