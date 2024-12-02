import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { WinstonLoggerService } from './common/logger/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001', // Allowed origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Include cookies
  });

  // Enable Helmet middleware
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP if needed for development
      crossOriginEmbedderPolicy: true, // Enable specific policies
    }),
  );
  app.useLogger(app.get(WinstonLoggerService));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
