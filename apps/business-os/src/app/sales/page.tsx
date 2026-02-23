'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, ChevronRight, DollarSign, User } from 'lucide-react';

const stages = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED'];

export default function SalesPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await api.get('/sales/leads');
                setLeads(response.data);
            } catch (err) {
                console.error('Failed to fetch leads');
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sales - Lead Pipeline</h1>
                    <p className="text-slate-500">Track and manage your sales opportunities.</p>
                </div>
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lead
                </button>
            </div>

            <div className="flex space-x-4 overflow-x-auto pb-4">
                {stages.map((stage) => (
                    <div key={stage} className="flex-shrink-0 w-80">
                        <div className="bg-slate-100 p-3 rounded-t-lg border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-700">{stage}</h3>
                            <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                                {leads.filter(l => l.pipelineStage === stage || (stage === 'NEW' && !l.pipelineStage)).length}
                            </span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-b-lg border border-slate-200 min-h-[500px] space-y-3">
                            {loading ? (
                                <div className="text-center py-10 text-slate-400 text-sm">Loading...</div>
                            ) : (
                                leads
                                    .filter(l => l.pipelineStage === stage || (stage === 'NEW' && !l.pipelineStage))
                                    .map((lead) => (
                                        <div key={lead.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400 transition-colors group">
                                            <div className="flex items-start justify-between">
                                                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">{lead.name}</h4>
                                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400" />
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">{lead.email || 'No email'}</p>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center text-xs text-slate-500">
                                                    <User className="h-3 w-3 mr-1" />
                                                    {lead.salesExecutive?.name || 'Unassigned'}
                                                </div>
                                                <div className="flex items-center text-xs text-green-600 font-medium">
                                                    <DollarSign className="h-3 w-3" />
                                                    {lead.commissions?.[0]?.amount || 0}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
