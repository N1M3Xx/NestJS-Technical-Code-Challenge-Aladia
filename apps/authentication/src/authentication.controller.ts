import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LoginDto, LoggerService } from '@app/common';
import { AuthenticationService } from './authentication.service';

@Controller()
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly logger: LoggerService,
  ) {}

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: LoginDto) {
    this.logger.log(`Logging in user ${data.email}`);
    const user = await this.authenticationService.validateUser(
      data.email,
      data.password,
    );
    if (!user) {
      throw new RpcException('Invalid credentials');
    }
    return this.authenticationService.login(user);
  }
}
