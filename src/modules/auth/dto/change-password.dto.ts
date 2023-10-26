import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { IsEqualTo, IsPassword } from 'src/common';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPassword()
  @Expose()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPassword()
  @Expose()
  newPassword: string;

  @ApiProperty()
  @ApiProperty()
  @IsPassword()
  @IsEqualTo('newPassword')
  @Expose()
  newPasswordConfirm: string;
}
