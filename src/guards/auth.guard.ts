import { CanActivate, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";



@Injectable()
export class AUthGuard implements CanActivate{
    
    constructor(private readonly jwtService: JwtService) {}
    
    canActivate(context: any): boolean {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);
        if(!token){
            throw new UnauthorizedException('Missing token');
        }
        try {
            const decoded = this.jwtService.verify(token);
            request.userId = decoded.sub;
        } catch (error) {
            Logger.error(error);
            throw new UnauthorizedException('Invalid token');
        }
        return true;
    }

    private extractToken(request: Request): string {
        if(!request.headers.authorization){
            return null;
        }
        const bearerToken = request.headers.authorization.split(' ')[1];
        return bearerToken;
    }
    
}