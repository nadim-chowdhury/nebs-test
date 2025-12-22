import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  console.log('Bootstrap starting...');
  try {
    const app = await NestFactory.create(AppModule);
    console.log('NestFactory created app');

    // Enable CORS with specific options
    app.enableCors({
      origin: ['http://localhost:3000'], // Add your frontend URLs here
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // Global prefix for all routes
    app.setGlobalPrefix('api');

    // Enable global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Global Response Interceptor
    app.useGlobalInterceptors(new TransformInterceptor());

    // Global Exception Filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Swagger Configuration
    const config = new DocumentBuilder()
      .setTitle('NEBS Test API')
      .setDescription('API documentation for NEBS Test backend')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    console.log('Calling app.listen...');
    await app.listen(process.env.PORT ?? 5000);
    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(`Swagger documentation: ${await app.getUrl()}/api/docs`);
  } catch (err) {
    console.error('Bootstrap failed:', err);
  }
}
bootstrap();
