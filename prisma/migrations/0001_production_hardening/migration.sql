-- Production hardening migration.
-- This migration is intentionally additive and maps the original db-push schema
-- in place so existing booking data is preserved.

DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "RoomStatus" AS ENUM ('AVAILABLE', 'MAINTENANCE', 'DEACTIVATED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "BookingStatus" AS ENUM ('HOLD', 'PAYMENT_PENDING', 'CONFIRMED', 'CANCEL_REQUESTED', 'CANCELLED', 'EXPIRED', 'FAILED', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUND_PENDING', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "EnquiryStatus" AS ENUM ('UNREAD', 'READ', 'REPLIED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE TABLE IF NOT EXISTS "Room" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "pricePerNight" INTEGER NOT NULL,
  "maxGuests" INTEGER NOT NULL,
  "bedType" TEXT NOT NULL DEFAULT 'King Bed',
  "roomSize" TEXT,
  "inventoryCount" INTEGER NOT NULL DEFAULT 1,
  "images" TEXT[] NOT NULL,
  "amenities" TEXT[] NOT NULL,
  "status" "RoomStatus" NOT NULL DEFAULT 'AVAILABLE',
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Room_slug_key" ON "Room"("slug");
CREATE INDEX IF NOT EXISTS "Room_status_idx" ON "Room"("status");
CREATE INDEX IF NOT EXISTS "Room_featured_idx" ON "Room"("featured");

CREATE TABLE IF NOT EXISTS "Booking" (
  "id" TEXT NOT NULL,
  "bookingCode" TEXT NOT NULL,
  "roomId" TEXT NOT NULL,
  "checkIn" TIMESTAMP(3) NOT NULL,
  "checkOut" TIMESTAMP(3) NOT NULL,
  "nights" INTEGER NOT NULL,
  "guests" INTEGER NOT NULL,
  "totalAmount" INTEGER NOT NULL,
  "status" "BookingStatus" NOT NULL DEFAULT 'HOLD',
  "guestName" TEXT NOT NULL,
  "guestEmail" TEXT NOT NULL,
  "guestPhone" TEXT NOT NULL,
  "specialRequests" TEXT,
  "expiresAt" TIMESTAMP(3),
  "accessTokenHash" TEXT,
  "idempotencyKeyHash" TEXT,
  "requestFingerprint" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Payment" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "razorpayOrderId" TEXT,
  "razorpayPaymentId" TEXT,
  "razorpaySignature" TEXT,
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'INR',
  "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
  "failureReason" TEXT,
  "providerMetadata" JSONB,
  "idempotencyKeyHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Enquiry" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "message" TEXT NOT NULL,
  "status" "EnquiryStatus" NOT NULL DEFAULT 'UNREAD',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- Map values from the original string-based schema before converting columns.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'role' AND udt_name IN ('text', 'varchar')) THEN
    ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
    ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole" USING ("role"::text::"UserRole");
    ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Room' AND column_name = 'status' AND udt_name IN ('text', 'varchar')) THEN
    ALTER TABLE "Room" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "Room" ALTER COLUMN "status" TYPE "RoomStatus" USING ("status"::text::"RoomStatus");
    ALTER TABLE "Room" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Booking' AND column_name = 'status' AND udt_name IN ('text', 'varchar')) THEN
    UPDATE "Booking" SET "status" = 'HOLD' WHERE "status" = 'PENDING';
    ALTER TABLE "Booking" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus" USING ("status"::text::"BookingStatus");
    ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'HOLD';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Payment' AND column_name = 'status' AND udt_name IN ('text', 'varchar')) THEN
    UPDATE "Payment" SET "status" = 'CAPTURED' WHERE "status" = 'PAID';
    UPDATE "Payment" SET "status" = 'CREATED' WHERE "status" = 'PENDING';
    ALTER TABLE "Payment" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus" USING ("status"::text::"PaymentStatus");
    ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'CREATED';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Enquiry' AND column_name = 'status' AND udt_name IN ('text', 'varchar')) THEN
    ALTER TABLE "Enquiry" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "Enquiry" ALTER COLUMN "status" TYPE "EnquiryStatus" USING ("status"::text::"EnquiryStatus");
    ALTER TABLE "Enquiry" ALTER COLUMN "status" SET DEFAULT 'UNREAD';
  END IF;
END $$;

ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "accessTokenHash" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "idempotencyKeyHash" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "requestFingerprint" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "failureReason" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "providerMetadata" JSONB;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "idempotencyKeyHash" TEXT;
ALTER TABLE "Payment" ALTER COLUMN "razorpayOrderId" DROP NOT NULL;
ALTER TABLE "Payment" DROP CONSTRAINT IF EXISTS "Payment_bookingId_key";

UPDATE "Booking"
SET "expiresAt" = "createdAt" + INTERVAL '15 minutes', "status" = 'EXPIRED'
WHERE "status" IN ('HOLD', 'PAYMENT_PENDING') AND "expiresAt" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Booking_accessTokenHash_key" ON "Booking"("accessTokenHash");
CREATE UNIQUE INDEX IF NOT EXISTS "Booking_idempotencyKeyHash_key" ON "Booking"("idempotencyKeyHash");
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_razorpayOrderId_key" ON "Payment"("razorpayOrderId");
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_razorpayPaymentId_key" ON "Payment"("razorpayPaymentId");
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_idempotencyKeyHash_key" ON "Payment"("idempotencyKeyHash");
CREATE INDEX IF NOT EXISTS "Booking_roomId_status_checkIn_checkOut_idx" ON "Booking"("roomId", "status", "checkIn", "checkOut");
CREATE INDEX IF NOT EXISTS "Booking_status_expiresAt_idx" ON "Booking"("status", "expiresAt");
CREATE INDEX IF NOT EXISTS "Payment_bookingId_status_idx" ON "Payment"("bookingId", "status");

DO $$ BEGIN
  ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Room" ADD CONSTRAINT "Room_price_positive" CHECK ("pricePerNight" > 0);
  ALTER TABLE "Room" ADD CONSTRAINT "Room_inventory_positive" CHECK ("inventoryCount" > 0);
  ALTER TABLE "Booking" ADD CONSTRAINT "Booking_dates_valid" CHECK ("checkOut" > "checkIn");
  ALTER TABLE "Booking" ADD CONSTRAINT "Booking_guests_positive" CHECK ("guests" > 0);
  ALTER TABLE "Booking" ADD CONSTRAINT "Booking_nights_positive" CHECK ("nights" > 0);
  ALTER TABLE "Booking" ADD CONSTRAINT "Booking_amount_nonnegative" CHECK ("totalAmount" >= 0);
  ALTER TABLE "Payment" ADD CONSTRAINT "Payment_amount_nonnegative" CHECK ("amount" >= 0);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "WebhookEvent" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "payloadHash" TEXT NOT NULL,
  "payload" JSONB,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "WebhookEvent_eventId_key" ON "WebhookEvent"("eventId");
CREATE INDEX IF NOT EXISTS "WebhookEvent_status_idx" ON "WebhookEvent"("status");

CREATE TABLE IF NOT EXISTS "RateLimitBucket" (
  "key" TEXT NOT NULL,
  "windowStart" TIMESTAMP(3) NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);
CREATE INDEX IF NOT EXISTS "RateLimitBucket_expiresAt_idx" ON "RateLimitBucket"("expiresAt");
