import { PrismaClient, Role, LeadStatus, ClientStatus, ProjectStatus, ProjectPriority, QuotationStatus, InvoiceStatus, PaymentStatus, CommissionStatus, BlogStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

async function main() {
  const passwordHash = await bcrypt.hash('Admin@12345', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@digitaldhuriya.com' },
    update: {
      name: 'Digital Dhuriya Owner',
      passwordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      name: 'Digital Dhuriya Owner',
      email: 'admin@digitaldhuriya.com',
      passwordHash,
      role: Role.SUPER_ADMIN,
      commissionPercent: 0,
    },
  });

  const salesManager = await prisma.user.upsert({
    where: { email: 'sales@digitaldhuriya.com' },
    update: {
      name: 'Sales Manager',
      passwordHash,
      role: Role.SALES_MANAGER,
      commissionPercent: 8,
      isActive: true,
    },
    create: {
      name: 'Sales Manager',
      email: 'sales@digitaldhuriya.com',
      passwordHash,
      role: Role.SALES_MANAGER,
      commissionPercent: 8,
    },
  });

  const marketingExecutive = await prisma.user.upsert({
    where: { email: 'marketing@digitaldhuriya.com' },
    update: {
      name: 'Marketing Executive',
      passwordHash,
      role: Role.DIGITAL_MARKETING_EXECUTIVE,
      isActive: true,
    },
    create: {
      name: 'Marketing Executive',
      email: 'marketing@digitaldhuriya.com',
      passwordHash,
      role: Role.DIGITAL_MARKETING_EXECUTIVE,
    },
  });

  const freelancer = await prisma.user.upsert({
    where: { email: 'freelancer@digitaldhuriya.com' },
    update: {
      name: 'Freelancer One',
      passwordHash,
      role: Role.FREELANCER,
      isActive: true,
    },
    create: {
      name: 'Freelancer One',
      email: 'freelancer@digitaldhuriya.com',
      passwordHash,
      role: Role.FREELANCER,
    },
  });

  await prisma.user.upsert({
    where: { email: 'accounts@digitaldhuriya.com' },
    update: {
      name: 'Accountant',
      passwordHash,
      role: Role.ACCOUNTANT,
      isActive: true,
    },
    create: {
      name: 'Accountant',
      email: 'accounts@digitaldhuriya.com',
      passwordHash,
      role: Role.ACCOUNTANT,
    },
  });

  await prisma.setting.upsert({
    where: { id: 1 },
    update: {
      brandName: 'Digital Dhuriya',
      companyName: 'Digital Dhuriya',
      city: 'Kanpur',
      state: 'Uttar Pradesh',
      country: 'India',
      taxPercent: 18,
      currency: 'INR',
      email: 'hello@digitaldhuriya.com',
      phone: '+91-90000-00000',
    },
    create: {
      id: 1,
      brandName: 'Digital Dhuriya',
      companyName: 'Digital Dhuriya',
      city: 'Kanpur',
      state: 'Uttar Pradesh',
      country: 'India',
      taxPercent: 18,
      currency: 'INR',
      email: 'hello@digitaldhuriya.com',
      phone: '+91-90000-00000',
    },
  });

  const seoService = await prisma.service.upsert({
    where: { name: 'SEO Growth Package' },
    update: {
      basePrice: 25000,
      taxPercent: 18,
      isActive: true,
    },
    create: {
      name: 'SEO Growth Package',
      description: 'Technical SEO + on-page + monthly reporting',
      basePrice: 25000,
      taxPercent: 18,
      isActive: true,
    },
  });

  const adsService = await prisma.service.upsert({
    where: { name: 'Performance Marketing' },
    update: {
      basePrice: 35000,
      taxPercent: 18,
      isActive: true,
    },
    create: {
      name: 'Performance Marketing',
      description: 'Paid media campaign setup and management',
      basePrice: 35000,
      taxPercent: 18,
      isActive: true,
    },
  });

  const webService = await prisma.service.upsert({
    where: { name: 'Website Revamp' },
    update: {
      basePrice: 80000,
      taxPercent: 18,
      isActive: true,
    },
    create: {
      name: 'Website Revamp',
      description: 'Design, development and optimization',
      basePrice: 80000,
      taxPercent: 18,
      isActive: true,
    },
  });

  const lead = await prisma.lead.upsert({
    where: { id: 'seed-lead-digital-transform' },
    update: {
      companyName: 'Global Tech Solutions',
      contactName: 'Ravi Sharma',
      email: 'ravi@globaltech.com',
      phone: '+91-98765-43210',
      source: 'LinkedIn',
      country: 'India',
      status: LeadStatus.WON,
      estimatedValue: 120000,
      assignedToId: salesManager.id,
      notes: 'High intent lead interested in SEO + paid campaigns.',
    },
    create: {
      id: 'seed-lead-digital-transform',
      companyName: 'Global Tech Solutions',
      contactName: 'Ravi Sharma',
      email: 'ravi@globaltech.com',
      phone: '+91-98765-43210',
      source: 'LinkedIn',
      country: 'India',
      status: LeadStatus.WON,
      estimatedValue: 120000,
      assignedToId: salesManager.id,
      notes: 'High intent lead interested in SEO + paid campaigns.',
    },
  });

  await prisma.leadNote.upsert({
    where: { id: 'seed-note-lead-01' },
    update: {
      leadId: lead.id,
      createdById: salesManager.id,
      content: 'Initial discovery call completed. Budget approved.',
    },
    create: {
      id: 'seed-note-lead-01',
      leadId: lead.id,
      createdById: salesManager.id,
      content: 'Initial discovery call completed. Budget approved.',
    },
  });

  const client = await prisma.client.upsert({
    where: { leadId: lead.id },
    update: {
      companyName: 'Global Tech Solutions',
      contactName: 'Ravi Sharma',
      email: 'ravi@globaltech.com',
      phone: '+91-98765-43210',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      gstNumber: '29ABCDE1234F1Z5',
      contractStart: new Date(),
      contractEnd: addDays(new Date(), 180),
      status: ClientStatus.ACTIVE,
    },
    create: {
      companyName: 'Global Tech Solutions',
      contactName: 'Ravi Sharma',
      email: 'ravi@globaltech.com',
      phone: '+91-98765-43210',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      gstNumber: '29ABCDE1234F1Z5',
      contractStart: new Date(),
      contractEnd: addDays(new Date(), 180),
      status: ClientStatus.ACTIVE,
      leadId: lead.id,
    },
  });

  await prisma.clientService.upsert({
    where: {
      clientId_serviceId_isActive: {
        clientId: client.id,
        serviceId: seoService.id,
        isActive: true,
      },
    },
    update: {
      agreedPrice: 25000,
      billingCycle: 'Monthly',
    },
    create: {
      clientId: client.id,
      serviceId: seoService.id,
      agreedPrice: 25000,
      billingCycle: 'Monthly',
      isActive: true,
    },
  });

  const project = await prisma.project.upsert({
    where: { id: 'seed-project-growth-2026' },
    update: {
      name: 'Global Tech Growth Sprint',
      description: 'SEO + paid media pipeline for export lead generation.',
      clientId: client.id,
      status: ProjectStatus.IN_PROGRESS,
      priority: ProjectPriority.HIGH,
      startDate: new Date(),
      deadline: addDays(new Date(), 90),
    },
    create: {
      id: 'seed-project-growth-2026',
      name: 'Global Tech Growth Sprint',
      description: 'SEO + paid media pipeline for export lead generation.',
      clientId: client.id,
      status: ProjectStatus.IN_PROGRESS,
      priority: ProjectPriority.HIGH,
      startDate: new Date(),
      deadline: addDays(new Date(), 90),
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: project.id,
        userId: marketingExecutive.id,
      },
    },
    update: {
      designation: 'Campaign Manager',
    },
    create: {
      projectId: project.id,
      userId: marketingExecutive.id,
      designation: 'Campaign Manager',
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: project.id,
        userId: freelancer.id,
      },
    },
    update: {
      designation: 'SEO Specialist',
    },
    create: {
      projectId: project.id,
      userId: freelancer.id,
      designation: 'SEO Specialist',
    },
  });

  await prisma.task.upsert({
    where: { id: 'seed-task-technical-seo' },
    update: {
      projectId: project.id,
      title: 'Run technical SEO audit',
      description: 'Crawl site and resolve indexing/performance issues.',
      dueDate: addDays(new Date(), 10),
      assignedToId: freelancer.id,
      createdById: superAdmin.id,
    },
    create: {
      id: 'seed-task-technical-seo',
      projectId: project.id,
      title: 'Run technical SEO audit',
      description: 'Crawl site and resolve indexing/performance issues.',
      dueDate: addDays(new Date(), 10),
      assignedToId: freelancer.id,
      createdById: superAdmin.id,
    },
  });

  const subtotal = 60000;
  const taxPercent = 18;
  const taxAmount = subtotal * (taxPercent / 100);
  const total = subtotal + taxAmount;

  const quotation = await prisma.quotation.upsert({
    where: { quotationNumber: 'DD-Q-2026-0001' },
    update: {
      clientId: client.id,
      leadId: lead.id,
      createdById: superAdmin.id,
      issueDate: new Date(),
      validUntil: addDays(new Date(), 15),
      status: QuotationStatus.ACCEPTED,
      currency: 'INR',
      gstEnabled: true,
      subtotal,
      taxPercent,
      taxAmount,
      total,
      notes: '50% advance required before sprint kickoff.',
    },
    create: {
      quotationNumber: 'DD-Q-2026-0001',
      clientId: client.id,
      leadId: lead.id,
      createdById: superAdmin.id,
      issueDate: new Date(),
      validUntil: addDays(new Date(), 15),
      status: QuotationStatus.ACCEPTED,
      currency: 'INR',
      gstEnabled: true,
      subtotal,
      taxPercent,
      taxAmount,
      total,
      notes: '50% advance required before sprint kickoff.',
    },
  });

  await prisma.quotationItem.deleteMany({ where: { quotationId: quotation.id } });
  await prisma.quotationItem.createMany({
    data: [
      {
        quotationId: quotation.id,
        serviceId: seoService.id,
        description: 'SEO Growth Package',
        quantity: 1,
        unitPrice: 25000,
        lineTotal: 25000,
      },
      {
        quotationId: quotation.id,
        serviceId: adsService.id,
        description: 'Performance Marketing',
        quantity: 1,
        unitPrice: 35000,
        lineTotal: 35000,
      },
    ],
  });

  const invoice = await prisma.invoice.upsert({
    where: { invoiceNumber: 'DD-INV-2026-0001' },
    update: {
      clientId: client.id,
      projectId: project.id,
      quotationId: quotation.id,
      createdById: superAdmin.id,
      issueDate: new Date(),
      dueDate: addDays(new Date(), 7),
      status: InvoiceStatus.PARTIALLY_PAID,
      paymentStatus: PaymentStatus.PARTIAL,
      currency: 'INR',
      subtotal,
      taxPercent,
      taxAmount,
      total,
      amountReceived: 30000,
      balance: total - 30000,
      lastPaymentDate: new Date(),
      notes: 'Advance payment received via bank transfer.',
    },
    create: {
      invoiceNumber: 'DD-INV-2026-0001',
      clientId: client.id,
      projectId: project.id,
      quotationId: quotation.id,
      createdById: superAdmin.id,
      issueDate: new Date(),
      dueDate: addDays(new Date(), 7),
      status: InvoiceStatus.PARTIALLY_PAID,
      paymentStatus: PaymentStatus.PARTIAL,
      currency: 'INR',
      subtotal,
      taxPercent,
      taxAmount,
      total,
      amountReceived: 30000,
      balance: total - 30000,
      lastPaymentDate: new Date(),
      notes: 'Advance payment received via bank transfer.',
    },
  });

  await prisma.invoiceItem.deleteMany({ where: { invoiceId: invoice.id } });
  await prisma.invoiceItem.createMany({
    data: [
      {
        invoiceId: invoice.id,
        serviceId: seoService.id,
        description: 'SEO Growth Package',
        quantity: 1,
        unitPrice: 25000,
        lineTotal: 25000,
      },
      {
        invoiceId: invoice.id,
        serviceId: adsService.id,
        description: 'Performance Marketing',
        quantity: 1,
        unitPrice: 35000,
        lineTotal: 35000,
      },
    ],
  });

  const commissionAmount = 30000 * 0.08;

  await prisma.commission.upsert({
    where: {
      invoiceId_salesPersonId: {
        invoiceId: invoice.id,
        salesPersonId: salesManager.id,
      },
    },
    update: {
      leadId: lead.id,
      commissionPercent: 8,
      baseAmount: 30000,
      commissionAmount,
      status: CommissionStatus.EARNED,
      earnedAt: new Date(),
    },
    create: {
      invoiceId: invoice.id,
      salesPersonId: salesManager.id,
      leadId: lead.id,
      commissionPercent: 8,
      baseAmount: 30000,
      commissionAmount,
      status: CommissionStatus.EARNED,
      earnedAt: new Date(),
    },
  });

  await prisma.crmNote.upsert({
    where: { id: 'seed-crm-note-01' },
    update: {
      noteType: 'CLIENT',
      clientId: client.id,
      createdById: superAdmin.id,
      content: 'Client requested weekly reporting every Friday.',
    },
    create: {
      id: 'seed-crm-note-01',
      noteType: 'CLIENT',
      clientId: client.id,
      createdById: superAdmin.id,
      content: 'Client requested weekly reporting every Friday.',
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'how-kanpur-businesses-scale-global-leads' },
    update: {
      title: 'How Kanpur Businesses Can Scale Global Leads',
      content: 'Use SEO + performance campaigns + conversion-first websites to scale export services.',
      metaTitle: 'Kanpur Global Lead Generation Guide',
      metaDescription: 'Actionable framework for service exporters from Kanpur.',
      status: BlogStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: superAdmin.id,
    },
    create: {
      title: 'How Kanpur Businesses Can Scale Global Leads',
      slug: 'how-kanpur-businesses-scale-global-leads',
      content: 'Use SEO + performance campaigns + conversion-first websites to scale export services.',
      metaTitle: 'Kanpur Global Lead Generation Guide',
      metaDescription: 'Actionable framework for service exporters from Kanpur.',
      status: BlogStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: superAdmin.id,
    },
  });

  console.log('Seed complete');
  console.log('Admin Login: admin@digitaldhuriya.com / Admin@12345');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

