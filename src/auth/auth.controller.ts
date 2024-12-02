import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WinstonLoggerService } from 'src/common/logger/winston-logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly logger: WinstonLoggerService,
  ) {}
  @Post('signup')
  async signUp(@Body() body: any) {
    this.logger.info('Received POST request for SignUp');
    const { email, name, password } = body;
    console.log(email, name, password);
    return this.authService.signUp(email, name, password);
  }
  @Post('signin')
  async signIn(@Body() body: any) {
    this.logger.info('Received POST request for SignIn');
    const { email, password } = body;
    return this.authService.signIn(email, password);
  }
}
