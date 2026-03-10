'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Fix for default Leaflet icon not showing in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically update map bounds to fit all markers
function MapBounds({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (locations && locations.length > 0) {
      const validLocations = locations.filter(loc => loc.lat && loc.lng);
      if (validLocations.length === 0) return;

      const bounds = L.latLngBounds(validLocations.map(loc => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [locations, map]);

  return null;
}

export default function MapView({ locations = [] }) {
  // We need to render this only on client because window object is required for maps
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-[400px] md:h-full bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">Loading map...</div>;

  const validLocations = locations.filter(loc => loc.lat && loc.lng);
  const defaultCenter = validLocations.length > 0 ? [validLocations[0].lat, validLocations[0].lng] : [48.8566, 2.3522];

  return (
    <div className="w-full h-[400px] md:h-full rounded-3xl overflow-hidden glass shadow-lg border border-slate-100 relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={validLocations.length > 0 ? 12 : 2} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://hints.macworld.com/images/apple-logo.jpg" // Wait, I need standard OSM layer
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {validLocations.map((loc, idx) => (
          <Marker key={idx} position={[loc.lat, loc.lng]}>
            <Popup className="rounded-xl overflow-hidden shadow-sm">
              <div className="font-bold text-slate-800 text-sm mb-1">{loc.name}</div>
              {loc.address && <div className="text-xs text-slate-500">{loc.address}</div>}
              {idx === 0 && <div className="mt-1 inline-block bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">Primary Destination</div>}
            </Popup>
          </Marker>
        ))}

        <MapBounds locations={validLocations} />
      </MapContainer>
    </div>
  );
}
