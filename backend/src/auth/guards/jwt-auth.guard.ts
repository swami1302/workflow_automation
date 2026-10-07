import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ALLOW_UNVERIFIED_KEY } from '../../common/decorators/allow-unverified.decorator';

interface AccessTokenPayload {
  sub: string;
  email: string;
  isEmailVerified: boolean;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    let payload: AccessTokenPayload;
    try {
      payload = this.jwtService.verify<AccessTokenPayload>(token, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET')!,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    const allowUnverified = this.reflector.get<boolean>(
      ALLOW_UNVERIFIED_KEY,
      context.getHandler(),
    );
    if (!payload.isEmailVerified && !allowUnverified) {
      throw new ForbiddenException(
        'Please verify your email to access this resource',
      );
    }

    (request as Request & { user: AccessTokenPayload }).user = payload;
    return true;
  }

  private extractToken(request: Request): string | null {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return null;
    return auth.slice(7);
  }
}
