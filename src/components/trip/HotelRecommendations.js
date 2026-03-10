import { Building, Star, ExternalLink } from 'lucide-react';

export default function HotelRecommendations({ hotels, destination }) {
  if (!hotels || hotels.length === 0) return null;

  return (
    <div className="glass rounded-3xl p-6 sm:p-8 mt-8">
      <div className="flex items-center mb-6">
        <Building className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold text-slate-800">Where to Stay</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {hotels.map((hotel, idx) => (
          <a 
            key={idx} 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${destination || ''}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition flex items-center">
                {hotel.name}
                <ExternalLink className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <div className="bg-amber-50 rounded-lg px-2 py-1 flex items-center shrink-0 ml-2">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                <span className="text-xs font-semibold text-amber-700">{hotel.type}</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Highly recommended option fitting your {hotel.type.toLowerCase()} budget profile.
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
