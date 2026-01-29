import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('test')
export class TestController {
  @Get()
  getHello() {
    return { message: 'Hello World - Public' };
  }

  @Get('protected')
  @UseGuards(AuthGuard) 
  getProtected() {
    return { message: 'Protected route - Auth0 working!' };
  }
}