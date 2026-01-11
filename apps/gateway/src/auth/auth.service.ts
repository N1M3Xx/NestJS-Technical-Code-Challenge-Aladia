import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import {
  CreateUserDto,
  LoginDto,
  NetworkingService,
  LoggerService,
  UserResponseDto,
} from "@app/common";

@Injectable()
export class AuthService {
  constructor(
    private readonly networkingService: NetworkingService,
    private readonly logger: LoggerService,
  ) {}

  register(createUserDto: CreateUserDto): Observable<Partial<UserResponseDto>> {
    this.logger.log("Sending create_user command to auth service");
    return this.networkingService.send<Partial<UserResponseDto>>(
      { cmd: "create_user" },
      createUserDto,
    );
  }

  login(loginDto: LoginDto) {
    this.logger.log("Sending login command to auth service");
    return this.networkingService.send<{ access_token: string }>(
      { cmd: "login" },
      loginDto,
    );
  }

  getUsers() {
    this.logger.log("Sending find_all_users command to auth service");
    return this.networkingService.send<Partial<UserResponseDto>[]>(
      { cmd: "find_all_users" },
      {},
    );
  }
}
