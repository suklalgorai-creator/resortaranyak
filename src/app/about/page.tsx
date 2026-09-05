import { galleryImages } from "@/lib/data";

export default function AboutPage() {
  const image = galleryImages.find((img) => img.label === 'Nature') || galleryImages[0];

  return (
    <div className="min-h-screen bg-green-50/30 dark:bg-[#1E1E1E] text-green-950 dark:text-stone-200">
      <div className="bg-green-900 dark:bg-[#111111] text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-serif mb-4">About Resort Arranyak</h1>
        <p className="text-green-100 max-w-2xl mx-auto text-lg">A premium nature resort near Ghatsila, Jharkhand</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-green-900 dark:text-stone-200">Our Story</h2>
            <p className="text-lg text-green-800/80 dark:text-stone-300 leading-relaxed">
              Nestled in the pristine landscape of Ghatsila, Resort Arranyak was born out of a deep connection to nature. We believe in providing an oasis where guests can disconnect from the bustling city life and reconnect with the tranquil rhythms of the forest.
            </p>
            <p className="text-lg text-green-800/80 dark:text-stone-300 leading-relaxed">
              Our roots are deeply embedded in the history and culture of Ghatsila. Surrounded by lush greenery and soothing natural sounds, every corner of our resort is designed to bring you peace and relaxation.
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={image.image} 
              alt={image.label} 
              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
            />
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif text-green-900 dark:text-stone-200 mb-4">Why Choose Us</h2>
          <p className="text-green-800/80 dark:text-stone-300 max-w-2xl mx-auto">Experience the perfect blend of natural beauty, modern comfort, and culinary excellence.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white glass-card p-8 rounded-xl shadow-sm border border-green-100 dark:border-stone-800 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6 text-green-800 dark:text-stone-200 text-2xl">
              🌿
            </div>
            <h3 className="text-xl font-bold mb-3 text-green-900 dark:text-stone-200">Nature</h3>
            <p className="text-green-800/70 dark:text-stone-400">Immerse yourself in lush greenery, fresh air, and the soothing sounds of the forest.</p>
          </div>
          
          <div className="bg-white glass-card p-8 rounded-xl shadow-sm border border-green-100 dark:border-stone-800 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6 text-green-800 dark:text-stone-200 text-2xl">
              🛏️
            </div>
            <h3 className="text-xl font-bold mb-3 text-green-900 dark:text-stone-200">Comfort</h3>
            <p className="text-green-800/70 dark:text-stone-400">Cozy, well-appointed rooms and tents designed for your ultimate relaxation.</p>
          </div>

          <div className="bg-white glass-card p-8 rounded-xl shadow-sm border border-green-100 dark:border-stone-800 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6 text-green-800 dark:text-stone-200 text-2xl">
              🍽️
            </div>
            <h3 className="text-xl font-bold mb-3 text-green-900 dark:text-stone-200">Food</h3>
            <p className="text-green-800/70 dark:text-stone-400">Delicious, freshly prepared meals that promise a delightful culinary experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
