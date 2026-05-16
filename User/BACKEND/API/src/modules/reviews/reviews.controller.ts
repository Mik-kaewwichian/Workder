import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './reviews.dto';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Post()
    create(@Body() dto: CreateReviewDto) {
        return this.reviewsService.create(dto);
    }

    @Get('job/:jobId')
    byJob(@Param('jobId', ParseIntPipe) jobId: number) {
        return this.reviewsService.getByJob(jobId);
    }

    @Get('author/:authorId')
    byAuthor(@Param('authorId', ParseIntPipe) authorId: number) {
        return this.reviewsService.getByAuthor(authorId);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReviewDto) {
        return this.reviewsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.reviewsService.remove(id);
    }
}
