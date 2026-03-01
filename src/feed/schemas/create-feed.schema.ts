import { z } from 'zod';

export const createFeedSchema = z.object({
  caption: z
    .string('Caption must be string')
    .trim()
    .min(1, 'Caption must be at least 1 character')
    .max(2200, 'Caption is to long'),
});

export type CreateFeedDto = z.infer<typeof createFeedSchema>;
