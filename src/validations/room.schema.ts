import { z } from 'zod/v4';

export const createRoomSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(10).max(5000),
  pricePerNight: z.number().int().positive().max(1_000_000),
  maxGuests: z.number().int().min(1).max(20),
  roomSize: z.string().trim().max(50).optional(),
  bedType: z.string().trim().min(1).max(50),
  inventoryCount: z.number().int().min(1).max(100).default(1),
  images: z.array(z.string().max(500)).max(20).default([]),
  amenities: z.array(z.string().trim().max(100)).max(50).default([]),
  status: z.enum(['AVAILABLE', 'MAINTENANCE', 'DEACTIVATED']).default('AVAILABLE'),
});

export const updateRoomSchema = createRoomSchema.partial();

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
