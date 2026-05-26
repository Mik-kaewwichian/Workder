"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const escrow_service_1 = require("../escrow/escrow.service");
const notifications_service_1 = require("../notifications/notifications.service");
let ApplicationsService = class ApplicationsService {
    prisma;
    escrow;
    notifications;
    constructor(prisma, escrow, notifications) {
        this.prisma = prisma;
        this.escrow = escrow;
        this.notifications = notifications;
    }
    /** Fire-and-forget — never let a notification failure surface to the caller. */
    async notify(input) {
        try {
            await this.notifications.create(input);
        }
        catch { /* swallow */ }
    }
    /**
     * @param dto    Validated request body (jobId, optional message)
     * @param workerId  Resolved from the JWT by the controller — never trusted from the body
     */
    async apply(dto, workerId) {
        // Worker must have completed their profile (name, ID card, etc.) before
        // they can apply. Unregistered accounts are blocked at the API level so
        // this cannot be bypassed from the frontend.
        const worker = await this.prisma.user.findUnique({
            where: { id: workerId },
            select: { profileCompleted: true },
        });
        if (!worker)
            throw new common_1.NotFoundException('Worker not found');
        if (!worker.profileCompleted) {
            throw new common_1.ForbiddenException('PROFILE_INCOMPLETE');
        }
        const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        if (job.status !== 'open')
            throw new common_1.ConflictException('Job is no longer open');
        if (job.postedById === workerId) {
            throw new common_1.ForbiddenException('You cannot apply to your own job');
        }
        // Block if this worker already has an active job (escrow HELD / PENDING_CONFIRMATION / DISPUTED)
        const busyEscrow = await this.prisma.escrow.findFirst({
            where: {
                workerId,
                status: { in: ['HELD', 'PENDING_CONFIRMATION', 'DISPUTED'] },
            },
            select: { jobId: true },
        });
        if (busyEscrow)
            throw new common_1.ForbiddenException('WORKER_BUSY');
        const existing = await this.prisma.application.findUnique({
            where: { jobId_workerId: { jobId: dto.jobId, workerId } },
        });
        if (existing)
            throw new common_1.ConflictException('Already applied to this job');
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
    async getById(id) {
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
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        return application;
    }
    async getApplicationsByJob(jobId) {
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
    async getApplicationsByWorker(workerId) {
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
    async updateStatus(id, dto) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: { job: true },
        });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        const job = application.job;
        // Accepting a worker funds escrow from the employer's wallet. The
        // hold and the status change are atomic — if the employer can't
        // cover it, INSUFFICIENT_FUNDS rolls back and the app stays pending.
        if (dto.status === 'accepted') {
            if (application.status === 'accepted')
                return application; // idempotent
            if (!job || job.postedById == null) {
                throw new common_1.BadRequestException('Job has no employer to fund escrow');
            }
            const employerId = job.postedById;
            await this.escrow.ensureWallets(employerId, application.workerId);
            const updated = await this.prisma.$transaction(async (tx) => {
                // Prevent double-booking: worker must not be active on a different job
                const alreadyBusy = await tx.escrow.findFirst({
                    where: {
                        workerId: application.workerId,
                        status: { in: ['HELD', 'PENDING_CONFIRMATION', 'DISPUTED'] },
                        applicationId: { not: id },
                    },
                    select: { jobId: true },
                });
                if (alreadyBusy)
                    throw new common_1.ConflictException('WORKER_BUSY');
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
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        escrow_service_1.EscrowService,
        notifications_service_1.NotificationsService])
], ApplicationsService);
