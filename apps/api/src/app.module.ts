import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CrmModule } from './crm/crm.module';
import { SalesModule } from './sales/sales.module';
import { ProjectsModule } from './projects/projects.module';
import { FinanceModule } from './finance/finance.module';
import { HrModule } from './hr/hr.module';
import { MarketingModule } from './marketing/marketing.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CrmModule,
    SalesModule,
    ProjectsModule,
    FinanceModule,
    HrModule,
    MarketingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
