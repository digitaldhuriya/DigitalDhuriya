import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000'];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.use(cookieParser(process.env.COOKIE_SECRET || 'digital-dhuriya-cookie-secret'));

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 600,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  const csrfProtection = csurf({
    cookie: {
      key: '_csrf',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  });

  app.use((req, res, next) => {
    if (req.path.startsWith('/api/health')) {
      return next();
    }

    return csrfProtection(req, res, next);
  });

  app.use((error: { code?: string }, req, res, next) => {
    if (error?.code === 'EBADCSRFTOKEN') {
      return res.status(403).json({ message: 'Invalid CSRF token' });
    }

    return next(error);
  });

  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT || 3001);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Digital Dhuriya API listening on ${port}`);
}

bootstrap();

