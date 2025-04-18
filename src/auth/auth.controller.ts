/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Req,
    Put,
    Delete,
    Param,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }

    @Get('test')
    getTest() {
        return { message: 'Auth module is working!' };
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.create(createUserDto);
        return { message: 'User registered successfully', user };
    }

    @Post('login')
    async login(@Body() loginDto: LoginUserDto) {
        const token = await this.authService.validateUser(loginDto);
        return { message: 'Login successful', access_token: token };
    }
    // 🔐 Get profile from token
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: any) {
        const user = await this.userService.findById(req.user.userId);
        return { message: 'Profile fetched successfully', user };
    }
    @Get('user/:id')
    async findUserById(@Param('id') id: string) {
        const user = await this.userService.findById(id);
        return { message: 'User fetched successfully', user };
    }
    // 🔄 Update user by token
    @UseGuards(JwtAuthGuard)
    @Put('update')
    async updateUser(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.userService.update(req.user.userId, updateUserDto);
        return { message: 'User updated successfully', user };
    }

    // ❌ Delete user by token
    @UseGuards(JwtAuthGuard)
    @Delete('delete')
    async deleteOwnAccount(@Req() req: any) {
        await this.userService.delete(req.user.userId);
        return { message: 'User deleted successfully' };
    }

    // 🔍 Get all users
    @Get('users')
    async getAllUsers() {
        const users = await this.userService.findAll();
        return { message: 'All users fetched successfully', users };
    }

    // ❌ Admin-style: Delete user by ID
    @Delete('delete/:id')
    async deleteById(@Param('id') id: string) {
        await this.userService.delete(id);
        return { message: `User with ID ${id} deleted successfully` };
    }
}
