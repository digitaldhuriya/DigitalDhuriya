'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { canAccessRoute } from '@/lib/rbac';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

const publicRoutes = ['/login'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user && !isPublicRoute) {
      router.replace('/login');
      return;
    }

    if (user && pathname === '/') {
      router.replace('/dashboard');
      return;
    }

    if (user && !isPublicRoute && !canAccessRoute(user.role, pathname)) {
      router.replace('/dashboard');
    }
  }, [isLoading, isPublicRoute, pathname, router, user]);

  if (isLoading && !isPublicRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-6 py-4 text-sm text-[var(--muted)]">
          Loading workspace...
        </div>
      </div>
    );
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar openSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 py-4 lg:px-8 lg:py-6">{children}</main>
      </div>
    </div>
  );
}

