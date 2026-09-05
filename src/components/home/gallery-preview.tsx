"use client";

import Link from 'next/link';
import { galleryImages } from '@/lib/data';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function GalleryPreview() {
  return (
    <section className="py-12 md:py-24 bg-stone-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-5xl text-forest mb-4 font-semibold">
              Glimpses of Arranyak
            </h2>
            <p className="text-stone-600 max-w-xl">
              Take a visual journey through our lush resort grounds, elegant accommodations, and serene surroundings.
            </p>
          </div>
          <Link 
            href="/gallery"
            className="hidden md:inline-flex mt-6 md:mt-0 items-center font-medium text-gold hover:text-gold/80 uppercase tracking-wider text-sm group transition-colors"
          >
            View Full Gallery
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr"
        >
          {galleryImages.map((item) => (
            <motion.div 
              variants={itemVariants}
              key={item.id} 
              className={`relative rounded-lg overflow-hidden group cursor-pointer ${item.className}`}
            >
              {/* Image */}
              <img src={item.image} alt={item.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              
              {/* Overlay with subtle gold tint */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-500" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100">
                <span className="w-12 h-12 rounded-full border border-gold flex items-center justify-center text-gold mb-3 bg-black/30 backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                <h3 className="text-white font-serif font-medium text-xl tracking-wide text-center">
                  {item.label}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center md:hidden">
          <Link 
            href="/gallery"
            className="inline-flex items-center font-medium text-gold hover:text-gold/80 uppercase tracking-wider text-sm transition-colors"
          >
            View Full Gallery
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
