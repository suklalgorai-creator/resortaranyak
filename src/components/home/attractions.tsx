const ATTRACTIONS = [
  {
    name: 'Burudih Lake',
    distance: '~9 km',
    description: 'A beautiful artificial lake surrounded by hills and dense forests. Perfect for boating and picnics.',
  },
  {
    name: 'Rankini Temple',
    distance: '~12 km',
    description: 'An ancient temple dedicated to Goddess Kali, located in the picturesque Jadugoda hills.',
  },
  {
    name: 'Subarnarekha River',
    distance: '~3 km',
    description: 'The golden river flowing near Ghatsila offers scenic sunset views and rocky shores for relaxing.',
  },
  {
    name: 'Galudih Barrage',
    distance: '~15 km',
    description: 'A majestic dam on the Subarnarekha river, offering stunning panoramic views of the water and hills.',
  },
  {
    name: 'Dharagiri Falls',
    distance: '~10 km',
    description: 'A pristine waterfall accessible via a short forest trek near Burudih Lake.',
  },
  {
    name: 'Phuldungri Hills',
    distance: '~4 km',
    description: 'A series of hillocks providing a vantage point for spectacular aerial views of Ghatsila town.',
  },
];

export default function Attractions() {
  return (
    <section className="py-20 md:py-32 bg-white px-4 sm:px-6 lg:px-8 border-y border-stone-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-green-900 mb-4 font-semibold">
            Explore the Neighbourhood
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Discover the natural wonders, historical sites, and cultural heritage surrounding Ghatsila.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {ATTRACTIONS.map((attraction, index) => (
            <div 
              key={index}
              className="border border-stone-200 rounded-lg p-6 hover:border-green-300 hover:bg-green-50/50 transition-colors duration-300 group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-green-900 group-hover:text-green-700">
                  {attraction.name}
                </h3>
                <span className="inline-block px-2 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-sm group-hover:bg-green-100 group-hover:text-green-800 transition-colors">
                  {attraction.distance}
                </span>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed">
                {attraction.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
