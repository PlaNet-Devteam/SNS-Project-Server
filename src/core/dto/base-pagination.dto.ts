import { Expose, Type } from 'class-transformer';
import { BaseDto } from './base.dto';
import { IsNumber, Max, Min } from 'class-validator';

export class BasePaginationDto<T> extends BaseDto<T> {
  @Type(() => Number)
  @Min(1)
  @Expose()
  page: number = 1;

  @Type(() => Number)
  @Max(10)
  @Expose()
  limit: number = 10;
}
