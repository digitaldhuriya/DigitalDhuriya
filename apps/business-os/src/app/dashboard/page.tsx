'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import { Users, TrendingUp, DollarSign, Briefcase } from 'lucide-react';

const data = [
    { name: 'Jan', revenue: 4000, leads: 24, projects: 12 },
    { name: 'Feb', revenue: 3000, leads: 18, projects: 10 },
    { name: 'Mar', revenue: 5000, leads: 32, projects: 15 },
    { name: 'Apr', revenue: 4500, leads: 28, projects: 14 },
    { name: 'May', revenue: 6000, leads: 40, projects: 20 },
    { name: 'Jun', revenue: 5500, leads: 35, projects: 18 },
];

const stats = [
    { name: 'Total Revenue', value: '$28,000', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Active Clients', value: '42', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Ongoing Projects', value: '18', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Leads Conversion', value: '24%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
];

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name}</h1>
                <p className="text-slate-500">Here's what's happening with Digital Dhuriya today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-stats">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center">
                            <div className={`${stat.bg} p-3 rounded-lg`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
                    <h3 className="text-lg font-semibold mb-4">Revenue Growth</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
                    <h3 className="text-lg font-semibold mb-4">Lead Performance</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            />
                            <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
