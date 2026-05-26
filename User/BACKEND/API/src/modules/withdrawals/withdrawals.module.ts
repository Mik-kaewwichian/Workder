import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WalletModule } from '../wallet/wallet.module';
import { WithdrawalsController } from './withdrawals.controller';
import { WithdrawalsService } from './withdrawals.service';

@Module({
    imports: [AuthModule, WalletModule],
    controllers: [WithdrawalsController],
    providers: [WithdrawalsService],
})
export class WithdrawalsModule {}
