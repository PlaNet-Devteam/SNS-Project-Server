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
  @IsNotEmpty({
    message: '이메일은 필수 항목 입니다',
  })
  @MinLength(2, {
    message: '이메일은 2자 이상 작성해주세요',
  })
  @IsEmail(
    {},
    {
      message: '이메일 형식이여야 합니다',
    },
  )
  @Expose()
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '비밀번호는 필수 항목 입니다',
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
