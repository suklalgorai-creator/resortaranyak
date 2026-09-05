import { z } from 'zod/v4';

export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  pricePerNight: z.number().positive('Price must be positive'),
  maxGuests: z.number().int().min(1).max(20),
  roomSize: z.string().optional(),
  bedType: z.string().min(1, 'Bed type is required'),
  status: z.enum(['AVAILABLE', 'MAINTENANCE', 'DEACTIVATED']).default('AVAILABLE'),
});

export const updateRoomSchema = createRoomSchema.partial();

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
