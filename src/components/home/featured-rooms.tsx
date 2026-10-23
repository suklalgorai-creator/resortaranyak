'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Room = {
  id: string;
  slug: string;
  name: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  images: string[];
};

export default function FeaturedRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetch('/api/rooms')
      .then(async (response) => {
        if (!response.ok) return;
        const result = await response.json() as { data?: Room[] };
        setRooms((result.data || []).slice(0, 3));
      })
      .catch(() => undefined);
  }, []);

  return (
    <section className="py-12 md:py-24 bg-stone-50/90 dark:bg-stone-900/50 glass-section px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-[#173a2a] dark:text-stone-100 mb-6 font-semibold">Our Rooms & Suites</h2>
          <p className="text-stone-700 dark:text-stone-300 max-w-2xl mx-auto text-lg leading-relaxed">Carefully designed to blend seamlessly with nature while providing the utmost comfort and luxury.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rooms.length === 0 ? [1, 2, 3].map((item) => <div key={item} className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-md dark:border-white/10 dark:bg-white/5"><div className="h-64 animate-pulse bg-stone-200 dark:bg-white/10" /><div className="space-y-4 p-6"><div className="h-7 w-3/4 animate-pulse rounded bg-stone-200 dark:bg-white/10" /><div className="h-4 w-full animate-pulse rounded bg-stone-100 dark:bg-white/5" /><div className="h-4 w-2/3 animate-pulse rounded bg-stone-100 dark:bg-white/5" /></div></div>) : rooms.map((room, index) => (
            <motion.div key={room.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.2 }} className="bg-white dark:bg-white/5 glass-card rounded-lg overflow-hidden shadow-md dark:shadow-none hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1">
              <div className="h-64 w-full relative overflow-hidden"><img src={room.images[0] || '/hero-resort.jpg'} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /><div className="absolute top-4 right-4 bg-white dark:bg-stone-800/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-forest dark:text-stone-200 shadow-sm">Up to {room.maxGuests}</div></div>
              <div className="p-6"><div className="flex justify-between items-start mb-4"><h3 className="font-serif text-2xl text-[#173a2a] dark:text-stone-100 font-semibold group-hover:text-gold transition-colors">{room.name}</h3></div><p className="text-stone-700 dark:text-stone-300 mb-6 line-clamp-2 min-h-12">{room.description}</p><div className="flex items-center justify-between mt-auto"><div className="text-[#173a2a] dark:text-stone-200"><span className="text-2xl font-bold text-gold">Rs. {room.pricePerNight.toLocaleString()}</span><span className="text-sm text-stone-600 dark:text-stone-400 font-medium"> / night</span></div><Link href={`/rooms/${room.slug}`} className="text-gold hover:text-gold/80 font-semibold text-sm uppercase tracking-wider group-hover:underline underline-offset-4 transition-colors">View Details</Link></div></div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-16 text-center"><Link href="/rooms" className="inline-block px-8 py-3 border border-[#173a2a] dark:border-stone-400 text-[#173a2a] dark:text-stone-200 hover:bg-forest dark:hover:bg-stone-700 hover:text-white dark:hover:text-stone-100 transition-colors duration-300 rounded-sm font-medium">View All Rooms</Link></motion.div>
      </div>
    </section>
  );
}
