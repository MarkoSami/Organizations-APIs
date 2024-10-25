import { Expose } from "class-transformer";
import { OrganizationMemberDto } from "./organizationMember.dto";
import { Organization } from "../schemas/organization.schema";


export class OrganizationReponseDto {
    

    organization_id: string

    name: string;

    description: string;

    organization_memebers: OrganizationMemberDto[];

    public static fromEntity(entity: Organization): OrganizationReponseDto {
        const organizationReponseDto = new OrganizationReponseDto();
        organizationReponseDto.organization_id = entity.id;
        organizationReponseDto.name = entity.name;
        organizationReponseDto.description = entity.description;
        organizationReponseDto.organization_memebers = entity.members.map((member: any) => OrganizationMemberDto.fromEntity(member));
        return organizationReponseDto;
    }
}