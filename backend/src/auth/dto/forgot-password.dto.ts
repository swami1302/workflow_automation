import { PickType } from '@nestjs/mapped-types';
import { LoginDto } from './login.dto';

export class ForgotPasswordDto extends PickType(LoginDto, ['email'] as const) {}
