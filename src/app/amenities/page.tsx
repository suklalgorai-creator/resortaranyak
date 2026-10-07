'use client';

import { amenities } from "@/lib/data";
import { motion } from "framer-motion";
import { 
  Waves, 
  UtensilsCrossed, 
  Car, 
  TreePine, 
  ConciergeBell,
  LifeBuoy,
  Ship,
  Activity,
  CheckCircle2
} from "lucide-react";

// Helper function to assign an icon based on the amenity name
const getIconForAmenity = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('boat')) return <Ship className="w-8 h-8" />;
  if (lowerName.includes('pool')) return <Waves className="w-8 h-8" />;
  if (lowerName.includes('restaurant') || lowerName.includes('food')) return <UtensilsCrossed className="w-8 h-8" />;
  if (lowerName.includes('pick') || lowerName.includes('drop')) return <Car className="w-8 h-8" />;
  if (lowerName.includes('garden') || lowerName.includes('lawn')) return <TreePine className="w-8 h-8" />;
  if (lowerName.includes('room service')) return <ConciergeBell className="w-8 h-8" />;
  if (lowerName.includes('water sport')) return <LifeBuoy className="w-8 h-8" />;
  if (lowerName.includes('game')) return <Activity className="w-8 h-8" />;
  
  return <CheckCircle2 className="w-8 h-8" />;
};

export default function AmenitiesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Premium Page Header */}
      <div className="bg-forest dark:bg-black/40 text-white py-16 md:py-24 px-4 text-center border-b border-stone-200/10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-serif mb-6 text-gold-light drop-shadow-md"
        >
          Resort Amenities
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-stone-200 max-w-2xl mx-auto text-lg md:text-xl font-light"
        >
          Everything you need for a perfect, relaxing getaway
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {amenities.map((amenity, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index}
              className="group flex flex-col items-center text-center p-8 bg-white/60 dark:bg-black/20 backdrop-blur-md rounded-2xl shadow-lg border border-stone-200/60 dark:border-white/10 hover:-translate-y-2 hover:border-gold/50 dark:hover:border-gold/40 transition-all duration-300"
            >
              <div className="w-20 h-20 mb-6 rounded-full bg-forest/5 dark:bg-gold/10 flex items-center justify-center text-forest dark:text-gold-light group-hover:scale-110 group-hover:bg-gold/10 transition-transform duration-500 shadow-inner">
                {getIconForAmenity(amenity)}
              </div>
              <h3 className="text-xl font-serif font-medium text-heading group-hover:text-gold-light transition-colors">
                {amenity}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}