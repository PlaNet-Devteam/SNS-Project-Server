import { Expose, Transform, Type } from 'class-transformer';
import { BaseDto } from './base.dto';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ORDER_BY_VALUE } from 'src/common';
import { Default } from 'src/common/decorator/default.decorator';

export class BasePaginationDto<T> extends BaseDto<T> {
  @Type(() => Number)
  @Min(1)
  @Default(1)
  @Expose()
  page: number;

  @Type(() => Number)
  @Max(10)
  @Default(10)
  @Expose()
  limit: number;

  @IsOptional()
  @IsEnum(ORDER_BY_VALUE, { each: true })
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderBy?: ORDER_BY_VALUE;

  @IsOptional()
  @Expose()
  viewerId?: number;
}
