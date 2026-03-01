import { z } from 'zod';

export const usernameParamSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username must be at least 1 character')
    .max(30, 'Username too long'),
});

export type UsernameParamDto = z.infer<typeof usernameParamSchema>;
