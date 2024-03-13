import { BaseDto } from 'src/core';
import { User } from '../user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from 'src/common';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserDeleteDto
  extends BaseDto<UserDeleteDto>
  implements Partial<User>
{
  @ApiProperty()
  @IsPassword({}, '비밀번호')
  @IsNotEmpty()
  @Expose()
  password: string;
}
