import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { AuthModule } from './modules/auth/auth.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { WorkerPostsModule } from './modules/workerposts/workerposts.module';
import { ChatModule } from './modules/chat/chat.module';
import { UserReviewsModule } from './modules/user-reviews/user-reviews.module';
import { PaymentModule } from './infra/payment/payment.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { EscrowModule } from './modules/escrow/escrow.module';
import { WithdrawalsModule } from './modules/withdrawals/withdrawals.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
    imports: [PrismaModule, UsersModule, JobsModule, AuthModule, ApplicationsModule, ReviewsModule, WorkerPostsModule, ChatModule, UserReviewsModule, PaymentModule, WalletModule, PaymentsModule, EscrowModule, WithdrawalsModule, NotificationsModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
