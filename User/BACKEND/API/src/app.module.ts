import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { AuthModule } from './modules/auth/auth.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { WorkerPostsModule } from './modules/workerposts/workerposts.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
    imports: [PrismaModule, UsersModule, JobsModule, AuthModule, ApplicationsModule, ReviewsModule, WorkerPostsModule, ChatModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
