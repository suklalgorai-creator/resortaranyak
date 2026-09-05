import { testimonials } from '@/lib/data';

export default function Testimonials() {
  return (
    <section className="py-12 md:py-24 bg-green-50 glass-section px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-green-900 dark:text-stone-200 mb-4 font-semibold">
            What Our Guests Say
          </h2>
          <p className="text-green-800/70 dark:text-stone-400 max-w-2xl mx-auto">
            Memories created at Arranyak, shared by those who experienced it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white glass-card p-8 rounded-xl shadow-sm dark:shadow-none hover:shadow-md transition-shadow relative"
            >
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
                
                <p className="text-stone-700 dark:text-stone-300 italic mb-8 flex-grow leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
                
                <div className="mt-auto">
                  <p className="font-semibold text-green-900 dark:text-stone-200">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

