'use client';

import { ArrowLeft, Upload, Save, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const availableAmenities = [
  'Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Fridge', 
  'Room Service', 'Balcony', 'Geyser/Hot Water', 'Tea/Coffee Maker'
];

export default function AddRoomPage() {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/rooms" className="p-2 rounded-lg bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-600 dark:text-stone-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 dark:text-stone-100">Add New Room</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Create a new room listing for the resort</p>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 glass-card rounded-xl border border-stone-200 dark:border-white/5 p-6 lg:p-8">
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Room Name</label>
              <input type="text" placeholder="e.g. Luxury Forest Tent" className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-white/10 bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">URL Slug</label>
              <input type="text" placeholder="e.g. luxury-forest-tent" className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-white/10 bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500/50" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Description</label>
            <textarea rows={4} placeholder="Describe the room, views, and experience..." className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-white/10 bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none"></textarea>
          </div>

          {/* Pricing & Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Price per Night (?)</label>
              <input type="number" placeholder="e.g. 5000" className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-white/10 bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Max Capacity</label>
              <input type="number" placeholder="e.g. 3" className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-white/10 bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Bed Type</label>
              <input type="text" placeholder="e.g. 1 King Bed" className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-white/10 bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500/50" />
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Room Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableAmenities.map(amenity => (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  type="button"
                  className={`px-3 py-2 rounded-lg text-sm font-medium border text-left transition-colors ${
                    selectedAmenities.includes(amenity)
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500/50 text-green-700 dark:text-green-400'
                      : 'border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-white/5'
                  }`}
                >
                  {selectedAmenities.includes(amenity) ? '? ' : '+ '} {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Room Images</label>
            <div className="border-2 border-dashed border-stone-300 dark:border-white/10 rounded-xl p-8 text-center hover:border-green-400 transition-colors cursor-pointer bg-stone-50 dark:bg-white/5">
              <Upload className="w-8 h-8 text-stone-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-stone-600 dark:text-stone-300">Click or drag images to upload</p>
              <p className="text-xs text-stone-400 mt-1">Recommended size: 1200x800px (JPG/PNG)</p>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-200 dark:border-white/5 flex items-center justify-end gap-4">
            <Link href="/admin/rooms" className="px-6 py-2.5 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors">
              Cancel
            </Link>
            <button type="submit" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-sm">
              <Save className="w-4 h-4" /> Save Room
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}