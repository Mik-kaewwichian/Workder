import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Prisma } from '@workder/user-db';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @Post()
    create(@Body() createJobDto: Prisma.JobCreateInput) {
        return this.jobsService.createJob(createJobDto);
    }

    @Get()
    findAll(@Query('postedById') postedById?: string) {
        const where: Prisma.JobWhereInput = postedById
            ? { postedById: parseInt(postedById, 10) }
            : {};
        return this.jobsService.jobs({ where, orderBy: { createdAt: 'desc' } });
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.jobsService.job({ id });
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateJobDto: Prisma.JobUpdateInput) {
        return this.jobsService.updateJob({
            where: { id },
            data: updateJobDto,
        });
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.jobsService.deleteJob({ id });
    }
}
