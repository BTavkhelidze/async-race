import type { z } from 'zod';
import type { updateCarSchema } from './update-car.schema';

export type UpdateCarFormValues = z.infer<typeof updateCarSchema>;
