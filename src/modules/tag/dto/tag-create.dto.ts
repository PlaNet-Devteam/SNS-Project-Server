import { BaseDto } from 'src/core';
import { Tag } from '../tag.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { YN } from 'src/common';

export class TagCreateDto
  extends BaseDto<TagCreateDto>
  implements Partial<Tag>
{
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(60)
  @Expose()
  tagName: string;

  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN)
  @IsOptional()
  @Expose()
  searchYn?: YN = YN.Y;
}
