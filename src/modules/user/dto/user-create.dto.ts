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
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @Expose()
  username: string;

  // TODO:
  // profileImage

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(2)
  @Transform((value: any) =>
    value.value === '' ? (value.value = null) : value.value,
  )
  @Expose()
  nickname?: string;

  @ApiProperty()
  @IsPassword()
  @IsNotEmpty()
  @Expose()
  password: string;

  @ApiProperty()
  @IsPassword()
  @IsEqualTo('password')
  @Expose()
  passwordConfirm: string;

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
