import { z } from 'zod';

export const registerUserSchema = z.object({
  fullname: z.string().min(6, 'Fullname must be at least 6 character'),
  username: z.string().min(6, 'Username must be at least 6 character'),
  email: z.email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 8 character'),
});

export type CreateUserRequest = z.infer<typeof registerUserSchema>;
