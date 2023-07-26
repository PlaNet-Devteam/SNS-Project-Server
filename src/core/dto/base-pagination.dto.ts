import { Expose, Type } from 'class-transformer';
import { BaseDto } from './base.dto';
import { Max, Min } from 'class-validator';

export class BasePaginationDto {
  @Type(() => Number)
  @Min(1)
  @Expose()
  page: number = 1;

  @Type(() => Number)
  @Max(10)
  @Expose()
  limit: number = 10;
}
