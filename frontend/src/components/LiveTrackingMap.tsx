import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { DARK_TILES, CITY_CENTERS } from '../lib/mapConfig'
import { homePin, cleanerPin, tealPin } from '../lib/mapIcons'

interface LiveTrackingMapProps {
  bookingId: string
  homeLat: number
  homeLng: number
  cleanerLat?: number
  cleanerLng?: number
  eta?: string
}

function RouteUpdater({
  route,
}: {
  route: [number, number][]
}) {
  const map = useMap()
  
  useEffect(() => {
    if (route.length > 0) {
      const bounds = L.latLngBounds(route)
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [route, map])

  return null
}

export default function LiveTrackingMap({
  bookingId,
  homeLat,
  homeLng,
  cleanerLat,
  cleanerLng,
  eta,
}: LiveTrackingMapProps) {
  const [route, setRoute] = useState<[number, number][]>([])
  
  // Fetch route from OSRM (Free Routing API)
  useEffect(() => {
    if (!cleanerLat || !cleanerLng || !homeLat || !homeLng) return

    const fetchRoute = async () => {
      try {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${cleanerLng},${cleanerLat};${homeLng},${homeLat}?overview=full&geometries=geojson`
        const res = await fetch(osrmUrl)
        const data = await res.json()
        
        if (data.routes && data.routes[0]) {
          // OSRM returns [lng, lat], we need [lat, lng] for Leaflet
          const coords = data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]])
          setRoute(coords)
        }
      } catch (err) {
        console.error('OSRM tracking error:', err)
      }
    }

    fetchRoute()
  }, [cleanerLat, cleanerLng, homeLat, homeLng])

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-[#0AFFE6]/30 shadow-[0_0_20px_rgba(10,255,230,0.15)] relative">
      <MapContainer
        center={[homeLat, homeLng]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer url={DARK_TILES.url} attribution={DARK_TILES.attribution} />

        <Marker position={[homeLat, homeLng]} icon={homePin}>
          <Popup className="dark-popup">
            <strong className="text-black">Your Home</strong>
          </Popup>
        </Marker>

        {cleanerLat && cleanerLng && (
          <Marker position={[cleanerLat, cleanerLng]} icon={cleanerPin}>
            <Popup className="dark-popup">
              <strong className="text-black">Spark Cleaner</strong>
              <br />
              <span className="text-gray-800 tracking-wider">ETA: {eta || 'Arriving Soon'}</span>
            </Popup>
          </Marker>
        )}

        {route.length > 0 && (
          <>
            <Polyline positions={route} color="#0AFFE6" weight={4} dashArray="10, 10" className="animate-dash" />
            <RouteUpdater route={route} />
          </>
        )}
      </MapContainer>
      
      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-black/60 backdrop-blur-md border border-[#0AFFE6]/40 p-3 rounded-lg text-white font-mono text-sm tracking-widest shadow-[0_0_15px_rgba(10,255,230,0.2)]">
        <div>TRACKING ID: {bookingId.slice(0, 8)}</div>
        {eta && <div className="text-[#0AFFE6] mt-1 font-bold">ETA: {eta} MIN</div>}
        <div className="text-xs text-gray-400 mt-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0AFFE6] animate-pulse"></span>
          LIVE CONNECTION
        </div>
      </div>
      <style>
        {`
          .animate-dash {
            stroke-dashoffset: 100;
            animation: dash 20s linear infinite;
          }
          @keyframes dash {
            to { stroke-dashoffset: 0; }
          }
        `}
      </style>
    </div>
  )
}