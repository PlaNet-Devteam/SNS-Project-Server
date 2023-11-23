import { BaseDto } from 'src/core';
import { User } from '../user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { GENDER } from 'src/common';

export class UserUpdateDto
  extends BaseDto<UserUpdateDto>
  implements Partial<User>
{
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2, { message: '닉네임은 2글자 이상 작성해주세요' })
  @Transform((value: any) =>
    value.value === '' ? (value.value = null) : value.value,
  )
  @Expose()
  nickname: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(50, { message: '자기소개는 50자 이하로 작성해주세요' })
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

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  profileImage?: string;
}
