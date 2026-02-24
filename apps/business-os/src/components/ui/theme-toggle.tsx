'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeMode } from '@/context/theme-context';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeMode();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]"
    >
      {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
}

