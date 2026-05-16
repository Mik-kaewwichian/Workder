export const CHAT_STORAGE_KEY = 'workder_chat_messages';

export type ChatMessage = {
    id: string;
    chatId: string;
    sender: 'me' | 'other';
    text: string;
    time: string;
};

export const getChatMessages = (chatId: string): ChatMessage[] => {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(`${CHAT_STORAGE_KEY}_${chatId}`);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const addChatMessage = (chatId: string, msg: Omit<ChatMessage, 'id'>): ChatMessage => {
    const messages = getChatMessages(chatId);
    const newMsg: ChatMessage = { ...msg, id: `msg_${Date.now()}_${Math.random()}` };
    messages.push(newMsg);
    window.localStorage.setItem(`${CHAT_STORAGE_KEY}_${chatId}`, JSON.stringify(messages));
    return newMsg;
};
