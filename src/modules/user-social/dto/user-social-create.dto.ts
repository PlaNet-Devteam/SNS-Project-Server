import { BaseDto } from 'src/core';
import { UserSocial } from '../user-social.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { SOCIAL_TYPE } from 'src/common';

export class UserSocialCreateDto
  extends BaseDto<UserSocialCreateDto>
  implements Partial<UserSocial>
{
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({ enum: SOCIAL_TYPE })
  @IsEnum(SOCIAL_TYPE, { each: true })
  @IsNotEmpty()
  @Expose()
  socialType: SOCIAL_TYPE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  socialUniqueId?: string;
}
