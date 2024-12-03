import { Module } from '@nestjs/common';
import * as dotnev from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { WinstonLoggerService } from 'src/common/logger/winston-logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

dotnev.config();
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, WinstonLoggerService],
  exports: [AuthService],
})
export class AuthModule {}
