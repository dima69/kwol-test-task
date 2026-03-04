import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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

});
