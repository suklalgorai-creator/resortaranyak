# Resort Arranyak Security & Production Audit

## Executive Summary

- Overall security rating: **3/10**
- Production readiness: **NOT READY**
- Critical findings: **1**
- High findings: **7**
- Medium findings: **10**
- Low / informational findings: **8**

The repository contains reasonable foundations—Prisma parameterization, bcrypt password hashing, Razorpay HMAC checks, Zod usage, and role checks on admin APIs. However, the booking/payment architecture is not production-safe.

The largest risks are:

- A hardcoded default admin password in the seed script.
- Public access to booking records and payment data.
- Double-booking under concurrent requests.
- Maintenance/deactivated rooms and over-capacity bookings being accepted.
- Public payment endpoints that can mutate arbitrary bookings when their IDs are known.
- Pending bookings never expiring.
- The visible booking, contact, and admin screens are mostly static/demo interfaces and are not connected to the APIs.

## Critical Findings

| ID | Severity | Area | File | Problem | Impact | Fix |
|---|---|---|---|---|---|---|
| RA-SEC-001 | CRITICAL | Authentication | `prisma/seed.ts:10-18` | The seed script creates an admin account using the known password `admin123`. | Anyone knowing the seeded email/password can obtain administrator access. | Require a deployment-time password or bootstrap token. Never seed a known production password. Force password rotation and rotate any already-exposed credentials. |

Evidence: `bcrypt.hash('admin123', 12)` is hardcoded and the user role is `ADMIN`.

Priority: **Immediate**

## High Findings

| ID | Severity | Area | File | Problem | Impact | Fix |
|---|---|---|---|---|---|---|
| RA-SEC-002 | HIGH | IDOR/BOLA | `src/app/api/bookings/[bookingId]/route.ts:5-10`, `src/services/booking.service.ts:80-85` | Any unauthenticated caller with a booking ID can retrieve the booking, guest data, room, and payment record. | Exposure of names, email, phone, dates, payment IDs, and Razorpay signatures. | Remove the public endpoint or require a short-lived signed booking-access token. Never return payment signatures to clients. |
| RA-SEC-003 | HIGH | Inventory/concurrency | `src/services/booking.service.ts:38-73` | Availability is checked and then a booking is inserted inside a transaction, but no row lock, serializable isolation, advisory lock, or database exclusion constraint exists. | Two simultaneous requests can both observe available inventory and create overlapping bookings. | Lock a per-room inventory row, use serializable transactions with retry, or model individual units and enforce PostgreSQL exclusion constraints. |
| RA-SEC-004 | HIGH | Booking business logic | `src/services/booking.service.ts:38-52`, `src/validations/booking.schema.ts:3-14` | Booking creation does not check room status or compare `guests` with `room.maxGuests`. | Guests can book MAINTENANCE or DEACTIVATED rooms and exceed capacity. | Validate room status and capacity inside the transaction immediately before insertion. |
| RA-SEC-005 | HIGH | Payment authorization | `src/app/api/payment/create-order/route.ts:5-23`, `src/services/payment.service.ts:22-58` | Payment order creation is unauthenticated and accepts any `bookingId`. It can reset the payment row and move arbitrary bookings to `PAYMENT_PENDING`. | A caller who knows another booking ID can interfere with its payment lifecycle or reopen cancelled/confirmed bookings. | Bind booking access to a signed checkout token, verify allowed booking state, use idempotency, and reject cancelled/confirmed bookings. |
| RA-SEC-006 | HIGH | Payment integrity | `src/services/payment.service.ts:40-58`, `64-120`, `148-164` | Payment/order updates and booking updates are separate operations. Verification does not query Razorpay to confirm amount, currency, and captured status. | Payment and booking states can diverge; failed updates can leave a paid payment with an unconfirmed booking. | Use a payment state machine, transactionally update local records, verify Razorpay order/payment details server-side, and reconcile through webhooks. |
| RA-SEC-007 | HIGH | Abuse/availability | `src/services/booking.service.ts:11-19`, `41-48` | `PENDING` and `PAYMENT_PENDING` bookings permanently consume inventory. There is no expiry, cleanup job, or rate limit. | An attacker can fill inventory with unpaid bookings and prevent legitimate reservations. | Add `expiresAt`, exclude expired reservations, run cleanup, require payment within a short hold window, and rate-limit booking/order creation. |
| RA-PROD-001 | HIGH | Production readiness | `src/app/book/page.tsx:52`, `src/app/contact/page.tsx:98`, `src/app/admin/*/page.tsx` | The public booking form prevents submission, the contact form only shows a toast, and admin pages use hardcoded demo data. | The advertised booking/payment/admin system is not operational. Real customer bookings cannot be reliably accepted or managed. | Connect the UI to the APIs, implement loading/error states, and test the complete production lifecycle before launch. |

## Medium Findings

| ID | Severity | Area | File | Problem | Impact | Fix |
|---|---|---|---|---|---|---|
| RA-SEC-010 | MEDIUM | Date validation | `src/validations/booking.schema.ts:3-14` | Dates only require non-empty strings and chronological ordering. Past dates, excessive date ranges, timezone ambiguity, and DST edge cases are not controlled. | Invalid or commercially unacceptable reservations can be created. | Parse strict ISO calendar dates, reject past check-in, enforce maximum stay/range, and use one defined resort timezone. |
| RA-SEC-011 | MEDIUM | Input validation/DoS | `src/validations/booking.schema.ts`, `room.schema.ts`, `enquiry.schema.ts` | Most string fields have no maximum length. Guest count has no upper bound in booking validation. | Excessive database payloads, oversized requests, and integer/price calculation failures. | Add strict length, numeric range, and request-body limits. |
| RA-SEC-012 | MEDIUM | Abuse protection | Public booking, payment, enquiry, availability, and Auth.js endpoints | No rate limiting, CAPTCHA, abuse controls, or login throttling is implemented. | Spam, brute-force login attempts, payment-order exhaustion, and database load. | Add IP/account/device-aware rate limits at the edge and application layers. |
| RA-SEC-013 | MEDIUM | State machine | `src/services/booking.service.ts:108-112`, `src/app/api/admin/bookings/[id]/route.ts:31-52` | Admins can transition bookings between arbitrary statuses, including confirming without payment or reconfirming cancelled bookings. | Operational and financial inconsistencies. | Define valid state transitions and make cancellation/refund/payment transitions explicit. |
| RA-SEC-014 | MEDIUM | Authorization/session | `src/middleware.ts:6-26`, `src/lib/auth.ts:41-55` | Middleware protects `/admin` for any authenticated user, not specifically admins. JWT role claims can remain valid after a database role change until token expiry. | Normal authenticated users could access admin UI; revoked roles may retain API access temporarily. | Enforce admin role in middleware/page boundaries and re-check current role for sensitive operations. Set explicit session lifetime and revocation strategy. |
| RA-SEC-015 | MEDIUM | Database integrity | `prisma/schema.prisma:16, 31, 55-58, 79-98` | Statuses and roles are free-form strings. No database checks exist for positive inventory, dates, guests, amounts, or valid status values. | Invalid states can enter the database through future code or direct database access. | Use Prisma enums where practical and PostgreSQL check constraints for critical invariants. |
| RA-SEC-016 | MEDIUM | Payment idempotency | `prisma/schema.prisma:77-88`, `src/services/payment.service.ts:40-58` | Payment retries overwrite the existing Razorpay order. There is no payment event ID, immutable order history, or unique `razorpayPaymentId`. | Late callbacks and webhook events can become detached from the current payment record. | Use immutable payment attempts, unique provider IDs, idempotency keys, and event records. |
| RA-SEC-017 | MEDIUM | Error handling | Public API routes, especially `src/app/api/payment/*`, `src/app/api/bookings/route.ts:34-35` | Several routes return raw `error.message` values for unexpected errors. | Database/provider implementation details may be exposed. | Log detailed errors server-side and return stable generic error responses to clients. |
| RA-SEC-018 | MEDIUM | Room lifecycle | `src/services/room.service.ts:13-20`, `src/services/booking.service.ts:38-52` | Room details can expose deactivated rooms, and booking uses only the room ID without lifecycle validation. | Unavailable inventory can remain bookable through direct API calls. | Apply status filters consistently and revalidate status during booking. |
| RA-SEC-019 | MEDIUM | Pagination/resource exhaustion | `src/app/api/admin/bookings/route.ts:11-16`, `src/app/api/admin/enquiries/route.ts:11-16` | Page values are not range-validated; public room and availability endpoints have no pagination or abuse protection. | Large or malformed requests can cause inefficient queries or errors. | Validate page bounds, set maximum page sizes, and add indexes/composite indexes for availability queries. |

## Low / Informational Findings

| ID | Severity | Area | File | Problem | Impact | Fix |
|---|---|---|---|---|---|---|
| RA-INFO-001 | LOW | Next.js | `src/middleware.ts` | Next.js 16 documents `middleware.ts` as deprecated in favor of `proxy.ts`. | Future compatibility and warning risk. | Migrate using the project’s Next.js 16 guidance. |
| RA-INFO-002 | LOW | Security headers | `next.config.ts` | No CSP, HSTS, Referrer-Policy, Permissions-Policy, or frame protection headers are configured. | Reduced browser-side defense-in-depth. | Add environment-appropriate headers, especially CSP, HSTS, and frame protection. |
| RA-INFO-003 | LOW | SEO/accessibility | `src/app/layout.tsx`, `src/app` | No sitemap, robots file, canonical metadata, OG image implementation, or global error boundary was found. | SEO and operational UX deficiencies. | Add metadata routes, error boundaries, and accessibility testing. |
| RA-INFO-004 | LOW | Frontend performance | Multiple components | Raw `<img>` elements are used instead of `next/image` in many places. | Larger payloads and weaker image optimization. | Use `next/image` with controlled remote patterns. |
| RA-INFO-005 | INFO | XSS | Repository-wide search | No `dangerouslySetInnerHTML` or direct HTML injection was found. React renders user strings escaped. | No demonstrated stored/reflected XSS in the current code. | Preserve escaped rendering and sanitize any future rich text. |
| RA-INFO-006 | INFO | SSRF/path traversal | Repository-wide search | No server-side URL fetching, upload handler, shell execution, or path-based file access was found. | No demonstrated SSRF, command injection, or traversal path. | Validate future image URLs and avoid server-fetching arbitrary user URLs. |
| RA-INFO-007 | INFO | Dependency security | `package.json`, `package-lock.json` | `npm audit` reported zero known vulnerabilities in the installed dependency tree. `next-auth` remains a beta dependency. | No currently reported npm advisory, but beta/auth dependencies require monitoring. | Enable Dependabot/npm audit in CI and test upgrades. |
| RA-INFO-008 | INFO | Deployment configuration | `.env`, `.env.example` | The local environment contains localhost/test-style configuration. `.env` is ignored and not tracked, which is good. | Deploying these values unchanged would break or weaken production behavior. | Use production-only secrets, HTTPS URLs, secret rotation, and deployment secret storage. |

## Authentication Audit

What is implemented correctly:

- Credentials are checked with bcrypt.
- Auth.js uses JWT sessions.
- Admin APIs independently check `session.user.role === 'ADMIN'`.
- Admin API routes are also covered by middleware.
- No public registration flow exists.

Problems:

- `prisma/seed.ts` contains a known admin password.
- The login page never calls `signIn`; the visible login form is non-functional.
- There is no login rate limiting or lockout.
- No explicit session lifetime or revocation policy is configured.
- Role information is copied into the JWT at sign-in and may remain stale after a database role change.
- `/admin` page middleware checks authentication but not the admin role.
- Cookie behavior is mostly delegated to Auth.js defaults; production HTTPS and cookie behavior should be explicitly verified.
- `AUTH_URL` in the local environment is localhost-style and must not be reused for production.

Unauthenticated access to admin APIs is blocked by both middleware and route checks.

## Authorization Audit

| Resource | Public | Authenticated | Admin | Properly Protected? |
|---|---:|---:|---:|---|
| `GET /api/rooms` | Yes | Yes | Yes | Mostly; deactivated rooms filtered |
| `GET /api/rooms/[slug]` | Yes | Yes | Yes | No; deactivated rooms can be retrieved |
| `GET /api/availability` | Yes | Yes | Yes | Partial; no status/date/rate controls |
| `POST /api/bookings` | Yes | Yes | Yes | Partial; intended guest access but weak business validation |
| `GET /api/bookings/[bookingId]` | Yes | Yes | Yes | No; direct BOLA/PII exposure |
| `POST /api/payment/create-order` | Yes | Yes | Yes | No; arbitrary booking mutation |
| `POST /api/payment/verify` | Yes | Yes | Yes | Partial; HMAC exists but ownership/correct state is weak |
| `POST /api/payment/webhook` | Provider | Provider | Provider | Signature protected, but replay/idempotency incomplete |
| `POST /api/enquiries` | Yes | Yes | Yes | Partial; no rate limiting or size limits |
| `GET /api/admin/dashboard` | No | No | Yes | Yes at API level |
| Admin room APIs | No | No | Yes | Yes at API level |
| Admin booking APIs | No | No | Yes | Yes at API level, but state transitions are unsafe |
| Admin enquiry APIs | No | No | Yes | Yes at API level |
| `/admin/*` pages | No | Yes | Yes | No; middleware does not require admin role |

## Booking Security Audit

### Inventory

The service counts overlapping `PENDING`, `PAYMENT_PENDING`, and `CONFIRMED` bookings against `inventoryCount`. That is logically reasonable for a temporary hold model, but:

- There is no hold expiration.
- There is no room-status check.
- There is no concurrency protection.
- The check and insert are vulnerable to concurrent transactions.
- Cancelled bookings are excluded, but no refund or payment reconciliation is tied to cancellation.

### Dates

Check-out must be later than check-in, and same-day bookings are rejected. However:

- Past check-in dates are accepted.
- Very long date ranges are accepted.
- Strict date parsing is absent.
- Timezone handling is implicit.
- No maximum stay or booking horizon exists.

### Capacity

The request only validates `guests >= 1`. It never loads the room’s `maxGuests` and compares against it.

### Pricing

This is one of the stronger areas:

- The booking API does not accept `totalAmount`, `pricePerNight`, or `nights` from the client.
- The server calculates nights and total amount using the room’s database price.
- The payment order uses the stored booking total.

However, the calculation has no upper bounds and payment verification does not independently validate the provider-side amount/currency.

### Cancellation and state transitions

There is no public cancellation endpoint. Admin status changes are unrestricted apart from the status enum. A cancelled booking can be moved back to `CONFIRMED`, and an unpaid booking can be marked confirmed manually without a payment record.

## Razorpay Payment Audit

Current intended flow:

1. Public booking creation creates a pending booking.
2. Public `create-order` receives a booking ID.
3. Server calculates the order amount from the booking.
4. Razorpay creates the order.
5. Client would submit Razorpay callback fields to `verify`.
6. Server verifies `order_id|payment_id` using the Razorpay secret.
7. Razorpay webhook can also mark the payment and booking as paid/confirmed.

Trust assessment:

- Client-provided amount: correctly not trusted.
- Client-provided booking ID: currently over-trusted.
- Razorpay checkout signature: checked, but malformed signature handling and provider-side amount verification need improvement.
- Webhook raw body: correctly preserved for signature verification.
- Webhook event ID: not stored.
- Database: not updated transactionally across payment and booking.

Specific problems:

- Payment order creation accepts cancelled, confirmed, or already-paid bookings.
- Multiple order attempts overwrite the previous provider order.
- Payment and booking updates are separate.
- `payment.captured` does not compare amount/currency against the database.
- No refund webhook handling exists.
- No durable webhook event/idempotency record exists.
- No explicit payment attempt history exists.
- A valid payment can be associated with another booking if an attacker knows its booking ID and causes a new order to be created for it.

There is no demonstrated way for an unauthenticated user to mark a payment paid without a valid Razorpay signature or webhook. The payment boundary is nevertheless too weak for production.

## Database Audit

Positive points:

- Prisma parameterizes normal queries, so no SQL injection was found.
- Foreign keys exist for room and payment relationships.
- Booking and payment identifiers have useful indexes/uniques.
- Admin booking lists are paginated with a default page size.

Problems:

- Statuses and roles are strings rather than database-enforced enums.
- No check constraints enforce positive prices, inventory, guest counts, nights, or valid date order.
- No exclusion constraint prevents overlapping bookings.
- No `expiresAt` for temporary booking holds.
- No booking idempotency key.
- No payment event table or webhook event ID.
- `razorpayPaymentId` is not unique.
- Payment retry overwrites history.
- Availability queries would benefit from a composite index.
- Public booking data cannot be tied to a customer account because bookings have no user relation.
- No migration/deployment strategy is defined; `db:push` is not an appropriate production migration process.

No obvious N+1 query was found in the small current service layer, but the data model and pagination controls are incomplete.

## API Audit

| Endpoint | Auth | Validation | Main status |
|---|---|---|---|
| `GET /api/auth/[...nextauth]` | Auth.js | Provider-level | Credentials auth exists; UI login is not wired |
| `POST /api/auth/[...nextauth]` | Auth.js | Provider-level | No visible login throttling |
| `GET /api/rooms` | Public | None required | Returns active and maintenance rooms; no pagination |
| `GET /api/rooms/[slug]` | Public | Minimal route handling | Can expose deactivated rooms |
| `GET /api/availability` | Public | Weak date/string validation | No rate limiting; race-prone information |
| `POST /api/bookings` | Public | Zod | No room status/capacity/date bounds/idempotency/rate limit |
| `GET /api/bookings/[bookingId]` | Public | ID only | Critical privacy/BOLA problem |
| `POST /api/payment/create-order` | Public | Truthy booking ID only | Arbitrary booking mutation and payment-order abuse |
| `POST /api/payment/verify` | Public | Zod + HMAC | Missing provider-side amount/state checks |
| `POST /api/payment/webhook` | Provider signature | Raw body | Signature present; replay/idempotency incomplete |
| `POST /api/enquiries` | Public | Zod | Spam and payload-size risk |
| `GET/POST /api/admin/rooms` | Admin role | Zod for POST | Correct role check; incomplete room fields |
| `PATCH/DELETE /api/admin/rooms/[id]` | Admin role | Zod for PATCH | Correct role check; no CSRF defense-in-depth |
| `GET /api/admin/bookings` | Admin role | Weak page/status parsing | Correct role check; page bounds missing |
| `GET/PATCH /api/admin/bookings/[id]` | Admin role | Status enum | Arbitrary state transitions |
| `GET/PATCH /api/admin/enquiries` | Admin role | ID only for PATCH | Correct role check; status handling incomplete |
| `GET /api/admin/dashboard` | Admin role | None | Correct role check |

No server actions were found.

## Frontend Audit

The current UI is not connected to the backend:

- `/src/app/book/page.tsx` calls `preventDefault()` and never creates a booking.
- `/src/app/contact/page.tsx` displays a success toast without sending the enquiry.
- Admin pages use hardcoded sample rooms, bookings, and enquiries.
- Admin buttons such as Edit, Delete, and Save do not call APIs.
- No frontend code calls `/api/bookings`, `/api/payment`, `/api/enquiries`, or admin APIs.
- The room pages use static data rather than the Prisma-backed room API.
- The dynamic room page uses the older synchronous `params` shape and falls back to the first featured room for unknown slugs.

No direct XSS sink was found. React escaping is used for displayed strings. No SSRF, command injection, path traversal, or SQL injection path was found in the current implementation.

## Infrastructure / Deployment Audit

Production risks:

- No security headers are configured.
- No CSP or frame protection exists.
- No visible health checks, monitoring, request IDs, audit logs, or payment alerting.
- No production migration script exists.
- Local environment configuration uses localhost/test-style values and must not be deployed unchanged.
- Secrets are ignored by Git and `.env` is not tracked, which is correct.
- Only the Razorpay key ID is returned to clients; the Razorpay secret is not observed in client code.
- The current build check failed at `prisma generate` with `spawn EPERM` in this environment. TypeScript checking passed. This should be re-run in CI or a normal deployment environment.

## Dependency Audit

Installed versions include:

- Next.js `16.3.4`
- React `19.2.8`
- NextAuth `5.0.0-beta.32`
- Prisma `5.22.0`
- Razorpay `2.9.8`
- Zod `4.6.5`
- bcryptjs `3.0.3`

Results:

- `npm audit --omit=dev`: 0 reported vulnerabilities.
- `npm audit`: 0 reported vulnerabilities.
- `npx tsc --noEmit`: passed.
- `npm run lint`: timed out after 120 seconds without completing.
- `npm run build`: failed during `prisma generate` with `spawn EPERM`.

The clean npm audit result does not remove the need to monitor the beta Auth.js dependency and keep Next.js/Prisma patched.

## Attack Path Analysis

### Attack path 1: Known seed credentials to admin takeover

```text
Known repository or deployment details
        ↓
Login with seeded admin123 password
        ↓
Valid ADMIN JWT
        ↓
Admin dashboard and admin APIs
        ↓
Room, booking, enquiry manipulation
```

Impact: complete administrative compromise.

Fix: remove the hardcoded password, rotate credentials, and require a secure bootstrap process.

### Attack path 2: Booking ID exposure to guest-data disclosure

```text
Booking creation or leaked booking ID
        ↓
GET /api/bookings/[bookingId]
        ↓
Booking record with guest/payment data
        ↓
PII and payment metadata disclosure
```

Impact: unauthorized access to customer information.

Fix: remove the public lookup endpoint or require a signed, expiring access token.

### Attack path 3: Booking hoarding

```text
Unauthenticated attacker
        ↓
Repeated POST /api/bookings
        ↓
PENDING bookings consume inventory
        ↓
Availability reaches zero
        ↓
Real customers cannot book
```

Impact: booking denial of service and lost revenue.

Fix: short-lived reservation holds, expiration cleanup, idempotency, and rate limiting.

### Attack path 4: Concurrent overbooking

```text
Two simultaneous booking requests
        ↓
Both count the same available inventory
        ↓
Both insert bookings
        ↓
Inventory count is exceeded
```

Impact: double booking and operational/financial loss.

Fix: locked inventory transaction or PostgreSQL exclusion constraints.

### Attack path 5: Payment lifecycle interference

```text
Known booking ID
        ↓
Unauthenticated create-order request
        ↓
Payment row overwritten and booking set PAYMENT_PENDING
        ↓
Late callback/webhook no longer matches current order
        ↓
Payment and booking states diverge
```

Impact: failed confirmations, disputed payments, or unauthorized booking state changes.

Fix: signed checkout capability, immutable payment attempts, and idempotent reconciliation.

## Explicit High-Risk Scenario Answers

| Scenario | Result |
|---|---|
| 1. Guest books beyond inventory | **Yes**, through race conditions and unpaid reservation hoarding |
| 2. Two users book the last room simultaneously | **Yes** |
| 3. Guest manipulates booking price | **Not directly**; server calculates price, but provider-side payment verification is incomplete |
| 4. Successful booking without valid Razorpay payment | **No demonstrated public bypass**, but admin status changes can confirm manually |
| 5. Guest fakes Razorpay success | **Not with only fake callback fields**; valid HMAC is required |
| 6. Guest replays a valid payment | **Duplicate normal callbacks are mostly no-op**, but explicit replay/event idempotency is missing |
| 7. Webhook replay | **Partially protected**; duplicate captured events usually no-op after `PAID`, but no durable event ID exists |
| 8. Guest modifies another booking | **Yes, partially**; payment order creation can change a known booking’s state |
| 9. Guest reads another guest’s information | **Yes**, through the public booking lookup endpoint |
| 10. Normal user accesses admin APIs | **No through current role checks**, but admin pages only require authentication |
| 11. Unauthenticated user accesses admin APIs | **No**, based on middleware and route checks |
| 12. Non-admin changes room inventory | **No current inventory API exists** |
| 13. Non-admin changes room price | **No, based on API role checks** |
| 14. Someone marks payment successful | **Not without valid Razorpay evidence**; admins can change booking status but not payment status directly |
| 15. Payment information from another booking | **Yes**, through the public booking lookup if the ID is known |
| 16. Malicious input reaches HTML unsanitized | **No demonstrated case** |
| 17. SSRF | **No current SSRF path found** |
| 18. Secrets reach browser | **No observed secret exposure**; only the Razorpay public key ID is returned |
| 19. Contact spam/DoS | **Yes**, through the public API; current UI does not submit |
| 20. Unlimited pending bookings | **Yes** |
| 21. Cancelled bookings reused | **Yes**; create-order does not reject cancelled bookings |
| 22. MAINTENANCE room booked | **Yes** |
| 23. DEACTIVATED room booked | **Yes** |
| 24. Guest capacity bypassed | **Yes** |
| 25. Date validation bypassed | **Partially**; ordering is checked, but past/extreme dates are accepted |
| 26. Payment and booking inconsistency | **Yes** |
| 27. Arbitrary record ID manipulation | **Yes** for public booking reads and payment-order mutations |
| 28. Race conditions | **Yes** |
| 29. Stale cached availability | **No explicit cache was found**, but availability is inherently stale between check and create |
| 30. Duplicate bookings/payments | **Yes**; duplicate booking requests create separate bookings and order retries overwrite payment state |

## Security Test Cases

Run these only against local or staging environments:

- Submit booking requests with past, invalid, same-day, very distant, and timezone-shifted dates.
- Submit `guests` above room capacity and extremely large guest values.
- Submit MAINTENANCE and DEACTIVATED room IDs.
- Send two identical booking requests concurrently and verify inventory.
- Send dozens of booking requests and verify pending holds expire.
- Repeat the same booking request with and without an idempotency key.
- Retrieve another booking ID through `GET /api/bookings/[bookingId]`; expected result is denial.
- Attempt `create-order` for cancelled, confirmed, and another booking.
- Modify order ID, payment ID, signature, booking ID, amount, and currency fields.
- Replay the same payment verification request.
- Replay the same webhook body and webhook event ID.
- Send malformed webhook signatures of different lengths.
- Attempt admin API access without a session and with a non-admin session.
- Change room status, price, inventory, and booking status through direct API calls.
- Submit oversized names, messages, special requests, and JSON bodies.
- Submit HTML/script strings and verify they remain escaped everywhere.
- Test cross-origin POST requests against admin state-changing endpoints.
- Brute-force the admin login in staging and verify throttling.
- Trigger database/provider failures and verify generic client errors.
- Verify no Razorpay secret, database URL, password, stack trace, or signature is present in browser responses.

## Fix Priority Roadmap

### Phase 1 — Fix Immediately

1. Remove and rotate the seeded admin credentials.
2. Remove public booking-record access or add signed expiring access tokens.
3. Add room-status and capacity validation.
4. Fix inventory concurrency with database-backed locking/constraints.
5. Add reservation expiration and prevent unlimited pending bookings.
6. Redesign payment order creation around authorized, idempotent booking capabilities.
7. Make payment confirmation and booking confirmation transactional and provider-verified.
8. Connect and test the actual booking/payment UI before accepting customers.

### Phase 2 — Before Production

1. Add strict date, length, numeric, and body-size validation.
2. Add rate limiting for login, booking, payment, enquiry, availability, and webhooks.
3. Implement valid booking/payment state transitions.
4. Add webhook event idempotency and payment attempt history.
5. Add database check constraints and useful composite indexes.
6. Replace raw internal error messages with safe error responses.
7. Enforce admin authorization at both page and middleware boundaries.
8. Add security headers, HTTPS enforcement, monitoring, structured logs, and alerts.
9. Replace static admin/demo screens with real database-backed screens.

### Phase 3 — Post Launch

1. Add sitemap, robots, canonical metadata, OG images, and structured data.
2. Replace raw images with optimized `next/image`.
3. Improve accessibility and keyboard/focus behavior.
4. Add automated unit, integration, concurrency, payment, and end-to-end tests.
5. Add backups, disaster recovery, audit logs, and operational dashboards.
6. Migrate deprecated Next.js middleware conventions.

## Secure Architecture Recommendation

```text
Availability request
        ↓
Server validates strict dates, capacity, room status
        ↓
Create short-lived reservation hold with idempotency key
        ↓
Database transaction locks room inventory
        ↓
Create immutable payment attempt
        ↓
Create Razorpay order using authoritative server amount
        ↓
Client pays using public Razorpay key
        ↓
Server verifies signature and queries Razorpay payment/order
        ↓
Webhook verifies raw-body signature and event ID
        ↓
Idempotent transaction marks payment captured
        ↓
Booking becomes CONFIRMED
        ↓
Expired/failed holds are released automatically
```

Recommended state model:

- Booking: `HOLD → PAYMENT_PENDING → CONFIRMED`
- Failure: `HOLD/PAYMENT_PENDING → EXPIRED/FAILED`
- Cancellation: `CONFIRMED → CANCEL_REQUESTED → CANCELLED/REFUNDED`
- Payment: `CREATED → AUTHORIZED → CAPTURED → REFUNDED`

Important implementation rules:

- Never accept client price, nights, room status, or capacity decisions.
- Use an idempotency key for booking creation and payment-order creation.
- Store payment attempts instead of overwriting one payment row.
- Store webhook event IDs with a unique constraint.
- Treat Razorpay webhook reconciliation as authoritative.
- Confirm bookings only after verified captured payment.
- Expire unpaid holds automatically.
- Use database locking or PostgreSQL exclusion constraints to prevent overlap.

## Is Resort Arranyak Safe for Production?

**NO**

The five most important fixes before accepting real customer bookings are:

1. Remove the known seeded admin password and rotate credentials.
2. Eliminate public booking-record access and secure payment/order ownership.
3. Fix inventory concurrency and add expiring reservation holds.
4. Enforce room status, guest capacity, strict dates, and payment state transitions server-side.
5. Finish and test the real booking, payment, contact, and admin UI flows end to end.

## Production Hardening Implementation Update — 2026-10-07

The requested hardening changes have been implemented in the codebase.

### Implemented

- Removed the public booking-by-ID endpoint and replaced it with opaque access tokens for customer-facing booking/payment flows.
- Added strict Zod validation for dates, guest details, room data, enquiries, authentication, and payment verification.
- Added expiring booking holds, room status/capacity checks, serializable transactions, row locking, idempotent booking creation, and retry handling for serialization conflicts.
- Added explicit booking and payment state machines, payment-attempt history, server-side Razorpay amount/currency/payment verification, and durable webhook-event deduplication.
- Added database-backed rate limits for authentication, booking, availability, enquiry, payment, webhook, and admin-sensitive operations.
- Added current database role checks for admin APIs, functional admin login, and protected admin pages.
- Added security headers/CSP, disabled the powered-by header, removed the seeded hardcoded admin password, and added secure environment bootstrap variables.
- Connected public booking/contact flows and the main admin dashboard, room, booking, and enquiry screens to live APIs.
- Added an internal cron-protected hold-expiry endpoint and a staging-only concurrency smoke-test script.
- Added the production-hardening Prisma migration at `prisma/migrations/0001_production_hardening/migration.sql`.

### Verification

- `npx prisma generate` — PASS
- `npx tsc --noEmit` — PASS
- `npm run lint` — PASS; 0 errors, 10 existing/non-blocking warnings
- `npx next build --debug` — PASS with network access; 40 static pages generated
- `npm audit` — PASS; 0 vulnerabilities after upgrading Next.js and eslint-config-next to 16.4.0
- Concurrency smoke test — NOT VERIFIED; requires a running staging application and database
- Razorpay payment/webhook end-to-end test — NOT VERIFIED; requires provider credentials and test transactions
- Prisma migration deployment — NOT VERIFIED; must be run against the target PostgreSQL database after backup review

### Remaining production risks

- The migration has been authored and validated by Prisma generation/build but has not been deployed to the real database.
- External Razorpay and concurrent-booking tests still need to run in staging.
- The current payment-order implementation performs the provider order call inside a database transaction; an operational reconciliation job should handle a rare provider-success/database-failure orphan-order case.
- Next.js 16.4 reports that the `middleware` convention is deprecated in favor of `proxy`; this should be migrated in a follow-up before the framework removes compatibility.
- Some auxiliary admin screens (offers, gallery, amenities, settings, customers) remain presentation-only because the existing schema has no corresponding persisted models.

### Final verdict

**NOT PRODUCTION READY YET** — the security and correctness implementation is substantially hardened and passes static/build checks, but production approval still depends on applying the migration and completing staging database, concurrency, Razorpay, webhook, backup/restore, and operational monitoring tests.
