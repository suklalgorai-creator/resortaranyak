import { prisma } from '@/lib/db';
import { BOOKING_STATUS } from '@/lib/constants';
import { NotFoundError, ConflictError } from '@/lib/errors';

async function checkAvailability(roomId: string, checkIn: Date, checkOut: Date) {
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    throw new NotFoundError('Room not found');
  }

  const overlappingBookings = await prisma.booking.count({
    where: {
      roomId,
      status: { in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PAYMENT_PENDING, BOOKING_STATUS.PENDING] },
      AND: [
        { checkIn: { lt: checkOut } },
        { checkOut: { gt: checkIn } }
      ]
    }
  });

  const totalUnits = room.inventoryCount;
  const bookedUnits = overlappingBookings;
  const remainingUnits = totalUnits - bookedUnits;

  return {
    available: remainingUnits > 0,
    totalUnits,
    bookedUnits,
    remainingUnits
  };
}

async function create(data: { roomId: string; checkIn: Date; checkOut: Date; guests: number; guestName: string; guestEmail: string; guestPhone: string; specialRequests?: string }) {
  // Use transaction to prevent race conditions (overbooking)
  return await prisma.$transaction(async (tx) => {
    // Check availability inside transaction
    const room = await tx.room.findUnique({ where: { id: data.roomId } });
    if (!room) throw new NotFoundError('Room not found');

    const overlappingBookings = await tx.booking.count({
      where: {
        roomId: data.roomId,
        status: { in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PAYMENT_PENDING, BOOKING_STATUS.PENDING] },
        AND: [
          { checkIn: { lt: data.checkOut } },
          { checkOut: { gt: data.checkIn } }
        ]
      }
    });

    if (overlappingBookings >= room.inventoryCount) {
      throw new ConflictError('Room is sold out for these dates');
    }

    // Calculate nights — ensure minimum 1 night and positive
    const diffMs = data.checkOut.getTime() - data.checkIn.getTime();
    const nights = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const totalAmount = nights * room.pricePerNight;

    return await tx.booking.create({
      data: {
        roomId: data.roomId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        specialRequests: data.specialRequests,
        status: BOOKING_STATUS.PENDING,
        nights,
        totalAmount
      }
    });
  });
}

async function getById(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { room: true, payment: true }
  });
  if (!booking) throw new NotFoundError('Booking not found');
  return booking;
}

async function getAll(filters?: { status?: string, page?: number, pageSize?: number }) {
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  
  const where = filters?.status ? { status: filters.status } : {};
  
  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { room: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.booking.count({ where })
  ]);
  
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

async function updateStatus(id: string, status: string) {
  return await prisma.booking.update({
    where: { id },
    data: { status }
  });
}

export const bookingService = { checkAvailability, create, getById, getAll, updateStatus };
