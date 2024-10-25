import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum AccessLevel {
    OWNER = "owner",
    INVITED = "invited"
}

@Schema({
    timestamps: true,
    _id: false
})
export class OrganizationMember extends Document {
    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'User'
    })
    userId: Types.ObjectId; 

    @Prop({
        required: true,
        enum: AccessLevel,
        type: String
    })
    access_level: AccessLevel;   
}

export const OrganizationMemberSchema = SchemaFactory.createForClass(OrganizationMember);
