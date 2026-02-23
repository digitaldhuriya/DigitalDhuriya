'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { User, Calendar, Award } from 'lucide-react';

export default function HrPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get('/hr/employees');
                setEmployees(response.data);
            } catch (err) {
                console.error('Failed to fetch employees');
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">HR & Employee Management</h1>
                    <p className="text-slate-500">Manage team attendance, salaries and performance.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-slate-500">Loading employees...</div>
                ) : (
                    employees.map((emp) => (
                        <div key={emp.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex items-center mb-6">
                                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    {emp.name?.[0] || 'U'}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-slate-900">{emp.name}</h3>
                                    <p className="text-sm text-slate-500">{emp.role}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-slate-50 p-3 rounded-lg text-center">
                                    <Calendar className="h-4 w-4 mx-auto mb-1 text-slate-400" />
                                    <p className="text-xs text-slate-500">Attendance</p>
                                    <p className="text-sm font-bold text-slate-900">{emp.attendance?.length || 0}d</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg text-center">
                                    <Award className="h-4 w-4 mx-auto mb-1 text-slate-400" />
                                    <p className="text-xs text-slate-500">Perf. Score</p>
                                    <p className="text-sm font-bold text-slate-900">{emp.performance?.[0]?.score || 0}%</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg text-center">
                                    <User className="h-4 w-4 mx-auto mb-1 text-slate-400" />
                                    <p className="text-xs text-slate-500">Status</p>
                                    <p className="text-sm font-bold text-green-600">Active</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
