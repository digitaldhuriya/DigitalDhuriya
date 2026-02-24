'use client';

import { FormEvent, useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import { ServiceItem } from '@/lib/types';
import { useAuth } from '@/context/auth-context';

export default function ServicesPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'SUPER_ADMIN';
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    basePrice: '',
    taxPercent: '18',
  });

  async function loadServices() {
    setLoading(true);
    try {
      const response = await api.get<ServiceItem[]>('/services');
      setServices(response.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadServices();
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManage) {
      return;
    }

    setSaving(true);
    try {
      await api.post('/services', {
        name: form.name,
        description: form.description,
        basePrice: Number(form.basePrice),
        taxPercent: Number(form.taxPercent),
      });

      setForm({
        name: '',
        description: '',
        basePrice: '',
        taxPercent: '18',
      });
      await loadServices();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!canManage) {
      return;
    }

    if (!window.confirm('Delete this service?')) {
      return;
    }

    await api.delete(`/services/${id}`);
    await loadServices();
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr,1.5fr]">
      <article className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Create Service</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">Used in quotation and invoice auto-pricing.</p>
        <form className="mt-4 space-y-3" onSubmit={handleCreate}>
          <input
            required
            disabled={!canManage}
            placeholder="Service name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full"
          />
          <textarea
            disabled={!canManage}
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            className="w-full"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              required
              disabled={!canManage}
              type="number"
              placeholder="Base price"
              value={form.basePrice}
              onChange={(event) => setForm((current) => ({ ...current, basePrice: event.target.value }))}
            />
            <input
              required
              disabled={!canManage}
              type="number"
              placeholder="Tax %"
              value={form.taxPercent}
              onChange={(event) => setForm((current) => ({ ...current, taxPercent: event.target.value }))}
            />
          </div>
          <button className="primary-btn w-full" disabled={saving || !canManage}>
            {saving ? 'Saving...' : canManage ? 'Create Service' : 'Read only access'}
          </button>
        </form>
      </article>

      <article className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Service Catalog</h3>
        <div className="table-wrap mt-4">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Base Price</th>
                <th>Tax</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>Loading services...</td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5}>No services found.</td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <p className="font-semibold">{service.name}</p>
                      <p className="text-xs text-[var(--muted)]">{service.description || '-'}</p>
                    </td>
                    <td>{formatCurrency(service.basePrice)}</td>
                    <td>{Number(service.taxPercent)}%</td>
                    <td>
                      <span className={`badge ${service.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {canManage ? (
                        <button className="secondary-btn" onClick={() => void handleDelete(service.id)}>
                          Delete
                        </button>
                      ) : null}
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

