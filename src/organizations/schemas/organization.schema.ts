import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/users/schemas/user.schema";


@Schema({
    timestamps: true
})
export class Organization extends Document {
    
    @Prop({
        required: true,
    })
    name: string;

    @Prop({
        required: true,
    })
    description: string;

    @Prop({
        type: [{ type: Types.ObjectId, ref: 'User' }],
    })
    members: Types.ObjectId[] | User[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);