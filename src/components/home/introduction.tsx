'use client';

import { motion } from 'framer-motion';

export default function Introduction() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-stone-50 dark:bg-[#0a0f0d] flex items-center justify-center">
      
      {/* Background Mountain Terrain Pattern (40% Visibility) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath fill='none' stroke='%23224422' stroke-width='0.8' d='M0 50 Q 50 10 100 50 T 200 50 M0 70 Q 50 30 100 70 T 200 70 M0 90 Q 50 50 100 90 T 200 90 M0 110 Q 50 70 100 110 T 200 110 M0 130 Q 50 90 100 130 T 200 130'/%3E%3Cpath fill='none' stroke='%23d4af37' stroke-width='0.5' d='M0 60 Q 50 20 100 60 T 200 60 M0 100 Q 50 60 100 100 T 200 100'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Soft radial glow so text stays readable over the pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,15,13,0.8)_80%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-forest dark:text-stone-100 mb-6 font-semibold tracking-wide drop-shadow-sm text-left leading-tight">
              Welcome to <br /> Resort Arranyak
            </h2>
            
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-transparent mb-8 opacity-80" />
            
            <div className="space-y-6 text-stone-700 dark:text-stone-300 text-base md:text-lg font-light leading-relaxed tracking-wide text-left">
              <p>
                Discover a sanctuary of peace at Resort Arranyak, where luxury meets the untamed beauty of nature. Located in the picturesque town of Ghatsila, our resort offers an unparalleled retreat away from the chaos of city life. Surrounded by dense, lush forests and the gentle rolling hills of Jharkhand, every moment here is an invitation to reconnect with the earth.
              </p>
              <p>
                Whether you are seeking a quiet weekend getaway or an adventurous exploration of the nearby Subarnarekha river and natural trails, Arranyak provides the perfect base. Wake up to the symphony of birds, breathe in the crisp forest air, and let the tranquility of our surroundings rejuvenate your spirit.
              </p>
              <p className="font-medium text-forest dark:text-gold-light mt-6">
                Experience authentic hospitality, premium amenities, and a deep respect for our environment. Your journey into nature begins here.
              </p>
            </div>
          </motion.div>

          {/* Right Side: Resort Image */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative h-[450px] md:h-[550px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 group"
          >
            <img 
              src="/gallery-6.jpg" 
              alt="Resort Arranyak Garden" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out" 
            />
            {/* Elegant inner shadow / gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent pointer-events-none" />
            
            {/* Decorative border frame */}
            <div className="absolute inset-4 border border-white/20 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}