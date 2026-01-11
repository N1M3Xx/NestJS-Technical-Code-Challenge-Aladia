import { Test, TestingModule } from "@nestjs/testing";
import { INestMicroservice, ValidationPipe } from "@nestjs/common";
import { Transport, ClientsModule, ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { AuthenticationModule } from "./../src/authentication.module";
import { CreateUserDto, LoginDto, UserResponseDto } from "@app/common";

describe("AuthenticationModule (e2e)", () => {
  let app: INestMicroservice;
  let client: ClientProxy;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthenticationModule,
        ClientsModule.register([
          {
            name: "AUTH_CLIENT",
            transport: Transport.TCP,
            options: {
              host: "0.0.0.0",
              port: 3002,
            },
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: {
        host: "0.0.0.0",
        port: 3002,
      },
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.listen();

    client = app.get("AUTH_CLIENT");
    await client.connect();
  });

  afterAll(async () => {
    await app.close();
    if (client) {
      client.close();
    }
  });

  it("should create a user and login", async () => {
    const email = `test-${Date.now()}@example.com`;
    const password = "password123";
    const name = "Test User";
    const createUserDto: CreateUserDto = { email, password, name };

    const user = await firstValueFrom(
      client.send<UserResponseDto>({ cmd: "create_user" }, createUserDto),
    );
    expect(user).toBeDefined();
    expect(user?.email).toBe(email);

    const loginDto: LoginDto = { email, password };
    const token = await firstValueFrom(
      client.send<{ access_token: string }>({ cmd: "login" }, loginDto),
    );
    expect(token).toBeDefined();
    expect(token?.access_token).toBeDefined();
  });
});
