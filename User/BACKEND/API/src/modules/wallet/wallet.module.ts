import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
    imports: [AuthModule], // provides JwtAuthGuard (+ AuthService it depends on)
    controllers: [WalletController],
    providers: [WalletService],
    exports: [WalletService], // escrow (Phase 2) & payments webhook reuse this
})
export class WalletModule {}
