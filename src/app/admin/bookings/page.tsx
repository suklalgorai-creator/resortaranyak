'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Booking = {
  id: string;
  bookingCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  room: { name: string };
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: string;
};

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
    setError('');
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
    const response = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const result = await response.json() as { success: boolean; error?: string };
    if (!response.ok || !result.success) throw new Error(result.error || 'Unable to update booking');
    await load();
  }

  function statusClass(status: string) {
    if (status === 'CONFIRMED') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300';
    if (status === 'CANCELLED' || status === 'FAILED') return 'bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300';
    return 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300';
  }

  function statusLabel(status: string) {
    return status.toLowerCase().replace('_', ' ');
  }

  function StatusPill({ status }: { status: string }) {
    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusClass(status)}`}>{statusLabel(status)}</span>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 dark:text-stone-100">Booking requests</h1>
        <p className="text-stone-500 mt-1">Review requests and confirm availability manually</p>
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 dark:border-white/10 dark:bg-white/5 dark:text-stone-200">
          <option value="">All statuses</option>
          <option value="REQUESTED">Requested</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="FAILED">Failed</option>
        </select>
        <Link href="/admin/dashboard" className="rounded-xl border border-stone-200 px-4 py-2.5 text-center text-sm font-semibold text-stone-700 transition hover:border-gold hover:text-gold dark:border-white/10 dark:text-stone-200">Dashboard</Link>
      </div>
      {bookings.length === 0 && !error && <div className="rounded-2xl border border-dashed border-stone-300 bg-white/70 p-12 text-center dark:border-white/15 dark:bg-white/[0.03]"><p className="font-semibold text-stone-700 dark:text-stone-200">No booking requests found</p><p className="mt-1 text-sm text-stone-500">Try another status filter or wait for a new request.</p></div>}
      <div className="space-y-3 md:hidden">
        {bookings.map((booking) => <article key={booking.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs text-stone-500">{booking.bookingCode}</p><h2 className="mt-1 font-semibold text-stone-800 dark:text-stone-100">{booking.guestName}</h2></div><StatusPill status={booking.status} /></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-stone-400">Room</p><p className="mt-1 font-medium text-stone-700 dark:text-stone-200">{booking.room.name}</p></div><div><p className="text-xs text-stone-400">Guests</p><p className="mt-1 text-stone-700 dark:text-stone-200">{booking.guestEmail}</p></div><div><p className="text-xs text-stone-400">Dates</p><p className="mt-1 text-stone-700 dark:text-stone-200">{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</p></div><div><p className="text-xs text-stone-400">Estimate</p><p className="mt-1 font-semibold text-gold">Rs. {booking.totalAmount.toLocaleString()}</p></div></div><select aria-label={`Update ${booking.bookingCode} status`} value={booking.status} onChange={(event) => updateStatus(booking.id, event.target.value).catch((updateError) => setError(updateError instanceof Error ? updateError.message : 'Unable to update booking'))} className="mt-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5 dark:text-stone-200"><option value={booking.status}>{statusLabel(booking.status)}</option>{booking.status === 'REQUESTED' && <option value="CONFIRMED">Confirm request</option>}{(booking.status === 'REQUESTED' || booking.status === 'CONFIRMED') && <option value="CANCELLED">Cancel request</option>}{booking.status === 'CONFIRMED' && <option value="COMPLETED">Mark completed</option>}{(booking.status === 'REQUESTED' || booking.status === 'HOLD' || booking.status === 'PAYMENT_PENDING') && <option value="FAILED">Mark failed</option>}</select></article>)}
      </div>
      <div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04] md:block">
        <table className="w-full">
          <thead className="bg-stone-50 dark:bg-white/5"><tr className="text-left text-xs uppercase tracking-wider text-stone-500"><th className="p-4">Reference</th><th className="p-4">Guest</th><th className="p-4">Room</th><th className="p-4">Dates</th><th className="p-4">Amount</th><th className="p-4">Status</th></tr></thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="p-4 font-mono text-xs text-stone-500">{booking.bookingCode}</td>
                <td className="p-4"><div className="font-medium text-stone-800 dark:text-stone-100">{booking.guestName}</div><div className="text-xs text-stone-500">{booking.guestEmail}</div><div className="text-xs text-stone-500">{booking.guestPhone}</div></td>
                <td className="p-4 text-sm">{booking.room.name}</td>
                <td className="p-4 text-sm text-stone-600 dark:text-stone-300">{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</td>
                <td className="p-4 font-semibold text-gold">Rs. {booking.totalAmount.toLocaleString()}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2"><StatusPill status={booking.status} /><select aria-label={`Update ${booking.bookingCode} status`} value={booking.status} onChange={(event) => updateStatus(booking.id, event.target.value).catch((updateError) => setError(updateError instanceof Error ? updateError.message : 'Unable to update booking'))} className="max-w-28 rounded-lg border border-stone-200 bg-transparent px-2 py-1 text-xs dark:border-white/10 dark:text-stone-200">
                    <option value={booking.status}>{booking.status}</option>
                    {booking.status === 'REQUESTED' && <option value="CONFIRMED">Confirm request</option>}
                    {(booking.status === 'REQUESTED' || booking.status === 'CONFIRMED') && <option value="CANCELLED">Cancel request</option>}
                    {booking.status === 'CONFIRMED' && <option value="COMPLETED">Mark completed</option>}
                    {(booking.status === 'REQUESTED' || booking.status === 'HOLD' || booking.status === 'PAYMENT_PENDING') && <option value="FAILED">Mark failed</option>}
                  </select></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
