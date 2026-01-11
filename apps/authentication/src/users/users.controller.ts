import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UsersService } from "./users.service";
import { CreateUserDto, UserResponseDto } from "@app/common";
import { plainToInstance } from "class-transformer";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: "create_user" })
  async create(@Payload() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const userObj = user.toObject ? user.toObject() : user;
    return plainToInstance(UserResponseDto, userObj, {
      excludeExtraneousValues: true,
    });
  }

  @MessagePattern({ cmd: "find_all_users" })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => {
      const userObj = user.toObject ? user.toObject() : user;
      return plainToInstance(UserResponseDto, userObj, {
        excludeExtraneousValues: true,
      });
    });
  }
}
