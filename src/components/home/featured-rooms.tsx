import Link from 'next/link';
import { featuredRooms } from '@/lib/data';

export default function FeaturedRooms() {
  return (
    <section className="py-20 md:py-32 bg-stone-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-green-900 mb-6 font-semibold">
            Our Rooms & Suites
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto text-lg">
            Carefully designed to blend seamlessly with nature while providing the utmost comfort and luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <div 
              key={room.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="h-64 w-full relative">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-green-900 shadow-sm">
                  {room.capacity}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-serif text-2xl text-green-900 font-semibold group-hover:text-green-700 transition-colors">
                    {room.name}
                  </h3>
                </div>
                
                <p className="text-stone-600 mb-6 line-clamp-2 h-12">
                  {room.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-green-800">
                    <span className="text-2xl font-bold">₹{room.price}</span>
                    <span className="text-sm text-stone-500 font-medium"> / night</span>
                  </div>
                  
                  <Link 
                    href={`/rooms/${room.id}`}
                    className="text-amber-700 hover:text-amber-800 font-semibold text-sm uppercase tracking-wider group-hover:underline underline-offset-4"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/rooms"
            className="inline-block px-8 py-3 border border-green-800 text-green-800 hover:bg-green-800 hover:text-white transition-colors duration-300 rounded-sm font-medium"
          >
            View All Rooms
          </Link>
        </div>
      </div>
    </section>
  );
}
