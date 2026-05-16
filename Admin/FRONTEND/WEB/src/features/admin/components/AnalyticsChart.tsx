'use client';

import React, { useState, useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

type TimeRange = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year' | 'decade' | '2decades';
type ChartType = 'combined' | 'views' | 'users' | 'registrations' | 'revenue' | 'expenses';

// Helper to generate mock data based on timeframe
const generateData = (timeRange: TimeRange) => {
    let dataPoints = 15;
    let labelFormatter = (i: number) => `${i}`;
    let baseMultiplier = 1;

    switch (timeRange) {
        case 'second':
            dataPoints = 60; labelFormatter = (i) => `${i} วิ.`; baseMultiplier = 1; break;
        case 'minute':
            dataPoints = 60; labelFormatter = (i) => `${i} น.`; baseMultiplier = 10; break;
        case 'hour':
            dataPoints = 24; labelFormatter = (i) => `${i}:00`; baseMultiplier = 100; break;
        case 'day':
            dataPoints = 30; labelFormatter = (i) => `วัน ${i}`; baseMultiplier = 1000; break;
        case 'month':
            dataPoints = 12; labelFormatter = (i) => `เดือน ${i}`; baseMultiplier = 10000; break;
        case 'year':
            dataPoints = 5; labelFormatter = (i) => `ปี ${new Date().getFullYear() - 5 + i}`; baseMultiplier = 100000; break;
        case 'decade':
            dataPoints = 10; labelFormatter = (i) => `ปี ${1930 + (i * 10)}`; baseMultiplier = 500000; break;
        case '2decades':
            dataPoints = 20; labelFormatter = (i) => `ปี ${1900 + (i * 20)}`; baseMultiplier = 1000000; break;
    }

    const data = [];
    
    for (let i = 1; i <= dataPoints; i++) {
        data.push({
            name: labelFormatter(i),
            views: 0,
            users: 0,
            registrations: 0,
            revenue: 0,
            expenses: 0
        });
    }
    return data;
};

export default function AnalyticsChart() {
    const [timeRange, setTimeRange] = useState<TimeRange>('day');
    const [chartType, setChartType] = useState<ChartType>('combined');

    const data = useMemo(() => generateData(timeRange), [timeRange]);

    const metrics = [
        { id: 'views', label: 'คนเข้ามาดู', color: '#3b82f6', fill: 'url(#colorViews)' },
        { id: 'users', label: 'คนใช้งาน', color: '#8b5cf6', fill: 'url(#colorUsers)' },
        { id: 'registrations', label: 'คนลงทะเบียน', color: '#f59e0b', fill: 'transparent', strokeWidth: 2 },
        { id: 'revenue', label: 'รายได้', color: '#10b981', fill: 'url(#colorRevenue)' },
        { id: 'expenses', label: 'รายจ่าย', color: '#ef4444', fill: 'transparent', strokeWidth: 2 },
    ];

    const activeMetrics = chartType === 'combined'
        ? metrics
        : metrics.filter(m => m.id === chartType);

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm w-full mb-8">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        📈 สถิติการใช้งานแพลตฟอร์มเชิงลึก
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        เลือกมุมมองข้อมูลและช่วงเวลาที่ต้องการวิเคราะห์
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 flex-wrap">
                        <select
                            value={chartType}
                            onChange={(e) => setChartType(e.target.value as ChartType)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                        >
                            <option value="combined">รวมทุกสถิติ</option>
                            <option value="views">คนเข้ามาดู</option>
                            <option value="users">คนใช้งาน</option>
                            <option value="registrations">คนลงทะเบียน</option>
                            <option value="revenue">รายได้</option>
                            <option value="expenses">รายจ่าย</option>
                        </select>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                        >
                            <option value="second">วินาที</option>
                            <option value="minute">นาที</option>
                            <option value="hour">ชั่วโมง</option>
                            <option value="day">วัน</option>
                            <option value="month">เดือน</option>
                            <option value="year">ปี</option>
                            <option value="5year">5 ปี</option>
                            <option value="decade">10 ปี</option>
                            <option value="2decades">20 ปี</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="w-full h-[500px] overflow-x-auto pb-4">
                <div style={{ minWidth: `${Math.max(800, data.length * 60)}px`, height: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                        >
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} minTickGap={20} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} width={80} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', paddingBottom: '20px' }} />

                            {activeMetrics.map(metric => {
                                // If viewing a single metric (not combined), make it a solid line without gradient fill
                                const isCombined = chartType === 'combined';
                                const fillOpacity = isCombined ? (metric.fill === 'transparent' ? 0 : 1) : 0;
                                const fill = isCombined ? metric.fill : 'transparent';
                                const strokeWidth = isCombined ? (metric.strokeWidth || 2) : 3;

                                return (
                                    <Area
                                        key={metric.id}
                                        type="monotone"
                                        dataKey={metric.id}
                                        name={metric.label}
                                        stroke={metric.color}
                                        fillOpacity={fillOpacity}
                                        fill={fill}
                                        strokeWidth={strokeWidth}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                );
                            })}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
