import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from '@react-google-maps/api'
import { useState, useEffect } from 'react'

// Map locations — LIVE cities
const locations = [
  {
    id      : 1,
    name    : 'Koramangala',
    city    : 'Bengaluru',
    lat     : 12.9352,
    lng     : 77.6245,
    status  : 'LIVE',
    areas   : ['Koramangala', 'Indiranagar',
               'HSR Layout', 'BTM Layout'],
  },
  {
    id      : 2,
    name    : 'Bengaluru Central',
    city    : 'Bengaluru',
    lat     : 12.9716,
    lng     : 77.5946,
    status  : 'LIVE',
    areas   : ['Whitefield', 'Marathahalli',
               'Electronic City', 'Jayanagar'],
  },
  {
    id      : 3,
    name    : 'Bandra',
    city    : 'Mumbai',
    lat     : 19.0596,
    lng     : 72.8295,
    status  : 'LIVE',
    areas   : ['Bandra', 'Andheri',
               'Juhu', 'Worli'],
  },
  {
    id      : 4,
    name    : 'Thane',
    city    : 'Mumbai',
    lat     : 19.2183,
    lng     : 72.9781,
    status  : 'LIVE',
    areas   : ['Thane', 'Navi Mumbai',
               'Powai', 'Borivali'],
  },
  {
    id    : 5,
    name  : 'MVP Colony',
    city  : 'Visakhapatnam',
    state : 'Andhra Pradesh',
    lat   : 17.7231,
    lng   : 83.3012,
    status: 'LIVE',
    areas : [
      'MVP Colony', 'Madhurawada',
      'Rushikonda', 'Kommadi'
    ],
  },
  {
    id    : 6,
    name  : 'Dwaraka Nagar',
    city  : 'Visakhapatnam',
    state : 'Andhra Pradesh',
    lat   : 17.7326,
    lng   : 83.3162,
    status: 'LIVE',
    areas : [
      'Dwaraka Nagar', 'Seethammadhara',
      'Siripuram', 'Jagadamba'
    ],
  },
  {
    id    : 7,
    name  : 'Gajuwaka',
    city  : 'Visakhapatnam',
    state : 'Andhra Pradesh',
    lat   : 17.6917,
    lng   : 83.2115,
    status: 'LIVE',
    areas : [
      'Gajuwaka', 'NAD Junction',
      'Gopalapatnam', 'Bheemunipatnam'
    ],
  },

  // ── HYDERABAD PINS ──
  {
    id    : 8,
    name  : 'Banjara Hills',
    city  : 'Hyderabad',
    state : 'Telangana',
    lat   : 17.4156,
    lng   : 78.4347,
    status: 'LIVE',
    areas : [
      'Banjara Hills', 'Jubilee Hills',
      'Gachibowli', 'Hitech City',
    ],
  },
  {
    id    : 9,
    name  : 'Kukatpally',
    city  : 'Hyderabad',
    state : 'Telangana',
    lat   : 17.4848,
    lng   : 78.3990,
    status: 'LIVE',
    areas : [
      'Kukatpally', 'Begumpet',
      'Secunderabad', 'Ameerpet',
    ],
  },

  // ── BHOPAL PIN ──
  {
    id    : 10,
    name  : 'MP Nagar',
    city  : 'Bhopal',
    state : 'Madhya Pradesh',
    lat   : 23.2599,
    lng   : 77.4126,
    status: 'LIVE',
    areas : [
      'MP Nagar', 'Arera Colony',
      'Kolar Road', 'Shahpura',
    ],
  },

  // ── CHENNAI PINS ──
  {
    id    : 11,
    name  : 'Anna Nagar',
    city  : 'Chennai',
    state : 'Tamil Nadu',
    lat   : 13.0850,
    lng   : 80.2101,
    status: 'LIVE',
    areas : [
      'Anna Nagar', 'T. Nagar',
      'Nungambakkam', 'Mylapore',
    ],
  },
  {
    id    : 12,
    name  : 'Velachery',
    city  : 'Chennai',
    state : 'Tamil Nadu',
    lat   : 12.9815,
    lng   : 80.2180,
    status: 'LIVE',
    areas : [
      'Velachery', 'Adyar',
      'OMR', 'Sholinganallur',
    ],
  },

  // ── DELHI NCR COMING SOON PIN ──
  {
    id      : 13,
    name    : 'New Delhi',
    city    : 'Delhi NCR',
    lat     : 28.6139,
    lng     : 77.2090,
    status  : 'COMING_SOON',
    areas   : ['Connaught Place', 'Noida',
               'Gurugram', 'Dwarka'],
  },
]

// Dark map style matching SuciHome theme
const darkMapStyle = [
  { elementType: 'geometry',
    stylers: [{ color: '#0a0a0a' }] },
  { elementType: 'labels.text.stroke',
    stylers: [{ color: '#0a0a0a' }] },
  { elementType: 'labels.text.fill',
    stylers: [{ color: '#746855' }] },
  { featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1a1a1a' }] },
  { featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212121' }] },
  { featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#1a1a2e' }] },
  { featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0a1628' }] },
  { featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }] },
  { featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#757575' }] },
  { featureType: 'poi',
    stylers: [{ visibility: 'off' }] },
]

// Center of India
const defaultCenter = { lat: 20.5937, lng: 78.9629 }

const libraries: any = ['places'];

export default function SuciHomeMap() {
  const [selectedPin, setSelectedPin] = 
    useState<typeof locations[0] | null>(null)
  
  const [mapsKey, setMapsKey] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dynamicHeight = isMobile ? '300px' : '450px';

  const dynamicMapContainerStyle = {
    width       : '100%',
    height      : dynamicHeight,
    borderRadius: '20px',
    overflow    : 'hidden',
  }

  useEffect(() => {
    import('../lib/config').then(m => m.getPublicConfig()).then(cfg => {
      setMapsKey(cfg.googleMapsKey);
    });
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapsKey || '',
    libraries,
  })

  // Prevent map from loading until key is fetched
  if (!mapsKey) return null;

  if (loadError) {
    return (
      <div style={{
        height        : dynamicHeight,
        background    : 'rgba(255,255,255,0.03)',
        border        : '1px solid rgba(255,255,255,0.08)',
        borderRadius  : '20px',
        display       : 'flex',
        alignItems    : 'center',
        justifyContent: 'center',
        color         : '#A0A0A0',
      }}>
        Map unavailable. Check API key.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div style={{
        height        : dynamicHeight,
        background    : 'rgba(10,255,230,0.03)',
        border        : '1px solid rgba(10,255,230,0.1)',
        borderRadius  : '20px',
        display       : 'flex',
        alignItems    : 'center',
        justifyContent: 'center',
        flexDirection : 'column',
        gap           : '12px',
      }}>
        <svg
          width="40" height="40"
          viewBox="0 0 24 24" fill="none"
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <circle cx="12" cy="12" r="10"
            stroke="#0AFFE6" strokeWidth="3"
            strokeDasharray="50 30"
          />
        </svg>
        <p style={{ color: '#A0A0A0', fontSize: '14px' }}>
          Loading map...
        </p>
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={dynamicMapContainerStyle}
      center           ={defaultCenter}
      zoom             ={5}
      options={{
        styles          : darkMapStyle,
        disableDefaultUI: false,
        zoomControl     : true,
        mapTypeControl  : false,
        streetViewControl: false,
        fullscreenControl: true,
        scrollwheel     : false,
      }}
    >
      {/* Render markers for each city */}
      {locations.map(loc => (
        <Marker
          key     ={loc.id}
          position={{ lat: loc.lat, lng: loc.lng }}
          onClick ={() => setSelectedPin(loc)}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale    : loc.status === 'LIVE' ? 10 : 7,
            fillColor: loc.status === 'LIVE'
                       ? '#0AFFE6'
                       : 'rgba(255,255,255,0.3)',
            fillOpacity  : 1,
            strokeColor  : loc.status === 'LIVE'
                           ? '#FFFFFF'
                           : 'rgba(255,255,255,0.2)',
            strokeWeight : 2,
          }}
        />
      ))}

      {/* Info window when pin clicked */}
      {selectedPin && (
        <InfoWindow
          position={{
            lat: selectedPin.lat,
            lng: selectedPin.lng,
          }}
          onCloseClick={() => setSelectedPin(null)}
        >
          <div style={{
            background  : '#111111',
            padding     : '12px 16px',
            borderRadius: '10px',
            minWidth    : '200px',
            fontFamily  : 'Inter, sans-serif',
          }}>
            {/* Status badge */}
            <span style={{
              background   : selectedPin.status === 'LIVE'
                             ? 'rgba(10,255,230,0.15)'
                             : 'rgba(255,255,255,0.08)',
              color        : selectedPin.status === 'LIVE'
                             ? '#0AFFE6'
                             : '#A0A0A0',
              borderRadius : '20px',
              padding      : '2px 10px',
              fontSize     : '11px',
              fontWeight   : '700',
            }}>
              {selectedPin.status === 'LIVE'
               ? '✦ LIVE' : '🔒 COMING SOON'}
            </span>

            {/* City name */}
            <h3 style={{
              color      : '#FFFFFF',
              fontSize   : '16px',
              fontWeight : '700',
              margin     : '8px 0 6px',
            }}>
              {selectedPin.city}
            </h3>

            {/* Areas list */}
            <div style={{ marginBottom: '10px' }}>
              {selectedPin.areas.map(area => (
                <p key={area} style={{
                  color    : '#A0A0A0',
                  fontSize : '12px',
                  margin   : '2px 0',
                }}>
                  • {area}
                </p>
              ))}
            </div>

            {/* CTA button */}
            {selectedPin.status === 'LIVE' ? (
              <a
                href="/book"
                style={{
                  display      : 'block',
                  background   : '#0AFFE6',
                  color        : '#000000',
                  textAlign    : 'center',
                  padding      : '8px',
                  borderRadius : '8px',
                  fontSize     : '13px',
                  fontWeight   : '700',
                  textDecoration: 'none',
                }}
              >
                Book Now →
              </a>
            ) : (
              <a
                href={`https://wa.me/919392420643?text=Hi! Notify me when SuciHome launches in ${selectedPin.city}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display      : 'block',
                  background   : '#25D366',
                  color        : '#FFFFFF',
                  textAlign    : 'center',
                  padding      : '8px',
                  borderRadius : '8px',
                  fontSize     : '13px',
                  fontWeight   : '600',
                  textDecoration: 'none',
                }}
              >
                🔔 Notify Me
              </a>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}
