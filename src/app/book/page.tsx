'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Users, BedDouble, Phone } from 'lucide-react';
import Link from 'next/link';

const rooms = [
  { id: 'deluxe', name: 'Deluxe Cottage', price: 2500 },
  { id: 'nature', name: 'Nature View Room', price: 3500 },
  { id: 'family', name: 'Family Suite', price: 4500 },
  { id: 'tent', name: 'Luxury Forest Tent', price: 2000 },
];

export default function BookPage() {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const selected = rooms.find(r => r.id === selectedRoom);
  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const total = selected ? selected.price * nights : 0;

  return (
    <section className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl text-forest dark:text-stone-100 font-bold text-center mb-2">
            Book Your Stay
          </h1>
          <p className="text-center text-stone-500 dark:text-stone-400 mb-10">
            Reserve your perfect getaway at Resort Arranyak
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-white/5 glass-card rounded-2xl border border-stone-200 dark:border-white/5 p-6 md:p-10 shadow-xl"
        >
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">

            {/* Room Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
                <BedDouble className="w-4 h-4" /> Select Room Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rooms.map(room => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedRoom(room.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedRoom === room.id
                        ? 'border-gold bg-gold/10 dark:bg-gold/5 ring-2 ring-gold/30'
                        : 'border-stone-200 dark:border-white/10 hover:border-gold/50'
                    }`}
                  >
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{room.name}</span>
                    <span className="block text-sm text-gold font-bold mt-1">
                      &#x20B9;{room.price.toLocaleString()}/night
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  <CalendarDays className="w-4 h-4" /> Check-in Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  <CalendarDays className="w-4 h-4" /> Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                <Users className="w-4 h-4" /> Number of Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full sm:w-48 px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Guest Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2 block">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-gold/50" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  <Phone className="w-4 h-4" /> Phone
                </label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91-XXXXXXXXXX" className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-gold/50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2 block">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-gold/50" />
              </div>
            </div>

            {/* Price Summary */}
            {selected && nights > 0 && (
              <div className="bg-stone-50 dark:bg-white/5 rounded-xl p-6 border border-stone-200 dark:border-white/10">
                <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
                  <div className="flex justify-between"><span>{selected.name}</span><span>&#x20B9;{selected.price.toLocaleString()}/night</span></div>
                  <div className="flex justify-between"><span>{nights} night{nights > 1 ? 's' : ''}</span></div>
                  <div className="border-t border-stone-200 dark:border-white/10 pt-2 mt-2 flex justify-between font-bold text-lg text-stone-800 dark:text-stone-100">
                    <span>Total</span>
                    <span className="text-gold">&#x20B9;{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gold hover:bg-gold-light text-stone-900 font-bold text-lg rounded-lg transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:-translate-y-0.5"
            >
              Confirm Booking
            </button>

            <p className="text-center text-sm text-stone-500 dark:text-stone-400">
              Or call us directly: <a href="tel:+917362888864" className="text-gold hover:underline font-medium">+91-7362888864</a>
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}