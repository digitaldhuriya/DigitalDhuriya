'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType } from 'react';
import {
  BarChart3,
  BookOpenText,
  Briefcase,
  Building2,
  CircleDollarSign,
  FileSpreadsheet,
  FileText,
  HandCoins,
  LayoutDashboard,
  Receipt,
  Settings,
  Shield,
  Target,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { navigationItems } from '@/lib/rbac';

const iconMap: Record<string, ComponentType<{ size?: number }>> = {
  '/dashboard': LayoutDashboard,
  '/leads': Target,
  '/clients': Building2,
  '/projects': Briefcase,
  '/services': Wrench,
  '/quotations': FileText,
  '/invoices': Receipt,
  '/commissions': HandCoins,
  '/blog': BookOpenText,
  '/settings': Settings,
  '/accounting': CircleDollarSign,
  '/admin': Shield,
};

export function Sidebar({ isOpen, close }: { isOpen: boolean; close: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const allowedItems = navigationItems.filter((item) => item.roles.includes(user.role));

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={close}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-[var(--border)] bg-[var(--sidebar)] text-[var(--sidebar-text)] transition-transform lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Business OS</p>
            <h1 className="font-heading text-lg font-semibold text-white">Digital Dhuriya</h1>
          </div>
          <button type="button" className="lg:hidden" onClick={close}>
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {allowedItems.map((item) => {
            const Icon = iconMap[item.href] || BarChart3;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-[var(--sidebar-active)] text-white'
                    : 'text-[var(--sidebar-text)] hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

