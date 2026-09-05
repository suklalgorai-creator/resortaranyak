import { z } from 'zod/v4';

export const createEnquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
