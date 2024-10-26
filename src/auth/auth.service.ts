import {
  ConflictException,
  Inject,
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
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
    await this.cacheManager.set(refresh_token, user._id, 7 * 24 *60 * 60000);
    return {
      access_token,
      refresh_token,
    };
  }

  async refreshAccessToken(refreshToken: string, userId?: string) {
    const fetcheduserId: string = await this.cacheManager.get(refreshToken);
    if (!fetcheduserId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(fetcheduserId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userTokens = await this.createUserTokens(user);
    return {
      message: "Access token refreshed successfully",
      ...userTokens
    };

    
  }

  async revokeRefreshToken(refreshToken: string, userId?: string) {
    //revoke it from cache
    await this.cacheManager.del(refreshToken);
  }
}
