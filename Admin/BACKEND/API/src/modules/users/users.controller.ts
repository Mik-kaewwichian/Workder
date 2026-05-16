import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, SendProfileOtpDto, UpdateProfileWithOtpDto, UpdateUserDto, VerifyProfileOtpDto } from './users.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @Get()
    findAll() {
        return this.usersService.users({});
    }

    @Get('activity/logs')
    activityLogs() {
        return this.usersService.userActivityLogs();
    }

    @Post(':id/profile-otp/send')
    sendProfileOtp(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: SendProfileOtpDto,
    ) {
        return this.usersService.sendProfileOtp(id, payload.email, payload.phone);
    }

    @Post(':id/profile-otp/verify')
    verifyProfileOtp(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: VerifyProfileOtpDto,
    ) {
        return this.usersService.verifyProfileOtp(id, payload.email, payload.phone, payload.emailOtp, payload.phoneOtp);
    }

    @Patch(':id/profile')
    updateProfileWithOtp(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateProfileWithOtpDto,
    ) {
        return this.usersService.updateProfileWithOtp(id, payload);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.user({ id });
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.updateUser({
            where: { id },
            data: updateUserDto,
        });
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.deleteUser({ id });
    }
}
