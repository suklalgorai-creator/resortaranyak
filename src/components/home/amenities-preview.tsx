'use client';

import { motion } from 'framer-motion';
import { 
  Waves, 
  Wifi, 
  UtensilsCrossed, 
  CarFront, 
  TreePine, 
  Flame, 
  ConciergeBell, 
  Zap 
} from 'lucide-react';

const AMENITIES = [
  {
    name: 'Swimming Pool',
    description: 'Crystal clear pool surrounded by nature',
    icon: <Waves className="w-8 h-8" />,
    color: 'rgba(56, 189, 248, 0.6)', // Sky Blue
    borderColor: 'rgba(56, 189, 248, 1)',
  },
  {
    name: 'Free WiFi',
    description: 'High-speed internet in all areas',
    icon: <Wifi className="w-8 h-8" />,
    color: 'rgba(168, 85, 247, 0.6)', // Purple
    borderColor: 'rgba(168, 85, 247, 1)',
  },
  {
    name: 'Restaurant',
    description: 'Multi-cuisine dining experience',
    icon: <UtensilsCrossed className="w-8 h-8" />,
    color: 'rgba(251, 146, 60, 0.6)', // Orange
    borderColor: 'rgba(251, 146, 60, 1)',
  },
  {
    name: 'Parking',
    description: 'Secure, ample parking space',
    icon: <CarFront className="w-8 h-8" />,
    color: 'rgba(156, 163, 175, 0.6)', // Silver/Gray
    borderColor: 'rgba(156, 163, 175, 1)',
  },
  {
    name: 'Garden',
    description: 'Lush green landscaped gardens',
    icon: <TreePine className="w-8 h-8" />,
    color: 'rgba(74, 222, 128, 0.6)', // Green
    borderColor: 'rgba(74, 222, 128, 1)',
  },
  {
    name: 'Bonfire',
    description: 'Evening campfires on request',
    icon: <Flame className="w-8 h-8" />,
    color: 'rgba(248, 113, 113, 0.6)', // Red/Flame
    borderColor: 'rgba(248, 113, 113, 1)',
  },
  {
    name: 'Room Service',
    description: '24/7 in-room dining available',
    icon: <ConciergeBell className="w-8 h-8" />,
    color: 'rgba(212, 175, 55, 0.6)', // Gold
    borderColor: 'rgba(212, 175, 55, 1)',
  },
  {
    name: 'Power Backup',
    description: 'Uninterrupted power supply',
    icon: <Zap className="w-8 h-8" />,
    color: 'rgba(250, 204, 21, 0.6)', // Yellow
    borderColor: 'rgba(250, 204, 21, 1)',
  },
];

export default function AmenitiesPreview() {
  return (
    <section className="py-12 md:py-24 bg-transparent glass-section nature-bg px-4 sm:px-6 lg:px-8 border-y border-stone-100 dark:border-stone-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-heading mb-4 font-semibold drop-shadow-sm"
          >
            Resort Amenities
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto rounded-full opacity-80" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {AMENITIES.map((amenity, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index} 
              className="relative flex flex-col items-center text-center group p-6 rounded-2xl bg-white/40 dark:bg-black/40 backdrop-blur-md border border-stone-200/50 dark:border-white/10 transition-all duration-500 overflow-hidden"
              style={{ 
                /* Using custom properties for the hover glow effect */
                '--glow-color': amenity.color,
                '--border-color': amenity.borderColor,
              } as React.CSSProperties}
            >
              
              {/* Dynamic Hover Outline & Glow */}
              <div className="absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
                   style={{ 
                     boxShadow: '0 0 25px var(--glow-color)',
                     border: '1px solid var(--border-color)' 
                   }} 
              />
              
              {/* Subtle background highlight on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div 
                className="relative z-10 w-16 h-16 rounded-full bg-white dark:bg-stone-900 shadow-sm flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2"
                style={{ color: amenity.borderColor }}
              >
                {amenity.icon}
                
                {/* Icon inner glow */}
                <div 
                  className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ backgroundColor: amenity.borderColor }}
                />
              </div>
              
              <h3 className="relative z-10 text-xl font-serif font-medium text-heading mb-3 group-hover:text-stone-900 dark:group-hover:text-white transition-colors duration-300">
                {amenity.name}
              </h3>
              
              <p className="relative z-10 text-sm text-bodytext font-light group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors duration-300">
                {amenity.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}