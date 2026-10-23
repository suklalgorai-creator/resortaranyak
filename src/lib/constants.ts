export const BOOKING_STATUS = {
  REQUESTED: 'REQUESTED',
  HOLD: 'HOLD',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCEL_REQUESTED: 'CANCEL_REQUESTED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  FAILED: 'FAILED',
  COMPLETED: 'COMPLETED',
} as const;

export const PAYMENT_STATUS = {
  CREATED: 'CREATED',
  AUTHORIZED: 'AUTHORIZED',
  CAPTURED: 'CAPTURED',
  FAILED: 'FAILED',
  REFUND_PENDING: 'REFUND_PENDING',
  REFUNDED: 'REFUNDED',
} as const;

export const ROOM_STATUS = {
  AVAILABLE: 'AVAILABLE',
  MAINTENANCE: 'MAINTENANCE',
  DEACTIVATED: 'DEACTIVATED',
} as const;

export const ENQUIRY_STATUS = {
  UNREAD: 'UNREAD',
  READ: 'READ',
  REPLIED: 'REPLIED',
} as const;

export const SITE_CONFIG = {
  name: 'Resort Arranyak',
  description: 'A premium resort near Ghatsila, Jharkhand',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};
