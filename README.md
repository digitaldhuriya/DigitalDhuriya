# Digital Dhuriya Business OS
Production-ready All-In-One Business Management Web Application for Digital Dhuriya (Kanpur, India), designed for B2B + service export operations with role-based access for 1-20 users and scalable growth.

## Tech Stack
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS + Recharts
- Backend: NestJS + TypeScript + JWT auth + RBAC
- Database: PostgreSQL + Prisma ORM

## Implemented Modules
- Dashboard (leads, active projects, monthly revenue, pending payments, team performance)
- Lead Management (CRUD, status pipeline, notes, CSV export)
- Client Management (contracts, GST, active services)
- Project Management (team assignment, tasks, deadlines, file upload)
- Service Management
- Quotation Generator (service lines, GST toggle, auto totals, PDF export)
- Invoice Generator (auto number, payment tracking, PDF export)
- Commission System (auto-calculated from received payments)
- Blog / Content Management (slug auto-generation, SEO fields, draft/publish)
- Settings Panel (company profile, logo upload, SMTP/tax/WhatsApp config)
- Accounting Overview (financial summary + monthly revenue)
- Admin Control Panel (user management + JSON backup export)

## Security Features
- Password hashing with bcrypt
- JWT authentication
- Role-based route protection
- CSRF token protection for mutating requests
- Global input validation (whitelisting + strict DTO validation)
- Security headers via helmet
- API rate limiting

## Monorepo Structure
```text
.
|- apps/
|  |- api/
|  |  |- src/
|  |  |  |- auth/
|  |  |  |- dashboard/
|  |  |  |- leads/
|  |  |  |- clients/
|  |  |  |- projects/
|  |  |  |- service-catalog/
|  |  |  |- quotations/
|  |  |  |- invoices/
|  |  |  |- commissions/
|  |  |  |- blog/
|  |  |  |- settings/
|  |  |  |- accounting/
|  |  |  |- admin/
|  |  |  |- integrations/
|  |  |  |- prisma/
|  |  |- .env.example
|  |- business-os/
|     |- src/app/
|     |  |- login/
|     |  |- dashboard/
|     |  |- leads/
|     |  |- clients/
|     |  |- projects/
|     |  |- services/
|     |  |- quotations/
|     |  |- invoices/
|     |  |- commissions/
|     |  |- blog/
|     |  |- settings/
|     |  |- accounting/
|     |  |- admin/
|     |- .env.example
|- packages/
|  |- database/
|     |- prisma/schema.prisma
|     |- prisma/seed.ts
|     |- .env.example
|- .env.example
|- DEPLOYMENT.md
```

## Database Schema (Required Tables)
Prisma models include all requested core tables with foreign-key relationships:
- User
- Lead
- Client
- Project
- Service
- Invoice
- Quotation
- Commission
- BlogPost
- Setting

Additional operational models:
- LeadNote, ClientService, ProjectMember, Task, ProjectFile, InvoiceItem, QuotationItem, CRMNote, BackupLog

## Local Setup
1. Install dependencies:
```bash
npm install
```

2. Create environment files:
- Copy `.env.example` to `.env` (or set per-app envs).
- Ensure `DATABASE_URL` points to PostgreSQL.

3. Generate Prisma client + sync schema:
```bash
npm run db:generate --workspace @digital-dhuriya/database
npm run db:push --workspace @digital-dhuriya/database
```

4. Seed sample data:
```bash
npm run db:seed --workspace @digital-dhuriya/database
```

5. Run backend:
```bash
npm run start:dev --workspace api
```

6. Run frontend:
```bash
npm run dev --workspace business-os
```

7. Open app:
- Frontend: `http://localhost:3000`
- API: `http://localhost:3001/api`

## Sample Admin Credentials
Seeded by `packages/database/prisma/seed.ts`:
- Email: `admin@digitaldhuriya.com`
- Password: `Admin@12345`

## Build Validation
Validated successfully:
- `npm run build --workspace api`
- `npm run build --workspace business-os`
- `npm run db:generate --workspace @digital-dhuriya/database`

## Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment steps (Node processes + Nginx reverse proxy + SSL + backups).
