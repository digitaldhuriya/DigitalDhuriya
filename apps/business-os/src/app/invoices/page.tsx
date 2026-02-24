'use client';

import { FormEvent, useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import { Client, Invoice, ServiceItem } from '@/lib/types';

type InvoiceItemForm = {
  serviceId: string;
  description: string;
  quantity: number;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    clientId: '',
    dueDate: '',
    taxPercent: 18,
    notes: '',
  });
  const [items, setItems] = useState<InvoiceItemForm[]>([
    { serviceId: '', description: '', quantity: 1 },
  ]);

  async function loadData() {
    setLoading(true);
    try {
      const [invoiceResponse, clientResponse, serviceResponse] = await Promise.all([
        api.get<Invoice[]>('/invoices'),
        api.get<Client[]>('/clients'),
        api.get<ServiceItem[]>('/services'),
      ]);

      setInvoices(invoiceResponse.data);
      setClients(clientResponse.data);
      setServices(serviceResponse.data);
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

  const updateItem = (index: number, value: Partial<InvoiceItemForm>) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...value } : item)));
  };

  const removeItem = (index: number) => {
    setItems((current) => current.filter((_item, itemIndex) => itemIndex !== index));
  };

  const createInvoice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post('/invoices', {
        ...form,
        items: items.map((item) => ({
          serviceId: item.serviceId || undefined,
          description: item.description || undefined,
          quantity: item.quantity,
        })),
      });

      setForm({
        clientId: '',
        dueDate: '',
        taxPercent: 18,
        notes: '',
      });
      setItems([{ serviceId: '', description: '', quantity: 1 }]);
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  const recordPayment = async (invoiceId: string) => {
    const amountInput = window.prompt('Received amount');
    if (!amountInput) {
      return;
    }

    const amount = Number(amountInput);
    if (!Number.isFinite(amount) || amount <= 0) {
      window.alert('Enter a valid amount');
      return;
    }

    await api.post(`/invoices/${invoiceId}/payments`, { amount });
    await loadData();
  };

  const downloadPdf = async (invoiceId: string) => {
    const response = await api.get(`/invoices/${invoiceId}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${invoiceId}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr,1.9fr]">
      <article className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Generate Invoice</h3>
        <form className="mt-3 space-y-3" onSubmit={createInvoice}>
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

          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              required
              value={form.dueDate}
              onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
            />
            <input
              type="number"
              value={form.taxPercent}
              onChange={(event) =>
                setForm((current) => ({ ...current, taxPercent: Number(event.target.value) }))
              }
            />
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Items</p>
              <button type="button" className="secondary-btn" onClick={addItem}>
                Add Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={`invoice-item-${index}`} className="grid gap-2 rounded-lg border border-[var(--border)] p-2 md:grid-cols-5">
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
                    className="md:col-span-2"
                    placeholder="Description"
                    value={item.description}
                    onChange={(event) => updateItem(index, { description: event.target.value })}
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
            {saving ? 'Saving...' : 'Create Invoice'}
          </button>
        </form>
      </article>

      <article className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Invoice Register</h3>
        <div className="table-wrap mt-4">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Status</th>
                <th>Total</th>
                <th>Received</th>
                <th>Balance</th>
                <th>Due</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>Loading invoices...</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8}>No invoices generated yet.</td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.client.companyName}</td>
                    <td>
                      <span className="badge badge-info">{invoice.status}</span>
                    </td>
                    <td>{formatCurrency(invoice.total)}</td>
                    <td>{formatCurrency(invoice.amountReceived)}</td>
                    <td>{formatCurrency(invoice.balance)}</td>
                    <td>{formatDate(invoice.dueDate)}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        <button className="secondary-btn" onClick={() => void recordPayment(invoice.id)}>
                          Record Payment
                        </button>
                        <button className="secondary-btn" onClick={() => void downloadPdf(invoice.id)}>
                          PDF
                        </button>
                      </div>
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

