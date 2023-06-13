import { BaseDto } from 'src/core';
import { User } from '../user.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, MinLength } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { GENDER } from 'src/common';

export class UserUpdateDto
  extends BaseDto<UserUpdateDto>
  implements Partial<User>
{
  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(3)
  @Transform((value: any) =>
    value.value === '' ? (value.value = null) : value.value,
  )
  @Expose()
  nickname?: string;

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
