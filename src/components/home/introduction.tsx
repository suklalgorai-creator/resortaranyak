import { cn } from '@/lib/utils';

export default function Introduction() {
  return (
    <section className="py-20 md:py-32 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-5xl text-green-900 mb-8 font-semibold">
          Welcome to Resort Arranyak
        </h2>
        
        <div className="w-24 h-1 bg-amber-600 mx-auto mb-10 rounded-full opacity-80" />
        
        <div className="space-y-6 text-stone-600 text-base md:text-lg leading-relaxed">
          <p>
            Discover a sanctuary of peace at Resort Arranyak, where luxury meets the untamed beauty of nature. Located in the picturesque town of Ghatsila, our resort offers an unparalleled retreat away from the chaos of city life. Surrounded by dense, lush forests and the gentle rolling hills of Jharkhand, every moment here is an invitation to reconnect with the earth.
          </p>
          <p>
            Whether you are seeking a quiet weekend getaway or an adventurous exploration of the nearby Subarnarekha river and natural trails, Arranyak provides the perfect base. Wake up to the symphony of birds, breathe in the crisp forest air, and let the tranquility of our surroundings rejuvenate your spirit.
          </p>
          <p>
            Experience authentic hospitality, premium amenities, and a deep respect for our environment. Your journey into nature begins here.
          </p>
        </div>
      </div>
    </section>
  );
}
