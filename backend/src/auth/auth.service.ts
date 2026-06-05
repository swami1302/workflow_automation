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
import { UsersService, SafeUser } from '../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

const BCRYPT_SALT_ROUNDS = 12;
const EMAIL_VERIFICATION_EXPIRY_HOURS = 24;
const PASSWORD_RESET_EXPIRY_HOURS = 1;

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

  // ─── Signup ──────────────────────────────────────────────────────────────────

  async signup(
    dto: SignupDto,
  ): Promise<{ user: SafeUser; message: string } & TokenPair> {
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

    const verificationUrl = `${this.config.get<string>('FRONTEND_URL')}/auth/verify-email?token=${emailVerificationToken}`;
    await this.mailService.sendVerificationEmail(
      user.email,
      user.name ?? user.email,
      verificationUrl,
    );

    const tokens = this.generateTokens(user.id, user.email);
    const hashedRt = await bcrypt.hash(tokens.refreshToken, BCRYPT_SALT_ROUNDS);
    await this.usersService.updateById(user.id, { refreshToken: hashedRt });

    return {
      user: this.usersService.toSafeUser(user),
      ...tokens,
      message: 'Account created. Please check your email to verify your address.',
    };
  }

  // ─── Login ───────────────────────────────────────────────────────────────────

  async login(dto: LoginDto): Promise<{ user: SafeUser } & TokenPair> {
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
      user: this.usersService.toSafeUser(user),
      ...tokens,
    };
  }

  // ─── Refresh tokens ──────────────────────────────────────────────────────────

  async refreshTokens(dto: RefreshTokenDto): Promise<TokenPair> {
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

  // ─── Resend verification ──────────────────────────────────────────────────────

  async resendVerification(userId: string): Promise<{ message: string }> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isEmailVerified) {
      return { message: 'Email is already verified' };
    }

    const { token: emailVerificationToken, expiry: emailVerificationExpiry } =
      this.generateEmailVerificationToken();

    await this.usersService.updateById(user.id, {
      emailVerificationToken,
      emailVerificationExpiry,
    });

    const verificationUrl = `${this.config.get<string>('FRONTEND_URL')}/auth/verify-email?token=${emailVerificationToken}`;
    await this.mailService.sendVerificationEmail(
      user.email,
      user.name ?? user.email,
      verificationUrl,
    );

    return { message: 'Verification email sent. Please check your inbox.' };
  }

  // ─── Forgot password ──────────────────────────────────────────────────────────

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);

    // Always return success to avoid user enumeration
    if (!user) {
      return { message: 'If an account with that email exists, a reset link has been sent.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + PASSWORD_RESET_EXPIRY_HOURS);

    await this.usersService.updateById(user.id, {
      forgotPasswordToken: token,
      forgotPasswordExpiry: expiry,
    });

    const resetUrl = `${this.config.get<string>('FRONTEND_URL')}/auth/reset-password?token=${token}`;
    await this.mailService.sendPasswordResetEmail(user.email, user.name ?? user.email, resetUrl);

    return { message: 'If an account with that email exists, a reset link has been sent.' };
  }

  // ─── Reset password ───────────────────────────────────────────────────────────

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByForgotPasswordToken(dto.token);

    if (!user || !user.forgotPasswordExpiry || user.forgotPasswordExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    await this.usersService.updateById(user.id, {
      password: hashedPassword,
      forgotPasswordToken: null,
      forgotPasswordExpiry: null,
      refreshToken: null, // invalidate all sessions
    });

    return { message: 'Password reset successfully. Please log in with your new password.' };
  }

  // ─── Change password ──────────────────────────────────────────────────────────

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string } & TokenPair> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Re-authenticate: holding a valid JWT is not proof you know the password
    // (e.g. an unattended laptop). Sensitive actions re-verify it.
    const passwordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('New password must be different from the current password');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, BCRYPT_SALT_ROUNDS);

    // Rotate the refresh token: any other device's session dies (it holds the
    // old refresh token), but THIS session stays alive with the fresh pair.
    const tokens = this.generateTokens(user.id, user.email);
    const hashedRt = await bcrypt.hash(tokens.refreshToken, BCRYPT_SALT_ROUNDS);

    await this.usersService.updateById(user.id, {
      password: hashedPassword,
      refreshToken: hashedRt,
    });

    return {
      message: 'Password changed successfully.',
      ...tokens,
    };
  }

  // ─── Email verification ───────────────────────────────────────────────────────

  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string }> {
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
