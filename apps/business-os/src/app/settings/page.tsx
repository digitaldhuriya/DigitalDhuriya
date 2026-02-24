'use client';

import { FormEvent, useEffect, useState } from 'react';
import api from '@/lib/api';

type SettingsData = {
  brandName: string;
  companyName: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  gstNumber?: string;
  logoUrl?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassEncrypted?: string;
  smtpFromEmail?: string;
  taxPercent: string | number;
  currency: string;
  whatsappApiUrl?: string;
  whatsappApiToken?: string;
};

const defaultSettings: SettingsData = {
  brandName: 'Digital Dhuriya',
  companyName: 'Digital Dhuriya',
  address: '',
  city: 'Kanpur',
  state: 'Uttar Pradesh',
  country: 'India',
  phone: '',
  email: '',
  website: '',
  gstNumber: '',
  logoUrl: '',
  smtpHost: '',
  smtpPort: 587,
  smtpUser: '',
  smtpPassEncrypted: '',
  smtpFromEmail: '',
  taxPercent: 18,
  currency: 'INR',
  whatsappApiUrl: '',
  whatsappApiToken: '',
};

export default function SettingsPage() {
  const assetBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(
    /\/api\/?$/,
    '',
  );
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  async function loadSettings() {
    setLoading(true);
    try {
      const response = await api.get<SettingsData>('/settings');
      setSettings((current) => ({ ...current, ...response.data }));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSettings();
  }, []);

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...settings,
        taxPercent: Number(settings.taxPercent),
        smtpPort: settings.smtpPort ? Number(settings.smtpPort) : undefined,
      };
      const response = await api.patch<SettingsData>('/settings', payload);
      setSettings((current) => ({ ...current, ...response.data }));
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingLogo(true);
    try {
      const payload = new FormData();
      payload.append('file', file);

      const response = await api.post<{ logoUrl: string; settings: SettingsData }>('/settings/logo', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSettings((current) => ({ ...current, logoUrl: response.data.logoUrl }));
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) {
    return <div className="panel p-6 text-sm text-[var(--muted)]">Loading settings...</div>;
  }

  return (
    <form className="grid gap-4 xl:grid-cols-2" onSubmit={saveSettings}>
      <article className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Company Details</h3>
        <div className="mt-3 space-y-3">
          <input
            value={settings.brandName}
            onChange={(event) => setSettings((current) => ({ ...current, brandName: event.target.value }))}
            placeholder="Brand name"
            className="w-full"
          />
          <input
            value={settings.companyName}
            onChange={(event) => setSettings((current) => ({ ...current, companyName: event.target.value }))}
            placeholder="Company name"
            className="w-full"
          />
          <input
            value={settings.email || ''}
            onChange={(event) => setSettings((current) => ({ ...current, email: event.target.value }))}
            placeholder="Company email"
            className="w-full"
          />
          <input
            value={settings.phone || ''}
            onChange={(event) => setSettings((current) => ({ ...current, phone: event.target.value }))}
            placeholder="Phone"
            className="w-full"
          />
          <input
            value={settings.gstNumber || ''}
            onChange={(event) => setSettings((current) => ({ ...current, gstNumber: event.target.value }))}
            placeholder="GST number"
            className="w-full"
          />
          <textarea
            value={settings.address || ''}
            onChange={(event) => setSettings((current) => ({ ...current, address: event.target.value }))}
            placeholder="Address"
            className="w-full"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              value={settings.city || ''}
              onChange={(event) => setSettings((current) => ({ ...current, city: event.target.value }))}
              placeholder="City"
            />
            <input
              value={settings.state || ''}
              onChange={(event) => setSettings((current) => ({ ...current, state: event.target.value }))}
              placeholder="State"
            />
            <input
              value={settings.country || ''}
              onChange={(event) => setSettings((current) => ({ ...current, country: event.target.value }))}
              placeholder="Country"
            />
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Company Logo</p>
            <div className="mt-2 flex items-center gap-3">
              {settings.logoUrl ? (
                <img
                  src={`${assetBaseUrl}${settings.logoUrl}`}
                  alt="Logo"
                  className="h-12 w-12 rounded-lg border border-[var(--border)] bg-white object-contain"
                />
              ) : null}
              <input type="file" accept="image/*" onChange={handleLogoUpload} />
              {uploadingLogo ? <span className="text-xs text-[var(--muted)]">Uploading...</span> : null}
            </div>
          </div>
        </div>
      </article>

      <article className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">System & Billing</h3>
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={settings.taxPercent}
              onChange={(event) => setSettings((current) => ({ ...current, taxPercent: event.target.value }))}
              placeholder="Tax %"
            />
            <input
              value={settings.currency}
              onChange={(event) => setSettings((current) => ({ ...current, currency: event.target.value }))}
              placeholder="Currency"
            />
          </div>

          <h4 className="pt-2 text-sm font-semibold text-[var(--text)]">SMTP Configuration</h4>
          <input
            value={settings.smtpHost || ''}
            onChange={(event) => setSettings((current) => ({ ...current, smtpHost: event.target.value }))}
            placeholder="SMTP host"
            className="w-full"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={settings.smtpPort || ''}
              onChange={(event) =>
                setSettings((current) => ({ ...current, smtpPort: Number(event.target.value) }))
              }
              placeholder="SMTP port"
            />
            <input
              value={settings.smtpUser || ''}
              onChange={(event) => setSettings((current) => ({ ...current, smtpUser: event.target.value }))}
              placeholder="SMTP user"
            />
          </div>
          <input
            type="password"
            value={settings.smtpPassEncrypted || ''}
            onChange={(event) =>
              setSettings((current) => ({ ...current, smtpPassEncrypted: event.target.value }))
            }
            placeholder="SMTP password"
            className="w-full"
          />
          <input
            value={settings.smtpFromEmail || ''}
            onChange={(event) =>
              setSettings((current) => ({ ...current, smtpFromEmail: event.target.value }))
            }
            placeholder="SMTP from email"
            className="w-full"
          />

          <h4 className="pt-2 text-sm font-semibold text-[var(--text)]">WhatsApp API</h4>
          <input
            value={settings.whatsappApiUrl || ''}
            onChange={(event) =>
              setSettings((current) => ({ ...current, whatsappApiUrl: event.target.value }))
            }
            placeholder="WhatsApp API URL"
            className="w-full"
          />
          <input
            value={settings.whatsappApiToken || ''}
            onChange={(event) =>
              setSettings((current) => ({ ...current, whatsappApiToken: event.target.value }))
            }
            placeholder="WhatsApp API token"
            className="w-full"
          />
        </div>
      </article>

      <div className="xl:col-span-2">
        <button className="primary-btn" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}

