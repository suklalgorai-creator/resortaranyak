import Link from 'next/link';
import { galleryImages } from '@/lib/data';

export default function GalleryPreview() {
  return (
    <section className="py-20 md:py-32 bg-stone-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-5xl text-green-900 mb-4 font-semibold">
              Glimpses of Arranyak
            </h2>
            <p className="text-stone-600 max-w-xl">
              Take a visual journey through our lush resort grounds, elegant accommodations, and serene surroundings.
            </p>
          </div>
          <Link 
            href="/gallery"
            className="hidden md:inline-flex mt-6 md:mt-0 items-center font-medium text-amber-700 hover:text-amber-800 uppercase tracking-wider text-sm group"
          >
            View Full Gallery
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
          {galleryImages.map((item) => (
            <div 
              key={item.id} 
              className={`relative rounded-lg overflow-hidden group cursor-pointer ${item.className}`}
            >
              {/* Image */}
              <img src={item.image} alt={item.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-medium text-lg tracking-wide">
                  {item.label}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link 
            href="/gallery"
            className="inline-flex items-center font-medium text-amber-700 hover:text-amber-800 uppercase tracking-wider text-sm"
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
