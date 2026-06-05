import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  // JwtModule gives JwtAuthGuard its JwtService dependency.
  // (We can't import AuthModule here — AuthModule already imports UsersModule,
  // and that would create a circular dependency.)
  imports: [JwtModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
