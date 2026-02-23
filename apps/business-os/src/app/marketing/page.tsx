'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Megaphone, Target, BarChart2 } from 'lucide-react';

export default function MarketingPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await api.get('/marketing/campaigns');
                setCampaigns(response.data);
            } catch (err) {
                console.error('Failed to fetch campaigns');
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Marketing Dashboard</h1>
                    <p className="text-slate-500">Track ad spend, ROI and campaign results.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Campaign Name</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Spend</th>
                                <th className="px-6 py-4">ROI</th>
                                <th className="px-6 py-4">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading campaigns...</td></tr>
                            ) : campaigns.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No campaigns found.</td></tr>
                            ) : (
                                campaigns.map((c) => (
                                    <tr key={c.id}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Target className="h-4 w-4 mr-2 text-blue-500" />
                                                <span className="font-medium text-slate-900">{c.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">{c.status}</span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">${c.spend}</td>
                                        <td className="px-6 py-4 text-green-600 font-medium">+{c.roi || 0}%</td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
