import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        return 'signup';
    }

    @Post('signin')
    async signin(@Body() signinDto: SigninDto) {
        return 'signin';
    }
}
