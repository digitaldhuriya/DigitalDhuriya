import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create Super Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@digitaldhuriya.com' },
        update: {},
        create: {
            email: 'admin@digitaldhuriya.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        },
    });

    console.log('Seed: Created Super Admin', admin.email);

    // Create Sales Executive
    const sales = await prisma.user.upsert({
        where: { email: 'sales@digitaldhuriya.com' },
        update: {},
        create: {
            email: 'sales@digitaldhuriya.com',
            name: 'Sales Executive',
            password: hashedPassword,
            role: 'SALES',
        },
    });

    console.log('Seed: Created Sales Executive', sales.email);

    // Create Sample Client
    const client = await prisma.client.create({
        data: {
            name: 'Global Tech Solutions',
            email: 'contact@globaltech.com',
            status: 'ACTIVE',
            notes: 'Key client for digital transformation.',
        },
    });

    console.log('Seed: Created Client', client.name);

    // Create Sample Lead
    const lead = await prisma.lead.create({
        data: {
            name: 'Future Innovations Ltd',
            email: 'hello@futureinno.com',
            status: 'NEW',
            pipelineStage: 'NEW',
            salesExecutiveId: sales.id,
        },
    });

    console.log('Seed: Created Lead', lead.name);

    // Create Sample Project
    const project = await prisma.project.create({
        data: {
            name: 'Website Redign',
            description: 'Full redesign of corporate website.',
            clientId: client.id,
            status: 'IN_PROGRESS',
        },
    });

    console.log('Seed: Created Project', project.name);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
