import { z } from 'zod/v4';

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().trim().min(1).max(100),
  razorpay_payment_id: z.string().trim().min(1).max(100),
  razorpay_signature: z.string().trim().length(64).regex(/^[a-f0-9]+$/i),
  checkoutToken: z.string().min(32).max(128),
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
