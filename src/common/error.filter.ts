import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as {
      message?: string;
      errors?: unknown;
    };

    const errorResponse = {
      statusCode: status,
      message: exceptionResponse.message || exception.message,
      errors: exceptionResponse.errors || null,
    };

    response.status(status).json(errorResponse);
  }
}
