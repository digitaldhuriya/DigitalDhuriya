'use client';

import { FormEvent, useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatDate } from '@/lib/format';
import { useAuth } from '@/context/auth-context';

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  commissionPercent: string | null;
  createdAt: string;
};

type BackupRow = {
  id: string;
  fileName: string;
  filePath: string;
  createdAt: string;
  createdBy?: { name: string };
};

export default function AdminPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [users, setUsers] = useState<UserRow[]>([]);
  const [backups, setBackups] = useState<BackupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'FREELANCER',
    commissionPercent: 0,
  });

  async function loadData() {
    setLoading(true);
    try {
      const backupPromise = api.get<BackupRow[]>('/admin/backups').catch(() => ({ data: [] as BackupRow[] }));
      const usersPromise = api.get<UserRow[]>('/admin/users').catch(() => ({ data: [] as UserRow[] }));

      const [backupsResponse, usersResponse] = await Promise.all([backupPromise, usersPromise]);
      setBackups(backupsResponse.data);
      setUsers(usersResponse.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const createUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSuperAdmin) {
      return;
    }

    setSaving(true);
    try {
      await api.post('/admin/users', form);
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'FREELANCER',
        commissionPercent: 0,
      });
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  const toggleUserStatus = async (id: string, nextStatus: boolean) => {
    if (!isSuperAdmin) {
      return;
    }

    await api.patch(`/admin/users/${id}/status`, { isActive: nextStatus });
    await loadData();
  };

  const createBackup = async () => {
    if (!isSuperAdmin) {
      return;
    }

    setBackupLoading(true);
    try {
      await api.post('/admin/backups', {});
      await loadData();
    } finally {
      setBackupLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[1fr,2fr]">
        <article className="panel p-4">
          <h3 className="font-heading text-lg font-semibold">Create Team User</h3>
          <form className="mt-3 space-y-3" onSubmit={createUser}>
            <input
              required
              disabled={!isSuperAdmin}
              placeholder="Full name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="w-full"
            />
            <input
              required
              type="email"
              disabled={!isSuperAdmin}
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="w-full"
            />
            <input
              required
              type="password"
              disabled={!isSuperAdmin}
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="w-full"
            />
            <select
              value={form.role}
              disabled={!isSuperAdmin}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              className="w-full"
            >
              <option value="SALES_MANAGER">Sales Manager</option>
              <option value="DIGITAL_MARKETING_EXECUTIVE">Digital Marketing Executive</option>
              <option value="FREELANCER">Freelancer</option>
              <option value="ACCOUNTANT">Accountant</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
            <input
              type="number"
              min={0}
              max={100}
              disabled={!isSuperAdmin}
              placeholder="Commission %"
              value={form.commissionPercent}
              onChange={(event) =>
                setForm((current) => ({ ...current, commissionPercent: Number(event.target.value) }))
              }
              className="w-full"
            />

            <button className="primary-btn w-full" disabled={saving || !isSuperAdmin}>
              {saving ? 'Saving...' : isSuperAdmin ? 'Create User' : 'Read only access'}
            </button>
          </form>
        </article>

        <article className="panel p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold">Team Accounts</h3>
            <button className="secondary-btn" disabled={!isSuperAdmin || backupLoading} onClick={createBackup}>
              {backupLoading ? 'Backing up...' : 'Backup Database'}
            </button>
          </div>
          <div className="table-wrap mt-4">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Commission</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5}>Loading users...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No users found.</td>
                  </tr>
                ) : (
                  users.map((teamUser) => (
                    <tr key={teamUser.id}>
                      <td>
                        <p className="font-semibold">{teamUser.name}</p>
                        <p className="text-xs text-[var(--muted)]">{teamUser.email}</p>
                      </td>
                      <td>{teamUser.role}</td>
                      <td>
                        <span className={`badge ${teamUser.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {teamUser.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td>{Number(teamUser.commissionPercent || 0)}%</td>
                      <td>
                        {isSuperAdmin ? (
                          <button
                            className="secondary-btn"
                            onClick={() => void toggleUserStatus(teamUser.id, !teamUser.isActive)}
                          >
                            {teamUser.isActive ? 'Disable' : 'Enable'}
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
      </section>

      <section className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Backup History</h3>
        <div className="table-wrap mt-4">
          <table>
            <thead>
              <tr>
                <th>File</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Path</th>
              </tr>
            </thead>
            <tbody>
              {backups.length === 0 ? (
                <tr>
                  <td colSpan={4}>No backups recorded yet.</td>
                </tr>
              ) : (
                backups.map((backup) => (
                  <tr key={backup.id}>
                    <td>{backup.fileName}</td>
                    <td>{backup.createdBy?.name || 'System'}</td>
                    <td>{formatDate(backup.createdAt)}</td>
                    <td className="text-xs">{backup.filePath}</td>
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

