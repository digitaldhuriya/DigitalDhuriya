'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/format';

type Overview = {
  totalInvoiced: number;
  totalReceived: number;
  outstanding: number;
  paidInvoices: number;
  pendingInvoices: number;
};

export default function AccountingPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<Array<{ month: number; revenue: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccounting() {
      setLoading(true);
      try {
        const [overviewResponse, monthlyResponse] = await Promise.all([
          api.get<Overview>('/accounting/overview'),
          api.get<Array<{ month: number; revenue: number }>>('/accounting/monthly-revenue'),
        ]);

        setOverview(overviewResponse.data);
        setMonthlyRevenue(monthlyResponse.data);
      } finally {
        setLoading(false);
      }
    }

    void loadAccounting();
  }, []);

  if (loading || !overview) {
    return <div className="panel p-6 text-sm text-[var(--muted)]">Loading accounting...</div>;
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="panel p-4">
          <p className="text-xs text-[var(--muted)]">Total Invoiced</p>
          <p className="font-heading text-2xl font-bold">{formatCurrency(overview.totalInvoiced)}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-[var(--muted)]">Total Received</p>
          <p className="font-heading text-2xl font-bold">{formatCurrency(overview.totalReceived)}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-[var(--muted)]">Outstanding</p>
          <p className="font-heading text-2xl font-bold">{formatCurrency(overview.outstanding)}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-[var(--muted)]">Paid Invoices</p>
          <p className="font-heading text-2xl font-bold">{overview.paidInvoices}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-[var(--muted)]">Pending Invoices</p>
          <p className="font-heading text-2xl font-bold">{overview.pendingInvoices}</p>
        </article>
      </section>

      <section className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Monthly Revenue Analytics</h3>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#0a63d8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

