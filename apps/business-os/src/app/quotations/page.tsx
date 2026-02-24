'use client';

import { FormEvent, useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import { Client, Lead, Quotation, ServiceItem } from '@/lib/types';

type QuotationItemForm = {
  serviceId: string;
  description: string;
  quantity: number;
  unitPrice?: number;
};

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    clientId: '',
    leadId: '',
    validUntil: '',
    gstEnabled: true,
    taxPercent: 18,
    notes: '',
  });
  const [items, setItems] = useState<QuotationItemForm[]>([
    { serviceId: '', description: '', quantity: 1 },
  ]);

  async function loadData() {
    setLoading(true);
    try {
      const [quotationsResponse, clientsResponse, servicesResponse, leadsResponse] = await Promise.all([
        api.get<Quotation[]>('/quotations'),
        api.get<Client[]>('/clients'),
        api.get<ServiceItem[]>('/services'),
        api.get<Lead[]>('/leads'),
      ]);

      setQuotations(quotationsResponse.data);
      setClients(clientsResponse.data);
      setServices(servicesResponse.data);
      setLeads(leadsResponse.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const addItem = () => {
    setItems((current) => [...current, { serviceId: '', description: '', quantity: 1 }]);
  };

  const updateItem = (index: number, nextValue: Partial<QuotationItemForm>) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...nextValue } : item)));
  };

  const removeItem = (index: number) => {
    setItems((current) => current.filter((_item, itemIndex) => itemIndex !== index));
  };

  const createQuotation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      await api.post('/quotations', {
        ...form,
        leadId: form.leadId || undefined,
        items: items.map((item) => ({
          serviceId: item.serviceId || undefined,
          description: item.description || undefined,
          quantity: Number(item.quantity),
          unitPrice: item.unitPrice,
        })),
      });

      setForm({
        clientId: '',
        leadId: '',
        validUntil: '',
        gstEnabled: true,
        taxPercent: 18,
        notes: '',
      });
      setItems([{ serviceId: '', description: '', quantity: 1 }]);
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  const downloadPdf = async (id: string) => {
    const response = await api.get(`/quotations/${id}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `quotation-${id}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr,1.85fr]">
      <article className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Create Quotation</h3>
        <form className="mt-3 space-y-3" onSubmit={createQuotation}>
          <select
            required
            value={form.clientId}
            onChange={(event) => setForm((current) => ({ ...current, clientId: event.target.value }))}
            className="w-full"
          >
            <option value="">Select client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </select>

          <select
            value={form.leadId}
            onChange={(event) => setForm((current) => ({ ...current, leadId: event.target.value }))}
            className="w-full"
          >
            <option value="">Optional lead reference</option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.companyName}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              required
              value={form.validUntil}
              onChange={(event) => setForm((current) => ({ ...current, validUntil: event.target.value }))}
            />
            <input
              type="number"
              value={form.taxPercent}
              onChange={(event) =>
                setForm((current) => ({ ...current, taxPercent: Number(event.target.value) }))
              }
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.gstEnabled}
              onChange={(event) =>
                setForm((current) => ({ ...current, gstEnabled: event.target.checked }))
              }
            />
            GST enabled
          </label>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Items</p>
              <button type="button" className="secondary-btn" onClick={addItem}>
                Add Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={`item-${index}`} className="grid gap-2 rounded-lg border border-[var(--border)] p-2 md:grid-cols-5">
                  <select
                    value={item.serviceId}
                    onChange={(event) => updateItem(index, { serviceId: event.target.value })}
                  >
                    <option value="">Service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder="Description"
                    value={item.description}
                    onChange={(event) => updateItem(index, { description: event.target.value })}
                    className="md:col-span-2"
                  />
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })}
                  />
                  <button type="button" className="secondary-btn" onClick={() => removeItem(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            className="w-full"
          />

          <button className="primary-btn w-full" disabled={saving}>
            {saving ? 'Saving...' : 'Create Quotation'}
          </button>
        </form>
      </article>

      <article className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Quotation List</h3>
        <div className="table-wrap mt-4">
          <table>
            <thead>
              <tr>
                <th>Quotation #</th>
                <th>Client</th>
                <th>Status</th>
                <th>Total</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>Loading quotations...</td>
                </tr>
              ) : quotations.length === 0 ? (
                <tr>
                  <td colSpan={6}>No quotations created yet.</td>
                </tr>
              ) : (
                quotations.map((quotation) => (
                  <tr key={quotation.id}>
                    <td>{quotation.quotationNumber}</td>
                    <td>{quotation.client.companyName}</td>
                    <td>
                      <span className="badge badge-info">{quotation.status}</span>
                    </td>
                    <td>{formatCurrency(quotation.total)}</td>
                    <td>{formatDate(quotation.createdAt)}</td>
                    <td>
                      <button className="secondary-btn" onClick={() => void downloadPdf(quotation.id)}>
                        PDF
                      </button>
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

