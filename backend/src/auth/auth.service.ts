import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async checkEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) throw new ConflictException('Email already registered');
  }
}
