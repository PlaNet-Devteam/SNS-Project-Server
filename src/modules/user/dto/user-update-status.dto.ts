import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { USER_STATUS } from 'src/common';

export class UserUpdateStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(USER_STATUS)
  @Expose()
  status: USER_STATUS;
}
