import { z } from 'zod/v4';

export const createBookingSchema = z.object({
  roomId: z.string().min(1, 'Room is required'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.number().int().min(1, 'At least 1 guest required'),
  guestName: z.string().min(1, 'Name is required'),
  guestEmail: z.string().email('Valid email required'),
  guestPhone: z.string().min(10, 'Valid phone number required'),
  specialRequests: z.string().optional(),
}).refine(
  (data) => new Date(data.checkOut) > new Date(data.checkIn),
  { message: 'Check-out must be after check-in' }
);

export const checkAvailabilitySchema = z.object({
  roomId: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
