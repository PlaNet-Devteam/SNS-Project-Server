import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, FEED_STATUS, YN } from 'src/common';

export class FeedUpdateStatusDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(YN, { each: true })
  @Default(YN.Y)
  @Expose()
  showLikeCountYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(YN, { each: true })
  @Expose()
  displayYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(FEED_STATUS, { each: true })
  @Expose()
  status?: FEED_STATUS;
}
