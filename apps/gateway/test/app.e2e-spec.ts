import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { GatewayModule } from './../src/gateway.module';
import { NetworkingService } from '@app/common';
import { of } from 'rxjs';

describe('GatewayController (e2e)', () => {
  let app: INestApplication;
  const networkingService = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GatewayModule],
    })
      .overrideProvider(NetworkingService)
      .useValue(networkingService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('/auth/register (POST)', () => {
    networkingService.send.mockReturnValue(of({ _id: '1', email: 'test@test.com', name: 'Test' }));
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@test.com', password: 'password123', name: 'Test' })
      .expect(201)
      .expect((res) => {
        expect(res.body.email).toEqual('test@test.com');
      });
  });

  it('/auth/login (POST)', () => {
    networkingService.send.mockReturnValue(of({ access_token: 'jwt_token' }));
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'password123' })
      .expect(201)
      .expect({ access_token: 'jwt_token' });
  });
});
