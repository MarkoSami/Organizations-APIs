import { Expose } from "class-transformer";


export class OrganizationMemberDto {

    name: string;

    email: string;

    access_level: string;
    

    public static fromEntity(entity: any): OrganizationMemberDto {
        const organizationMemberDto = new OrganizationMemberDto();
        organizationMemberDto.name = entity.userId.name;
        organizationMemberDto.email = entity.userId.email;
        organizationMemberDto.access_level = entity.access_level;
        return organizationMemberDto;
    }
}

