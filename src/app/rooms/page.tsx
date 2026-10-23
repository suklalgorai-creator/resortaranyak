'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Users, BedDouble, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/section-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Room = {
  id: string;
  slug: string;
  name: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedType: string;
  images: string[];
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/rooms')
      .then(async (response) => {
        const result = await response.json() as { success: boolean; data?: Room[]; error?: string };
        if (!response.ok || !result.data) throw new Error(result.error || 'Unable to load rooms');
        setRooms(result.data);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Unable to load rooms'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="relative flex min-h-[420px] items-center justify-center bg-forest px-4 pb-16 pt-28 text-white sm:min-h-[440px] sm:pt-32">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4">
          <SectionHeader className="mb-0" title="Our Rooms & Suites" subtitle="Experience the perfect blend of comfort and nature in our carefully designed accommodations." tone="light" />
        </div>
      </section>

      <section className="py-16 md:py-24 glass-section">
        <div className="container mx-auto px-4">
          {loading && <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto" aria-label="Loading rooms">{[1, 2, 3].map((item) => <div key={item} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"><div className="h-64 animate-pulse bg-stone-200 dark:bg-white/10" /><div className="space-y-4 p-6"><div className="h-7 w-2/3 animate-pulse rounded bg-stone-200 dark:bg-white/10" /><div className="h-4 w-full animate-pulse rounded bg-stone-100 dark:bg-white/5" /><div className="h-4 w-4/5 animate-pulse rounded bg-stone-100 dark:bg-white/5" /><div className="h-11 w-full animate-pulse rounded-xl bg-stone-200 dark:bg-white/10" /></div></div>)}</div>}
          {error && <p role="alert" className="mx-auto max-w-xl rounded-lg bg-red-50 p-4 text-center text-red-700">{error}</p>}
          {!loading && !error && rooms.length === 0 && <p className="text-center text-bodytext">No rooms are currently available.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {rooms.map((room, index) => (
              <motion.div key={room.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="glass-card rounded-2xl overflow-hidden flex flex-col group">
                <div className="relative h-64 overflow-hidden">
                  <img src={room.images[0] || '/hero-resort.jpg'} alt={room.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-4 right-4"><Badge variant="gold">Rs. {room.pricePerNight.toLocaleString()} / night</Badge></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif font-semibold text-heading mb-2">{room.name}</h3>
                  <p className="text-bodytext mb-6 flex-grow">{room.description}</p>
                  <div className="flex items-center gap-6 mb-6 text-sm text-bodytext"><div className="flex items-center gap-2"><Users className="w-4 h-4 text-forest" /><span>Up to {room.maxGuests}</span></div><div className="flex items-center gap-2"><BedDouble className="w-4 h-4 text-forest" /><span>{room.bedType}</span></div></div>
                  <Button href={`/rooms/${room.slug}`} className="w-full">View Details<ArrowRight className="w-4 h-4 ml-2" /></Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
