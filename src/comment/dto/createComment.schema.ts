import { z } from 'zod';

export const createCommentSchema = z.object({
  postId: z.number().int().positive(),
  content: z
    .string()
    .min(1, 'Content must be at least 1 charachter')
    .max(1000, 'Content is too long'),
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;
