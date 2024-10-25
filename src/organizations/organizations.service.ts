import { ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OrganizationsRepository } from './organizations.repository';
import { OrganizationReponseDto } from './dtos/organizationReponse.dto';
import { plainToClass } from 'class-transformer';
import { OrganizationDto } from './dtos/organization.dto';
import { UpdateOrganizationDto } from './dtos/updateOrganization.dto';
import { Types } from 'mongoose';
import { AccessLevel, OrganizationMember } from './schemas/organizationMember.schema';
import { inviteDto } from './dtos/invite.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrganizationsService {

    constructor(
        private readonly organizationsRepository: OrganizationsRepository,
        private readonly userService: UsersService
    ) {}
    
    async create(organizationDto: OrganizationDto, userId: string) {
        const createdOrganization = await this.organizationsRepository.create(organizationDto, userId);
        return {
            organization_id: createdOrganization.id,
        }; 
    }

    async getAll() {
        const organizations = await this.organizationsRepository.getAll();
        const mappedOrganizations = organizations.map(o=> OrganizationReponseDto.fromEntity(o));
        return mappedOrganizations;
    }

    async findById(id: string) {
        const organization = await this.organizationsRepository.findById(id);
        if(!organization){
            return null;
        }
        const mappedOrganization = OrganizationReponseDto.fromEntity(organization); 
        return mappedOrganization;
    }

    async update(id: string, organizationDto: UpdateOrganizationDto, userId: string) {
        const organization = await this.organizationsRepository.findById(id);
        if(!organization){
            return null;
        }
        const canModify = await this.canModifyOrganization(id, userId);
        if(!canModify){
            throw new ForbiddenException('You are not allowed to modify this organization');
        }
        const updatedOrganization = await this.organizationsRepository.update(id, organizationDto);
        return updatedOrganization;
    }

    async delete(id: string, userId: string) {
        const organization = await this.organizationsRepository.findById(id);
        if(!organization){
            return null;
        }
        const canModify = await this.canModifyOrganization(id, userId);
        if(!canModify){
            throw new ForbiddenException('You are not allowed to delete this organization');
        }
        const deletedOrganization = await this.organizationsRepository.delete(id);
        return deletedOrganization;
    }


    async invite(id: string, inviteDto: inviteDto, userId: string) {
        const organization = await this.organizationsRepository.findById(id);
        if(!organization){
            throw new NotFoundException('Organization not found');
        }
        const canModify = await this.canModifyOrganization(id, userId);
        if(!canModify){
            throw new ForbiddenException('You are not allowed to invite to this organization');
        }

        const userBeingInvited = await this.userService.findByEmail(inviteDto.user_email);
        if(!userBeingInvited){
            throw new NotFoundException('User not found');
        }

        const member = await this.organizationsRepository.findMember(id,userBeingInvited.id);
        if(member){
            throw new ConflictException('User is already a member of this organization');
        }
        const invitedMember = await this.organizationsRepository.addMember(id, userBeingInvited.id,  AccessLevel.INVITED);
        return invitedMember;

    }


    private async canModifyOrganization(organizationId: string, userId: string) {
        const member = await this.organizationsRepository.findMember(organizationId, userId);
        return member !== null; 
    }
}
