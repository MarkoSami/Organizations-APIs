import { IsEmail, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class SignupDto {

    @IsString()
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/ , {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    })
    password: string;
    
    @IsString()
    @MinLength(2)
    @MaxLength(40)
    name: string;
    
}