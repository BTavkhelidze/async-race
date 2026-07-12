import { z } from 'zod';

export const DEFAULT_UPDATE_CAR_COLOR = '#ffffff';

export const updateCarSchema = z.object({
  name: z.string().trim().min(1, 'Car name is required'),
  color: z
    .string()
    .regex(/^#[\da-f]{6}$/i, 'Choose a valid car color'),
});
