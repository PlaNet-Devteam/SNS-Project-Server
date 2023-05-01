import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import Debug from 'debug';
import { basename } from 'path';

Debug(`app:${basename(__dirname)}:${basename(__filename)}`);

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    return {
      secret: process.env.JWT_SECRET_KEY,
    };
  }
}
