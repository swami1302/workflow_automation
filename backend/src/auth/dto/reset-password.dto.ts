import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { SignupDto } from './signup.dto';

export class ResetPasswordDto extends PickType(SignupDto, ['password'] as const) {
  @IsString()
  @IsNotEmpty({ message: 'Reset token is required' })
  token: string;
}
