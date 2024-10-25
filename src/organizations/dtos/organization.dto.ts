import { IsString, MaxLength, Min, MinLength } from "class-validator";


export class OrganizationDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    @IsString()
    @MaxLength(500)
    description: string;
}