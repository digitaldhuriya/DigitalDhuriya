import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountingModule } from './accounting/accounting.module';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ClientsModule } from './clients/clients.module';
import { CommissionsModule } from './commissions/commissions.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { InvoicesModule } from './invoices/invoices.module';
import { LeadsModule } from './leads/leads.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { QuotationsModule } from './quotations/quotations.module';
import { ServiceCatalogModule } from './service-catalog/service-catalog.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DashboardModule,
    LeadsModule,
    ClientsModule,
    ProjectsModule,
    ServiceCatalogModule,
    QuotationsModule,
    InvoicesModule,
    CommissionsModule,
    BlogModule,
    SettingsModule,
    AccountingModule,
    IntegrationsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

