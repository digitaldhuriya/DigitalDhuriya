import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadStatus, Prisma } from '@digital-dhuriya/database';
import { IntegrationsService } from '../integrations/integrations.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { CreateLeadNoteDto } from './dto/create-lead-note.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly integrationsService: IntegrationsService,
  ) {}

  async create(dto: CreateLeadDto, userId: string) {
    const lead = await this.prisma.lead.create({
      data: {
        companyName: dto.companyName,
        contactName: dto.contactName,
        email: dto.email,
        phone: dto.phone,
        country: dto.country,
        source: dto.source,
        status: dto.status ?? LeadStatus.NEW,
        estimatedValue: dto.estimatedValue,
        assignedToId: dto.assignedToId,
        notes: dto.notes,
      },
    });

    if (dto.notes) {
      await this.prisma.leadNote.create({
        data: {
          leadId: lead.id,
          createdById: userId,
          content: dto.notes,
        },
      });
    }

    await this.integrationsService
      .sendLeadNotification({
        companyName: lead.companyName,
        contactName: lead.contactName,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
      })
      .catch(() => null);

    return this.findOne(lead.id);
  }

  async findAll(filters: { status?: LeadStatus; search?: string }) {
    const where: Prisma.LeadWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { companyName: { contains: filters.search, mode: 'insensitive' } },
        { contactName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.lead.findMany({
      where,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
        leadNotes: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        commissions: {
          include: {
            salesPerson: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
        leadNotes: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        quotations: true,
        commissions: {
          include: {
            salesPerson: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async update(id: string, dto: UpdateLeadDto) {
    await this.findOne(id);

    await this.prisma.lead.update({
      where: { id },
      data: {
        companyName: dto.companyName,
        contactName: dto.contactName,
        email: dto.email,
        phone: dto.phone,
        country: dto.country,
        source: dto.source,
        status: dto.status,
        estimatedValue: dto.estimatedValue,
        assignedToId: dto.assignedToId,
        notes: dto.notes,
      },
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.lead.delete({ where: { id } });
    return { message: 'Lead deleted successfully' };
  }

  async addNote(id: string, dto: CreateLeadNoteDto, userId: string) {
    await this.findOne(id);

    return this.prisma.leadNote.create({
      data: {
        leadId: id,
        createdById: userId,
        content: dto.content,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async exportToCsv(filters: { status?: LeadStatus; search?: string }) {
    const leads = await this.findAll(filters);

    const headers = [
      'id',
      'companyName',
      'contactName',
      'email',
      'phone',
      'status',
      'source',
      'estimatedValue',
      'assignedTo',
      'createdAt',
    ];

    const rows = leads.map((lead) => [
      lead.id,
      lead.companyName,
      lead.contactName,
      lead.email || '',
      lead.phone || '',
      lead.status,
      lead.source || '',
      lead.estimatedValue?.toString() || '',
      lead.assignedTo?.name || '',
      lead.createdAt.toISOString(),
    ]);

    const escape = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => escape(String(cell))).join(','))
      .join('\n');

    return csv;
  }
}

