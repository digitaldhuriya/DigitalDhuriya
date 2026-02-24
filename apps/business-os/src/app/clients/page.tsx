'use client';

import { FormEvent, useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatDate } from '@/lib/format';
import { Client, ServiceItem } from '@/lib/types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    gstNumber: '',
    contractStart: '',
    contractEnd: '',
    activeServiceIds: [] as string[],
  });

  async function loadData() {
    setLoading(true);
    try {
      const [clientsResponse, servicesResponse] = await Promise.all([
        api.get<Client[]>('/clients'),
        api.get<ServiceItem[]>('/services'),
      ]);
      setClients(clientsResponse.data);
      setServices(servicesResponse.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post('/clients', {
        ...form,
        contractStart: form.contractStart || undefined,
        contractEnd: form.contractEnd || undefined,
      });

      setForm({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        gstNumber: '',
        contractStart: '',
        contractEnd: '',
        activeServiceIds: [],
      });
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setForm((current) => {
      const exists = current.activeServiceIds.includes(serviceId);
      return {
        ...current,
        activeServiceIds: exists
          ? current.activeServiceIds.filter((id) => id !== serviceId)
          : [...current.activeServiceIds, serviceId],
      };
    });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr,1.8fr]">
      <article className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Add Client</h3>
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
          <input
            placeholder="GST (optional)"
            value={form.gstNumber}
            onChange={(event) => setForm((current) => ({ ...current, gstNumber: event.target.value }))}
            className="w-full"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={form.contractStart}
              onChange={(event) =>
                setForm((current) => ({ ...current, contractStart: event.target.value }))
              }
            />
            <input
              type="date"
              value={form.contractEnd}
              onChange={(event) => setForm((current) => ({ ...current, contractEnd: event.target.value }))}
            />
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Active Services
            </p>
            <div className="space-y-1">
              {services.map((service) => (
                <label key={service.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.activeServiceIds.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                  />
                  <span>{service.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="primary-btn w-full" disabled={saving}>
            {saving ? 'Saving...' : 'Create Client'}
          </button>
        </form>
      </article>

      <article className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Clients</h3>
        <div className="table-wrap mt-4">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Contract</th>
                <th>Services</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>Loading clients...</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={5}>No clients yet.</td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <p className="font-semibold">{client.companyName}</p>
                      <p className="text-xs text-[var(--muted)]">{client.email || '-'}</p>
                    </td>
                    <td>{client.contactName}</td>
                    <td>
                      {formatDate(client.contractStart)} - {formatDate(client.contractEnd)}
                    </td>
                    <td>
                      {(client.activeServices || []).map((activeService) => activeService.service.name).join(', ') ||
                        '-'}
                    </td>
                    <td>
                      <span className="badge badge-info">{client.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}

