import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckEmailDto } from './dto/check-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check-email')
  @HttpCode(204)
  checkEmail(@Body() dto: CheckEmailDto) {
    this.authService.checkEmail(dto.email);
  }
}
