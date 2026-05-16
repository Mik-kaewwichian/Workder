'use client';

import Navbar from '../../../components/Navbar';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, Clock } from 'lucide-react';

const transactions = [
    { id: 1, type: 'out', label: 'จ้างสมชาย ช่างไฟ', amount: 500, date: '25 ก.พ. 2568', status: 'สำเร็จ' },
    { id: 2, type: 'out', label: 'จ้างนิดหน่อย แม่บ้าน', amount: 300, date: '24 ก.พ. 2568', status: 'สำเร็จ' },
    { id: 3, type: 'in', label: 'เติมเงินกระเป๋า', amount: 2000, date: '23 ก.พ. 2568', status: 'สำเร็จ' },
    { id: 4, type: 'out', label: 'จ้างช่างแอร์ สุขุมวิท', amount: 800, date: '22 ก.พ. 2568', status: 'สำเร็จ' },
    { id: 5, type: 'in', label: 'เติมเงินกระเป๋า', amount: 1000, date: '20 ก.พ. 2568', status: 'สำเร็จ' },
];

export default function EmployerWalletPage() {
    const balance = 5420;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
                <div className="max-w-lg mx-auto space-y-5">

                    {/* Balance Card */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-xl">
                        <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/10" />
                        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10" />
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-4 opacity-80 text-sm">
                                <Wallet className="h-4 w-4" />
                                <span>ยอดเงินคงเหลือ</span>
                            </div>
                            <div className="text-4xl font-bold tracking-tight mb-1">
                                ฿{balance.toLocaleString()}
                            </div>
                            <div className="text-xs opacity-60">อัปเดต: 25 ก.พ. 2568 · 11:18</div>
                        </div>
                        <button className="relative mt-5 flex items-center justify-center gap-2 w-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all rounded-2xl py-3 text-sm font-bold">
                            <Plus className="h-4 w-4" />
                            เติมเงิน
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-2 text-green-600 mb-1">
                                <ArrowDownLeft className="h-4 w-4" />
                                <span className="text-xs font-medium">รับเข้า (เดือนนี้)</span>
                            </div>
                            <div className="text-xl font-bold text-slate-900">฿3,000</div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-2 text-red-500 mb-1">
                                <ArrowUpRight className="h-4 w-4" />
                                <span className="text-xs font-medium">จ่ายออก (เดือนนี้)</span>
                            </div>
                            <div className="text-xl font-bold text-slate-900">฿1,600</div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-slate-400" />
                                ประวัติการทำรายการ
                            </h2>
                        </div>
                        <ul className="divide-y divide-slate-50">
                            {transactions.map((tx) => (
                                <li key={tx.id} className="flex items-center gap-4 px-5 py-3.5">
                                    <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'in' ? 'bg-green-100' : 'bg-red-50'}`}>
                                        {tx.type === 'in'
                                            ? <ArrowDownLeft className="h-4 w-4 text-green-600" />
                                            : <ArrowUpRight className="h-4 w-4 text-red-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-slate-900 truncate">{tx.label}</div>
                                        <div className="text-xs text-slate-400">{tx.date}</div>
                                    </div>
                                    <div className={`text-sm font-bold ${tx.type === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                                        {tx.type === 'in' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </>
    );
}
