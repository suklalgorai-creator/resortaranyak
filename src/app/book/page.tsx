'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BedDouble, CalendarDays, CheckCircle2, Clock3, Mail, Phone, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { motion } from 'framer-motion';

type Room = {
  id: string;
  slug: string;
  name: string;
  pricePerNight: number;
  maxGuests: number;
  status: string;
  images: string[];
};

type BookingResponse = {
  booking: { bookingCode: string; nights: number; totalAmount: number; status: string };
};

const inputClass = 'mt-2 w-full rounded-xl border border-stone-200 bg-stone-50/70 px-4 py-3.5 text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10 dark:border-white/10 dark:bg-white/5 dark:text-stone-100 dark:focus:bg-white/10';

export default function BookPage() {
  const router = useRouter();
  const [roomFromUrl, setRoomFromUrl] = useState<string | null>(null);
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
    setRoomFromUrl(new URLSearchParams(window.location.search).get('room'));
    fetch('/api/rooms')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load rooms');
        const result = await response.json() as { data: Room[] };
        setRooms(result.data.filter((room) => room.status === 'AVAILABLE'));
      })
      .catch(() => setError('Unable to load rooms. Please try again later.'))
      .finally(() => setLoadingRooms(false));
  }, []);

  useEffect(() => {
    if (!roomFromUrl || rooms.length === 0) return;
    const matchingRoom = rooms.find((room) => room.slug === roomFromUrl || room.id === roomFromUrl);
    if (matchingRoom) {
      setSelectedRoom(matchingRoom.id);
      setGuests((currentGuests) => Math.min(currentGuests, matchingRoom.maxGuests));
    }
  }, [roomFromUrl, rooms]);

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
    selected && checkIn && checkOut && name.trim() && phone.trim() && email.trim() && nights > 0 && guests <= selected.maxGuests,
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
      if (!bookingResponse.ok || !bookingResult.data) throw new Error(bookingResult.error || 'Unable to send booking request');

      router.push(`/booking/confirmation/${encodeURIComponent(bookingResult.data.booking.bookingCode)}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to send booking request');
      setSubmitting(false);
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-amber-50/40 px-4 pb-24 pt-28 dark:from-[#101713] dark:via-[#17251e] dark:to-[#101713] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mb-10 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-gold"><Sparkles className="h-3.5 w-3.5" /> Plan your escape</span>
          <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-forest dark:text-stone-100 sm:text-5xl md:text-6xl">Request your stay</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600 dark:text-stone-300">Tell us when you would like to visit. Our team will check availability and get back to you with a confirmation.</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)] lg:items-start">
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} onSubmit={handleSubmit} className="rounded-3xl border border-stone-200/80 bg-white/90 p-5 shadow-[0_24px_80px_-35px_rgba(23,58,42,0.45)] backdrop-blur sm:p-8 dark:border-white/10 dark:bg-white/[0.06]">
            <div className="mb-7 flex items-start justify-between gap-4 border-b border-stone-100 pb-6 dark:border-white/10">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Step 1</p><h2 className="mt-1 font-serif text-2xl font-semibold text-forest dark:text-stone-100">Choose your room</h2></div>
              <div className="hidden rounded-2xl bg-forest/5 p-3 text-forest sm:block dark:bg-white/10 dark:text-gold"><BedDouble className="h-6 w-6" /></div>
            </div>

            {error && <div role="alert" className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span className="mt-0.5">!</span><span>{error}</span></div>}
            <div>
              <div className="mb-3 flex items-center justify-between"><label className="text-sm font-semibold text-stone-700 dark:text-stone-200">Available room types</label><span className="text-xs text-stone-500 dark:text-stone-400">No payment required</span></div>
              {loadingRooms ? <div className="grid gap-3 sm:grid-cols-2"><div className="h-24 animate-pulse rounded-2xl bg-stone-100 dark:bg-white/10" /><div className="h-24 animate-pulse rounded-2xl bg-stone-100 dark:bg-white/10" /></div> : rooms.length === 0 ? <p className="rounded-2xl bg-stone-50 p-5 text-sm text-stone-500 dark:bg-white/5">No rooms are currently available.</p> : <div className="grid gap-3 sm:grid-cols-2">{rooms.map((room) => <button key={room.id} type="button" aria-pressed={selectedRoom === room.id} onClick={() => { setSelectedRoom(room.id); setGuests(Math.min(guests, room.maxGuests)); resetRequest(); }} className={`group flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${selectedRoom === room.id ? 'border-gold bg-gold/10 shadow-[0_8px_24px_-16px_rgba(211,154,24,0.9)] ring-2 ring-gold/20' : 'border-stone-200 bg-white hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]'}`}><img src={room.images[0] || '/hero-resort.jpg'} alt="" className="h-16 w-16 rounded-xl object-cover" /><span className="min-w-0 flex-1"><span className="block truncate font-semibold text-stone-800 dark:text-stone-100">{room.name}</span><span className="mt-1 block text-xs text-stone-500 dark:text-stone-400">Up to {room.maxGuests} guests</span><span className="mt-1 block text-sm font-bold text-gold">Rs. {room.pricePerNight.toLocaleString()} / night</span></span><CheckCircle2 className={`h-5 w-5 shrink-0 ${selectedRoom === room.id ? 'text-gold' : 'text-stone-200 dark:text-white/15'}`} /></button>)}</div>}
            </div>

            <div className="mt-8 border-t border-stone-100 pt-7 dark:border-white/10"><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gold">Step 2 · Dates & guests</p><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-stone-700 dark:text-stone-200"><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-gold" /> Check-in date</span><input required type="date" min={today} value={checkIn} onChange={(event) => { setCheckIn(event.target.value); resetRequest(); }} className={inputClass} /></label><label className="text-sm font-semibold text-stone-700 dark:text-stone-200"><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-gold" /> Check-out date</span><input required type="date" min={checkIn || today} value={checkOut} onChange={(event) => { setCheckOut(event.target.value); resetRequest(); }} className={inputClass} /></label></div><label className="mt-5 block text-sm font-semibold text-stone-700 dark:text-stone-200"><span className="flex items-center gap-2"><Users className="h-4 w-4 text-gold" /> Number of guests</span><select required value={guests} onChange={(event) => { setGuests(Number(event.target.value)); resetRequest(); }} className={inputClass}>{Array.from({ length: selected?.maxGuests || 1 }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value} Guest{value > 1 ? 's' : ''}</option>)}</select></label></div>

            <div className="mt-8 border-t border-stone-100 pt-7 dark:border-white/10"><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gold">Step 3 · Your details</p><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-stone-700 dark:text-stone-200">Full name<input required maxLength={100} value={name} onChange={(event) => { setName(event.target.value); resetRequest(); }} placeholder="Your full name" className={inputClass} /></label><label className="text-sm font-semibold text-stone-700 dark:text-stone-200"><span className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> Phone number</span><input required maxLength={30} value={phone} onChange={(event) => { setPhone(event.target.value); resetRequest(); }} placeholder="+91 ..." className={inputClass} /></label><label className="text-sm font-semibold text-stone-700 dark:text-stone-200 sm:col-span-2"><span className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> Email address</span><input required type="email" maxLength={254} value={email} onChange={(event) => { setEmail(event.target.value); resetRequest(); }} placeholder="you@example.com" className={inputClass} /></label></div><label className="mt-5 block text-sm font-semibold text-stone-700 dark:text-stone-200">Special requests <span className="font-normal text-stone-400">(optional)</span><textarea maxLength={1000} value={specialRequests} onChange={(event) => { setSpecialRequests(event.target.value); resetRequest(); }} placeholder="Dietary needs, arrival time, or anything else we should know..." className={`${inputClass} resize-none`} rows={4} /></label></div>

            <button type="submit" disabled={submitting || !canSubmit} aria-busy={submitting} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-4 text-base font-bold text-stone-950 shadow-lg shadow-gold/20 transition hover:bg-gold-light hover:shadow-gold/30 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'Sending request...' : 'Send booking request'}{!submitting && <ArrowRight className="h-5 w-5" />}</button>
          </motion.form>

          <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="space-y-4 lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-3xl bg-forest p-6 text-white shadow-xl shadow-forest/20 sm:p-7"><div className="flex items-center gap-3"><div className="rounded-2xl bg-gold p-3 text-stone-950"><Clock3 className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-light">Your request</p><h2 className="mt-1 font-serif text-2xl">Stay summary</h2></div></div><div className="mt-7 space-y-4 border-t border-white/15 pt-5 text-sm">{selected ? <><div className="flex justify-between gap-4"><span className="text-white/65">Room</span><strong className="text-right">{selected.name}</strong></div><div className="flex justify-between gap-4"><span className="text-white/65">Guests</span><strong>{guests}</strong></div>{nights > 0 && <div className="flex justify-between gap-4"><span className="text-white/65">Stay</span><strong>{nights} night{nights > 1 ? 's' : ''}</strong></div>}<div className="flex justify-between gap-4 border-t border-white/15 pt-4"><span className="text-white/65">Estimated total</span><strong className="text-lg text-gold-light">{nights > 0 ? `Rs. ${total.toLocaleString()}` : 'Select dates'}</strong></div></> : <p className="leading-6 text-white/70">Select a room and dates to see your estimated stay summary.</p>}</div></div>
            <div className="rounded-3xl border border-stone-200 bg-white/80 p-6 dark:border-white/10 dark:bg-white/[0.06]"><p className="text-sm font-semibold text-forest dark:text-stone-100">What happens next?</p><ul className="mt-4 space-y-4 text-sm text-stone-600 dark:text-stone-300"><li className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-gold" /><span>We check the room availability for your dates.</span></li><li className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-gold" /><span>Our team contacts you to confirm the stay.</span></li><li className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-gold" /><span>No payment is required at this stage.</span></li></ul></div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
