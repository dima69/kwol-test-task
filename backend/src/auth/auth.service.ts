import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  checkEmail(email: string) {
    // TODO: check if email exists in DB
  }
}
