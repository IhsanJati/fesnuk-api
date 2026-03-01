import { z } from 'zod';

export const editUserSchema = z.object({
  fullname: z
    .string('Fullname must be string')
    .min(6, 'Fullname must be at least 6 character'),
  username: z
    .string('Username must be string')
    .min(6, 'Username must be at least 6 character'),
  bio: z
    .string('Biodata must be string')
    .min(10, 'Biodata must be at least 10 character'),
});

export type EditUserDto = z.infer<typeof editUserSchema>;
