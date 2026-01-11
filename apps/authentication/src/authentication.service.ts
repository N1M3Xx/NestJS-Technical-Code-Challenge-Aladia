import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "./users/users.service";
import { UserDocument } from "./users/schemas/user.schema";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserDocument | null> {
    return this.usersService.validateUser(email, pass);
  }

  login(user: UserDocument) {
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
