import { z } from 'zod/v4';

export const MAX_GUESTS = 20;
export const MAX_STAY_NIGHTS = 30;
export const MAX_BOOKING_HORIZON_DAYS = 365;

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD dates');
const roomId = z.string().min(20).max(32).regex(/^[a-z0-9]+$/i, 'Invalid room');

export const createBookingSchema = z.object({
  roomId,
  checkIn: dateOnly,
  checkOut: dateOnly,
  guests: z.number().int().min(1).max(MAX_GUESTS),
  guestName: z.string().trim().min(2).max(100),
  guestEmail: z.string().trim().email().max(254),
  guestPhone: z.string().trim().min(10).max(30).regex(/^[+()\-\s\d]+$/, 'Invalid phone number'),
  arrivalTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use a valid arrival time').optional(),
  specialRequests: z.string().trim().max(1000).optional(),
}).refine((data) => data.checkOut > data.checkIn, {
  message: 'Check-out must be after check-in',
  path: ['checkOut'],
});

export const checkAvailabilitySchema = z.object({
  roomId,
  checkIn: dateOnly,
  checkOut: dateOnly,
}).refine((data) => data.checkOut > data.checkIn, {
  message: 'Check-out must be after check-in',
  path: ['checkOut'],
});

export const checkoutTokenSchema = z.object({
  checkoutToken: z.string().min(32).max(128),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
