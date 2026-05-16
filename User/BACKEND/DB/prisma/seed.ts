import { PrismaClient } from '../generated/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.job.deleteMany();
    await prisma.user.deleteMany();

    console.log('Seeding initial User app accounts...');

    const defaultPasswordHash = await hash('12345678', 12);

    await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            email: 'workder.coo@gmail.com',
            role: 'admin',
            firstName: 'System',
            lastName: 'Admin',
            profileCompleted: true,
            passwordHash: defaultPasswordHash,
        }
    });

    await prisma.user.create({
        data: {
            email: 'user@workder.com',
            role: 'user',
            firstName: 'Demo',
            lastName: 'Worker',
            profileCompleted: true,
            passwordHash: defaultPasswordHash,
        },
    });

    await prisma.user.create({
        data: {
            email: 'employer@workder.com',
            role: 'employer',
            firstName: 'Demo',
            lastName: 'Employer',
            profileCompleted: true,
            passwordHash: defaultPasswordHash,
        },
    });

    console.log('Seeding complete! Credentials: workder.coo@gmail.com / 12345678, user@workder.com / 12345678, employer@workder.com / 12345678');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
