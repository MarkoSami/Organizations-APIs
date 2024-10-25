import { IsEmail, IsString } from "class-validator";


export class inviteDto {
    @IsString()
    @IsEmail()
    user_email: string;

    
}