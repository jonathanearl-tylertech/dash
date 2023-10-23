import { z } from 'zod';

export const AppSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3),
  description: z.string().optional(),
  url: z.string().url().optional(),
  icon: z.string().url().optional(),
  health: z.string().url().optional(),
});

export type App = z.infer<typeof AppSchema>;
