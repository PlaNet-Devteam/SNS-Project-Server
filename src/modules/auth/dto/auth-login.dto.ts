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
import * as errors from '../../../locales/kr/errors.json';

export class AuthLoginDto {
  // 이메일일 수 있고 아닐 수도 있음
  @ApiProperty()
  @IsNotEmpty({
    message: errors.auth.requiredEmail,
  })
  @IsEmail(
    {},
    {
      message: errors.auth.invalidEmail,
    },
  )
  @Expose()
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: errors.auth.requiredPassword,
  })
  @IsPassword({}, '비밀번호')
  @Expose()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Expose()
  rememberMe?: boolean;
}
