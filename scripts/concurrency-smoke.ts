const baseUrl = process.env.CONCURRENCY_TEST_URL || 'http://localhost:3000';
const payloadText = process.env.CONCURRENCY_TEST_PAYLOAD;

if (process.env.ALLOW_CONCURRENCY_TEST !== 'true' || !payloadText) {
  throw new Error('Set ALLOW_CONCURRENCY_TEST=true and CONCURRENCY_TEST_PAYLOAD to run this staging-only test');
}

const payload = JSON.parse(payloadText) as Record<string, unknown>;
const requests = await Promise.all(Array.from({ length: 10 }, (_, index) => fetch(`${baseUrl}/api/bookings`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Idempotency-Key': `${crypto.randomUUID().replaceAll('-', '')}${index.toString().padStart(2, '0')}`,
  },
  body: JSON.stringify(payload),
})));

const results = await Promise.all(requests.map(async (response) => ({
  status: response.status,
  body: await response.json() as { success?: boolean },
})));
const successful = results.filter((result) => result.body.success === true).length;

console.log(JSON.stringify({ totalRequests: results.length, successfulReservations: successful, statuses: results.map((result) => result.status) }, null, 2));

if (successful > 1) {
  throw new Error(`Concurrency invariant failed: ${successful} reservations succeeded`);
}

export {};
