import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dtos/refreshToken.dto';

@Controller('auth')
export class AuthController {

    /**
     *
     */
    constructor(private readonly authService: AuthService) {
        
    }

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        const createdUser = await this.authService.signUp(signupDto);
        if(!createdUser) {
            return {
                message: 'User not created'
            };
        }
        return {
            message: 'User created successfully',
        };
    }

    @Post('signin')
    async signin(@Body() signinDto: SigninDto) {
        var response = await this.authService.signIn(signinDto);
        return response;
    }

    @Post('refresh-token')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        const response = await this.authService.refreshAccessToken(refreshTokenDto.refresh_token);
        return response;
    }

    @Post('revoke-refresh-token')
    async revokeRefreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        await this.authService.revokeRefreshToken(refreshTokenDto.refresh_token);
        return {
            message: 'Refresh token revoked successfully'
        };
    }


}

    
