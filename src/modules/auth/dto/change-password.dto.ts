import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { IsEqualTo, IsPassword } from 'src/common';

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
    message: '비밀번호가 일치하지 않습니다',
  })
  @Expose()
  newPasswordConfirm: string;
}
