import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { SignupDto } from './signup.dto';

export class LoginDto extends PickType(SignupDto, ['email'] as const) {
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
