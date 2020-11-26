import { Injectable } from '@nestjs/common';
import { FindConditions } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { UserOptions } from './user.types';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getLocale(options: FindConditions<UserOptions>): Promise<string> {
        const user = await this.userRepository.findOne(options);
        if (!user) throw new Error("User doesn't exist");

        return user.locale;
    }

    async getUser(options: FindConditions<UserOptions>): Promise<UserEntity> {
        const user = await this.userRepository.findOne(options);
        if (!user) throw new Error("User doesn't exist");

        return user;
    }

    async registerUser(
        userDto: CreateUserDto,
        userOptions: FindConditions<UserOptions>,
    ): Promise<UserEntity> {
        const user = await this.userRepository.findOne(userOptions);
        if (!user) {
            const newUser = this.userRepository.create({ ...userDto });
            return this.userRepository.save(newUser);
        }
        return user;
    }

    async validateUser(
        options: FindConditions<UserOptions>,
    ): Promise<UserEntity> {
        const user = await this.userRepository.findOne(options);
        if (!user) return;

        return user;
    }
}
