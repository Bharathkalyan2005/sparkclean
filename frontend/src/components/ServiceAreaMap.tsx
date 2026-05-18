import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet'
import { DARK_TILES, CITY_CENTERS } from '../lib/mapConfig'

// Define service zones (dummy polygons for demo)
// Format is [lat, lng]
const BENGALURU_ZONES = [
  // Indiranagar area roughly
  [[12.98, 77.63], [12.98, 77.65], [12.96, 77.65], [12.96, 77.63]],
  // Koramangala area roughly
  [[12.94, 77.61], [12.94, 77.64], [12.92, 77.64], [12.92, 77.61]]
] as [number, number][][]

export default function ServiceAreaMap() {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
      <MapContainer
        center={[CITY_CENTERS.Bengaluru.lat, CITY_CENTERS.Bengaluru.lng]}
        zoom={11}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer url={DARK_TILES.url} attribution={DARK_TILES.attribution} />
        
        {BENGALURU_ZONES.map((zone, idx) => (
          <Polygon 
            key={idx} 
            positions={zone} 
            pathOptions={{ color: '#0AFFE6', fillColor: '#0AFFE6', fillOpacity: 0.2, weight: 2 }} 
          >
            <Popup className="dark-popup">
              <strong className="text-black">Spark Zone {idx + 1}</strong>
              <br />
              <span className="text-gray-800">Ultra-fast 20min ETA available</span>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
      
      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-black/80 backdrop-blur border border-white/20 p-3 rounded-lg text-xs leading-relaxed text-gray-300">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-[#0AFFE6]/30 border border-[#0AFFE6]"></div>
          <span>Active Service Zones</span>
        </div>
        <div>Bengaluru, IN</div>
      </div>
    </div>
  )
}