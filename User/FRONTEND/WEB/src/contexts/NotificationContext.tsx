'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import api from '../lib/api';
import { getAuthSession, AUTH_STORAGE_KEY } from '../features/auth/lib/auth';

// Real notification record returned by GET /notifications
export type Notification = {
    id: number;
    type: string;
    title: string;
    body: string;
    link: string | null;
    refType: string | null;
    refId: number | null;
    readAt: string | null;
    createdAt: string;
};

// Chats kept as a localStorage stub for now — out of scope for the backend port.
export type ChatMessage = {
    id: number;
    name: string;
    message: string;
    time: string;
    unread: number;
    avatar: string;
};

type NotificationContextType = {
    notifications: Notification[];
    chats: ChatMessage[];
    unreadNotificationsCount: number;
    unreadMessagesCount: number;
    totalUnreadCount: number;
    markNotificationAsRead: (id: number) => Promise<void>;
    markChatAsRead: (id: number) => void;
    markAllAsRead: () => Promise<void>;
    refreshNotifications: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const POLL_INTERVAL_MS = 20_000;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [chats, setChats] = useState<ChatMessage[]>([]);
    const sessionRef = useRef<ReturnType<typeof getAuthSession>>(null);

    const refreshNotifications = useCallback(async () => {
        const session = getAuthSession();
        sessionRef.current = session;
        if (!session) { setNotifications([]); return; }
        try {
            const { data } = await api.get<Notification[]>('/notifications');
            setNotifications(Array.isArray(data) ? data : []);
        } catch {
            /* keep stale data */
        }
    }, []);

    // Initial fetch + polling. Re-init when auth changes (login/logout across tabs).
    useEffect(() => {
        refreshNotifications();
        const interval = setInterval(refreshNotifications, POLL_INTERVAL_MS);
        const onStorage = (ev: StorageEvent) => {
            if (ev.key === AUTH_STORAGE_KEY || ev.key === null) refreshNotifications();
        };
        window.addEventListener('storage', onStorage);
        return () => { clearInterval(interval); window.removeEventListener('storage', onStorage); };
    }, [refreshNotifications]);

    // Chats stub — kept identical to the old localStorage behaviour
    useEffect(() => {
        const saved = localStorage.getItem('notifications_chats_v4');
        if (saved) {
            try { setChats(JSON.parse(saved)); } catch { /* ignore */ }
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('notifications_chats_v4', JSON.stringify(chats));
    }, [chats]);

    const markNotificationAsRead = useCallback(async (id: number) => {
        // Optimistic update
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n));
        try { await api.patch(`/notifications/${id}/read`); }
        catch { /* retry on next poll */ }
    }, []);

    const markChatAsRead = useCallback((id: number) => {
        setChats((prev) => prev.map((c) => c.id === id ? { ...c, unread: 0 } : c));
    }, []);

    const markAllAsRead = useCallback(async () => {
        const now = new Date().toISOString();
        setNotifications((prev) => prev.map((n) => n.readAt ? n : { ...n, readAt: now }));
        setChats((prev) => prev.map((c) => ({ ...c, unread: 0 })));
        try { await api.post('/notifications/read-all'); }
        catch { /* retry on next poll */ }
    }, []);

    const unreadNotificationsCount = notifications.filter((n) => !n.readAt).length;
    const unreadMessagesCount = chats.reduce((acc, c) => acc + c.unread, 0);
    const totalUnreadCount = unreadNotificationsCount + unreadMessagesCount;

    return (
        <NotificationContext.Provider value={{
            notifications,
            chats,
            unreadNotificationsCount,
            unreadMessagesCount,
            totalUnreadCount,
            markNotificationAsRead,
            markChatAsRead,
            markAllAsRead,
            refreshNotifications,
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider');
    return ctx;
}
