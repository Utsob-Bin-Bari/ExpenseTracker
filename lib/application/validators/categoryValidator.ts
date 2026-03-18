import { z } from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(30, 'Max 30 characters'),
  color: z.string().min(1, 'Pick a color'),
  icon: z.string().min(1, 'Pick an icon'),
  budget: z
    .string()
    .min(1, 'Budget is required')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Enter a valid budget'),
});

export type CategoryFormDTO = z.infer<typeof CategorySchema>;
