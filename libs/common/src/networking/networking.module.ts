import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { AUTH_SERVICE } from "../constants";
import { NetworkingService } from "./networking.service";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>("AUTH_HOST"),
            port: configService.get<number>("AUTH_PORT"),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [NetworkingService],
  exports: [NetworkingService],
})
export class NetworkingModule {}
