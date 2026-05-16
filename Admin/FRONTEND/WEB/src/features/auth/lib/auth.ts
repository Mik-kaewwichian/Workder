import api from '../../../lib/api';

export const AUTH_STORAGE_KEY = 'workder_auth_session';

export type AuthSession = {
    userId: string | number;
    email: string;
    role: 'admin' | 'user' | 'employer';
    managerCode?: string;
    workStatus?: string;
    roleRank?: number;
    originalRole?: 'admin';
    profileCompleted: boolean;
    employerRegistered: boolean;
    name?: string;
    accessToken?: string;
};

type AuthResponse = {
    accessToken: string;
    user: {
        id: number;
        email: string;
        role: 'admin' | 'user' | 'employer';
        managerCode?: string | null;
        workStatus?: string | null;
        roleRank?: number | null;
        profileCompleted: boolean;
        firstName?: string | null;
        lastName?: string | null;
    };
};

export const loginWithEmailPassword = async (email: string, password: string): Promise<AuthSession | null> => {
    try {
        const { data } = await api.post<AuthResponse>('/auth/login', {
            email: email.trim().toLowerCase(),
            password,
        });

        return {
            userId: data.user.id,
            email: data.user.email,
            role: data.user.role,
            managerCode: data.user.managerCode ?? undefined,
            workStatus: data.user.workStatus ?? undefined,
            roleRank: data.user.roleRank ?? undefined,
            profileCompleted: data.user.profileCompleted,
            employerRegistered: data.user.role === 'employer',
            name: [data.user.firstName, data.user.lastName].filter(Boolean).join(' ').trim() || undefined,
            accessToken: data.accessToken,
        };
    } catch (error) {
        console.error('Login failed', error);
        return null;
    }
};

export const resetPasswordAdmin = async (email: string, managerCode: string, idCard: string, phone: string, newPassword: string): Promise<boolean> => {
    try {
        await api.post('/auth/reset-password-admin', {
            email: email.trim().toLowerCase(),
            managerCode: managerCode.trim(),
            idCard: idCard.trim(),
            phone: phone.trim(),
            newPassword
        });
        return true;
    } catch (error) {
        console.error('Reset password error:', error);
        return false;
    }
};

export const verifyAdminResetData = async (email: string, idCard: string, phone: string): Promise<boolean> => {
    try {
        await api.post('/auth/verify-admin-reset-data', {
            email: email.trim().toLowerCase(),
            idCard: idCard.trim(),
            phone: phone.trim()
        });
        return true;
    } catch (error) {
        console.error('Verify reset data error:', error);
        return false;
    }
};

export const setAuthSession = (session: AuthSession) => {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const getAuthSession = (): AuthSession | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawSession) {
        return null;
    }

    try {
        return JSON.parse(rawSession) as AuthSession;
    } catch {
        return null;
    }
};

export const clearAuthSession = () => {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
};
