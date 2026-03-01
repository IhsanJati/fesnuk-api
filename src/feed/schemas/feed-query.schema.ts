import { z } from 'zod';

export const feedQuerySchema = z.object({
  page: z.coerce.number().int().positive(),
  limit: z.coerce.number().int().positive().max(50),
});

export type FeedQueryDto = z.infer<typeof feedQuerySchema>;
