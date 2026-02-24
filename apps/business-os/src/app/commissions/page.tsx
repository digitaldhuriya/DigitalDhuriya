'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import { Commission } from '@/lib/types';

type CommissionSummary = {
  salesPersonId: string;
  salesPersonName: string;
  totalEarned: number;
  totalPaid: number;
  totalPending: number;
};

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const [commissionsResponse, summaryResponse] = await Promise.all([
        api.get<Commission[]>('/commissions'),
        api.get<CommissionSummary[]>('/commissions/summary'),
      ]);

      setCommissions(commissionsResponse.data);
      setSummary(summaryResponse.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const markPaid = async (commissionId: string) => {
    await api.patch(`/commissions/${commissionId}/pay`, {});
    await loadData();
  };

  return (
    <div className="space-y-4">
      <section className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Sales Commission Summary</h3>
        <div className="table-wrap mt-3">
          <table>
            <thead>
              <tr>
                <th>Sales Person</th>
                <th>Total Earned</th>
                <th>Total Paid</th>
                <th>Pending</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row) => (
                <tr key={row.salesPersonId}>
                  <td>{row.salesPersonName}</td>
                  <td>{formatCurrency(row.totalEarned)}</td>
                  <td>{formatCurrency(row.totalPaid)}</td>
                  <td>{formatCurrency(row.totalPending)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Commission Entries</h3>
        <div className="table-wrap mt-3">
          <table>
            <thead>
              <tr>
                <th>Sales Person</th>
                <th>Invoice</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>Loading commissions...</td>
                </tr>
              ) : commissions.length === 0 ? (
                <tr>
                  <td colSpan={6}>No commission records yet.</td>
                </tr>
              ) : (
                commissions.map((commission) => (
                  <tr key={commission.id}>
                    <td>{commission.salesPerson.name}</td>
                    <td>{commission.invoice.invoiceNumber}</td>
                    <td>{Number(commission.commissionPercent)}%</td>
                    <td>{formatCurrency(commission.commissionAmount)}</td>
                    <td>
                      <span className={`badge ${commission.status === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                        {commission.status}
                      </span>
                    </td>
                    <td>
                      {commission.status !== 'PAID' ? (
                        <button className="secondary-btn" onClick={() => void markPaid(commission.id)}>
                          Mark Paid
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

