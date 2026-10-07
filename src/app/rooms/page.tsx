'use client';

import Link from 'next/link';
import { featuredRooms } from '@/lib/data';
import { Users, BedDouble, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/section-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function RoomsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-forest text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center px-4">
          <SectionHeader 
            title="Our Rooms & Suites" 
            subtitle="Experience the perfect blend of comfort and nature in our carefully designed accommodations."
          />
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-16 md:py-24 glass-section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredRooms.map((room, index) => (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group"
              >
                <div className="relative h-64 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="gold">
                      ₹{room.price} / night
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif font-semibold text-heading mb-2">{room.name}</h3>
                  <p className="text-bodytext mb-6 flex-grow">{room.description}</p>
                  
                  <div className="flex items-center gap-6 mb-6 text-sm text-bodytext">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-forest" />
                      <span>{room.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-forest" />
                      <span>King/Twin Bed</span>
                    </div>
                  </div>
                  
                  <Button href={`/rooms/${room.id}`} className="w-full">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
