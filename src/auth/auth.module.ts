import { Module } from '@nestjs/common';
import * as dotnev from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { WinstonLoggerService } from 'src/common/logger/winston-logger.service';

dotnev.config();
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, WinstonLoggerService],
  exports: [AuthService],
})
export class AuthModule {}
