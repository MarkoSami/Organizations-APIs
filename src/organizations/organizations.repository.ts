import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Organization } from "./schemas/organization.schema";
import { Model } from "mongoose";
import { OrganizationDto } from "./dtos/organization.dto";
import { UpdateOrganizationDto } from "./dtos/updateOrganization.dto";

@Injectable()
export class OrganizationsRepository {

    constructor(@InjectModel(Organization.name) private readonly organizationModel: Model<Organization> ) {}

    async create(organizationDto: OrganizationDto) {
        const organization = new this.organizationModel(organizationDto);
        return organization.save();
    }

    async findById(id: string): Promise<Organization> {
        const user = await this.organizationModel.findById(id).exec();
        return user;
    }

    async update(id: string, organizationDto: UpdateOrganizationDto): Promise<Organization> {
        const user = await this.organizationModel.findByIdAndUpdate(id, organizationDto, { new: true }).exec();
        return user;
    }

    async delete(id: string): Promise<Organization> {
        const user = await this.organizationModel.findByIdAndDelete(id).exec();
        return user;
    }

    
    

}