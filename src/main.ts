import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONST_STYLE } from './assets/_index';
import { NestExpressApplication } from '@nestjs/platform-express';
import { urlencoded, json } from 'body-parser';
import * as compression from 'compression';
import * as packageInfo from '../package.json';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, ApiOAuth2 } from '@nestjs/swagger';
import helmet from 'helmet';
import { ENVIRONMENT, dataSource } from './config';
import * as cookieParser from 'cookie-parser';
import { ClassTransformOptions } from 'class-transformer';

// const debug = Debug(`app:${basename(__dirname)}:${basename(__filename)}`);

let app: NestExpressApplication;
declare const module: any;

async function bootstrap() {
  app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // TODO
    // bufferLogs: true,
  });

  app.use(urlencoded({ extended: true }));
  app.use(json({ limit: '50mb' }));
  app.disable('x-powered-by');
  app.setViewEngine('hbs');
  app.use(compression());
  app.use(helmet()); // https://helmetjs.github.io/

  app.set('trust proxy', process.env.NODE_ENV !== ENVIRONMENT.DEVELOPMENT);

  // console log environment if not in production
  if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION)
    console.log('process - env ', process.env.NODE_ENV);

  // CORS 설장
  app.enableCors({
    origin: 'http://localhost:4200', // CORS variables, 배열로 지정하는게 맞음. 그리고 이 부분도 나중에 따로 뺄 수 있음
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
    const options = new DocumentBuilder()
      .setTitle(packageInfo.name.toUpperCase())
      .setDescription(
        `${packageInfo.description} - Running in: ${process.env.NODE_ENV} environment`,
      )
      .setVersion(packageInfo.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document, {
      customCss: CONST_STYLE,
    });
  }

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      skipUndefinedProperties: true,
      skipMissingProperties: true,
      skipNullProperties: true,
      validationError: { target: false, value: false }, // object 와 value 역전송 막기
      transform: true,
      transformOptions: {
        excludeExtraneousValues: true,
      } as ClassTransformOptions,
    }),
  );

  app.enableShutdownHooks();
  await app.listen(process.env.SERVER_PORT || 4300, '0.0.0.0');

  // display server url
  const url = await app.getUrl();
  if (process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT)
    Logger.warn('IN DEV MODE', 'ENV');
  Logger.log(`${url}`, 'INSTA_CLONE');
  Logger.log(`${url}/swagger`, 'INSTA_CLONE');

  // HMR: Hot Reload (Webpack)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

process.stdin.resume();

async function shutdown() {
  if (app) {
    // app.useLogger()
    Logger.log('EXITING APP', 'SHUTDOWN');
    // shutdown
    // graceful shutdown
    await dataSource.destroy();
    process.exit();
  }
}

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});

// catch ctrl+c event and exit normally
process.on('SIGINT', () => {
  console.log('SIGINT signal received.');
  shutdown();
});

// catch console is closing on windows
process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
  shutdown();
});

// catch "kill pid"
process.on('SIGUSR1', () => {
  console.log('Got SIGUSR1 signal.');
  shutdown();
});
process.on('SIGUSR2', () => {
  console.log('Got SIGUSR2 signal.');
  shutdown();
});

bootstrap();
