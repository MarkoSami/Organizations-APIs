import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dtos/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import {v4 as uuidv4}  from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userDto: SignupDto) {
    const existingUser = await this.usersService.findByEmail(userDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = await this.usersService.create({
      ...userDto,
      password: hashedPassword,
    });
    return user;
  }

  async signIn(signInDto: SigninDto) {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userTokens = await this.createUserTokens(user);

    

    return {
        message: "User logged in successfully",
        ...userTokens,
    };
  }

  async createUserTokens(user: User) {
    const payload = { sub: user._id };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = uuidv4();
    await this.usersService.createUserRefreshToken(refresh_token, user.id);
    return {
      access_token,
      refresh_token,
    };
  }

  async refreshAccessToken(refreshToken: string, userId?: string) {
    const userRefreshToken = await this.usersService.findByRefreshToken(refreshToken,userId );
    if (!userRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(userRefreshToken.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userTokens = await this.createUserTokens(user);
    return {
      message: "Access token refreshed successfully",
      ...userTokens
    };
  }
}
