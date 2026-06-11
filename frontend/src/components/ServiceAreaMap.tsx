import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet'
import { LIGHT_TILES, CITY_CENTERS } from '../lib/mapConfig'

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
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-[#EDE8DC] shadow-md relative">
      <MapContainer
        center={[CITY_CENTERS.Bengaluru.lat, CITY_CENTERS.Bengaluru.lng]}
        zoom={11}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer url={LIGHT_TILES.url} attribution={LIGHT_TILES.attribution} />
        
        {BENGALURU_ZONES.map((zone, idx) => (
          <Polygon 
            key={idx} 
            positions={zone} 
            pathOptions={{ color: '#1B4332', fillColor: '#1B4332', fillOpacity: 0.2, weight: 2 }} 
          >
            <Popup className="light-popup">
              <strong className="text-black">Spark Zone {idx + 1}</strong>
              <br />
              <span className="text-gray-800">Ultra-fast 20min ETA available</span>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
      
      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur border border-[#EDE8DC] p-3 rounded-lg text-xs leading-relaxed text-[#2D4A35] shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-[#1B4332]/30 border border-[#1B4332]"></div>
          <span>Active Service Zones</span>
        </div>
        <div>Bengaluru, IN</div>
      </div>
    </div>
  )
}