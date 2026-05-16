'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import { ArrowLeft, Send, Phone } from 'lucide-react';
import { getChatMessages, addChatMessage, type ChatMessage } from '../../../../features/chat/lib/chat';
import { useNotifications } from '../../../../contexts/NotificationContext';

// Auto-reply messages from the other person
const AUTO_REPLIES = [
    'ครับ ผมสนใจงานนี้นะครับ',
    'ราคานี้โอเคได้เลยครับ 👍',
    'สะดวกเริ่มงานได้เลยครับ',
    'ขอบคุณมากครับ รอฟังรายละเอียดเพิ่มเติม',
    'ได้เลยครับ จะมาตรงเวลา',
    'ดีครับ ผมมีประสบการณ์ด้านนี้มา 5 ปีแล้ว',
    'โอเคครับ ไม่มีปัญหา 😊',
];

export default function ChatRoomPage() {
    const params = useParams();
    const router = useRouter();
    const chatId = params.id as string;
    const { chats, markChatAsRead } = useNotifications();

    const chatInfo = chats.find((c) => String(c.id) === chatId);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        markChatAsRead(chatId as unknown as number);
        const stored = getChatMessages(chatId);
        // Add default welcome message if empty
        if (stored.length === 0) {
            const welcome: ChatMessage = {
                id: 'init',
                chatId,
                sender: 'other',
                text: chatInfo?.message || 'สวัสดีครับ มีอะไรให้ช่วยไหมครับ',
                time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages([welcome]);
        } else {
            setMessages(stored);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMessage = () => {
        const text = input.trim();
        if (!text) return;

        const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        const myMsg = addChatMessage(chatId, { chatId, sender: 'me', text, time: now });
        setMessages((prev) => [...prev, myMsg]);
        setInput('');
        inputRef.current?.focus();

        // Simulate typing + auto reply
        setIsTyping(true);
        const delay = 1000 + Math.random() * 1500;
        setTimeout(() => {
            setIsTyping(false);
            const replyText = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
            const replyTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
            const reply = addChatMessage(chatId, { chatId, sender: 'other', text: replyText, time: replyTime });
            setMessages((prev) => [...prev, reply]);
        }, delay);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const displayName = chatInfo?.name || 'ผู้ใช้';
    const avatarColor = chatInfo?.avatar || 'bg-blue-200 text-blue-800';

    return (
        <>
            <Navbar />
            <div className="flex flex-col h-screen pt-16 bg-slate-50">

                {/* Header */}
                <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm">
                    <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-500 hover:text-slate-800">
                        <ArrowLeft size={20} />
                    </button>
                    <div className={`h-10 w-10 rounded-full ${avatarColor} flex items-center justify-center font-bold text-base flex-shrink-0`}>
                        {displayName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-slate-900 text-sm truncate">{displayName}</h2>
                        <p className="text-xs text-green-500 font-medium">ออนไลน์</p>
                    </div>
                    <button className="p-2 text-slate-500 hover:text-slate-800">
                        <Phone size={18} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.sender === 'other' && (
                                <div className={`h-7 w-7 rounded-full ${avatarColor} flex items-center justify-center text-xs font-bold flex-shrink-0 mb-1`}>
                                    {displayName.charAt(0)}
                                </div>
                            )}
                            <div className={`max-w-[70%] ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                <div
                                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.sender === 'me'
                                        ? 'bg-blue-600 text-white rounded-br-sm'
                                        : 'bg-white text-slate-800 rounded-bl-sm border border-slate-100 shadow-sm'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex items-end gap-2 justify-start">
                            <div className={`h-7 w-7 rounded-full ${avatarColor} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                                {displayName.charAt(0)}
                            </div>
                            <div className="bg-white border border-slate-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Input Bar */}
                <div className="bg-white border-t border-slate-100 px-4 py-3 flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="พิมพ์ข้อความ..."
                        className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim()}
                        className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex-shrink-0"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </>
    );
}
