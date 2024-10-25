import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";


@Injectable()
export class UserRepository{

    
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}


    async create(userDto: Partial<User>) {
        const user = new this.userModel(userDto);
        return user.save();
    }

    async findById(id: string): Promise<User> {
        return this.userModel.findById(id).exec();
    }


}