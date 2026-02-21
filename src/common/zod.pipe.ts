import {
  Injectable,
  ArgumentMetadata,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { flattenError, ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}
  transform<T>(value: T, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    const parseResult = this.schema.safeParse(value);

    if (!parseResult.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: flattenError(parseResult.error),
      });
    }

    return parseResult.data;
  }
}
