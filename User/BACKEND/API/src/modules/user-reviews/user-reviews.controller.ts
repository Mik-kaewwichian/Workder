import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { UserReviewsService } from './user-reviews.service';
import { CreateUserReviewDto } from './user-reviews.dto';

@Controller('user-reviews')
export class UserReviewsController {
    constructor(private readonly service: UserReviewsService) {}

    @Post()
    create(@Body() dto: CreateUserReviewDto) {
        return this.service.create(dto);
    }

    @Get('user/:targetId')
    byTarget(@Param('targetId', ParseIntPipe) targetId: number) {
        return this.service.getByTarget(targetId);
    }

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
        @Query('requesterId', ParseIntPipe) requesterId: number,
    ) {
        return this.service.remove(id, requesterId);
    }
}
