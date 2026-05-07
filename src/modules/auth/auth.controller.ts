import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  profile(@Req() req) {
    return req.user;
  }
}