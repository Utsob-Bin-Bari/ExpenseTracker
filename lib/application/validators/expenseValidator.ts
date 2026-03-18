import { z } from 'zod';

export const ExpenseSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Enter a valid amount'),
  description: z.string().min(1, 'Description is required').max(100, 'Max 100 characters'),
  categoryId: z.string().min(1, 'Select a category'),
  date: z.string().min(1, 'Date is required'),
});

export type ExpenseFormDTO = z.infer<typeof ExpenseSchema>;
