import Link from 'next/link';
import { amenities } from '@/lib/data';
import { roomService } from '@/services/room.service';
import { Check, Users, Maximize, Wifi, Coffee, Wind, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function RoomDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let room;
  try {
    room = await roomService.getPublicBySlug(slug);
  } catch {
    notFound();
  }

  const roomAmenities = [
    { icon: <Wifi className="w-5 h-5" />, text: 'Free High-Speed WiFi' },
    { icon: <Wind className="w-5 h-5" />, text: 'Air Conditioning' },
    { icon: <Coffee className="w-5 h-5" />, text: 'Tea/Coffee Maker' },
    { icon: <Maximize className="w-5 h-5" />, text: room.roomSize ? room.roomSize : 'Comfortable space' },
    { icon: <Users className="w-5 h-5" />, text: `Up to ${room.maxGuests} guests` },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#1E1E1E] pb-20">
      <div className="relative h-[50vh] min-h-[400px] w-full bg-stone-900">
        <img src={room.images[0] || '/hero-resort.jpg'} alt={room.name} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16"><div className="container mx-auto max-w-6xl"><Link href="/rooms" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Rooms</Link><h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">{room.name}</h1></div></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section><h2 className="text-3xl font-serif font-semibold text-stone-800 dark:text-stone-200 mb-6">About this room</h2><p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed">{room.description}</p></section>
            <section><h3 className="text-2xl font-serif font-semibold text-stone-800 dark:text-stone-200 mb-6">Room Amenities</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{roomAmenities.map((amenity) => <div key={amenity.text} className="flex items-center gap-3 text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm dark:shadow-none"><div className="text-emerald-600 dark:text-emerald-500">{amenity.icon}</div><span className="font-medium">{amenity.text}</span></div>)}</div></section>
            <section><h3 className="text-2xl font-serif font-semibold text-stone-800 dark:text-stone-200 mb-6">Resort Facilities</h3><ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">{(room.amenities.length ? room.amenities : amenities).map((item) => <li key={item} className="flex items-center gap-3 text-stone-600 dark:text-stone-300"><Check className="w-5 h-5 text-emerald-500 flex-shrink-0" /><span>{item}</span></li>)}</ul></section>
          </div>

          <div className="lg:col-span-1"><div className="sticky top-24 bg-white dark:bg-stone-900 rounded-2xl shadow-xl dark:shadow-none border border-stone-100 dark:border-stone-800 p-8"><div className="mb-6 pb-6 border-b border-stone-100 dark:border-stone-800"><div className="text-3xl font-bold text-emerald-800 dark:text-emerald-400 mb-1">Rs. {room.pricePerNight.toLocaleString()}</div><div className="text-stone-500 dark:text-stone-400 text-sm">per night, excluding taxes</div></div><div className="space-y-4 mb-8"><div className="flex justify-between items-center text-stone-600 dark:text-stone-300"><span>Max Capacity</span><span className="font-semibold text-stone-800 dark:text-stone-200">{room.maxGuests} guests</span></div><div className="flex justify-between items-center text-stone-600 dark:text-stone-300"><span>Bed Type</span><span className="font-semibold text-stone-800 dark:text-stone-200">{room.bedType}</span></div></div><Link href={`/book?room=${encodeURIComponent(room.slug)}`} className="block w-full bg-emerald-700 hover:bg-emerald-800 text-white text-center py-4 rounded-xl font-semibold text-lg transition-colors duration-200 shadow-lg shadow-emerald-200 dark:shadow-none">Request this room</Link><p className="text-center text-stone-400 dark:text-stone-500 text-xs mt-4">No payment is required now</p></div></div>
        </div>
      </div>
    </div>
  );
}
