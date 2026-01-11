import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { of } from "rxjs";
import { UserResponseDto } from "@app/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            getUsers: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("register", () => {
    it("should register a user", (done) => {
      const dto = { email: "test@test.com", password: "pwd", name: "name" };
      const result = { id: "1", ...dto };
      jest.spyOn(authService, "register").mockReturnValue(of(result));

      controller.register(dto).subscribe((res) => {
        expect(res).toBeInstanceOf(UserResponseDto);
        expect(res.email).toBe(dto.email);
        done();
      });
    });
  });

  describe("login", () => {
    it("should login a user", (done) => {
      const dto = { email: "test@test.com", password: "pwd" };
      const token = { access_token: "jwt_token" };
      jest.spyOn(authService, "login").mockReturnValue(of(token));

      controller.login(dto).subscribe((res) => {
        expect(res).toBe(token);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(authService.login).toHaveBeenCalledWith(dto);
        done();
      });
    });
  });
});
