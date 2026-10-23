import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { BOOKING_STATUS, ROOM_STATUS } from '@/lib/constants';
import { ConflictError, NotFoundError, ValidationError } from '@/lib/errors';
import { calendarDaysBetween, hashOpaqueToken, hashRequest, parseDateOnly } from '@/lib/security';
import {
  MAX_BOOKING_HORIZON_DAYS,
  MAX_STAY_NIGHTS,
} from '@/validations/booking.schema';

const HOLD_MINUTES = Number(process.env.BOOKING_HOLD_MINUTES || 15);

async function serializable<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(callback, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034' && attempt < 2) continue;
      throw error;
    }
  }
  throw new ConflictError('Booking could not be reserved concurrently');
}

function startOfTodayUtc(): Date {
  const today = new Date();
  return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
}

function validateBookingWindow(checkIn: Date, checkOut: Date): number {
  const today = startOfTodayUtc();
  const nights = calendarDaysBetween(checkIn, checkOut);
  const horizon = calendarDaysBetween(today, checkIn);

  if (checkIn < today) throw new ValidationError('Check-in cannot be in the past');
  if (nights < 1 || nights > MAX_STAY_NIGHTS) {
    throw new ValidationError(`Stay must be between 1 and ${MAX_STAY_NIGHTS} nights`);
  }
  if (horizon > MAX_BOOKING_HORIZON_DAYS) {
    throw new ValidationError('Check-in date is too far in the future');
  }
  return nights;
}

function activeBookingWhere(now: Date) {
  return {
    OR: [
      { status: BOOKING_STATUS.CONFIRMED },
      {
        status: { in: [BOOKING_STATUS.HOLD, BOOKING_STATUS.PAYMENT_PENDING] },
        expiresAt: { gt: now },
      },
    ],
  };
}

async function expireStaleBookings(tx: Prisma.TransactionClient, roomId?: string) {
  await tx.booking.updateMany({
    where: {
      ...(roomId ? { roomId } : {}),
      status: { in: [BOOKING_STATUS.HOLD, BOOKING_STATUS.PAYMENT_PENDING] },
      expiresAt: { lte: new Date() },
    },
    data: { status: BOOKING_STATUS.EXPIRED },
  });
}

async function expireExpiredBookings() {
  return prisma.booking.updateMany({
    where: {
      status: { in: [BOOKING_STATUS.HOLD, BOOKING_STATUS.PAYMENT_PENDING] },
      expiresAt: { lte: new Date() },
    },
    data: { status: BOOKING_STATUS.EXPIRED },
  });
}

function parseWindow(checkIn: string, checkOut: string) {
  try {
    return { checkIn: parseDateOnly(checkIn), checkOut: parseDateOnly(checkOut) };
  } catch {
    throw new ValidationError('Invalid calendar date');
  }
}

async function checkAvailability(roomId: string, checkIn: Date, checkOut: Date) {
  const nights = validateBookingWindow(checkIn, checkOut);
  const now = new Date();
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) throw new NotFoundError('Room not found');

  const overlappingBookings = await prisma.booking.count({
    where: {
      roomId,
      ...activeBookingWhere(now),
      AND: [
        { checkIn: { lt: checkOut } },
        { checkOut: { gt: checkIn } },
      ],
    },
  });

  const remainingUnits = room.inventoryCount - overlappingBookings;
  return {
    available: room.status === ROOM_STATUS.AVAILABLE && remainingUnits > 0,
    roomStatus: room.status,
    nights,
    totalUnits: room.inventoryCount,
    bookedUnits: overlappingBookings,
    remainingUnits: Math.max(0, remainingUnits),
  };
}

async function create(data: {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  idempotencyKey: string;
}) {
  const { checkIn, checkOut } = parseWindow(data.checkIn, data.checkOut);
  const nights = validateBookingWindow(checkIn, checkOut);
  const idempotencyKeyHash = hashOpaqueToken(data.idempotencyKey);
  const requestFingerprint = hashRequest({
    roomId: data.roomId,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    guests: data.guests,
    guestName: data.guestName,
    guestEmail: data.guestEmail.toLowerCase(),
    guestPhone: data.guestPhone,
    specialRequests: data.specialRequests || '',
  });

  return serializable(async (tx) => {
    const existing = await tx.booking.findUnique({ where: { idempotencyKeyHash } });
    if (existing) {
      if (existing.requestFingerprint !== requestFingerprint) {
        throw new ConflictError('Idempotency key was already used for another booking');
      }
      return { booking: existing, reused: true };
    }

    const lockedRoom = await tx.$queryRaw<Array<{ id: string }>>(
      Prisma.sql`SELECT "id" FROM "Room" WHERE "id" = ${data.roomId} FOR UPDATE`,
    );
    if (lockedRoom.length === 0) throw new NotFoundError('Room not found');

    await expireStaleBookings(tx, data.roomId);
    const room = await tx.room.findUnique({ where: { id: data.roomId } });
    if (!room) throw new NotFoundError('Room not found');
    if (room.status !== ROOM_STATUS.AVAILABLE) {
      throw new ConflictError('Room is not available for booking');
    }
    if (data.guests > room.maxGuests) {
      throw new ValidationError(`This room allows a maximum of ${room.maxGuests} guests`);
    }

    const overlappingBookings = await tx.booking.count({
      where: {
        roomId: data.roomId,
        ...activeBookingWhere(new Date()),
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } },
        ],
      },
    });

    if (overlappingBookings >= room.inventoryCount) {
      throw new ConflictError('Room is sold out for these dates');
    }

    const booking = await tx.booking.create({
      data: {
        roomId: data.roomId,
        checkIn,
        checkOut,
        guests: data.guests,
        guestName: data.guestName,
        guestEmail: data.guestEmail.toLowerCase(),
        guestPhone: data.guestPhone,
        specialRequests: data.specialRequests,
        status: BOOKING_STATUS.HOLD,
        nights,
        totalAmount: nights * room.pricePerNight,
        expiresAt: new Date(Date.now() + HOLD_MINUTES * 60_000),
        accessTokenHash: idempotencyKeyHash,
        idempotencyKeyHash,
        requestFingerprint,
      },
    });

    return { booking, reused: false };
  });
}

async function getByAccessToken(token: string) {
  return prisma.booking.findUnique({
    where: { accessTokenHash: hashOpaqueToken(token) },
    include: { room: true, payments: true },
  });
}

async function getById(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { room: true, payments: true },
  });
  if (!booking) throw new NotFoundError('Booking not found');
  return booking;
}

async function getAll(filters?: { status?: string; page?: number; pageSize?: number }) {
  const page = Math.max(1, filters?.page || 1);
  const pageSize = Math.min(50, Math.max(1, filters?.pageSize || 10));
  const where = filters?.status ? { status: filters.status as never } : {};

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { room: true, payments: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.booking.count({ where }),
  ]);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

async function updateStatus(id: string, status: string) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id },
      include: { payments: true },
    });
    if (!booking) throw new NotFoundError('Booking not found');

    if (status === BOOKING_STATUS.CONFIRMED) {
      throw new ConflictError('Bookings are confirmed only by verified payment');
    }
    if (status === BOOKING_STATUS.CANCELLED && booking.status === BOOKING_STATUS.CONFIRMED) {
      const captured = booking.payments.some((payment) => payment.status === 'CAPTURED');
      if (captured) throw new ConflictError('A captured booking requires a refund workflow before cancellation');
    }

    const allowed: Record<string, string[]> = {
      HOLD: [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.EXPIRED, BOOKING_STATUS.FAILED],
      PAYMENT_PENDING: [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.EXPIRED, BOOKING_STATUS.FAILED],
      CONFIRMED: [BOOKING_STATUS.CANCEL_REQUESTED, BOOKING_STATUS.COMPLETED],
      CANCEL_REQUESTED: [BOOKING_STATUS.CANCELLED],
    };
    if (!allowed[booking.status]?.includes(status)) {
      throw new ConflictError(`Invalid booking transition from ${booking.status} to ${status}`);
    }

    return tx.booking.update({ where: { id }, data: { status: status as never } });
  });
}

export const bookingService = {
  checkAvailability,
  create,
  getByAccessToken,
  getById,
  getAll,
  updateStatus,
  expireExpiredBookings,
};
