import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { UsersRepository } from "./users.repository";
import { LoggerService } from "@app/common";
import * as bcrypt from "bcrypt";

jest.mock("bcrypt");

describe("UsersService", () => {
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  describe("create", () => {
    it("should hash password and create user", async () => {
      const createUserDto = {
        email: "test@test.com",
        password: "password",
        name: "Test",
      };
      const savedUser = { ...createUserDto, password: "hashed_password" };

      (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
      (repository.create as jest.Mock).mockResolvedValue(savedUser);

      await service.create(createUserDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: createUserDto.email,
          name: createUserDto.name,
          password: "hashed_password",
        }),
      );
    });
  });

  describe("validateUser", () => {
    it("should return user if password matches", async () => {
      const user = { email: "test@test.com", password: "hashed_password" };
      (repository.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser("test@test.com", "password");
      expect(result).toBe(user);
    });

    it("should return null if password does not match", async () => {
      const user = { email: "test@test.com", password: "hashed_password" };
      (repository.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        "test@test.com",
        "wrong_password",
      );
      expect(result).toBeNull();
    });
  });
});
