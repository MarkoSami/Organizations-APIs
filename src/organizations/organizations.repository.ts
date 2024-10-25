import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './schemas/organization.schema';
import mongoose, { Model, Types } from 'mongoose';
import { OrganizationDto } from './dtos/organization.dto';
import { UpdateOrganizationDto } from './dtos/updateOrganization.dto';
import {
  AccessLevel,
  OrganizationMember,
} from './schemas/organizationMember.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class OrganizationsRepository {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<Organization>,
    @InjectModel(OrganizationMember.name)
    private readonly organizationMemberModel: Model<OrganizationMember>,
  ) {}

  async create(organizationDto: OrganizationDto, userId: string) {
    const organization = new this.organizationModel({
      ...organizationDto,
      members: [
        {
          userId,
          access_level: AccessLevel.OWNER,
        },
      ],
    });

    return organization.save();
  }

  async findById(id: string): Promise<Organization> {
    const organization = await this.organizationModel
      .findById(new Types.ObjectId(id))
      .populate({
        path: 'members.userId', // Path to the nested userId field
        model: 'User', // Reference to the User model
        select: 'email name profile', // Select the fields you want to include
      })
      .exec();

    Logger.log('Found organization:', organization);

    if (!organization) {
      return null;
    }

    return organization.toObject({
      virtuals: true, // Include virtual properties
      getters: true, // Include getter transforms
    });
  }

  async update(
    id: string,
    organizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const user = await this.organizationModel
      .findByIdAndUpdate(id, organizationDto, { new: true })
      .exec();
    return user;
  }

  async delete(id: string): Promise<Organization> {
    const user = await this.organizationModel.findByIdAndDelete(id).exec();
    return user;
  }

  async getAll(): Promise<Organization[]> {
    const organizations = await this.organizationModel
      .find()
      .populate({
        path: 'members.userId', // Path to the nested userId field
        model: 'User', // Reference to the User model
        select: 'email name profile', // Select the fields you want to include
      })
      .exec();
    return organizations;
  }

  async findMember(
    organizationId: string,
    userId: string,
  ): Promise<OrganizationMember | null> {
    Logger.log('Finding member:', { organizationId, userId });

    const organization = await this.organizationModel.findOne(
      { _id: organizationId, 'members.userId': userId },
      { 'members.$': 1 }, // Project only the matching member
    );
    Logger.log('Found organization:', organization);

    // Return the member if found, else null
    return organization ? organization.members[0] : null;
  }

  async addMember(
    organizationId: string,
    userId: string,
    accessLevel: AccessLevel,
  ) {
    const member = new this.organizationMemberModel({
      userId,
      organizationId,
      access_level: accessLevel,
    });

    const updatedOrganization = await this.organizationModel.updateOne(
      { _id: Types.ObjectId.createFromHexString(organizationId) },
      {
        $push: {
          members: {
            userId,
            organizationId,
            access_level: accessLevel,
          },
        },
      },
    );
    Logger.log('Updated organization:', updatedOrganization);
    return updatedOrganization.modifiedCount >=0 ? member : null;
  }
}
