import { prisma } from '@/lib/db';
import { BOOKING_STATUS } from '@/lib/constants';

async function getStats() {
  const [totalBookings, requestedBookings, confirmedBookings, cancelledBookings, revenueData, totalRooms, totalEnquiries] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: BOOKING_STATUS.REQUESTED } }),
    prisma.booking.count({ where: { status: BOOKING_STATUS.CONFIRMED } }),
    prisma.booking.count({ where: { status: BOOKING_STATUS.CANCELLED } }),
    prisma.booking.aggregate({
      where: { status: BOOKING_STATUS.CONFIRMED },
      _sum: { totalAmount: true }
    }),
    prisma.room.count(),
    prisma.enquiry.count({ where: { status: 'UNREAD' } })
  ]);
  
  return {
    totalBookings,
    requestedBookings,
    confirmedBookings,
    cancelledBookings,
    totalRevenue: revenueData._sum.totalAmount || 0,
    totalRooms,
    totalEnquiries
  };
}

async function getRecentBookings(limit: number = 5) {
  return await prisma.booking.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { room: true }
  });
}

async function getRecentEnquiries(limit: number = 5) {
  return prisma.enquiry.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}

export const dashboardService = { getStats, getRecentBookings, getRecentEnquiries };
