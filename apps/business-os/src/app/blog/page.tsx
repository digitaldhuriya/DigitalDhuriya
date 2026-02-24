'use client';

import { FormEvent, useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatDate } from '@/lib/format';
import { BlogPost } from '@/lib/types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    status: 'DRAFT',
  });

  async function loadPosts() {
    setLoading(true);
    try {
      const response = await api.get<BlogPost[]>('/blog/posts');
      setPosts(response.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPosts();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post('/blog/posts', form);
      setForm({
        title: '',
        content: '',
        metaTitle: '',
        metaDescription: '',
        status: 'DRAFT',
      });
      await loadPosts();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr,1.9fr]">
      <article className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">New Blog Post</h3>
        <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
          <input
            required
            placeholder="Post title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            className="w-full"
          />
          <textarea
            required
            placeholder="Post content"
            value={form.content}
            onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
            className="min-h-36 w-full"
          />
          <input
            placeholder="Meta title"
            value={form.metaTitle}
            onChange={(event) => setForm((current) => ({ ...current, metaTitle: event.target.value }))}
            className="w-full"
          />
          <textarea
            placeholder="Meta description"
            value={form.metaDescription}
            onChange={(event) =>
              setForm((current) => ({ ...current, metaDescription: event.target.value }))
            }
            className="w-full"
          />
          <select
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            className="w-full"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
          <button className="primary-btn w-full" disabled={saving}>
            {saving ? 'Publishing...' : 'Save Post'}
          </button>
        </form>
      </article>

      <article className="panel p-4">
        <h3 className="font-heading text-lg font-semibold">Published & Draft Articles</h3>
        <div className="table-wrap mt-4">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>Loading blog posts...</td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={4}>No posts found.</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td>{post.slug}</td>
                    <td>
                      <span className={`badge ${post.status === 'PUBLISHED' ? 'badge-success' : 'badge-warning'}`}>
                        {post.status}
                      </span>
                    </td>
                    <td>{formatDate(post.createdAt)}</td>
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

