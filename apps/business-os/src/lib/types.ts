export type UserRole =
  | 'SUPER_ADMIN'
  | 'SALES_MANAGER'
  | 'DIGITAL_MARKETING_EXECUTIVE'
  | 'FREELANCER'
  | 'ACCOUNTANT';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  commissionPercent: number;
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email?: string;
  phone?: string;
  source?: string;
  status: 'NEW' | 'CONTACTED' | 'PROPOSAL_SENT' | 'WON' | 'LOST';
  estimatedValue?: string;
  assignedTo?: { id: string; name: string };
  leadNotes?: Array<{ id: string; content: string; createdAt: string }>;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  basePrice: string;
  taxPercent: string;
  isActive: boolean;
}

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email?: string;
  phone?: string;
  gstNumber?: string;
  contractStart?: string;
  contractEnd?: string;
  status: string;
  activeServices?: Array<{ id: string; service: ServiceItem }>;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  deadline?: string;
  client: { id: string; companyName: string };
  members: Array<{ id: string; user: { id: string; name: string; role: UserRole } }>;
  tasks: Array<{ id: string; title: string; status: string; dueDate?: string }>;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  client: { companyName: string };
  status: string;
  total: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: { companyName: string };
  status: string;
  total: string;
  amountReceived: string;
  balance: string;
  dueDate: string;
  createdAt: string;
}

export interface Commission {
  id: string;
  commissionPercent: string;
  commissionAmount: string;
  status: string;
  salesPerson: { id: string; name: string };
  invoice: { invoiceNumber: string };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
}

