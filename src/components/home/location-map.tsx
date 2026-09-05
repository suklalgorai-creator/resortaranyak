import { siteConfig } from '@/config/site';

export default function LocationMap() {
  return (
    <section className="py-20 md:py-32 bg-stone-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-green-900 mb-4 font-semibold">
            Find Us
          </h2>
          <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full opacity-80" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Information Side */}
          <div className="order-2 lg:order-1 space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-green-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Resort Address
              </h3>
              <p className="text-stone-600 ml-7 leading-relaxed whitespace-pre-line">
                {siteConfig.name}<br />
                {siteConfig.address}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-green-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Key Distances
              </h3>
              <ul className="text-stone-600 ml-7 space-y-2">
                <li className="flex justify-between border-b border-stone-200 pb-2">
                  <span>From Jamshedpur:</span>
                  <span className="font-medium text-green-800">~60 km</span>
                </li>
                <li className="flex justify-between border-b border-stone-200 pb-2">
                  <span>From Kolkata:</span>
                  <span className="font-medium text-green-800">~250 km</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span>Nearest Railway Station:</span>
                  <span className="font-medium text-green-800">Ghatsila (GTS)</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-4 ml-7">
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium uppercase tracking-wider text-sm group"
              >
                Get Directions
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Map Side */}
          <div className="order-1 lg:order-2 h-[400px] lg:h-[500px] w-full rounded-xl overflow-hidden shadow-lg bg-stone-200 relative flex items-center justify-center">
            <iframe 
              src="https://maps.google.com/maps?q=Resort%20Aranyak,%20Ghatshila&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
