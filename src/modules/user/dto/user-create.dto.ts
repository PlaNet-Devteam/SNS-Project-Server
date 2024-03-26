import { BaseDto } from 'src/core';
import { User } from '../user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { GENDER, IsEqualTo, IsPassword, USER_STATUS } from 'src/common';
import * as errors from '../../../locales/kr/errors.json';

export class UserCreateDto
  extends BaseDto<UserCreateDto>
  implements Partial<User>
{
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
    message: errors.auth.requiredUsername,
  })
  @MinLength(6, {
    message: errors.auth.invalidUsername,
  })
  @Expose()
  username: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((value: any) =>
    value.value === '' ? (value.value = null) : value.value,
  )
  @Expose()
  profileImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(2, {
    message: errors.auth.invalidNickname,
  })
  @Transform((value: any) =>
    value.value === '' ? (value.value = null) : value.value,
  )
  @Expose()
  nickname?: string;

  @ApiPropertyOptional()
  @IsPassword({}, '비밀번호')
  @IsOptional()
  @Expose()
  password?: string;

  @ApiPropertyOptional()
  @IsPassword({}, '비밀번호 확인')
  @IsOptional()
  @IsEqualTo('password', {
    message: errors.auth.invalidPassword,
  })
  @Expose()
  passwordConfirm?: string;

  @ApiProperty({ enum: USER_STATUS })
  @IsEnum(USER_STATUS, { each: true })
  @IsNotEmpty()
  @Expose()
  status: USER_STATUS = USER_STATUS.ACTIVE;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((value: any) =>
    value.value === '' ? (value.value = null) : value.value,
  )
  @Expose()
  bio?: string;

  @ApiPropertyOptional({ enum: GENDER })
  @IsEnum(GENDER, { each: true })
  @IsOptional()
  @Expose()
  gender?: GENDER = GENDER.NO_ANSWER;
}
