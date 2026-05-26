import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { Job, Prisma } from '@workder/user-db';

@Injectable()
export class JobsService {
    constructor(private prisma: PrismaService) { }

    async job(
        jobWhereUniqueInput: Prisma.JobWhereUniqueInput,
    ): Promise<Job | null> {
        return this.prisma.job.findUnique({
            where: jobWhereUniqueInput,
            include: {
                postedBy: { select: { id: true, firstName: true, lastName: true, phone: true } },
                reviews: {
                    include: { author: { select: { id: true, firstName: true, lastName: true } } },
                    orderBy: { createdAt: 'desc' },
                },
                _count: { select: { applications: true } },
            },
        }) as any;
    }

    async jobs(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.JobWhereUniqueInput;
        where?: Prisma.JobWhereInput;
        orderBy?: Prisma.JobOrderByWithRelationInput;
    }): Promise<Job[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.job.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: {
                postedBy: { select: { id: true, firstName: true, lastName: true } },
                _count: { select: { applications: true } },
            },
        }) as any;
    }

    async createJob(data: Prisma.JobCreateInput): Promise<Job> {
        return this.prisma.job.create({
            data,
        });
    }

    async updateJob(params: {
        where: Prisma.JobWhereUniqueInput;
        data: Prisma.JobUpdateInput;
    }): Promise<Job> {
        const { where, data } = params;
        return this.prisma.job.update({
            data,
            where,
        });
    }

    async deleteJob(where: Prisma.JobWhereUniqueInput): Promise<Job> {
        // Block deletion if there is an active escrow (money is being held)
        const activeEscrow = await this.prisma.escrow.findFirst({
            where: {
                jobId: where.id as number,
                status: { in: ['HELD', 'PENDING_CONFIRMATION'] },
            },
        });
        if (activeEscrow) {
            throw new BadRequestException(
                'ไม่สามารถลบงานที่มีงานกำลังดำเนินการอยู่ได้ กรุณารอให้งานเสร็จสิ้นและยืนยันการจ่ายก่อน',
            );
        }
        return this.prisma.job.delete({ where });
    }
}
