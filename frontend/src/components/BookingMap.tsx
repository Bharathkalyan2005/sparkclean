import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { LIGHT_TILES, CITY_CENTERS } from '../lib/mapConfig'
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
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-[#EDE8DC] shadow-md relative">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer url={LIGHT_TILES.url} attribution={LIGHT_TILES.attribution} />
        
        <MapViewUpdater lat={centerLat} lng={centerLng} />

        {homeLat && homeLng && (
          <Marker position={[homeLat, homeLng]} icon={homePin} />
        )}
      </MapContainer>

      {/* Decorative overlay for the premium clean look */}
      <div className="absolute inset-0 pointer-events-none rounded-xl border border-[#EDE8DC] shadow-[inset_0_0_20px_rgba(27,67,50,0.05)] z-[1000]"></div>
    </div>
  )
}
