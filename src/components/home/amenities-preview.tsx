const AMENITIES = [
  {
    name: 'Swimming Pool',
    description: 'Crystal clear pool surrounded by nature',
    icon: '🏊‍♂️',
  },
  {
    name: 'Free WiFi',
    description: 'High-speed internet in all areas',
    icon: '📶',
  },
  {
    name: 'Restaurant',
    description: 'Multi-cuisine dining experience',
    icon: '🍽️',
  },
  {
    name: 'Parking',
    description: 'Secure, ample parking space',
    icon: '🚗',
  },
  {
    name: 'Garden',
    description: 'Lush green landscaped gardens',
    icon: '🌳',
  },
  {
    name: 'Bonfire',
    description: 'Evening campfires on request',
    icon: '🔥',
  },
  {
    name: 'Room Service',
    description: '24/7 in-room dining available',
    icon: '🛎️',
  },
  {
    name: 'Power Backup',
    description: 'Uninterrupted power supply',
    icon: '⚡',
  },
];

export default function AmenitiesPreview() {
  return (
    <section className="py-20 md:py-24 bg-white px-4 sm:px-6 lg:px-8 border-y border-stone-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-green-900 mb-4 font-semibold">
            Resort Amenities
          </h2>
          <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full opacity-80" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {AMENITIES.map((amenity, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center text-3xl mb-4 group-hover:bg-green-50 group-hover:scale-110 transition-all duration-300">
                {amenity.icon}
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                {amenity.name}
              </h3>
              <p className="text-sm text-stone-500">
                {amenity.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
