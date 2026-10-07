'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

const heroImages = [
  '/hero-resort.jpg',
  '/gallery-1.jpg',
  '/gallery-4.jpg',
  '/gallery-6.jpg',
  '/gallery-7.jpg',
  '/gallery-8.jpg',
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isZooming, setIsZooming] = useState(true);

  const goToNext = useCallback(() => {
    setIsZooming(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
      setIsZooming(true);
    }, 50);
  }, []);

  useEffect(() => {
    const timer = setInterval(goToNext, 6000);
    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* All images stacked — active one fades in with zoom */}
      {heroImages.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Resort view ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            transform: i === current && isZooming ? 'scale(1.15)' : 'scale(1)',
            transition: 'opacity 1.5s ease-in-out, transform 6s ease-out',
          }}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <span className="block text-gold-light uppercase tracking-[0.3em] text-sm md:text-base font-semibold mb-4 drop-shadow-md">
            Escape to Nature
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold leading-tight mb-6 drop-shadow-2xl">
            {siteConfig.name}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="text-lg md:text-2xl text-stone-200/90 mb-10 max-w-3xl drop-shadow-lg font-light"
        >
          {siteConfig.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0"
        >
          <Link
            href="/book"
            className="px-8 py-4 bg-gold hover:bg-gold-light text-stone-900 text-base sm:text-lg font-bold rounded-sm transition-all duration-300 text-center shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:-translate-y-1 whitespace-nowrap"
          >
            Book Your Stay
          </Link>
          <Link
            href="/rooms"
            className="px-8 py-4 bg-transparent border-2 border-white/80 text-white hover:bg-white hover:text-stone-900 text-base sm:text-lg font-bold rounded-sm transition-all duration-300 text-center hover:-translate-y-1 whitespace-nowrap backdrop-blur-sm"
          >
            Explore Rooms
          </Link>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setIsZooming(true); }}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === current ? 'bg-gold w-8' : 'bg-white/40 w-2 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}