import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { LoggerService } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { UserDocument } from './users/schemas/user.schema';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    authService = module.get<AuthenticationService>(AuthenticationService);
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user = { _id: '1', email: 'test@example.com' };
      const token = { access_token: 'jwt_token' };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user as unknown as UserDocument);
      jest.spyOn(authService, 'login').mockResolvedValue(token);

      expect(await controller.login(loginDto)).toBe(token);
    });

    it('should throw RpcException for invalid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrong_password' };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(RpcException);
    });
  });
});
