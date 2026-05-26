import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './applications.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';

@Controller('applications')
export class ApplicationsController {
    constructor(private readonly applicationsService: ApplicationsService) {}

    /**
     * Worker applies to a job.
     * workerId is taken from the JWT — the body value is ignored so a logged-in
     * user can never submit on behalf of another worker.
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    apply(@CurrentUserId() workerId: number, @Body() dto: CreateApplicationDto) {
        return this.applicationsService.apply(dto, workerId);
    }

    // Employer sees all applicants for their job
    @Get('job/:jobId')
    byJob(@Param('jobId', ParseIntPipe) jobId: number) {
        return this.applicationsService.getApplicationsByJob(jobId);
    }

    // Worker sees all their own applications
    @Get('worker/:workerId')
    byWorker(@Param('workerId', ParseIntPipe) workerId: number) {
        return this.applicationsService.getApplicationsByWorker(workerId);
    }

    // Single application by id (employer reviews before accepting)
    @Get(':id')
    byId(@Param('id', ParseIntPipe) id: number) {
        return this.applicationsService.getById(id);
    }

    // Employer accepts or rejects an application
    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateApplicationStatusDto,
    ) {
        return this.applicationsService.updateStatus(id, dto);
    }
}
