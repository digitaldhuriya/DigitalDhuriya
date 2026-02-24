'use client';

import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ThemeToggle } from '@/components/ui/theme-toggle';

function pageTitle(pathname: string) {
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname === '/leads') return 'Lead Management';
  if (pathname === '/clients') return 'Client Management';
  if (pathname === '/projects') return 'Project Tracking';
  if (pathname === '/services') return 'Service Management';
  if (pathname === '/quotations') return 'Quotations';
  if (pathname === '/invoices') return 'Invoices';
  if (pathname === '/commissions') return 'Team Commissions';
  if (pathname === '/blog') return 'Blog & Content';
  if (pathname === '/settings') return 'Business Settings';
  if (pathname === '/accounting') return 'Accounting Overview';
  if (pathname === '/admin') return 'Admin Control Panel';
  return 'Digital Dhuriya';
}

export function Topbar({ openSidebar }: { openSidebar: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--panel)]/85 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openSidebar}
            className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2 lg:hidden"
          >
            <Menu size={16} />
          </button>
          <div>
            <h2 className="font-heading text-lg font-semibold text-[var(--text)]">{pageTitle(pathname)}</h2>
            <p className="text-xs text-[var(--muted)]">Kanpur HQ • Service Export Worldwide</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs sm:block">
            <span className="font-semibold text-[var(--text)]">{user?.name}</span>
            <span className="text-[var(--muted)]"> • {user?.role}</span>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

