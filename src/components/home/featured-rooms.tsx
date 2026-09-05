"use client";

import Link from 'next/link';
import { featuredRooms } from '@/lib/data';
import { motion } from 'framer-motion';

export default function FeaturedRooms() {
  return (
    <section className="py-12 md:py-24 bg-stone-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-forest mb-6 font-semibold">
            Our Rooms & Suites
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto text-lg">
            Carefully designed to blend seamlessly with nature while providing the utmost comfort and luxury.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredRooms.map((room, index) => (
            <motion.div 
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="h-64 w-full relative overflow-hidden">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-forest shadow-sm">
                  {room.capacity}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-serif text-2xl text-forest font-semibold group-hover:text-gold transition-colors">
                    {room.name}
                  </h3>
                </div>
                
                <p className="text-stone-600 mb-6 line-clamp-2 h-12">
                  {room.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-forest">
                    <span className="text-2xl font-bold text-gold">₹{room.price}</span>
                    <span className="text-sm text-stone-500 font-medium"> / night</span>
                  </div>
                  
                  <Link 
                    href={`/rooms/${room.id}`}
                    className="text-gold hover:text-gold/80 font-semibold text-sm uppercase tracking-wider group-hover:underline underline-offset-4 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Link 
            href="/rooms"
            className="inline-block px-8 py-3 border border-forest text-forest hover:bg-forest hover:text-white transition-colors duration-300 rounded-sm font-medium"
          >
            View All Rooms
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
