import { PrismaClient } from '../generated/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.job.deleteMany();
    await prisma.user.deleteMany();

    console.log('Seeding initial Admin user...');

    const adminPasswordHash = await hash('12345678', 12);

    await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            email: 'workder.coo@gmail.com',
            role: 'admin',
            managerCode: 'MGR-001',
            idCard: 'ID-001',
            phone: '0812345678',
            workStatus: 'working',
            roleRank: 1,
            firstName: 'นริสรา',
            lastName: 'ไกยสินธุ์',
            profileCompleted: true,
            passwordHash: adminPasswordHash,
        }
    });

    console.log('Seeding complete! Admin credentials: workder.coo@gmail.com / 12345678');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
