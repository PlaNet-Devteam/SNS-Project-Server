import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Min,
  MinLength,
} from 'class-validator';
import { IsPassword } from 'src/common';

export class AuthLoginDto {
  // 이메일일 수 있고 아닐 수도 있음
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPassword()
  @Expose()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Expose()
  rememberMe?: boolean;
}
