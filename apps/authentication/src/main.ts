import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AuthenticationModule } from "./authentication.module";
import { ConfigService } from "@nestjs/config";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule);
  const configService = app.get(ConfigService);
  const host = configService.getOrThrow<string>("AUTH_HOST");
  const port = configService.getOrThrow<number>("AUTH_PORT");

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: host,
      port: port,
    },
  });

  await app.startAllMicroservices();
  Logger.log(`Authentication microservice is listening on ${host}:${port}`);
}
bootstrap().catch((err) => {
  Logger.error(err);
});
