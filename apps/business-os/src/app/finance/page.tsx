'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { DollarSign, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';

export default function FinancePage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ monthlyIncome: 0, monthlyExpenses: 0, profit: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                const [transRes, statsRes] = await Promise.all([
                    api.get('/finance/transactions'),
                    api.get('/finance/stats')
                ]);
                setTransactions(transRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error('Failed to fetch finance data');
            } finally {
                setLoading(false);
            }
        };
        fetchFinanceData();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Finance & Accounts</h1>
                <p className="text-slate-500">Track revenue, expenses and generate invoices.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm font-medium text-slate-500 mb-1">Monthly Income</p>
                    <p className="text-2xl font-bold text-green-600">${stats.monthlyIncome}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm font-medium text-slate-500 mb-1">Monthly Expenses</p>
                    <p className="text-2xl font-bold text-red-600">${stats.monthlyExpenses}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm font-medium text-slate-500 mb-1">Net Profit</p>
                    <p className="text-2xl font-bold text-blue-600">${stats.profit}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 font-semibold">Recent Transactions</div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Transaction</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading transactions...</td></tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t.id}>
                                        <td className="px-6 py-4 font-medium">{t.description}</td>
                                        <td className="px-6 py-4">
                                            {t.type === 'INCOME' ? (
                                                <span className="flex items-center text-green-600"><ArrowUpRight className="h-4 w-4 mr-1" /> Income</span>
                                            ) : (
                                                <span className="flex items-center text-red-600"><ArrowDownLeft className="h-4 w-4 mr-1" /> Expense</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">${t.amount}</td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
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
