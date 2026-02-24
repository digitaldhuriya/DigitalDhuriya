import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureSettings() {
    const existing = await this.prisma.setting.findUnique({ where: { id: 1 } });

    if (existing) {
      return existing;
    }

    return this.prisma.setting.create({
      data: {
        id: 1,
        brandName: 'Digital Dhuriya',
        companyName: 'Digital Dhuriya',
        city: 'Kanpur',
        state: 'Uttar Pradesh',
        country: 'India',
        taxPercent: 18,
        currency: 'INR',
      },
    });
  }

  async getSettings() {
    return this.ensureSettings();
  }

  async updateSettings(dto: UpdateSettingsDto) {
    await this.ensureSettings();

    return this.prisma.setting.update({
      where: { id: 1 },
      data: {
        brandName: dto.brandName,
        companyName: dto.companyName,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        phone: dto.phone,
        email: dto.email,
        website: dto.website,
        gstNumber: dto.gstNumber,
        smtpHost: dto.smtpHost,
        smtpPort: dto.smtpPort,
        smtpUser: dto.smtpUser,
        smtpPassEncrypted: dto.smtpPassEncrypted,
        smtpFromEmail: dto.smtpFromEmail,
        taxPercent: dto.taxPercent,
        currency: dto.currency,
        whatsappApiUrl: dto.whatsappApiUrl,
        whatsappApiToken: dto.whatsappApiToken,
      },
    });
  }

  async updateLogo(logoUrl: string) {
    await this.ensureSettings();

    return this.prisma.setting.update({
      where: { id: 1 },
      data: { logoUrl },
    });
  }
}

