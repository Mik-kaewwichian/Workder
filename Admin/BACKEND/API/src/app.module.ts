import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [PrismaModule, UsersModule, JobsModule, AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
