import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from '@digital-dhuriya/database';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SendTestEmailDto } from './dto/send-test-email.dto';
import { SendWhatsappDto } from './dto/send-whatsapp.dto';
import { IntegrationsService } from './integrations.service';

@Controller('integrations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post('whatsapp/manual-trigger')
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER, Role.DIGITAL_MARKETING_EXECUTIVE)
  sendWhatsapp(@Body() dto: SendWhatsappDto) {
    return this.integrationsService.sendWhatsapp(dto);
  }

  @Post('email/test')
  @Roles(Role.SUPER_ADMIN)
  sendTestEmail(@Body() dto: SendTestEmailDto) {
    return this.integrationsService.sendTestEmail(dto);
  }
}

