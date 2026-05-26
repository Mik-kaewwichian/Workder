import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, CurrentUserId } from '../../common/decorators/current-user.decorator';
import { EscrowService } from './escrow.service';
import { DisputeEscrowDto, MarkWorkDoneDto, ResolveDisputeDto } from './escrow.dto';

@UseGuards(JwtAuthGuard)
@Controller('escrow')
export class EscrowController {
    constructor(private readonly escrow: EscrowService) {}

    @Get('me')
    mine(@CurrentUserId() userId: number) {
        return this.escrow.listMine(userId);
    }

    /** Worker marks the work finished — must include at least 1 proof photo. */
    @Post(':id/work-done')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    workDone(
        @CurrentUserId() userId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: MarkWorkDoneDto,
    ) {
        return this.escrow.markWorkDone(id, userId, dto.proofPhotos);
    }

    /** Employer confirms → release to worker. */
    @Post(':id/confirm')
    confirm(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
        return this.escrow.confirmAndRelease(id, userId);
    }

    /** Employer disputes → freeze for admin resolution. */
    @Post(':id/dispute')
    dispute(
        @CurrentUserId() userId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: DisputeEscrowDto,
    ) {
        return this.escrow.dispute(id, userId, dto.reason);
    }

    /** Employer cancels a not-yet-started job → refund. */
    @Post(':id/cancel')
    cancel(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
        return this.escrow.cancelAndRefund(id, userId);
    }

    /** Admin: resolve a DISPUTED escrow → pay worker or refund employer. */
    @Post(':id/resolve')
    resolve(
        @CurrentUser() user: { role: string },
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ResolveDisputeDto,
    ) {
        if (user.role !== 'admin') throw new ForbiddenException('Admin only');
        return this.escrow.resolveDispute(id, dto.outcome);
    }

    /**
     * Sweep due auto-releases. Idempotent (only releases legitimately-due
     * escrows). TODO(Phase 4): restrict to admin / drive from a scheduler.
     */
    @Post('sweep')
    sweep() {
        return this.escrow.releaseDue().then((released) => ({ released }));
    }
}
