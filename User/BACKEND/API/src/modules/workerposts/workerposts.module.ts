import { Module } from '@nestjs/common';
import { WorkerPostsController } from './workerposts.controller';
import { WorkerPostsService } from './workerposts.service';

@Module({
    controllers: [WorkerPostsController],
    providers: [WorkerPostsService],
})
export class WorkerPostsModule {}
