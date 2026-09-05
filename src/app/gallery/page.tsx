import Image from 'next/image';
import { galleryImages } from '@/lib/data';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-4">Photo Gallery</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Take a visual journey through our resort, capturing the essence of our peaceful surroundings and comfortable accommodations.
          </p>
        </div>

        {/* Masonry/CSS Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {galleryImages.map((img) => (
            <div 
              key={img.id} 
              className={`relative rounded-xl overflow-hidden group cursor-pointer ${
                img.id === 1 ? 'md:col-span-2 md:row-span-2' :
                img.id === 5 ? 'md:col-span-2 md:row-span-1' :
                'md:col-span-1 md:row-span-1'
              }`}
            >
              <Image
                src={img.image}
                alt={img.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-white font-medium">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
