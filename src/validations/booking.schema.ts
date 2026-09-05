import { z } from 'zod/v4';

export const createBookingSchema = z.object({
  roomId: z.string().min(1, 'Room is required'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.number().int().min(1, 'At least 1 guest required'),
  customer: z.object({
    fullName: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email required'),
    phone: z.string().min(10, 'Valid phone number required'),
    specialRequests: z.string().optional(),
  }),
});

export const checkAvailabilitySchema = z.object({
  roomId: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
