import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

// The user shape that is safe to send to clients — never expose hashes/tokens.
// Lives here (not in auth) because the users module owns the user shape.
export type SafeUser = Omit<
  User,
  'password' | 'refreshToken' | 'emailVerificationToken' | 'forgotPasswordToken'
>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  toSafeUser(user: User): SafeUser {
    const {
      password: _p,
      refreshToken: _rt,
      emailVerificationToken: _evt,
      forgotPasswordToken: _fpt,
      ...safe
    } = user;
    return safe;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { emailVerificationToken: token } });
  }

  async findByForgotPasswordToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { forgotPasswordToken: token } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async updateById(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async getProfile(id: string): Promise<SafeUser> {
    const user = await this.findById(id);
    if (!user) {
      // 401 (not 404) on purpose: the token was valid but the account no longer
      // exists — the frontend's axios interceptor treats 401 as "end the session".
      throw new UnauthorizedException('User not found');
    }
    return this.toSafeUser(user);
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<SafeUser> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { name: dto.name },
    });
    return this.toSafeUser(user);
  }
}
