import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';
import request from 'supertest';
import { App } from 'supertest/types';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('POST /auth/check-email - should return 204 if email is valid', () => {
    return request(app.getHttpServer())
      .post('/auth/check-email')
      .send({ email: 'test@test.com' })
      .expect(204);
  });

  it('POST /auth/check-email - should return 400 if email is invalid', () => {
    return request(app.getHttpServer())
      .post('/auth/check-email')
      .send({ email: 'invalidemail' })
      .expect(400);
  });

  it('POST /auth/check-email - should return 400 if no params provided', () => {
    // prettier-ignore
    return request(app.getHttpServer())
      .post('/auth/check-email')
      .expect(400);
  });
});
