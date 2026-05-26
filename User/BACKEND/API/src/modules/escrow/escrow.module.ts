import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WalletModule } from '../wallet/wallet.module';
import { EscrowController } from './escrow.controller';
import { EscrowService } from './escrow.service';

@Module({
    imports: [AuthModule, WalletModule],
    controllers: [EscrowController],
    providers: [EscrowService],
    exports: [EscrowService], // ApplicationsService holds escrow on accept
})
export class EscrowModule {}
