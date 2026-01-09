import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthenticationModule } from './authentication.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule);
  const configService = app.get(ConfigService);
  const host = configService.get<string>('AUTH_HOST') ?? '0.0.0.0';
  const port = configService.get<number>('AUTH_PORT') ?? 3001;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: host,
      port: port,
    },
  });

  await app.startAllMicroservices();
  Logger.log(`Authentication microservice is listening on port ${port}`);
}
bootstrap();
