'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/format';

type DashboardSummary = {
  totalLeads: number;
  activeProjects: number;
  monthlyRevenue: number;
  pendingPayments: number;
  overdueInvoices: number;
  teamPerformance: Array<{
    userId: string;
    userName: string;
    assignedTasks: number;
    completedTasks: number;
    completionRate: number;
  }>;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<Array<{ month: string; revenue: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [summaryResponse, revenueResponse] = await Promise.all([
          api.get<DashboardSummary>('/dashboard/summary'),
          api.get<Array<{ month: string; revenue: number }>>('/dashboard/revenue-trend?months=6'),
        ]);

        setSummary(summaryResponse.data);
        setRevenueTrend(revenueResponse.data);
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  const cards = useMemo(() => {
    if (!summary) {
      return [];
    }

    return [
      { label: 'Total Leads', value: summary.totalLeads.toString() },
      { label: 'Active Projects', value: summary.activeProjects.toString() },
      { label: 'Monthly Revenue', value: formatCurrency(summary.monthlyRevenue) },
      { label: 'Pending Payments', value: formatCurrency(summary.pendingPayments) },
      { label: 'Overdue Invoices', value: summary.overdueInvoices.toString() },
    ];
  }, [summary]);

  if (loading) {
    return <div className="panel p-6 text-sm text-[var(--muted)]">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <article key={card.label} className="panel p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{card.label}</p>
            <p className="mt-2 font-heading text-2xl font-bold text-[var(--text)]">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="panel p-4">
          <h3 className="font-heading text-lg font-semibold">Monthly Revenue Trend</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0a63d8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0a63d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#0a63d8" fill="url(#revGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel p-4">
          <h3 className="font-heading text-lg font-semibold">Team Performance</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary?.teamPerformance || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="userName" stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip />
                <Bar dataKey="completionRate" fill="#0a63d8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Task Completion Snapshot</h3>
        <div className="table-wrap mt-3">
          <table>
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Assigned Tasks</th>
                <th>Completed</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {(summary?.teamPerformance || []).map((member) => (
                <tr key={member.userId}>
                  <td>{member.userName}</td>
                  <td>{member.assignedTasks}</td>
                  <td>{member.completedTasks}</td>
                  <td>{member.completionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

