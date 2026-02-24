'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { formatDate } from '@/lib/format';
import { Lead } from '@/lib/types';

const statuses: Lead['status'][] = ['NEW', 'CONTACTED', 'PROPOSAL_SENT', 'WON', 'LOST'];

const statusBadge: Record<string, string> = {
  NEW: 'badge-info',
  CONTACTED: 'badge-warning',
  PROPOSAL_SENT: 'badge-warning',
  WON: 'badge-success',
  LOST: 'badge-danger',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    source: 'Website',
    status: 'NEW' as Lead['status'],
    estimatedValue: '',
  });

  async function loadLeads() {
    setLoading(true);
    try {
      const response = await api.get<Lead[]>('/leads', {
        params: search ? { search } : undefined,
      });
      setLeads(response.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLeads();
  }, []);

  const totals = useMemo(() => {
    return {
      total: leads.length,
      won: leads.filter((lead) => lead.status === 'WON').length,
      hot: leads.filter((lead) => lead.status === 'CONTACTED' || lead.status === 'PROPOSAL_SENT').length,
    };
  }, [leads]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      await api.post('/leads', {
        ...form,
        estimatedValue: form.estimatedValue ? Number(form.estimatedValue) : undefined,
      });

      setForm({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        source: 'Website',
        status: 'NEW',
        estimatedValue: '',
      });
      await loadLeads();
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async (leadId: string) => {
    const note = window.prompt('Enter CRM note');
    if (!note) {
      return;
    }

    await api.post(`/leads/${leadId}/notes`, { content: note });
    await loadLeads();
  };

  const exportCsv = async () => {
    const response = await api.get('/leads/export/csv', {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leads-export.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="panel p-4">
          <p className="text-xs text-[var(--muted)]">Total Leads</p>
          <p className="font-heading text-2xl font-bold">{totals.total}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-[var(--muted)]">Won Deals</p>
          <p className="font-heading text-2xl font-bold">{totals.won}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-[var(--muted)]">Warm Pipeline</p>
          <p className="font-heading text-2xl font-bold">{totals.hot}</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr,1.9fr]">
        <article className="panel p-4">
          <h3 className="font-heading text-lg font-semibold">Add Lead</h3>
          <form className="mt-3 space-y-3" onSubmit={handleCreate}>
            <input
              required
              placeholder="Company name"
              value={form.companyName}
              onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))}
              className="w-full"
            />
            <input
              required
              placeholder="Contact person"
              value={form.contactName}
              onChange={(event) => setForm((current) => ({ ...current, contactName: event.target.value }))}
              className="w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="w-full"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({ ...current, status: event.target.value as Lead['status'] }))
                }
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <input
                placeholder="Source"
                value={form.source}
                onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))}
              />
            </div>
            <input
              type="number"
              placeholder="Estimated value"
              value={form.estimatedValue}
              onChange={(event) => setForm((current) => ({ ...current, estimatedValue: event.target.value }))}
              className="w-full"
            />
            <button className="primary-btn w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Create Lead'}
            </button>
          </form>
        </article>

        <article className="panel p-4">
          <div className="flex flex-wrap items-center gap-2">
            <input
              placeholder="Search lead/company"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="min-w-56 flex-1"
            />
            <button className="secondary-btn" onClick={() => void loadLeads()}>
              Search
            </button>
            <button className="secondary-btn" onClick={exportCsv}>
              Export CSV
            </button>
          </div>

          <div className="table-wrap mt-4">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>Loading leads...</td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No leads found.</td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <p className="font-semibold">{lead.companyName}</p>
                        <p className="text-xs text-[var(--muted)]">{lead.email || '-'}</p>
                      </td>
                      <td>{lead.contactName}</td>
                      <td>
                        <span className={`badge ${statusBadge[lead.status] || 'badge-info'}`}>{lead.status}</span>
                      </td>
                      <td>{lead.source || '-'}</td>
                      <td>{formatDate(lead.createdAt)}</td>
                      <td>
                        <button className="secondary-btn" onClick={() => void handleAddNote(lead.id)}>
                          Add Note
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}

