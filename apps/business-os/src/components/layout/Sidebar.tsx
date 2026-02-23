'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    Users,
    TrendingUp,
    Briefcase,
    DollarSign,
    UserCircle,
    Megaphone,
    Settings,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['*'] },
    { name: 'CRM', href: '/crm', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES', 'MARKETING'] },
    { name: 'Sales', href: '/sales', icon: TrendingUp, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES'] },
    { name: 'Projects', href: '/projects', icon: Briefcase, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES', 'FREELANCER'] },
    { name: 'Finance', href: '/finance', icon: DollarSign, roles: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTS'] },
    { name: 'HR', href: '/hr', icon: UserCircle, roles: ['SUPER_ADMIN', 'ADMIN', 'HR'] },
    { name: 'Marketing', href: '/marketing', icon: Megaphone, roles: ['SUPER_ADMIN', 'ADMIN', 'MARKETING'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['*'] },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    if (!user) return null;

    const filteredItems = sidebarItems.filter(item =>
        item.roles.includes('*') || item.roles.includes(user.role)
    );

    return (
        <div className="flex flex-col h-screen w-64 bg-slate-900 text-white border-r border-slate-800">
            <div className="flex items-center justify-center h-20 border-b border-slate-800">
                <h1 className="text-xl font-bold text-blue-400">Digital Dhuriya</h1>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-4 space-y-1">
                    {filteredItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                pathname === item.href
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
