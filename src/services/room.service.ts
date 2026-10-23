import { prisma } from '@/lib/db';
import { ROOM_STATUS } from '@/lib/constants';
import { NotFoundError } from '@/lib/errors';
import { CreateRoomInput, UpdateRoomInput } from '@/validations/room.schema';
import { slugify } from '@/lib/utils';

async function getAll() {
  return await prisma.room.findMany({
    where: { status: { not: ROOM_STATUS.DEACTIVATED } },
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' },
    ],
  });
}

async function getPublicAll() {
  return await prisma.room.findMany({
    where: { status: ROOM_STATUS.AVAILABLE },
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' },
    ],
  });
}

async function getBySlug(slug: string) {
  const room = await prisma.room.findFirst({ where: { slug, status: { not: ROOM_STATUS.DEACTIVATED } } });
  if (!room) {
    throw new NotFoundError('Room not found');
  }
  return room;
}

async function getPublicBySlug(slug: string) {
  const room = await prisma.room.findFirst({ where: { slug, status: ROOM_STATUS.AVAILABLE } });
  if (!room) {
    throw new NotFoundError('Room not found');
  }
  return room;
}

async function getById(id: string) {
  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) throw new NotFoundError('Room not found');
  return room;
}

async function create(data: CreateRoomInput & { images?: string[], amenities?: string[] }) {
  const slug = slugify(data.name);
  return await prisma.room.create({
    data: {
      ...data,
      slug,
    },
  });
}

async function update(id: string, data: UpdateRoomInput) {
  return await prisma.room.update({
    where: { id },
    data,
  });
}

async function deactivate(id: string) {
  return await prisma.room.update({
    where: { id },
    data: { status: ROOM_STATUS.DEACTIVATED },
  });
}

export const roomService = { getAll, getPublicAll, getBySlug, getPublicBySlug, getById, create, update, deactivate };
