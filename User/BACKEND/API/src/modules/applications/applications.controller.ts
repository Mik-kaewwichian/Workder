import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './applications.dto';

@Controller('applications')
export class ApplicationsController {
    constructor(private readonly applicationsService: ApplicationsService) {}

    // Worker applies to a job
    @Post()
    apply(@Body() dto: CreateApplicationDto) {
        return this.applicationsService.apply(dto);
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

    // Employer accepts or rejects an application
    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateApplicationStatusDto,
    ) {
        return this.applicationsService.updateStatus(id, dto);
    }
}
