'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Gift, Megaphone, CreditCard, Zap, Bell, MessageSquare } from 'lucide-react';

// Types
export type NotificationChannel = {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    unreadCount: number;
    lastMessage: string;
    timestamp: string;
};

export type ChatMessage = {
    id: number;
    name: string;
    message: string;
    time: string;
    unread: number;
    avatar: string;
};

type NotificationContextType = {
    channels: NotificationChannel[];
    chats: ChatMessage[];
    unreadNotificationsCount: number;
    unreadMessagesCount: number;
    totalUnreadCount: number;
    markNotificationAsRead: (id: string) => void;
    markChatAsRead: (id: number) => void;
    markAllAsRead: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialChannels: NotificationChannel[] = [];
const initialChats: ChatMessage[] = [];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [channels, setChannels] = useState<NotificationChannel[]>(initialChannels);
    const [chats, setChats] = useState<ChatMessage[]>(initialChats);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const savedChannels = localStorage.getItem('notifications_channels_v4');
        const savedChats = localStorage.getItem('notifications_chats_v4');

        if (savedChannels) {
            try {
                const parsedChannels = JSON.parse(savedChannels);
                // Re-attach icons
                setChannels(parsedChannels.map((c: any) => ({
                    ...c,
                    icon: initialChannels.find(ic => ic.id === c.id)?.icon
                })));
            } catch (e) {
                console.error("Failed to parse channels", e);
            }
        }

        if (savedChats) {
            try {
                setChats(JSON.parse(savedChats));
            } catch (e) {
                console.error("Failed to parse chats", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('notifications_channels_v4', JSON.stringify(channels));
            localStorage.setItem('notifications_chats_v4', JSON.stringify(chats));
        }
    }, [channels, chats, isLoaded]);

    const markNotificationAsRead = (id: string) => {
        setChannels(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
    };

    const markChatAsRead = (id: number) => {
        setChats(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    };

    const markAllAsRead = () => {
        setChannels(prev => prev.map(c => ({ ...c, unreadCount: 0 })));
        setChats(prev => prev.map(c => ({ ...c, unread: 0 })));
    };

    const unreadNotificationsCount = channels.reduce((acc, curr) => acc + curr.unreadCount, 0);
    const unreadMessagesCount = chats.reduce((acc, curr) => acc + curr.unread, 0);
    const totalUnreadCount = unreadNotificationsCount + unreadMessagesCount;

    return (
        <NotificationContext.Provider value={{
            channels,
            chats,
            unreadNotificationsCount,
            unreadMessagesCount,
            totalUnreadCount,
            markNotificationAsRead,
            markChatAsRead,
            markAllAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
