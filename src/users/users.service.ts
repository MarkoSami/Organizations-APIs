import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserRefreshTokenRepository } from './userRefreshToken.repository';

@Injectable()
export class UsersService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly userRefreshTokenRepository: UserRefreshTokenRepository
    ) {}
        
    async create(userDto: any) {
        return await this.userRepository.create(userDto);
    }

    async findById(id: string) {
        return await this.userRepository.findById(id);
    }
    
    async findByEmail(email: string) {
        return  await this.userRepository.findByEmail(email);
    }

    async findByRefreshToken(refreshToken: string, userId?: string) {
        return await this.userRefreshTokenRepository.findValid(refreshToken, userId);
    }

    async createUserRefreshToken(token: string,userId: string){
        return await this.userRefreshTokenRepository.create({
            refreshToken: token,
            userId: userId,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        });

    }
}
