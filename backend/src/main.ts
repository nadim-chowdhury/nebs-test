import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Catch low-level Node errors
  process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION', err);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('UNHANDLED PROMISE REJECTION', reason);
  });

  try {
    logger.log('Starting NestJS application...');

    const app = await NestFactory.create(AppModule, {
      bufferLogs: true, // ensures logs before logger init are not lost
    });

    app.enableShutdownHooks(); // important for Prisma

    logger.log('Nest application created');

    // CORS
    app.enableCors({
      origin: [
        process.env.FRONTEND_URL,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ].filter(Boolean),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    logger.log('CORS enabled');

    // Global prefix
    app.setGlobalPrefix('api');
    logger.log('Global prefix set: /api');

    // Validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    logger.log('ValidationPipe enabled');

    // Interceptor
    app.useGlobalInterceptors(new TransformInterceptor());
    logger.log('Global interceptor registered');

    // Exception filter
    app.useGlobalFilters(new HttpExceptionFilter());
    logger.log('Global exception filter registered');

    // Swagger
    const swaggerConfig = new DocumentBuilder()
      .setTitle('NEBS Test API')
      .setDescription('API documentation for NEBS Test backend')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
    logger.log('Swagger initialized at /api/docs');

    const port = process.env.PORT ?? 5000;
    await app.listen(port);

    logger.log(`Server running successfully on http://localhost:${port}`);
    logger.log(`Swagger available at http://localhost:${port}/api/docs`);
  } catch (error) {
    console.error('BOOTSTRAP FAILED');
    console.error(error instanceof Error ? error.stack : error);
    process.exit(1);
  }
}

bootstrap();
