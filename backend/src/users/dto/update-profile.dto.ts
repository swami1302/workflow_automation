import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Name cannot be empty' })
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  name?: string;
}
