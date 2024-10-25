import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/users/schemas/user.schema";
import { OrganizationMember, OrganizationMemberSchema } from "./organizationMember.schema"; // Adjust import as necessary

// Define OrganizationMember as a sub-schema
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
        type: [OrganizationMemberSchema], // Use OrganizationMember as a sub-schema
    })
    members: OrganizationMember[];
}

export type OrganizationDocument = Organization & Document;
export const OrganizationSchema = SchemaFactory.createForClass(Organization);
