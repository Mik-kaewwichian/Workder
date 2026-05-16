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
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, users_module_1.UsersModule, jobs_module_1.JobsModule, auth_module_1.AuthModule, applications_module_1.ApplicationsModule, reviews_module_1.ReviewsModule, workerposts_module_1.WorkerPostsModule, chat_module_1.ChatModule],
        controllers: [],
        providers: [],
    })
], AppModule);
