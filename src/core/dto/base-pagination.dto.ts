import { Expose, Type } from 'class-transformer';
import { BaseDto } from './base.dto';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ORDER_BY_VALUE } from 'src/common';

export class BasePaginationDto<T> extends BaseDto<T> {
  @Type(() => Number)
  @Min(1)
  @Expose()
  page: number = 1;

  @Type(() => Number)
  @Max(10)
  @Expose()
  limit: number = 10;

  @IsOptional()
  @IsEnum(ORDER_BY_VALUE, { each: true })
  @Expose()
  orderBy?: ORDER_BY_VALUE;
}
