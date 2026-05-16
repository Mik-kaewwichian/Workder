import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { WorkerPostsService } from './workerposts.service';
import { CreateWorkerPostDto, UpdateWorkerPostDto } from './workerposts.dto';

@Controller('worker-posts')
export class WorkerPostsController {
    constructor(private readonly service: WorkerPostsService) {}

    @Post()
    create(@Body() dto: CreateWorkerPostDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get('worker/:workerId')
    findByWorker(@Param('workerId', ParseIntPipe) workerId: number) {
        return this.service.findByWorker(workerId);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateWorkerPostDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
