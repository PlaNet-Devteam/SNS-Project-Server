import { Expose, Type } from 'class-transformer';
import { BaseDto } from './base.dto';
import { Max, Min } from 'class-validator';

export class BasePaginationDto<T> extends BaseDto<T> {
  @Type(() => Number)
  @Min(1)
  @Expose()
  skip: number;

  @Type(() => Number)
  @Max(100)
  @Expose()
  take: number;
}
