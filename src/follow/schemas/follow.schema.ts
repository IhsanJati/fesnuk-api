import { z } from 'zod';

export const followUserSchema = z.object({
  followUserId: z.coerce.number().int().positive(),
});

export type FollowUserDto = z.infer<typeof followUserSchema>;
