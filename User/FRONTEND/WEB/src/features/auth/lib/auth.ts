import api from '../../../lib/api';

export const AUTH_STORAGE_KEY = 'workder_auth_session';

type BackendUserRole = 'admin' | 'user' | 'employer';

type AuthResponse = {
    accessToken: string;
    user: {
        id: number;
        email: string;
        role: BackendUserRole;
        profileCompleted: boolean;
        firstName?: string | null;
        lastName?: string | null;
    };
};

type StoredSession = {
    userId: string | number;
    email: string;
    role: BackendUserRole | 'user' | 'employer';
    profileCompleted: boolean;
    employerRegistered: boolean;
    name?: string;
    accessToken?: string;
};

export type AuthSession = {
    userId: string | number;
    email: string;
    role: 'user' | 'employer';
    profileCompleted: boolean;
    employerRegistered: boolean;
    name?: string;
    accessToken?: string;
};

const normalizeRole = (role: BackendUserRole | 'user' | 'employer'): 'user' | 'employer' =>
    role === 'employer' ? 'employer' : 'user';

const toSession = (payload: StoredSession): AuthSession => ({
    userId: payload.userId,
    email: payload.email,
    role: normalizeRole(payload.role),
    profileCompleted: payload.profileCompleted,
    employerRegistered: payload.employerRegistered,
    name: payload.name,
    accessToken: payload.accessToken,
});

export const loginWithEmailPassword = async (email: string, password: string): Promise<AuthSession | null> => {
    try {
        const { data } = await api.post<AuthResponse>('/auth/login', {
            email: email.trim().toLowerCase(),
            password,
        });

        return toSession({
            userId: data.user.id,
            email: data.user.email,
            role: data.user.role,
            profileCompleted: data.user.profileCompleted,
            employerRegistered: data.user.role === 'employer',
            name: [data.user.firstName, data.user.lastName].filter(Boolean).join(' ').trim() || undefined,
            accessToken: data.accessToken,
        });
    } catch (error) {
        console.error('Login failed', error);
        return null;
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
        return toSession(JSON.parse(rawSession) as StoredSession);
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
