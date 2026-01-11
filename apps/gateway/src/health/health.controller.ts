import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
} from "@nestjs/terminus";
import { Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.microservice.pingCheck("authentication", {
          transport: Transport.TCP,
          options: {
            host: this.configService.get<string>("AUTH_HOST"),
            port: this.configService.get<number>("AUTH_PORT"),
          },
        }),
    ]);
  }
}
