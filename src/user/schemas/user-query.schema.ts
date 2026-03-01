import { z } from 'zod';

export const searchUserQuerySchema = z.object({
  username: z
    .string('Username must be a string')
    .trim()
    .min(1, 'Username cannot be empty')
    .max(50),
});

export type SearchUserQueryDto = z.infer<typeof searchUserQuerySchema>;
