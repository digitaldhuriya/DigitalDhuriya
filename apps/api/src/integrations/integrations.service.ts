import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendTestEmailDto } from './dto/send-test-email.dto';
import { SendWhatsappDto } from './dto/send-whatsapp.dto';
import axios from 'axios';
import nodemailer from 'nodemailer';

type MailPayload = {
  to: string;
  subject: string;
  html: string;
};

@Injectable()
export class IntegrationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getSettings() {
    return this.prisma.setting.findUnique({ where: { id: 1 } });
  }

  private async getTransporter() {
    const settings = await this.getSettings();

    const host = settings?.smtpHost || process.env.SMTP_HOST;
    const port = Number(settings?.smtpPort || process.env.SMTP_PORT || 0);
    const user = settings?.smtpUser || process.env.SMTP_USER;
    const pass = settings?.smtpPassEncrypted || process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendEmail(payload: MailPayload) {
    const transporter = await this.getTransporter();
    if (!transporter) {
      return { sent: false, message: 'SMTP not configured' };
    }

    const settings = await this.getSettings();
    const from = settings?.smtpFromEmail || process.env.SMTP_FROM || 'no-reply@digitaldhuriya.com';

    await transporter.sendMail({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });

    return { sent: true };
  }

  async sendLeadNotification(payload: {
    companyName: string;
    contactName: string;
    email?: string | null;
    phone?: string | null;
    source?: string | null;
  }) {
    const notifyTarget = process.env.LEAD_NOTIFICATION_EMAIL || (await this.getSettings())?.email;

    if (!notifyTarget) {
      return { sent: false, message: 'No lead notification recipient configured' };
    }

    return this.sendEmail({
      to: notifyTarget,
      subject: `New Lead: ${payload.companyName}`,
      html: `
        <h2>New Lead Received</h2>
        <p><strong>Company:</strong> ${payload.companyName}</p>
        <p><strong>Contact:</strong> ${payload.contactName}</p>
        <p><strong>Email:</strong> ${payload.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${payload.phone || 'N/A'}</p>
        <p><strong>Source:</strong> ${payload.source || 'N/A'}</p>
      `,
    });
  }

  async sendWhatsapp(dto: SendWhatsappDto) {
    const settings = await this.getSettings();
    const apiUrl = settings?.whatsappApiUrl || process.env.WHATSAPP_API_URL;
    const apiToken = settings?.whatsappApiToken || process.env.WHATSAPP_API_TOKEN;

    if (!apiUrl || !apiToken) {
      throw new InternalServerErrorException('WhatsApp integration is not configured');
    }

    const response = await axios.post(
      apiUrl,
      {
        to: dto.to,
        message: dto.message,
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      success: true,
      providerResponse: response.data,
    };
  }

  async sendTestEmail(dto: SendTestEmailDto) {
    return this.sendEmail({
      to: dto.to,
      subject: dto.subject,
      html: `<p>${dto.body || 'Digital Dhuriya SMTP test successful.'}</p>`,
    });
  }
}

