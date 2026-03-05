import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
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

  it('POST /auth/check-email - should return 409 if email is already taken', async () => {
    await prisma.user.create({ data: { email: 'taken@test.com' } });
    return request(app.getHttpServer())
      .post('/auth/check-email')
      .send({ email: 'taken@test.com' })
      .expect(409);
  });

  it('POST /auth/register - should return 201 and create user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'emma@test.com',
        name: 'emma',
        password: 'password',
      })
      .expect(201);
  });

  it('POST /auth/register - should return 400 if no body provided', () => {
    // prettier-ignore
    return request(app.getHttpServer())
      .post('/auth/register')
      .expect(400);
  });

  it('POST /auth/register - should return 400 if name is empty', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@test.com', name: '', password: 'password' })
      .expect(400);
  });

  it('POST /auth/register - should return 400 if password is empty', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@test.com', name: '', password: 'password' })
      .expect(400);
  });

  it('POST /auth/register - should return 400 if password is too short', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@test.com', name: 'emma', password: 'p' })
      .expect(400);
  });

  it('POST /auth/register - should return 409 if email already taken', async () => {
    await prisma.user.create({ data: { email: 'taken@test.com' } });
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'taken@test.com', name: 'emma', password: 'password' })
      .expect(409);
  });

  it('POST /auth/register - should not return password in response', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'newuser@test.com',
        name: 'emma',
        password: 'PasswordAbc',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.password).toBeUndefined();
      });
  });
});
