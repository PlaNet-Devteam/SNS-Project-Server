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

export class UserCreateDto
  extends BaseDto<UserCreateDto>
  implements Partial<User>
{
  @ApiProperty()
  @IsNotEmpty({
    message: '이메일은 필수 항목 입니다',
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
    message: '사용자명은 필수 항목 입니다 ',
  })
  @MinLength(6, {
    message: '사용자명은 6자 이상 작성해주세요',
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
    message: '닉네임은 2자이상 작성해주세요',
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
    message: '비밀번호가 일치하지 않습니다',
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
