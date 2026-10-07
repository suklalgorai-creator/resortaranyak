'use client';

import { motion } from 'framer-motion';
import { Leaf, BedDouble, UtensilsCrossed } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-24 min-h-screen">
      {/* Hero Header */}
      <div className="bg-forest dark:bg-black/40 text-white py-16 md:py-24 px-4 text-center border-b border-stone-200/10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-serif mb-6 text-gold-light drop-shadow-md"
        >
          About Resort Arranyak
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-stone-200 max-w-2xl mx-auto text-lg md:text-xl font-light"
        >
          A premium nature resort near Ghatsila, Jharkhand
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-serif text-forest dark:text-gold-light mb-6">Our Story</h2>
            <div className="space-y-4 text-lg text-stone-700 dark:text-stone-300 leading-relaxed font-light">
              <p>
                Nestled in the pristine landscape of Ghatsila, Resort Arranyak was born out of a deep connection to nature. We believe in providing an oasis where guests can disconnect from the bustling city life and reconnect with the tranquil rhythms of the forest.
              </p>
              <p>
                Our roots are deeply embedded in the history and culture of Ghatsila. Surrounded by lush greenery and soothing natural sounds, every corner of our resort is designed to bring you peace and relaxation.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative h-[450px] md:h-[550px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/20"
          >
            {/* The Gate Image */}
            <img 
              src="/hero-resort.jpg" 
              alt="Resort Arranyak Entrance Gate" 
              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-in-out" 
            />
            {/* Elegant overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </motion.div>
        </div>

        {/* Why Choose Us Section */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif text-forest dark:text-gold-light mb-6"
          >
            Why Choose Us
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto text-lg"
          >
            Experience the perfect blend of natural beauty, modern comfort, and culinary excellence.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Leaf className="w-8 h-8 text-forest dark:text-gold-light" />, title: 'Nature', desc: 'Immerse yourself in lush greenery, fresh air, and the soothing sounds of the forest.' },
            { icon: <BedDouble className="w-8 h-8 text-forest dark:text-gold-light" />, title: 'Comfort', desc: 'Cozy, well-appointed rooms and tents designed for your ultimate relaxation.' },
            { icon: <UtensilsCrossed className="w-8 h-8 text-forest dark:text-gold-light" />, title: 'Food', desc: 'Delicious, freshly prepared meals that promise a delightful culinary experience.' }
          ].map((feature, i) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-white/50 dark:bg-black/20 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-stone-200 dark:border-white/5 text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-forest/10 dark:bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-serif mb-4 text-forest dark:text-gold-light">{feature.title}</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-light">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}