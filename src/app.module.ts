import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import * as Joi from 'joi'; // For environment variable validation

@Module({
  imports: [
    // ConfigModule for environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available across the entire app
      envFilePath: '.env', // Path to the .env file
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().required(), // Validation for DATABASE_URL
      }),
    }),

    // MongooseModule with ConfigService to dynamically load the database URL
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'), // Fetch DATABASE_URL from environment variables
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HelmetMiddleware).forRoutes('*'); // Apply Helmet middleware to all routes
  }
}
