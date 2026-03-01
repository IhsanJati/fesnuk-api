import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 character'),
});

export type SignInDto = z.infer<typeof signInSchema>;
