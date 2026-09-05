import Image from 'next/image';
import Link from 'next/link';
import { featuredRooms } from '@/lib/data';
import { Users, BedDouble } from 'lucide-react';

export default function RoomsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-gradient-to-r from-emerald-800 to-green-600 text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-white">Our Rooms & Suites</h1>
          <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto">
            Experience the perfect blend of comfort and nature in our carefully designed accommodations.
          </p>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredRooms.map((room) => (
              <div key={room.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-stone-100 flex flex-col">
                <div className="relative h-64 overflow-hidden group">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-emerald-800">
                    ₹{room.price} / night
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif font-semibold text-stone-800 mb-2">{room.name}</h3>
                  <p className="text-stone-600 mb-6 flex-grow">{room.description}</p>
                  
                  <div className="flex items-center gap-6 mb-6 text-sm text-stone-500">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>{room.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-emerald-600" />
                      <span>King/Twin Bed</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/rooms/${room.id}`}
                    className="block w-full text-center bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
