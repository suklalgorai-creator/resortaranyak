import { prisma } from '@/lib/db';
import { CreateEnquiryInput } from '@/validations/enquiry.schema';

async function create(data: CreateEnquiryInput) {
  return await prisma.enquiry.create({
    data: {
      ...data,
      status: 'UNREAD'
    }
  });
}

async function getAll(page: number = 1, pageSize: number = 10) {
  const [data, total] = await Promise.all([
    prisma.enquiry.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.enquiry.count()
  ]);
  
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

async function markAsRead(id: string) {
  return await prisma.enquiry.update({
    where: { id },
    data: { status: 'READ' }
  });
}

export const enquiryService = { create, getAll, markAsRead };
