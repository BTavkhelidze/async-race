import { z } from 'zod';

export const DEFAULT_CAR_COLOR = '#ffffff';

export const carFormSchema = z.object({
  name: z.string().trim().min(1, 'Car name is required'),
  color: z.string().min(1, 'Car color is required'),
});

export type CarFormValues = z.infer<typeof carFormSchema>;
