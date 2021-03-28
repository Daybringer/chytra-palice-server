import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('google')
  async googleAuth(@Body() { id_token }) {
    return this.authService.googleLogin(id_token);
  }
}
