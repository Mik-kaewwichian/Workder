"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./infra/prisma/prisma.module");
const users_module_1 = require("./modules/users/users.module");
const jobs_module_1 = require("./modules/jobs/jobs.module");
const auth_module_1 = require("./modules/auth/auth.module");
const applications_module_1 = require("./modules/applications/applications.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const workerposts_module_1 = require("./modules/workerposts/workerposts.module");
const chat_module_1 = require("./modules/chat/chat.module");
const user_reviews_module_1 = require("./modules/user-reviews/user-reviews.module");
const payment_module_1 = require("./infra/payment/payment.module");
const wallet_module_1 = require("./modules/wallet/wallet.module");
const payments_module_1 = require("./modules/payments/payments.module");
const escrow_module_1 = require("./modules/escrow/escrow.module");
const withdrawals_module_1 = require("./modules/withdrawals/withdrawals.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, users_module_1.UsersModule, jobs_module_1.JobsModule, auth_module_1.AuthModule, applications_module_1.ApplicationsModule, reviews_module_1.ReviewsModule, workerposts_module_1.WorkerPostsModule, chat_module_1.ChatModule, user_reviews_module_1.UserReviewsModule, payment_module_1.PaymentModule, wallet_module_1.WalletModule, payments_module_1.PaymentsModule, escrow_module_1.EscrowModule, withdrawals_module_1.WithdrawalsModule, notifications_module_1.NotificationsModule],
        controllers: [],
        providers: [],
    })
], AppModule);
