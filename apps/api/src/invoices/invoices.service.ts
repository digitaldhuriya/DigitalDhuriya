import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CommissionStatus,
  InvoiceStatus,
  PaymentStatus,
  Prisma,
} from '@digital-dhuriya/database';
import PDFDocument from 'pdfkit';
import { roundMoney, toNumber } from '../common/utils/number.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, InvoiceLineDto } from './dto/create-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { UpdateInvoiceDto, UpdateInvoiceLineDto } from './dto/update-invoice.dto';

const invoiceInclude = {
  client: true,
  project: {
    select: { id: true, name: true, status: true },
  },
  quotation: {
    include: {
      lead: {
        select: { id: true, assignedToId: true },
      },
    },
  },
  createdBy: {
    select: { id: true, name: true, email: true },
  },
  items: {
    include: { service: true },
  },
  commissions: {
    include: {
      salesPerson: {
        select: { id: true, name: true, email: true },
      },
    },
  },
} satisfies Prisma.InvoiceInclude;

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const prefix = `DD-INV-${year}-`;
    const count = await this.prisma.invoice.count({
      where: { invoiceNumber: { startsWith: prefix } },
    });

    return `${prefix}${String(count + 1).padStart(4, '0')}`;
  }

  private async resolveItems(lines: InvoiceLineDto[] | UpdateInvoiceLineDto[]) {
    if (!lines.length) {
      throw new BadRequestException('At least one invoice item is required');
    }

    const items = [] as Array<{
      serviceId?: string;
      description: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }>;

    for (const line of lines) {
      const quantity = line.quantity ?? 1;
      let unitPrice = toNumber(line.unitPrice, 0);
      let description = line.description?.trim() || '';

      if (line.serviceId) {
        const service = await this.prisma.service.findUnique({ where: { id: line.serviceId } });
        if (!service) {
          throw new BadRequestException(`Service not found: ${line.serviceId}`);
        }

        if (!description) {
          description = service.name;
        }

        if (line.unitPrice === undefined || line.unitPrice === null) {
          unitPrice = Number(service.basePrice);
        }
      }

      if (!description) {
        throw new BadRequestException('Item description is required when service is not selected');
      }

      items.push({
        serviceId: line.serviceId,
        description,
        quantity,
        unitPrice,
        lineTotal: roundMoney(quantity * unitPrice),
      });
    }

    return items;
  }

  private async calculateTotals(
    lines: InvoiceLineDto[] | UpdateInvoiceLineDto[],
    taxPercentInput?: number,
  ) {
    const setting = await this.prisma.setting.findUnique({ where: { id: 1 } });
    const normalizedItems = await this.resolveItems(lines);
    const subtotal = roundMoney(
      normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    );

    const taxPercent = toNumber(taxPercentInput, Number(setting?.taxPercent ?? 18));
    const taxAmount = roundMoney((subtotal * taxPercent) / 100);
    const total = roundMoney(subtotal + taxAmount);

    return {
      normalizedItems,
      subtotal,
      taxPercent,
      taxAmount,
      total,
      currency: setting?.currency || 'INR',
    };
  }

  private async getLinesFromQuotation(quotationId: string): Promise<InvoiceLineDto[]> {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { items: true },
    });

    if (!quotation) {
      throw new BadRequestException('Quotation not found');
    }

    if (!quotation.items.length) {
      throw new BadRequestException('Quotation has no items');
    }

    return quotation.items.map((item) => ({
      serviceId: item.serviceId || undefined,
      description: item.description,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
    }));
  }

  async create(dto: CreateInvoiceDto, userId: string) {
    const invoiceNumber = await this.generateInvoiceNumber();
    const lines = dto.items?.length
      ? dto.items
      : dto.quotationId
        ? await this.getLinesFromQuotation(dto.quotationId)
        : [];

    const totals = await this.calculateTotals(lines, dto.taxPercent);

    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          clientId: dto.clientId,
          projectId: dto.projectId,
          quotationId: dto.quotationId,
          createdById: userId,
          dueDate: new Date(dto.dueDate),
          status: dto.status ?? InvoiceStatus.SENT,
          paymentStatus: PaymentStatus.PENDING,
          currency: dto.currency || totals.currency,
          subtotal: totals.subtotal,
          taxPercent: totals.taxPercent,
          taxAmount: totals.taxAmount,
          total: totals.total,
          amountReceived: 0,
          balance: totals.total,
          notes: dto.notes,
        },
      });

      await tx.invoiceItem.createMany({
        data: totals.normalizedItems.map((item) => ({
          invoiceId: invoice.id,
          serviceId: item.serviceId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
        })),
      });

      return tx.invoice.findUnique({
        where: { id: invoice.id },
        include: invoiceInclude,
      });
    });
  }

  findAll(status?: InvoiceStatus) {
    return this.prisma.invoice.findMany({
      where: status ? { status } : undefined,
      include: invoiceInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: invoiceInclude,
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async update(id: string, dto: UpdateInvoiceDto) {
    const existing = await this.findOne(id);

    if (existing.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('Cancelled invoices cannot be modified');
    }

    const lines = dto.items?.length
      ? dto.items
      : existing.items.map((item) => ({
          serviceId: item.serviceId || undefined,
          description: item.description,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
        }));

    const totals = await this.calculateTotals(lines, dto.taxPercent ?? Number(existing.taxPercent));

    return this.prisma.$transaction(async (tx) => {
      await tx.invoice.update({
        where: { id },
        data: {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
          status: dto.status,
          currency: dto.currency,
          taxPercent: totals.taxPercent,
          taxAmount: totals.taxAmount,
          subtotal: totals.subtotal,
          total: totals.total,
          balance: roundMoney(totals.total - Number(existing.amountReceived)),
          notes: dto.notes,
        },
      });

      if (dto.items) {
        await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
        await tx.invoiceItem.createMany({
          data: totals.normalizedItems.map((item) => ({
            invoiceId: id,
            serviceId: item.serviceId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          })),
        });
      }

      return tx.invoice.findUnique({
        where: { id },
        include: invoiceInclude,
      });
    });
  }

  private async updateCommissionOnPayment(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: {
          select: {
            leadId: true,
          },
        },
        quotation: {
          include: {
            lead: {
              select: { assignedToId: true },
            },
          },
        },
      },
    });

    if (!invoice) {
      return;
    }

    let salesPersonId = invoice.quotation?.lead?.assignedToId || null;

    if (!salesPersonId && invoice.client.leadId) {
      const lead = await this.prisma.lead.findUnique({
        where: { id: invoice.client.leadId },
        select: { assignedToId: true },
      });
      salesPersonId = lead?.assignedToId || null;
    }

    if (!salesPersonId) {
      return;
    }

    const salesPerson = await this.prisma.user.findUnique({
      where: { id: salesPersonId },
      select: { commissionPercent: true },
    });

    const commissionPercent = Number(salesPerson?.commissionPercent ?? 0);
    const baseAmount = Number(invoice.amountReceived);
    const commissionAmount = roundMoney((baseAmount * commissionPercent) / 100);

    await this.prisma.commission.upsert({
      where: {
        invoiceId_salesPersonId: {
          invoiceId,
          salesPersonId,
        },
      },
      update: {
        leadId: invoice.quotation?.leadId || invoice.client.leadId,
        commissionPercent,
        baseAmount,
        commissionAmount,
        status: commissionAmount > 0 ? CommissionStatus.EARNED : CommissionStatus.PENDING,
      },
      create: {
        invoiceId,
        salesPersonId,
        leadId: invoice.quotation?.leadId || invoice.client.leadId,
        commissionPercent,
        baseAmount,
        commissionAmount,
        status: commissionAmount > 0 ? CommissionStatus.EARNED : CommissionStatus.PENDING,
      },
    });
  }

  async recordPayment(id: string, dto: RecordPaymentDto) {
    const invoice = await this.findOne(id);

    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('Cannot record payment against a cancelled invoice');
    }

    const total = Number(invoice.total);
    const currentReceived = Number(invoice.amountReceived);
    const newReceived = roundMoney(Math.min(total, currentReceived + dto.amount));
    const balance = roundMoney(total - newReceived);

    const paymentStatus =
      newReceived >= total
        ? PaymentStatus.PAID
        : newReceived > 0
          ? PaymentStatus.PARTIAL
          : PaymentStatus.PENDING;

    const status =
      newReceived >= total
        ? InvoiceStatus.PAID
        : newReceived > 0
          ? InvoiceStatus.PARTIALLY_PAID
          : InvoiceStatus.SENT;

    await this.prisma.invoice.update({
      where: { id },
      data: {
        amountReceived: newReceived,
        balance,
        paymentStatus,
        status,
        lastPaymentDate: dto.paymentDate ? new Date(dto.paymentDate) : new Date(),
      },
    });

    await this.updateCommissionOnPayment(id);

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.invoice.delete({ where: { id } });
    return { message: 'Invoice deleted successfully' };
  }

  async generatePdf(id: string) {
    const invoice = await this.findOne(id);

    return new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({ margin: 40 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(20).text('Digital Dhuriya', { align: 'left' });
      doc.fontSize(12).text('Tax Invoice', { align: 'left' });
      doc.moveDown();

      doc.fontSize(11).text(`Invoice #: ${invoice.invoiceNumber}`);
      doc.text(`Issue Date: ${invoice.issueDate.toDateString()}`);
      doc.text(`Due Date: ${invoice.dueDate.toDateString()}`);
      doc.text(`Status: ${invoice.status}`);
      doc.moveDown();

      doc.fontSize(12).text(`Client: ${invoice.client.companyName}`);
      doc.text(`Contact: ${invoice.client.contactName}`);
      doc.text(`Email: ${invoice.client.email || 'N/A'}`);
      doc.moveDown();

      doc.fontSize(12).text('Items', { underline: true });
      doc.moveDown(0.5);

      invoice.items.forEach((item, index) => {
        doc
          .fontSize(10)
          .text(
            `${index + 1}. ${item.description} | Qty ${item.quantity} x ${Number(item.unitPrice).toFixed(2)} = ${Number(item.lineTotal).toFixed(2)}`,
          );
      });

      doc.moveDown();
      doc.fontSize(11).text(`Subtotal: ${Number(invoice.subtotal).toFixed(2)} ${invoice.currency}`);
      doc.text(`Tax (${Number(invoice.taxPercent).toFixed(2)}%): ${Number(invoice.taxAmount).toFixed(2)} ${invoice.currency}`);
      doc.fontSize(12).text(`Total: ${Number(invoice.total).toFixed(2)} ${invoice.currency}`);
      doc.text(`Received: ${Number(invoice.amountReceived).toFixed(2)} ${invoice.currency}`);
      doc.text(`Balance: ${Number(invoice.balance).toFixed(2)} ${invoice.currency}`);

      if (invoice.notes) {
        doc.moveDown();
        doc.fontSize(10).text(`Notes: ${invoice.notes}`);
      }

      doc.end();
    });
  }
}

