import { IsEmail, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class SigninDto {

    @IsString()
    @IsEmail()
    email: string;
    
    @IsString()
    password: string;
    
}