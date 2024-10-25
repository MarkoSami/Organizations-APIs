import { Body, Controller, Delete, Get, Logger, NotFoundException, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationDto } from './dtos/organization.dto';
import { OrganizationReponseDto } from './dtos/organizationReponse.dto';
import { UpdateOrganizationDto } from './dtos/updateOrganization.dto';
import { AUthGuard } from 'src/guards/auth.guard';
import { inviteDto } from './dtos/invite.dto';

@Controller('organizations')
@UseGuards(AUthGuard)
export class OrganizationsController {

    constructor(private readonly organizationsService: OrganizationsService) {}


    @Post()
    async create(@Body() organizationDto: OrganizationDto, @Req() req) {
        return await this.organizationsService.create(organizationDto, req.userId);
    }


    @Get()
    async getAll() {
        return await this.organizationsService.getAll();
    }

    @Get(':id')
    async findById(@Param("id") id: string) {
        const organization =  await this.organizationsService.findById(id);
        if(!organization){
            throw new NotFoundException('Organization not found');
        }
        return organization;
    }

    @Put(':id')
    async update(@Param("id") id: string, @Body() organizationDto: UpdateOrganizationDto, @Req() req) {
        const updatedOrganization = await this.organizationsService.update(id, organizationDto, req.userId);
        if(!updatedOrganization){
            throw new NotFoundException('Organization not found');
        }
        return {
            organization_id: updatedOrganization.id,
            name: updatedOrganization.name,
            description: updatedOrganization.description,
        }
    }

    @Delete(':id')
    async delete(@Param("id")id: string, @Req() req) {
        const deletedOrganization = await this.organizationsService.delete(id, req.userId);
        if(!deletedOrganization){
            throw new NotFoundException('Organization not found');
        }
        return {
            message: 'Organization deleted successfully'
        }
    }

    @Post(':id/invite')
    async invite(@Param("id") id: string, @Body() inviteDto: inviteDto, @Req() req) {
        const invitedMember =  await this.organizationsService.invite(id, inviteDto, req.userId);
        if(!invitedMember){
            return {
                message: 'Could not invite member'
            }
        }
        return {
            message: 'Member invited successfully'
        }
    }
}
