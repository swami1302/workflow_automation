import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as ms from 'ms';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

const BCRYPT_SALT_ROUNDS = 12;
const EMAIL_VERIFICATION_EXPIRY_HOURS = 24;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
  ) {}

  // ─── Token generation ────────────────────────────────────────────────────────

  generateTokens(userId: string, email: string): TokenPair {
    const payload: JwtPayload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET')!,
      expiresIn: (this.config.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m') as ms.StringValue,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET')!,
      expiresIn: (this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d') as ms.StringValue,
    });

    return { accessToken, refreshToken };
  }

  private generateEmailVerificationToken(): { token: string; expiry: Date } {
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + EMAIL_VERIFICATION_EXPIRY_HOURS);
    return { token, expiry };
  }

  private stripSensitiveFields(user: Record<string, unknown>) {
    const { password: _p, refreshToken: _rt, emailVerificationToken: _evt, ...safe } = user;
    return safe;
  }

  // ─── Signup ──────────────────────────────────────────────────────────────────

  async signup(dto: SignupDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
    const { token: emailVerificationToken, expiry: emailVerificationExpiry } =
      this.generateEmailVerificationToken();

    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      emailVerificationToken,
      emailVerificationExpiry,
    });

    const verificationUrl = `${this.config.get<string>('APP_URL')}/api/auth/verify-email?token=${emailVerificationToken}`;
    await this.mailService.sendVerificationEmail(
      user.email,
      user.name ?? user.email,
      verificationUrl,
    );

    const tokens = this.generateTokens(user.id, user.email);
    const hashedRt = await bcrypt.hash(tokens.refreshToken, BCRYPT_SALT_ROUNDS);
    await this.usersService.updateById(user.id, { refreshToken: hashedRt });

    return {
      user: this.stripSensitiveFields(user),
      ...tokens,
      message: 'Account created. Please check your email to verify your address.',
    };
  }

  // ─── Login ───────────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      // Use the same message for both cases to avoid user enumeration
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = this.generateTokens(user.id, user.email);
    const hashedRt = await bcrypt.hash(tokens.refreshToken, BCRYPT_SALT_ROUNDS);
    await this.usersService.updateById(user.id, { refreshToken: hashedRt });

    return {
      user: this.stripSensitiveFields(user),
      ...tokens,
    };
  }

  // ─── Refresh tokens ──────────────────────────────────────────────────────────

  async refreshTokens(dto: RefreshTokenDto) {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(dto.refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET')!,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const rtMatches = await bcrypt.compare(dto.refreshToken, user.refreshToken);
    if (!rtMatches) {
      // Token reuse detected — rotate and invalidate all sessions
      await this.usersService.updateById(user.id, { refreshToken: null });
      throw new UnauthorizedException('Refresh token reuse detected. Please log in again.');
    }

    const tokens = this.generateTokens(user.id, user.email);
    const hashedRt = await bcrypt.hash(tokens.refreshToken, BCRYPT_SALT_ROUNDS);
    await this.usersService.updateById(user.id, { refreshToken: hashedRt });

    return tokens;
  }

  // ─── Email verification ───────────────────────────────────────────────────────

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.usersService.findByEmailVerificationToken(dto.token);

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (user.isEmailVerified) {
      return { message: 'Email is already verified' };
    }

    if (!user.emailVerificationExpiry || user.emailVerificationExpiry < new Date()) {
      throw new UnauthorizedException('Verification token has expired. Please request a new one.');
    }

    await this.usersService.updateById(user.id, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    });

    return { message: 'Email verified successfully. You can now log in.' };
  }
}
