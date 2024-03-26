import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { IsEqualTo, IsPassword } from 'src/common';
import * as errors from '../../../locales/kr/errors.json';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPassword({}, '비밀번호')
  @Expose()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPassword({}, '새 비밀번호')
  @Expose()
  newPassword: string;

  @ApiProperty()
  @IsPassword({}, '새 비밀번호 확인')
  @IsEqualTo('newPassword', {
    message: errors.auth.invalidPassword,
  })
  @Expose()
  newPasswordConfirm: string;
}
