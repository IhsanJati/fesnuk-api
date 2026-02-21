import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as
      | string
      | {
          message?: string | string[];
          error?: string;
          errors?: unknown;
        };

    let finalMessage: string | string[] = exception.message;
    let finalErrors: unknown = null;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      if (Array.isArray(exceptionResponse.message)) {
        finalMessage = 'Validation Failed';
        finalErrors = exceptionResponse.message;
      } else {
        finalMessage = exceptionResponse.message || exception.message;
        finalErrors = exceptionResponse.errors || null;
      }
    }

    const errorResponse = {
      statusCode: status,
      message: finalMessage,
      errors: finalErrors,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
