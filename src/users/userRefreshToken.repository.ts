import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserRefreshToken } from "./schemas/userRefreshToken.schema";
import { Model } from "mongoose";


@Injectable()
export class UserRefreshTokenRepository {
    
    constructor(@InjectModel(UserRefreshToken.name) private readonly userRefreshTokenModel: Model<UserRefreshToken>) {}
        
    async create(userRefreshTokenDto: Partial<UserRefreshToken>) {
        const userRefreshToken = new this.userRefreshTokenModel(userRefreshTokenDto);
        return userRefreshToken.save();
    }

    async findValid(token: string, userId?: string) {
        const query: any = {
            refreshToken: token,
            expiresAt: { $gt: new Date() },
        };
    
        if (userId) {
            query.userId = userId; // Add userId to the query only if it's not null or undefined
        }
    
        return await this.userRefreshTokenModel.findOne(query).exec();
    }
    


}
