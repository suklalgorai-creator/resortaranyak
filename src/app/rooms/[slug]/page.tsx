import Link from 'next/link';
import { featuredRooms, amenities } from '@/lib/data';
import { Check, Users, Maximize, Wifi, Coffee, Wind, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default function RoomDetailsPage({ params }: { params: { slug: string } }) {
  // Try to find the room in our dummy data, or fallback to a default premium layout
  const room = featuredRooms.find(r => r.id === params.slug) || featuredRooms[0];

  if (!room) {
    notFound();
  }

  const roomAmenities = [
    { icon: <Wifi className="w-5 h-5" />, text: "Free High-Speed WiFi" },
    { icon: <Wind className="w-5 h-5" />, text: "Air Conditioning" },
    { icon: <Coffee className="w-5 h-5" />, text: "Tea/Coffee Maker" },
    { icon: <Maximize className="w-5 h-5" />, text: "Spacious Balcony" },
    { icon: <Users className="w-5 h-5" />, text: `Up to ${room.capacity}` },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#1E1E1E] pb-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-stone-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="container mx-auto max-w-6xl">
            <Link href="/rooms" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Rooms
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">{room.name}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-serif font-semibold text-stone-800 dark:text-stone-200 mb-6">About this room</h2>
              <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
                {room.description} Experience the ultimate relaxation in our premium accommodation, designed to blend seamlessly with the natural surroundings while providing uncompromising comfort and luxury.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-serif font-semibold text-stone-800 dark:text-stone-200 mb-6">Room Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roomAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm dark:shadow-none">
                    <div className="text-emerald-600 dark:text-emerald-500">{amenity.icon}</div>
                    <span className="font-medium">{amenity.text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-serif font-semibold text-stone-800 dark:text-stone-200 mb-6">Resort Facilities</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {amenities.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-stone-600 dark:text-stone-300">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-stone-900 rounded-2xl shadow-xl dark:shadow-none border border-stone-100 dark:border-stone-800 p-8">
              <div className="mb-6 pb-6 border-b border-stone-100 dark:border-stone-800">
                <div className="text-3xl font-bold text-emerald-800 dark:text-emerald-400 mb-1">
                  ₹{room.price}
                </div>
                <div className="text-stone-500 dark:text-stone-400 text-sm">per night, excluding taxes</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-300">
                  <span>Max Capacity</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{room.capacity}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-300">
                  <span>Bed Type</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">King/Twin</span>
                </div>
              </div>

              <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4 rounded-xl font-semibold text-lg transition-colors duration-200 shadow-lg shadow-emerald-200 dark:shadow-none">
                Check Availability
              </button>
              
              <p className="text-center text-stone-400 dark:text-stone-500 text-xs mt-4">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
