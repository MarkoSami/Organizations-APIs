import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {

    constructor(private readonly userRepository: UserRepository) {}
        
    async create(userDto: any) {
        return this.userRepository.create(userDto);
    }

    async findById(id: string) {
        return this.userRepository.findById(id);
    }
}
