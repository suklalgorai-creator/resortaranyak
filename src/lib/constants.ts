export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export const PAYMENT_STATUS = {
  CREATED: 'CREATED',
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export const ROOM_STATUS = {
  AVAILABLE: 'AVAILABLE',
  MAINTENANCE: 'MAINTENANCE',
  DEACTIVATED: 'DEACTIVATED',
} as const;

export const SITE_CONFIG = {
  name: 'Resort Arranyak',
  description: 'A premium resort near Ghatsila, Jharkhand',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};
