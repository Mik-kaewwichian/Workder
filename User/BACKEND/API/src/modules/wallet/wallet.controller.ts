import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, CurrentUserId } from '../../common/decorators/current-user.decorator';
import { WalletService } from './wallet.service';
import { CreateTopUpDto, ListTransactionsDto } from './wallet.dto';

/**
 * All wallet endpoints are guarded and derive the user id from the JWT —
 * never from the request body (this is the money path).
 */
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Get('me')
    me(@CurrentUserId() userId: number) {
        return this.walletService.getSummary(userId);
    }

    @Get('transactions')
    transactions(@CurrentUserId() userId: number, @Query() query: ListTransactionsDto) {
        return this.walletService.getTransactions(userId, query.cursor, query.take ?? 20);
    }

    /** Admin: assert every wallet balance == sum(ledger). */
    @Get('admin/reconcile')
    reconcile(@CurrentUser() user: { role: string }) {
        if (user.role !== 'admin') throw new ForbiddenException('Admin only');
        return this.walletService.reconcile();
    }

    @Post('topups')
    createTopUp(@CurrentUserId() userId: number, @Body() dto: CreateTopUpDto) {
        return this.walletService.createTopUp(userId, dto.amount);
    }

    @Get('topups/:id')
    getTopUp(
        @CurrentUserId() userId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.walletService.getTopUp(userId, id);
    }
}
