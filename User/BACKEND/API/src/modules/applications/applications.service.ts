import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './applications.dto';
import { EscrowService } from '../escrow/escrow.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ApplicationsService {
    constructor(
        private prisma: PrismaService,
        private readonly escrow: EscrowService,
        private readonly notifications: NotificationsService,
    ) {}

    /** Fire-and-forget — never let a notification failure surface to the caller. */
    private async notify(input: Parameters<NotificationsService['create']>[0]) {
        try { await this.notifications.create(input); } catch { /* swallow */ }
    }

    /**
     * @param dto    Validated request body (jobId, optional message)
     * @param workerId  Resolved from the JWT by the controller — never trusted from the body
     */
    async apply(dto: CreateApplicationDto, workerId: number) {
        // Worker must have completed their profile (name, ID card, etc.) before
        // they can apply. Unregistered accounts are blocked at the API level so
        // this cannot be bypassed from the frontend.
        const worker = await this.prisma.user.findUnique({
            where: { id: workerId },
            select: { profileCompleted: true },
        });
        if (!worker) throw new NotFoundException('Worker not found');
        if (!worker.profileCompleted) {
            throw new ForbiddenException('PROFILE_INCOMPLETE');
        }

        const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
        if (!job) throw new NotFoundException('Job not found');
        if (job.status !== 'open') throw new ConflictException('Job is no longer open');
        if (job.postedById === workerId) {
            throw new ForbiddenException('You cannot apply to your own job');
        }

        const existing = await this.prisma.application.findUnique({
            where: { jobId_workerId: { jobId: dto.jobId, workerId } },
        });
        if (existing) throw new ConflictException('Already applied to this job');

        const application = await this.prisma.application.create({
            data: {
                jobId: dto.jobId,
                workerId,
                message: dto.message,
            },
            include: {
                job: true,
                worker: { select: { id: true, firstName: true, lastName: true, email: true } },
            },
        });

        // Notify the employer that a new application landed
        if (job.postedById) {
            const workerName = [application.worker.firstName, application.worker.lastName]
                .filter(Boolean).join(' ') || 'ผู้สมัครใหม่';
            await this.notify({
                userId: job.postedById,
                type: 'application_received',
                title: 'มีผู้สมัครงานใหม่',
                body: `${workerName} สมัครงาน "${job.title}" ของคุณ`,
                link: `/employer/candidates?jobId=${job.id}`,
                refType: 'application',
                refId: application.id,
            });
        }

        return application;
    }

    async getById(id: number) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: {
                job: {
                    select: { id: true, title: true, postedById: true, status: true },
                },
                worker: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });
        if (!application) throw new NotFoundException('Application not found');
        return application;
    }

    async getApplicationsByJob(jobId: number) {
        return this.prisma.application.findMany({
            where: { jobId },
            include: {
                worker: {
                    select: { id: true, firstName: true, lastName: true, email: true, phone: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getApplicationsByWorker(workerId: number) {
        return this.prisma.application.findMany({
            where: { workerId },
            include: {
                job: {
                    include: {
                        postedBy: {
                            select: { id: true, firstName: true, lastName: true, email: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(id: number, dto: UpdateApplicationStatusDto) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: { job: true },
        });
        if (!application) throw new NotFoundException('Application not found');
        const job = application.job;

        // Accepting a worker funds escrow from the employer's wallet. The
        // hold and the status change are atomic — if the employer can't
        // cover it, INSUFFICIENT_FUNDS rolls back and the app stays pending.
        if (dto.status === 'accepted') {
            if (application.status === 'accepted') return application; // idempotent
            if (!job || job.postedById == null) {
                throw new BadRequestException('Job has no employer to fund escrow');
            }
            const employerId = job.postedById;
            await this.escrow.ensureWallets(employerId, application.workerId);
            const updated = await this.prisma.$transaction(async (tx) => {
                await this.escrow.holdWithinTx(tx, {
                    jobId: job.id,
                    applicationId: id,
                    employerId,
                    workerId: application.workerId,
                    payAmountThb: job.payAmount,
                });
                const u = await tx.application.update({
                    where: { id },
                    data: { status: 'accepted' },
                });
                await tx.job.update({
                    where: { id: job.id },
                    data: { status: 'in_progress' },
                });
                return u;
            });

            // Notify the worker — they got the job!
            await this.notify({
                userId: application.workerId,
                type: 'application_accepted',
                title: 'ยินดีด้วย! คุณได้รับงาน',
                body: `นายจ้างรับคุณเข้าทำงาน "${job.title}" แล้ว เริ่มงานได้เลย`,
                link: `/workboard/${job.id}`,
                refType: 'application',
                refId: id,
            });
            return updated;
        }

        // Reverting an acceptance refunds the still-held escrow.
        if (dto.status === 'rejected' && application.status === 'accepted') {
            await this.escrow.refundByApplication(id);
        }

        const updated = await this.prisma.application.update({
            where: { id },
            data: { status: dto.status },
        });

        if (dto.status === 'rejected' && job) {
            await this.notify({
                userId: application.workerId,
                type: 'application_rejected',
                title: 'ใบสมัครไม่ผ่านการพิจารณา',
                body: `นายจ้างไม่ได้เลือกคุณสำหรับงาน "${job.title}"`,
                link: `/my-applications`,
                refType: 'application',
                refId: id,
            });
        }

        return updated;
    }
}
