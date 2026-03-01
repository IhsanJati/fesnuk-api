import { z } from 'zod';

export const usernameParamSchema = z.object({
  username: z
    .string('Username must be a string')
    .trim()
    .min(1, 'Username cannot be empty')
    .max(30, 'Username too long'),
});

export type UsernameParamDto = z.infer<typeof usernameParamSchema>;
