'use client';

import { useState } from 'react';
import { galleryImages } from '@/lib/data';

export default function AdminGalleryPage() {
  const [images, setImages] = useState(galleryImages);

  const handleDelete = (id: number) => {
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 dark:text-stone-100">Gallery</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">{images.length} photos uploaded</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm">
          ?? Upload Photos
        </button>
      </div>

      {/* Upload Area */}
      <div className="bg-white glass-card rounded-xl border-2 border-dashed border-stone-300 dark:border-white/10 p-12 text-center hover:border-green-400 dark:hover:border-green-500/30 transition-colors cursor-pointer">
        <div className="text-4xl mb-3">??</div>
        <p className="text-stone-600 dark:text-stone-400 font-medium">Drag and drop images here</p>
        <p className="text-sm text-stone-400 dark:text-stone-500 mt-1">or click to browse (JPG, PNG, WebP up to 5MB)</p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="group relative rounded-xl overflow-hidden bg-stone-100 dark:bg-white/5 aspect-square">
            <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                onClick={() => handleDelete(img.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                ??? Delete
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-xs font-medium truncate">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
