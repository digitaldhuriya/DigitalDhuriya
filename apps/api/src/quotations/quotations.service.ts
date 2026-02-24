import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, QuotationStatus } from '@digital-dhuriya/database';
import PDFDocument from 'pdfkit';
import { roundMoney, toNumber } from '../common/utils/number.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuotationDto, QuotationLineDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto, UpdateQuotationLineDto } from './dto/update-quotation.dto';

const quotationInclude = {
  client: true,
  lead: true,
  createdBy: {
    select: { id: true, name: true, email: true },
  },
  items: {
    include: { service: true },
  },
} satisfies Prisma.QuotationInclude;

@Injectable()
export class QuotationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateQuotationNumber() {
    const year = new Date().getFullYear();
    const prefix = `DD-Q-${year}-`;
    const count = await this.prisma.quotation.count({
      where: { quotationNumber: { startsWith: prefix } },
    });

    return `${prefix}${String(count + 1).padStart(4, '0')}`;
  }

  private async resolveItems(lines: QuotationLineDto[] | UpdateQuotationLineDto[]) {
    if (!lines.length) {
      throw new BadRequestException('At least one quotation item is required');
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
    lines: QuotationLineDto[] | UpdateQuotationLineDto[],
    gstEnabled?: boolean,
    taxPercentInput?: number,
  ) {
    const setting = await this.prisma.setting.findUnique({ where: { id: 1 } });
    const normalizedItems = await this.resolveItems(lines);
    const subtotal = roundMoney(
      normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    );

    const shouldApplyTax = gstEnabled ?? true;
    const taxPercent = shouldApplyTax
      ? toNumber(taxPercentInput, Number(setting?.taxPercent ?? 18))
      : 0;

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

  async create(dto: CreateQuotationDto, userId: string) {
    const number = await this.generateQuotationNumber();
    const totals = await this.calculateTotals(dto.items, dto.gstEnabled, dto.taxPercent);

    return this.prisma.$transaction(async (tx) => {
      const quotation = await tx.quotation.create({
        data: {
          quotationNumber: number,
          clientId: dto.clientId,
          leadId: dto.leadId,
          createdById: userId,
          validUntil: new Date(dto.validUntil),
          status: QuotationStatus.DRAFT,
          currency: dto.currency || totals.currency,
          gstEnabled: dto.gstEnabled ?? true,
          subtotal: totals.subtotal,
          taxPercent: totals.taxPercent,
          taxAmount: totals.taxAmount,
          total: totals.total,
          notes: dto.notes,
        },
      });

      await tx.quotationItem.createMany({
        data: totals.normalizedItems.map((item) => ({
          quotationId: quotation.id,
          serviceId: item.serviceId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
        })),
      });

      return tx.quotation.findUnique({
        where: { id: quotation.id },
        include: quotationInclude,
      });
    });
  }

  findAll(status?: QuotationStatus) {
    return this.prisma.quotation.findMany({
      where: status ? { status } : undefined,
      include: quotationInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id },
      include: quotationInclude,
    });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    return quotation;
  }

  async update(id: string, dto: UpdateQuotationDto) {
    const existing = await this.findOne(id);
    const itemsInput = dto.items ?? existing.items.map((item) => ({
      serviceId: item.serviceId || undefined,
      description: item.description,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
    }));

    const totals = await this.calculateTotals(
      itemsInput,
      dto.gstEnabled ?? existing.gstEnabled,
      dto.taxPercent ?? Number(existing.taxPercent),
    );

    return this.prisma.$transaction(async (tx) => {
      await tx.quotation.update({
        where: { id },
        data: {
          validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
          status: dto.status,
          currency: dto.currency,
          gstEnabled: dto.gstEnabled,
          taxPercent: totals.taxPercent,
          taxAmount: totals.taxAmount,
          subtotal: totals.subtotal,
          total: totals.total,
          notes: dto.notes,
        },
      });

      if (dto.items) {
        await tx.quotationItem.deleteMany({ where: { quotationId: id } });

        await tx.quotationItem.createMany({
          data: totals.normalizedItems.map((item) => ({
            quotationId: id,
            serviceId: item.serviceId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          })),
        });
      }

      return tx.quotation.findUnique({
        where: { id },
        include: quotationInclude,
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.quotation.delete({ where: { id } });
    return { message: 'Quotation deleted successfully' };
  }

  async generatePdf(id: string) {
    const quotation = await this.findOne(id);

    return new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({ margin: 40 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(20).text('Digital Dhuriya', { align: 'left' });
      doc.fontSize(12).text('Quotation', { align: 'left' });
      doc.moveDown();

      doc.fontSize(11).text(`Quotation #: ${quotation.quotationNumber}`);
      doc.text(`Issue Date: ${quotation.issueDate.toDateString()}`);
      doc.text(`Valid Until: ${quotation.validUntil.toDateString()}`);
      doc.moveDown();

      doc.fontSize(12).text(`Client: ${quotation.client.companyName}`);
      doc.text(`Contact: ${quotation.client.contactName}`);
      doc.text(`Email: ${quotation.client.email || 'N/A'}`);
      doc.moveDown();

      doc.fontSize(12).text('Items', { underline: true });
      doc.moveDown(0.5);

      quotation.items.forEach((item, index) => {
        doc
          .fontSize(10)
          .text(
            `${index + 1}. ${item.description} | Qty ${item.quantity} x ${Number(item.unitPrice).toFixed(2)} = ${Number(item.lineTotal).toFixed(2)}`,
          );
      });

      doc.moveDown();
      doc.fontSize(11).text(`Subtotal: ${Number(quotation.subtotal).toFixed(2)} ${quotation.currency}`);
      doc.text(`Tax (${Number(quotation.taxPercent).toFixed(2)}%): ${Number(quotation.taxAmount).toFixed(2)} ${quotation.currency}`);
      doc.fontSize(12).text(`Total: ${Number(quotation.total).toFixed(2)} ${quotation.currency}`);

      if (quotation.notes) {
        doc.moveDown();
        doc.fontSize(10).text(`Notes: ${quotation.notes}`);
      }

      doc.end();
    });
  }
}

