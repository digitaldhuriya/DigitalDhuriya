import { UserRole } from './types';

export type NavItem = {
  label: string;
  href: string;
  roles: UserRole[];
};

export const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    roles: [
      'SUPER_ADMIN',
      'SALES_MANAGER',
      'DIGITAL_MARKETING_EXECUTIVE',
      'FREELANCER',
      'ACCOUNTANT',
    ],
  },
  {
    label: 'Leads',
    href: '/leads',
    roles: ['SUPER_ADMIN', 'SALES_MANAGER', 'DIGITAL_MARKETING_EXECUTIVE', 'ACCOUNTANT'],
  },
  {
    label: 'Clients',
    href: '/clients',
    roles: ['SUPER_ADMIN', 'SALES_MANAGER', 'DIGITAL_MARKETING_EXECUTIVE', 'ACCOUNTANT'],
  },
  {
    label: 'Projects',
    href: '/projects',
    roles: [
      'SUPER_ADMIN',
      'SALES_MANAGER',
      'DIGITAL_MARKETING_EXECUTIVE',
      'FREELANCER',
      'ACCOUNTANT',
    ],
  },
  {
    label: 'Services',
    href: '/services',
    roles: [
      'SUPER_ADMIN',
      'SALES_MANAGER',
      'DIGITAL_MARKETING_EXECUTIVE',
      'FREELANCER',
      'ACCOUNTANT',
    ],
  },
  {
    label: 'Quotations',
    href: '/quotations',
    roles: ['SUPER_ADMIN', 'SALES_MANAGER', 'DIGITAL_MARKETING_EXECUTIVE', 'ACCOUNTANT'],
  },
  {
    label: 'Invoices',
    href: '/invoices',
    roles: ['SUPER_ADMIN', 'SALES_MANAGER', 'DIGITAL_MARKETING_EXECUTIVE', 'ACCOUNTANT'],
  },
  {
    label: 'Commissions',
    href: '/commissions',
    roles: ['SUPER_ADMIN', 'SALES_MANAGER', 'ACCOUNTANT'],
  },
  {
    label: 'Blog',
    href: '/blog',
    roles: [
      'SUPER_ADMIN',
      'SALES_MANAGER',
      'DIGITAL_MARKETING_EXECUTIVE',
      'FREELANCER',
      'ACCOUNTANT',
    ],
  },
  {
    label: 'Settings',
    href: '/settings',
    roles: ['SUPER_ADMIN', 'ACCOUNTANT'],
  },
  {
    label: 'Accounting',
    href: '/accounting',
    roles: ['SUPER_ADMIN', 'ACCOUNTANT'],
  },
  {
    label: 'Admin',
    href: '/admin',
    roles: ['SUPER_ADMIN', 'ACCOUNTANT'],
  },
];

export function canAccessRoute(role: UserRole, href: string) {
  const navItem = navigationItems.find((item) => item.href === href);
  if (!navItem) {
    return false;
  }

  return navItem.roles.includes(role);
}

