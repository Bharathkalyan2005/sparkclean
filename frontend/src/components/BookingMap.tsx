import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { DARK_TILES, CITY_CENTERS } from '../lib/mapConfig'
import { homePin } from '../lib/mapIcons'

interface BookingMapProps {
  centerLat: number
  centerLng: number
  homeLat?: number
  homeLng?: number
}

// Component to dynamically update map view when props change
function MapViewUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], 13)
  }, [lat, lng, map])
  return null
}

export default function BookingMap({ centerLat, centerLng, homeLat, homeLng }: BookingMapProps) {
  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-white/10 shadow-lg relative">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer url={DARK_TILES.url} attribution={DARK_TILES.attribution} />
        
        <MapViewUpdater lat={centerLat} lng={centerLng} />

        {homeLat && homeLng && (
          <Marker position={[homeLat, homeLng]} icon={homePin} />
        )}
      </MapContainer>

      {/* Decorative overlay for the sci-fi clean look */}
      <div className="absolute inset-0 pointer-events-none rounded-xl border border-[#0AFFE6]/20 shadow-[inset_0_0_20px_rgba(10,255,230,0.1)] z-[1000]"></div>
    </div>
  )
}
