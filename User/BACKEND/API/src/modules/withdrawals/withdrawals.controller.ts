import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import { WithdrawalsService } from './withdrawals.service';
import {
    CreateBankAccountDto,
    CreateWithdrawalDto,
    RejectWithdrawalDto,
} from './withdrawals.dto';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WithdrawalsController {
    constructor(private readonly svc: WithdrawalsService) {}

    @Get('bank-accounts')
    listBanks(@CurrentUserId() userId: number) {
        return this.svc.listBankAccounts(userId);
    }

    @Post('bank-accounts')
    addBank(@CurrentUserId() userId: number, @Body() dto: CreateBankAccountDto) {
        return this.svc.addBankAccount(userId, dto);
    }

    @Delete('bank-accounts/:id')
    deleteBank(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
        return this.svc.deleteBankAccount(userId, id);
    }

    @Get('withdrawals')
    listWithdrawals(@CurrentUserId() userId: number) {
        return this.svc.listWithdrawals(userId);
    }

    @Post('withdrawals')
    request(@CurrentUserId() userId: number, @Body() dto: CreateWithdrawalDto) {
        return this.svc.requestWithdrawal(userId, dto);
    }

    /** Processing — TODO(Phase 4): restrict to admin / drive from a job. */
    @Post('withdrawals/:id/approve')
    approve(@Param('id', ParseIntPipe) id: number) {
        return this.svc.approve(id);
    }

    @Post('withdrawals/:id/reject')
    reject(@Param('id', ParseIntPipe) id: number, @Body() dto: RejectWithdrawalDto) {
        return this.svc.reject(id, dto.reason);
    }
}
