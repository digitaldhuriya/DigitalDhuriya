'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Search, MoreHorizontal } from 'lucide-react';

export default function CrmPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('/crm/clients');
                setClients(response.data);
            } catch (err) {
                console.error('Failed to fetch clients');
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">CRM - Client Management</h1>
                    <p className="text-slate-500">Manage your clients, contacts and projects.</p>
                </div>
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="pl-10 w-full rounded-lg border-slate-200 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Client Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Projects</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading clients...</td></tr>
                            ) : clients.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No clients found.</td></tr>
                            ) : (
                                clients.map((client) => (
                                    <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{client.name}</td>
                                        <td className="px-6 py-4 text-slate-500">{client.email || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${client.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{client.projects?.length || 0}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-slate-600">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                        </td>
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
