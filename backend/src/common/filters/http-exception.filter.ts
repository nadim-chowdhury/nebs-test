import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const error =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).error ||
          (exceptionResponse as any).message;

    // Log the error if it's an internal server error
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('Internal Server Error:', exception);
      if (exception instanceof Error) {
        console.error(exception.stack);
      }
    }

    response.status(status).json({
      success: false,
      message:
        typeof exceptionResponse === 'object' &&
        (exceptionResponse as any).message
          ? (exceptionResponse as any).message
          : error,
      error: error,
      statusCode: status,
      timestamp: new Date().toISOString(),
    });
  }
}
