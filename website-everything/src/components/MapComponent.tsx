"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Next.js Leaflet icon fix
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Indore city coordinates
const BASE_LAT = 22.7196;
const BASE_LNG = 75.8577;

export default function MapComponent({ markers, activeMarker, setActiveMarker }: any) {
  return (
    <MapContainer 
      center={[BASE_LAT, BASE_LNG]} 
      zoom={14} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">Carto</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {markers.map((marker: any) => {
        // Use real lat/lng if available, otherwise fallback to slightly randomized around base
        const lat = marker.latitude || (BASE_LAT + (Math.random() - 0.5) * 0.01);
        const lng = marker.longitude || (BASE_LNG + (Math.random() - 0.5) * 0.01);

        return (
          <Marker 
            key={marker.id} 
            position={[lat, lng]}
            eventHandlers={{
              click: () => setActiveMarker(marker)
            }}
          >
            <Popup>
              <div className="text-sm font-sans min-w-[150px]">
                <div className="font-bold text-[#171918] text-base mb-1">{marker.title}</div>
                <div className="flex justify-between items-center text-xs mb-2 text-[#66706A]">
                  <span>{marker.ticket_id}</span>
                  <span className={`font-bold ${marker.severity?.toLowerCase() === 'high' || marker.severity?.toLowerCase() === 'critical' ? 'text-red-600' : 'text-orange-600'}`}>{marker.severity}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 font-medium text-blue-600">
                  Status: {marker.status}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
