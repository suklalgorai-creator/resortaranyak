import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img src="https://aranyakresortghatsila.com/wp-content/uploads/2023/01/Deluxe2.jpg" alt={siteConfig.name} className="absolute inset-0 w-full h-full object-cover -z-10" />
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-16">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold leading-tight mb-6 drop-shadow-lg">
          Welcome to {siteConfig.name}
        </h1>
        <p className="text-lg md:text-2xl text-stone-200 mb-10 max-w-3xl drop-shadow-md">
          {siteConfig.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
          <Link 
            href="/book" 
            className="px-8 py-4 bg-green-700 hover:bg-green-600 text-white text-lg font-medium rounded-sm transition-colors duration-300 text-center shadow-lg hover:shadow-xl"
          >
            Book Your Stay
          </Link>
          <Link 
            href="/rooms" 
            className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-900 text-lg font-medium rounded-sm transition-all duration-300 text-center"
          >
            Explore Rooms
          </Link>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce hidden sm:flex flex-col items-center text-white opacity-80">
        <span className="text-sm font-medium mb-2 tracking-widest uppercase">Scroll</span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
