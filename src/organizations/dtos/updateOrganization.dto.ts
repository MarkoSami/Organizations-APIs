import { IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";


export class UpdateOrganizationDto {

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;


    @IsOptional()
    @IsString()
    @MaxLength(500)
    description: string;
}