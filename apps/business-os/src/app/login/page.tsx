'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, isLoading } = useAuth();
  const [email, setEmail] = useState('admin@digitaldhuriya.com');
  const [password, setPassword] = useState('Admin@12345');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [isLoading, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      router.replace('/dashboard');
    } catch (loginError: any) {
      setError(loginError?.response?.data?.message || 'Unable to login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl lg:grid-cols-2">
        <div className="hidden bg-[linear-gradient(135deg,#0a63d8,#08234a)] p-10 text-white lg:block">
          <p className="text-sm uppercase tracking-[0.2em] text-blue-100">Digital Dhuriya</p>
          <h1 className="mt-4 font-heading text-4xl font-bold">Business Management OS</h1>
          <p className="mt-3 max-w-sm text-sm text-blue-100">
            Run leads, clients, projects, billing, commissions, content, and accounting from one secure dashboard.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <h2 className="font-heading text-2xl font-bold text-[var(--text)]">Welcome back</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Sign in to continue operating Digital Dhuriya.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full"
              />
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button type="submit" className="primary-btn w-full" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

