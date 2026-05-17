import { Module } from '@nestjs/common';
import { UserReviewsController } from './user-reviews.controller';
import { UserReviewsService } from './user-reviews.service';

@Module({
    controllers: [UserReviewsController],
    providers: [UserReviewsService],
})
export class UserReviewsModule {}
