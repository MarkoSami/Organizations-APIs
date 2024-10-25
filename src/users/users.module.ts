import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './user.repository';
import { UsersService } from './users.service';
import { UserRefreshTokenRepository } from './userRefreshToken.repository';
import { UserRefreshToken, UserRefreshTokenSchema } from './schemas/userRefreshToken.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
        MongooseModule.forFeature([
            {
                name: UserRefreshToken.name,
                schema: UserRefreshTokenSchema,
            },
        ])
    ],
    providers: [
        UserRepository,
        UsersService,
        UserRefreshTokenRepository
    ],
    exports: [UsersService]
})
export class UsersModule {}
