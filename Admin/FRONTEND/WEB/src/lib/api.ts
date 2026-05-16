import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const AUTH_STORAGE_KEY = 'workder_auth_session';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    if (typeof window === 'undefined') {
        return config;
    }

    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawSession) {
        return config;
    }

    try {
        const session = JSON.parse(rawSession) as { accessToken?: string };

        if (session.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
    } catch {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    return config;
});

export default apiClient;
