// Re-export types from validation schemas
export type { CreateRoomInput, UpdateRoomInput } from '@/validations/room.schema';
export type { CreateBookingInput } from '@/validations/booking.schema';
export type { VerifyPaymentInput } from '@/validations/payment.schema';
export type { CreateEnquiryInput } from '@/validations/enquiry.schema';
export type { LoginInput } from '@/validations/auth.schema';

// API Response types
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
};

// Pagination
export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}>;
