import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 z-0" />
      
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-white font-bold mb-6">
          Ready to Experience Arranyak?
        </h2>
        
        <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
          Book your stay now and immerse yourself in nature. Unwind, explore, and create unforgettable memories.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link 
            href="/book"
            className="w-full sm:w-auto px-8 py-4 bg-white text-green-900 font-semibold rounded-sm hover:bg-stone-100 transition-colors shadow-lg"
          >
            Book Now
          </Link>
          
          <Link 
            href="/contact"
            className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-sm hover:bg-white hover:text-green-900 transition-colors"
          >
            Contact Us
          </Link>
        </div>
        
        <div className="mt-12 text-green-200">
          <p className="text-sm uppercase tracking-widest mb-2 font-medium">Or call us directly</p>
          <a href="tel:+919876543210" className="text-2xl font-serif text-white hover:text-amber-400 transition-colors">
            +91 98765 43210
          </a>
        </div>
      </div>
    </section>
  );
}
