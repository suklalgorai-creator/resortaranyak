import { z } from 'zod/v4';

export const createEnquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).regex(/^[+()\-\s\d]*$/).optional(),
  message: z.string().trim().min(10).max(3000),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
