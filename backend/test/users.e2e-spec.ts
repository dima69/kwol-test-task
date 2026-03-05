import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { UsersModule } from '../src/users/users.module';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
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

  it('GET /users - should return empty array', () => {
    // prettier-ignore
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([]);
  });

  it('GET /users - should return list of users', async () => {
    await prisma.user.create({
      data: { email: 'emma@test.com', name: 'emma', password: 'password' },
    });
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0].email).toBeDefined();
        expect(res.body[0].name).toBeDefined();
        expect(res.body[0].password).toBeUndefined();
      });
  });

  it('DELETE /users/:id - should delete user and return 200', async () => {
    const user = await prisma.user.create({
      data: { email: 'delete@test.com', name: 'emma', password: 'password' },
    });

    return request(app.getHttpServer()).delete(`/users/${user.id}`).expect(200);
  });
});
