/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, password, name } = createUserDto;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) throw new BadRequestException('Email already in use');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({ email, password: hashedPassword, name });
        return newUser.save();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email });
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.userModel.findById(id).select('-password');
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async update(userId: string, updateUserDto: UpdateUserDto): Promise<User | null> {
        // Check if password is being updated
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        return this.userModel
            .findByIdAndUpdate(userId, updateUserDto, { new: true })
            .select('-password');
    }


    async findAll(): Promise<User[]> {
        return this.userModel.find().select('-password');
    }

    async delete(id: string): Promise<void> {
        const deleted = await this.userModel.findByIdAndDelete(id);
        if (!deleted) throw new NotFoundException('User not found for deletion');
    }
}
