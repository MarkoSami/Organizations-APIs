import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";



@Schema({
    timestamps: true
})
export class UserRefreshToken extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    refreshToken: string;

    @Prop({ required: true })
    expiresAt: Date;
}

export const UserRefreshTokenSchema = SchemaFactory.createForClass(UserRefreshToken);
