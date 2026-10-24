'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { ArrowLeft, BedDouble, CalendarDays, Check, CheckCircle2, Clock3, Copy, Mail, MessageCircle, Phone, UserRound } from 'lucide-react';

type Booking = {
  id: string;
  bookingCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  arrivalTime: string | null;
  specialRequests: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  room: { name: string; slug: string; pricePerNight: number; maxGuests: number; bedType: string; roomSize: string | null };
};

function statusClass(status: string) {
  if (status === 'CONFIRMED' || status === 'COMPLETED') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300';
  if (status === 'CANCELLED' || status === 'FAILED' || status === 'EXPIRED') return 'bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300';
  return 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300';
}

function statusLabel(status: string) {
  return status.toLowerCase().replaceAll('_', ' ');
}

function dateLabel(value: string) {
  return new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/bookings/${id}`)
      .then(async (response) => {
        const result = await response.json() as { success: boolean; data?: Booking; error?: string };
        if (!response.ok || !result.data) throw new Error(result.error || 'Unable to load booking');
        if (!cancelled) setBooking(result.data);
      })
      .catch((loadError) => { if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Unable to load booking'); });
    return () => { cancelled = true; };
  }, [id]);

  async function updateStatus(status: string) {
    if (!booking || updating) return;
    setUpdating(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      const result = await response.json() as { success: boolean; data?: Booking; error?: string };
      if (!response.ok || !result.success || !result.data) throw new Error(result.error || 'Unable to update booking');
      setBooking(result.data);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update booking');
    } finally {
      setUpdating(false);
    }
  }

  async function copyReference() {
    if (!booking) return;
    await navigator.clipboard.writeText(booking.bookingCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  if (error && !booking) return <div className="space-y-4"><Link href="/admin/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-green-800 dark:text-green-400"><ArrowLeft className="h-4 w-4" /> Back to bookings</Link><p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-400/10 dark:text-red-300">{error}</p></div>;
  if (!booking) return <p className="text-stone-500">Loading booking…</p>;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link href="/admin/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-green-800 transition hover:text-gold dark:text-green-400"><ArrowLeft className="h-4 w-4" /> Back to bookings</Link>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">Booking request</p><h1 className="mt-2 text-2xl font-bold text-stone-800 dark:text-stone-100 sm:text-3xl">{booking.bookingCode}</h1><p className="mt-1 text-sm text-stone-500">Received {dateLabel(booking.createdAt)}</p></div>
        <span className={`w-fit rounded-full px-3 py-1.5 text-sm font-bold capitalize ${statusClass(booking.status)}`}>{statusLabel(booking.status)}</span>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-400/10 dark:text-red-300">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-800 dark:text-stone-100"><UserRound className="h-5 w-5 text-gold" /> Guest details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Name</p><p className="mt-1 text-stone-800 dark:text-stone-100">{booking.guestName}</p></div><div><p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Guests</p><p className="mt-1 text-stone-800 dark:text-stone-100">{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</p></div><a href={`mailto:${booking.guestEmail}`} className="flex items-center gap-2 text-sm text-stone-700 hover:text-gold dark:text-stone-200"><Mail className="h-4 w-4 text-gold" /> {booking.guestEmail}</a><a href={`tel:${booking.guestPhone}`} className="flex items-center gap-2 text-sm text-stone-700 hover:text-gold dark:text-stone-200"><Phone className="h-4 w-4 text-gold" /> {booking.guestPhone}</a></div>
          </section>
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-800 dark:text-stone-100"><CalendarDays className="h-5 w-5 text-gold" /> Stay details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Check-in</p><p className="mt-1 text-stone-800 dark:text-stone-100">{dateLabel(booking.checkIn)}</p></div><div><p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Check-out</p><p className="mt-1 text-stone-800 dark:text-stone-100">{dateLabel(booking.checkOut)}</p></div><div><p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Arrival time</p><p className="mt-1 flex items-center gap-1.5 text-stone-800 dark:text-stone-100"><Clock3 className="h-4 w-4 text-gold" /> {booking.arrivalTime || 'Not specified'}</p></div></div>
            <div className="mt-5 border-t border-stone-100 pt-5 dark:border-white/10"><p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Special requests</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-700 dark:text-stone-200">{booking.specialRequests || 'No special requests added.'}</p></div>
          </section>
        </div>
        <aside className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-6"><h2 className="flex items-center gap-2 text-lg font-bold text-stone-800 dark:text-stone-100"><BedDouble className="h-5 w-5 text-gold" /> Room</h2><p className="mt-4 text-xl font-semibold text-stone-800 dark:text-stone-100">{booking.room.name}</p><p className="mt-1 text-sm text-stone-500">{booking.room.bedType}{booking.room.roomSize ? ` · ${booking.room.roomSize}` : ''} · up to {booking.room.maxGuests} guests</p><div className="mt-5 border-t border-stone-100 pt-5 dark:border-white/10"><div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-300"><span>{booking.nights} {booking.nights === 1 ? 'night' : 'nights'} × Rs. {booking.room.pricePerNight.toLocaleString()}</span><span className="font-bold text-stone-800 dark:text-stone-100">Rs. {booking.totalAmount.toLocaleString()}</span></div><p className="mt-2 text-xs text-stone-500">Estimated total · payment is collected separately by the resort.</p></div></section>
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-6"><h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">Update request</h2><p className="mt-2 text-sm leading-6 text-stone-500">Confirm only after checking availability with the resort team.</p><div className="mt-5 space-y-3">{booking.status === 'REQUESTED' && <button disabled={updating} onClick={() => updateStatus('CONFIRMED')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"><CheckCircle2 className="h-4 w-4" /> Confirm request</button>}{booking.status === 'CONFIRMED' && <button disabled={updating} onClick={() => updateStatus('COMPLETED')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"><CheckCircle2 className="h-4 w-4" /> Mark completed</button>}{(booking.status === 'REQUESTED' || booking.status === 'CONFIRMED') && <button disabled={updating} onClick={() => updateStatus('CANCELLED')} className="w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-400/20 dark:text-red-300 dark:hover:bg-red-400/10">Cancel request</button>}{!['REQUESTED', 'CONFIRMED'].includes(booking.status) && <p className="rounded-xl bg-stone-50 p-3 text-center text-sm text-stone-500 dark:bg-white/5">No actions available for this status.</p>}</div></section>
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-6"><h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">Contact guest</h2><p className="mt-2 text-sm leading-6 text-stone-500">Use the request reference when confirming dates with the guest.</p><div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1"><a href={`mailto:${booking.guestEmail}?subject=${encodeURIComponent(`Arranyak booking ${booking.bookingCode}`)}&body=${encodeURIComponent(`Hello ${booking.guestName},\n\nWe are writing regarding your stay request ${booking.bookingCode} for ${booking.room.name}, ${dateLabel(booking.checkIn)} to ${dateLabel(booking.checkOut)}.\n\nRegards,\nResort Arranyak`)}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-3 text-sm font-bold text-stone-700 transition hover:border-gold hover:text-gold dark:border-white/10 dark:text-stone-200"><Mail className="h-4 w-4" /> Email guest</a><a target="_blank" rel="noopener noreferrer" href={`https://wa.me/${whatsappNumber(booking.guestPhone)}?text=${encodeURIComponent(`Hello ${booking.guestName}, this is Resort Arranyak regarding booking request ${booking.bookingCode} for ${booking.room.name} from ${dateLabel(booking.checkIn)} to ${dateLabel(booking.checkOut)}.`)}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-400/20 dark:text-emerald-300 dark:hover:bg-emerald-400/10"><MessageCircle className="h-4 w-4" /> WhatsApp guest</a><button type="button" onClick={copyReference} className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-3 text-sm font-bold text-stone-700 transition hover:border-gold hover:text-gold dark:border-white/10 dark:text-stone-200">{copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy reference'}</button></div></section>
        </aside>
      </div>
    </div>
  );
}
