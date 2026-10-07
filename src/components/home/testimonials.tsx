'use client';

import { testimonials } from '@/lib/data';
import { SectionHeader } from '@/components/ui/section-header';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function Testimonials() {
  return (
    <section className="py-12 md:py-24 bg-background glass-section nature-bg px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="What Our Guests Say" 
          subtitle="Memories created at Arranyak, shared by those who experienced it." 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card p-8 h-full relative border-none shadow-sm dark:shadow-none hover:shadow-md transition-shadow">
                {/* Quote icon */}
                <div className="absolute top-6 left-6 text-green-100 dark:text-stone-700 opacity-50">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex mb-6 text-amber-500 text-sm">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  
                  <p className="text-bodytext italic mb-8 flex-grow leading-relaxed">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  
                  <div className="mt-auto">
                    <p className="font-semibold text-heading">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-bodytext">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}