import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function CtaSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a2e1f] via-[#0d3a28] to-[#0a2e1f] z-0" />
      
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-white font-bold mb-6">
          Ready to Experience Arranyak?
        </h2>
        
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Book your stay now and immerse yourself in nature. Unwind, explore, and create unforgettable memories.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link 
            href="/book"
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 text-heading font-semibold rounded-sm hover:bg-stone-100 transition-colors shadow-lg"
          >
            Book Now
          </Link>
          
          <Link 
            href="/contact"
            className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-sm hover:bg-white dark:bg-white/5 hover:text-heading transition-colors"
          >
            Contact Us
          </Link>
        </div>
        
        <div className="mt-12 text-white/60">
          <p className="text-sm uppercase tracking-widest mb-2 font-medium">Or call us directly</p>
          <a href={`tel:${siteConfig.links.phone.replace(/[^0-9+]/g, '')}`} className="text-2xl font-serif text-white hover:text-gold transition-colors">
            {siteConfig.links.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
