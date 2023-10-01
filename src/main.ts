import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.getOrThrow('URL_PREFIX'), {
    exclude: [''],
  });

  app.enableCors({
    origin: [configService.getOrThrow('CORS_ALLOW_ORIGIN')],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(configService.getOrThrow('PORT'));
};

bootstrap();
