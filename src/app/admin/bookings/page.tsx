'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Booking = { id: string; bookingCode: string; guestName: string; guestEmail: string; guestPhone: string; room: { name: string }; checkIn: string; checkOut: string; totalAmount: number; status: string };

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const query = filter ? `?status=${encodeURIComponent(filter)}` : '';
    const response = await fetch(`/api/admin/bookings${query}`);
    const result = await response.json() as { success: boolean; data?: { data: Booking[] }; error?: string };
    if (!response.ok || !result.data) throw new Error(result.error || 'Unable to load bookings');
    setBookings(result.data.data);
  }

  useEffect(() => {
    let cancelled = false;
    const query = filter ? `?status=${encodeURIComponent(filter)}` : '';
    fetch(`/api/admin/bookings${query}`)
      .then(async (response) => {
        const result = await response.json() as { success: boolean; data?: { data: Booking[] }; error?: string };
        if (!response.ok || !result.data) throw new Error(result.error || 'Unable to load bookings');
        if (!cancelled) setBookings(result.data.data);
      })
      .catch((loadError) => { if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Unable to load bookings'); });
    return () => { cancelled = true; };
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    const response = await fetch(`/api/admin/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    const result = await response.json() as { success: boolean; error?: string };
    if (!response.ok || !result.success) throw new Error(result.error || 'Unable to update booking');
    await load();
  }

  return <div className="space-y-6"><div><h1 className="text-2xl lg:text-3xl font-bold text-stone-800 dark:text-stone-100">Bookings</h1><p className="text-stone-500 mt-1">Manage live reservations and payment states</p></div>{error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}<div className="flex gap-2"><select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border px-3 py-2"><option value="">All statuses</option><option value="HOLD">Hold</option><option value="PAYMENT_PENDING">Payment pending</option><option value="CONFIRMED">Confirmed</option><option value="CANCELLED">Cancelled</option><option value="EXPIRED">Expired</option></select><Link href="/admin/dashboard" className="rounded-lg border px-3 py-2">Dashboard</Link></div><div className="rounded-xl border bg-white dark:bg-white/5 overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-xs uppercase text-stone-500"><th className="p-4">Reference</th><th className="p-4">Guest</th><th className="p-4">Room</th><th className="p-4">Dates</th><th className="p-4">Amount</th><th className="p-4">Status</th></tr></thead><tbody>{bookings.map((booking) => <tr key={booking.id} className="border-t"><td className="p-4 font-mono text-sm">{booking.bookingCode}</td><td className="p-4"><div>{booking.guestName}</div><div className="text-xs text-stone-500">{booking.guestEmail}</div></td><td className="p-4">{booking.room.name}</td><td className="p-4 text-sm">{new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()}</td><td className="p-4">₹{booking.totalAmount.toLocaleString()}</td><td className="p-4"><select value={booking.status} onChange={(event) => updateStatus(booking.id, event.target.value).catch((updateError) => setError(updateError instanceof Error ? updateError.message : 'Unable to update booking'))} className="rounded border px-2 py-1 text-sm"><option value={booking.status}>{booking.status}</option><option value="CANCEL_REQUESTED">Request cancellation</option><option value="CANCELLED">Cancelled</option><option value="EXPIRED">Expired</option><option value="FAILED">Failed</option><option value="COMPLETED">Completed</option></select></td></tr>)}</tbody></table></div></div>;
}
