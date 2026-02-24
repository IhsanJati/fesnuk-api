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

    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'object') {
      return response.status(status).json({
        success: false,
        ...exceptionResponse,
      });
    }

    const errorResponse = {
      success: false,
      message: exceptionResponse,
    };

    response.status(status).json(errorResponse);
  }
}
