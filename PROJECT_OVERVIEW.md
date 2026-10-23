# Resort Arranyak - Project Overview

## 1. Introduction
**Resort Arranyak** is a full-stack resort management and room booking web application. It features a public-facing website for guests to explore the resort and book rooms, as well as a secure admin dashboard for managing inventory, reservations, and payments.

## 2. Tech Stack
- **Core Framework:** Next.js (v16 App Router) with React 19
- **Styling & UI:** Tailwind CSS v4, Framer Motion (animations), Sonner (toast notifications), Lucide React (icons)
- **Database & ORM:** PostgreSQL managed via Prisma ORM
- **Authentication:** NextAuth.js (v5 beta) for secure Admin access
- **Payment Gateway:** Razorpay integration for online booking payments
- **Validation:** Zod for schema and API validation

## 3. Core Features

### Client / Guest Features
- **Information Pages:** About, Amenities, Dining, Local Attractions, and Photo Gallery.
- **Room Browsing:** Dynamic listing of available rooms, displaying images, pricing, bed types, and amenities.
- **Online Booking System:** 
  - Date selection (Check-in / Check-out).
  - Guest capacity checks.
  - Automated total price calculation based on the number of nights.
- **Payment Processing:** Secure payment capture using Razorpay.
- **Contact & Enquiries:** Contact form for guest queries.
- **Legal/Policies:** Dedicated pages for Terms & Conditions, Privacy Policy, and Cancellation policies.
- **Quick Contact:** Floating quick-action buttons (Call, WhatsApp).

### Admin Dashboard Features (Role-Protected)
- **Room Management:** Add, edit, or remove rooms. Manage pricing, inventory counts, images, and statuses (`AVAILABLE`, `MAINTENANCE`, `DEACTIVATED`).
- **Booking Management:** View incoming reservations, track status (`PENDING`, `CONFIRMED`, `CANCELLED`), and manage guest details.
- **Payment Tracking:** Monitor Razorpay transaction statuses and payment IDs.
- **Enquiry Management:** View and update the status of customer contact form submissions (`UNREAD`, `READ`, `REPLIED`).

## 4. Database Schema Overview
The database (via Prisma) consists of the following core models:
- **`User`**: System administrators managing the platform.
- **`Room`**: Details about accommodations including inventory count, price per night, and max guests.
- **`Booking`**: Links a Room to guest details, dates, and calculated totals.
- **`Payment`**: Links a Booking to a Razorpay Order ID and tracking status.
- **`Enquiry`**: Stores messages submitted via the public contact form.

## 5. Key Directory Structure
- `/src/app`: Application routes including public pages (`/rooms`, `/book`, `/gallery`) and the protected `/admin` dashboard.
- `/src/components`: Modular React components categorized into `layout`, `shared` (e.g., WhatsApp/Call buttons), and UI elements.
- `/prisma`: Contains `schema.prisma` mapping out the database structure.
