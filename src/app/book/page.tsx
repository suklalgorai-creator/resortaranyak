'use client';

import Script from 'next/script';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Users, BedDouble, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

type Room = {
  id: string;
  name: string;
  pricePerNight: number;
  maxGuests: number;
  status: string;
};

type BookingResponse = {
  booking: { id: string; bookingCode: string; nights: number; totalAmount: number };
  checkoutToken: string;
};

export default function BookPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const idempotencyKey = useRef<string | null>(null);

  useEffect(() => {
    fetch('/api/rooms')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load rooms');
        const result = await response.json() as { data: Room[] };
        setRooms(result.data.filter((room) => room.status === 'AVAILABLE'));
      })
      .catch(() => setError('Unable to load rooms. Please try again later.'))
      .finally(() => setLoadingRooms(false));
  }, []);

  const selected = rooms.find((room) => room.id === selectedRoom);
  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86_400_000))
    : 0;
  const total = selected ? selected.pricePerNight * nights : 0;
  const today = new Date().toISOString().slice(0, 10);

  const resetRequest = () => {
    idempotencyKey.current = null;
    setError('');
  };

  const canSubmit = useMemo(() => Boolean(
    selected && checkIn && checkOut && name && phone && email && nights > 0 && guests <= selected.maxGuests,
  ), [selected, checkIn, checkOut, name, phone, email, nights, guests]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || !selected) return;
    setSubmitting(true);
    setError('');
    const requestKey = idempotencyKey.current || crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '');
    idempotencyKey.current = requestKey;

    try {
      const availabilityResponse = await fetch(`/api/availability?roomId=${encodeURIComponent(selected.id)}&checkIn=${checkIn}&checkOut=${checkOut}`);
      if (!availabilityResponse.ok) throw new Error((await availabilityResponse.json()).error || 'Room is unavailable');
      const availability = await availabilityResponse.json() as { data: { available: boolean } };
      if (!availability.data.available) throw new Error('This room is no longer available for those dates');

      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestKey },
        body: JSON.stringify({ roomId: selected.id, checkIn, checkOut, guests, guestName: name, guestEmail: email, guestPhone: phone, specialRequests }),
      });
      const bookingResult = await bookingResponse.json() as { success: boolean; error?: string; data?: BookingResponse };
      if (!bookingResponse.ok || !bookingResult.data) throw new Error(bookingResult.error || 'Unable to create booking');

      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutToken: bookingResult.data.checkoutToken }),
      });
      const orderResult = await orderResponse.json() as { success: boolean; error?: string; data?: { id: string; amount: number; currency: string; key_id: string } };
      if (!orderResponse.ok || !orderResult.data) throw new Error(orderResult.error || 'Unable to start payment');
      if (!window.Razorpay) throw new Error('Payment checkout is still loading. Please try again.');

      const checkout = new window.Razorpay({
        key: orderResult.data.key_id,
        amount: orderResult.data.amount,
        currency: orderResult.data.currency,
        name: 'Resort Arranyak',
        description: `Booking ${bookingResult.data.booking.bookingCode}`,
        order_id: orderResult.data.id,
        prefill: { name, email, contact: phone },
        handler: async (response) => {
          const verification = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, checkoutToken: bookingResult.data?.checkoutToken }),
          });
          const result = await verification.json() as { success: boolean; error?: string };
          if (!verification.ok || !result.success) {
            setError(result.error || 'Payment could not be verified. Please contact the resort.');
            setSubmitting(false);
            return;
          }
          router.push(`/booking/confirmation/${encodeURIComponent(bookingResult.data?.booking.bookingCode || '')}`);
        },
        modal: { ondismiss: () => setSubmitting(false) },
      });
      checkout.open();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to complete booking');
      setSubmitting(false);
    }
  }

  return (
    <section className="min-h-screen pt-24 pb-16 px-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl md:text-5xl text-forest dark:text-stone-100 font-bold text-center mb-2">Book Your Stay</h1>
          <p className="text-center text-stone-500 dark:text-stone-400 mb-10">Reserve your perfect getaway at Resort Arranyak</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 glass-card rounded-2xl border border-stone-200 dark:border-white/5 p-6 md:p-10 shadow-xl space-y-8">
          {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p>}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3"><BedDouble className="w-4 h-4" /> Select Room Type</label>
            {loadingRooms ? <p className="text-stone-500">Loading rooms…</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rooms.map((room) => (
                  <button key={room.id} type="button" onClick={() => { setSelectedRoom(room.id); setGuests(Math.min(guests, room.maxGuests)); resetRequest(); }} className={`p-4 rounded-xl border text-left transition-all ${selectedRoom === room.id ? 'border-gold bg-gold/10 ring-2 ring-gold/30' : 'border-stone-200 dark:border-white/10 hover:border-gold/50'}`}>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{room.name}</span>
                    <span className="block text-sm text-gold font-bold mt-1">₹{room.pricePerNight.toLocaleString()}/night · up to {room.maxGuests}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <label className="text-sm font-semibold text-stone-700 dark:text-stone-300"><span className="flex items-center gap-2 mb-2"><CalendarDays className="w-4 h-4" /> Check-in Date</span><input required type="date" min={today} value={checkIn} onChange={(event) => { setCheckIn(event.target.value); resetRequest(); }} className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-transparent" /></label>
            <label className="text-sm font-semibold text-stone-700 dark:text-stone-300"><span className="flex items-center gap-2 mb-2"><CalendarDays className="w-4 h-4" /> Check-out Date</span><input required type="date" min={checkIn || today} value={checkOut} onChange={(event) => { setCheckOut(event.target.value); resetRequest(); }} className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-transparent" /></label>
          </div>

          <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300"><span className="flex items-center gap-2 mb-2"><Users className="w-4 h-4" /> Number of Guests</span><select required value={guests} onChange={(event) => { setGuests(Number(event.target.value)); resetRequest(); }} className="w-full sm:w-48 px-4 py-3 rounded-lg border border-stone-300 bg-transparent">{Array.from({ length: selected?.maxGuests || 1 }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value} Guest{value > 1 ? 's' : ''}</option>)}</select></label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <label className="text-sm font-semibold text-stone-700 dark:text-stone-300">Full Name<input required maxLength={100} value={name} onChange={(event) => { setName(event.target.value); resetRequest(); }} className="mt-2 w-full px-4 py-3 rounded-lg border border-stone-300 bg-transparent" /></label>
            <label className="text-sm font-semibold text-stone-700 dark:text-stone-300"><span className="flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</span><input required maxLength={30} value={phone} onChange={(event) => { setPhone(event.target.value); resetRequest(); }} className="mt-2 w-full px-4 py-3 rounded-lg border border-stone-300 bg-transparent" /></label>
            <label className="text-sm font-semibold text-stone-700 dark:text-stone-300">Email<input required type="email" maxLength={254} value={email} onChange={(event) => { setEmail(event.target.value); resetRequest(); }} className="mt-2 w-full px-4 py-3 rounded-lg border border-stone-300 bg-transparent" /></label>
          </div>
          <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">Special requests<textarea maxLength={1000} value={specialRequests} onChange={(event) => { setSpecialRequests(event.target.value); resetRequest(); }} className="mt-2 w-full px-4 py-3 rounded-lg border border-stone-300 bg-transparent" rows={3} /></label>

          {selected && nights > 0 && <div className="bg-stone-50 dark:bg-white/5 rounded-xl p-6 border border-stone-200"><div className="flex justify-between"><span>{nights} night{nights > 1 ? 's' : ''}</span><strong>₹{total.toLocaleString()}</strong></div></div>}
          <button type="submit" disabled={submitting || !canSubmit} className="w-full py-4 bg-gold hover:bg-gold-light disabled:opacity-50 text-stone-900 font-bold text-lg rounded-lg">{submitting ? 'Preparing secure checkout…' : 'Continue to secure payment'}</button>
        </form>
      </div>
    </section>
  );
}
