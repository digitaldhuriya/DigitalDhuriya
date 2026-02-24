'use client';

import { FormEvent, useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatDate } from '@/lib/format';
import { Client, Project } from '@/lib/types';

type TeamUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});

  const [form, setForm] = useState({
    name: '',
    description: '',
    clientId: '',
    deadline: '',
    teamMemberIds: [] as string[],
  });

  async function loadData() {
    setLoading(true);
    try {
      const [projectsResponse, clientsResponse] = await Promise.all([
        api.get<Project[]>('/projects'),
        api.get<Client[]>('/clients'),
      ]);

      setProjects(projectsResponse.data);
      setClients(clientsResponse.data);

      try {
        const usersResponse = await api.get<TeamUser[]>('/admin/users');
        setTeamUsers(usersResponse.data.filter((user) => user.isActive));
      } catch {
        setTeamUsers([]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const toggleTeamMember = (id: string) => {
    setForm((current) => ({
      ...current,
      teamMemberIds: current.teamMemberIds.includes(id)
        ? current.teamMemberIds.filter((memberId) => memberId !== id)
        : [...current.teamMemberIds, id],
    }));
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post('/projects', {
        ...form,
        deadline: form.deadline || undefined,
      });

      setForm({
        name: '',
        description: '',
        clientId: '',
        deadline: '',
        teamMemberIds: [],
      });

      await loadData();
    } finally {
      setSaving(false);
    }
  };

  const createTask = async (projectId: string) => {
    const title = window.prompt('Task title');
    if (!title) {
      return;
    }

    await api.post(`/projects/${projectId}/tasks`, {
      title,
    });

    await loadData();
  };

  const uploadFile = async (projectId: string) => {
    const file = selectedFiles[projectId];
    if (!file) {
      window.alert('Select a file first');
      return;
    }

    setUploadingId(projectId);
    try {
      const payload = new FormData();
      payload.append('file', file);
      await api.post(`/projects/${projectId}/files`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSelectedFiles((current) => ({ ...current, [projectId]: null }));
      await loadData();
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr,1.8fr]">
      <article className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Create Project</h3>
        <form className="mt-3 space-y-3" onSubmit={handleCreate}>
          <input
            required
            placeholder="Project name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            className="w-full"
          />

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

          <input
            type="date"
            value={form.deadline}
            onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))}
            className="w-full"
          />

          {teamUsers.length > 0 ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Assign Team</p>
              <div className="space-y-1">
                {teamUsers.map((teamUser) => (
                  <label key={teamUser.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.teamMemberIds.includes(teamUser.id)}
                      onChange={() => toggleTeamMember(teamUser.id)}
                    />
                    <span>
                      {teamUser.name} ({teamUser.role})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <button className="primary-btn w-full" disabled={saving}>
            {saving ? 'Saving...' : 'Create Project'}
          </button>
        </form>
      </article>

      <article className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Projects</h3>
        <div className="space-y-3 pt-3">
          {loading ? (
            <div className="text-sm text-[var(--muted)]">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-sm text-[var(--muted)]">No projects yet.</div>
          ) : (
            projects.map((project) => (
              <article key={project.id} className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="font-heading text-base font-semibold">{project.name}</h4>
                    <p className="text-sm text-[var(--muted)]">{project.client.companyName}</p>
                  </div>
                  <span className="badge badge-info">{project.status}</span>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-[var(--muted)] sm:grid-cols-3">
                  <p>Deadline: {formatDate(project.deadline)}</p>
                  <p>Team: {project.members.length}</p>
                  <p>Tasks: {project.tasks.length}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="secondary-btn" onClick={() => void createTask(project.id)}>
                    Add Task
                  </button>
                  <input
                    type="file"
                    onChange={(event) =>
                      setSelectedFiles((current) => ({
                        ...current,
                        [project.id]: event.target.files?.[0] || null,
                      }))
                    }
                  />
                  <button
                    className="secondary-btn"
                    disabled={uploadingId === project.id}
                    onClick={() => void uploadFile(project.id)}
                  >
                    {uploadingId === project.id ? 'Uploading...' : 'Upload File'}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </article>
    </div>
  );
}

