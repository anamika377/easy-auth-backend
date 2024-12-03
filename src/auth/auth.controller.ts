import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WinstonLoggerService } from 'src/common/logger/winston-logger.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly logger: WinstonLoggerService,
  ) {}
  @Post('signup')
  async signUp(@Body() input: SignUpDto) {
    this.logger.info('Received POST request for SignUp');
    return this.authService.signUp(input);
  }
  @Post('signin')
  async signIn(@Body() body: LoginDto) {
    this.logger.info('Received POST request for SignIn');
    const { email, password } = body;
    return this.authService.signIn(email, password);
  }
}
