import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('health-check')
@ApiTags('HEALTH CHECK')
export class HealthCheckController {
  /**
   * health check for AWS ec2 target group
   * @returns 200
   */
  @Get()
  public healthCheck(@Res() res: Response) {
    return res.status(HttpStatus.OK).json();
  }
}
