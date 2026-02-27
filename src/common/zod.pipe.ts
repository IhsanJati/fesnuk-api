import {
  Injectable,
  ArgumentMetadata,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}
  transform<T>(value: T, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    const parseResult = this.schema.safeParse(value);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.issues.map((err) => ({
        field: err.path.join('.') || 'unknown',
        error: err.message,
      }));

      throw new BadRequestException({
        success: false,
        message: 'Validation failed',
        error: {
          code: 'VALIDATION_ERROR',
          detail: formattedErrors,
        },
      });
    }

    return parseResult.data;
  }
}
