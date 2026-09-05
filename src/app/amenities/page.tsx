import { amenities } from "@/lib/data";

export default function AmenitiesPage() {
  return (
    <div className="min-h-screen bg-green-50/30 text-green-950">
      <div className="bg-green-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-serif mb-4">Resort Amenities</h1>
        <p className="text-green-100 max-w-2xl mx-auto text-lg">Everything you need for a perfect getaway</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {amenities.map((amenity, index) => (
            <div 
              key={index}
              className="flex items-center p-6 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-100 transition-colors">
                <span className="text-green-800 font-bold text-lg">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-medium text-green-900">{amenity}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
