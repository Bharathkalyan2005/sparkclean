import { Router } from 'express'

const router = Router();

// Serviceable areas data
const SUPPORTED_CITIES = [
  {
    name    : 'Bengaluru',
    state   : 'Karnataka',
    lat     : 12.9716,
    lng     : 77.5946,
    radiusKm: 50,
    areas   : [
      'Koramangala', 'Indiranagar',
      'Whitefield', 'HSR Layout',
      'Marathahalli', 'BTM Layout',
      'Jayanagar', 'Electronic City',
    ],
  },
  {
    name    : 'Mumbai',
    state   : 'Maharashtra',
    lat     : 19.0760,
    lng     : 72.8777,
    radiusKm: 60,
    areas   : [
      'Bandra', 'Andheri', 'Powai',
      'Thane', 'Navi Mumbai', 'Juhu',
      'Borivali', 'Worli',
    ],
  },
  {
    name    : 'Visakhapatnam',
    state   : 'Andhra Pradesh',
    lat     : 17.6868,
    lng     : 83.2185,
    radiusKm: 40,
    areas   : [
      'MVP Colony', 'Madhurawada',
      'Seethammadhara', 'Dwaraka Nagar',
      'Gajuwaka', 'Rushikonda',
      'Gopalapatnam', 'Kommadi',
    ],
  },

  // ── NEW CITIES ──────────────────────────

  {
    name    : 'Hyderabad',
    state   : 'Telangana',
    lat     : 17.3850,
    lng     : 78.4867,
    radiusKm: 55,
    areas   : [
      'Banjara Hills', 'Jubilee Hills',
      'Gachibowli', 'Hitech City',
      'Kondapur', 'Madhapur',
      'Kukatpally', 'Begumpet',
      'Secunderabad', 'Ameerpet',
      'Manikonda', 'Nallagandla',
    ],
  },
  {
    name    : 'Bhopal',
    state   : 'Madhya Pradesh',
    lat     : 23.2599,
    lng     : 77.4126,
    radiusKm: 35,
    areas   : [
      'MP Nagar', 'Arera Colony',
      'Kolar Road', 'Hoshangabad Road',
      'Shahpura', 'Misrod',
      'Ayodhya Bypass', 'Katara Hills',
      'Trilanga', 'Chunabhatti',
    ],
  },
  {
    name    : 'Chennai',
    state   : 'Tamil Nadu',
    lat     : 13.0827,
    lng     : 80.2707,
    radiusKm: 50,
    areas   : [
      'Anna Nagar', 'T. Nagar',
      'Velachery', 'Adyar',
      'Porur', 'OMR',
      'Nungambakkam', 'Mylapore',
      'Perambur', 'Chromepet',
      'Tambaram', 'Sholinganallur',
    ],
  },
]

const COMING_SOON_CITIES = [
  { name: 'Delhi NCR', state: 'Delhi' },
  { name: 'Pune',      state: 'Maharashtra' },
  { name: 'Kolkata',   state: 'West Bengal' },
]

// Haversine formula to calculate distance
function getDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R    = 6371 // Earth radius km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a    =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// POST /api/location/check
// Frontend sends lat/lng, backend checks serviceability
router.post('/check', async (req, res) => {
  try {
    const { lat, lng } = req.body
    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Location coordinates required'
      })
    }

    // Check if coordinates are in India bounds
    const inIndia = (
      lat >= 8.0 && lat <= 37.0 &&
      lng >= 68.0 && lng <= 97.0
    )

    if (!inIndia) {
      return res.json({
        serviceable  : false,
        status       : 'OUTSIDE_INDIA',
        message      : 'SuciHome currently operates in India only.',
        nearestArea  : null,
        comingSoon   : false,
      })
    }

    // Check distance to each supported city
    let nearestCity: any   = null
    let minDistance   = Infinity
    let isServiceable = false

    for (const city of SUPPORTED_CITIES) {
      const distance = getDistance(
        lat, lng,
        city.lat, city.lng
      )

      if (distance < minDistance) {
        minDistance = distance
        nearestCity = { ...city, distance }
      }

      if (distance <= city.radiusKm) {
        isServiceable = true
        nearestCity   = { ...city, distance }
      }
    }

    if (isServiceable) {
      return res.json({
        serviceable : true,
        status      : 'LIVE',
        message     : `Great news! We serve ${nearestCity?.name}!`,
        area        : {
          name: nearestCity.name,
          city: nearestCity.name,
          state: nearestCity.state,
          lat: nearestCity.lat,
          lng: nearestCity.lng,
          radius: nearestCity.radiusKm,
        },
        comingSoon  : false,
      })
    }

    // Check if in coming soon city
    const comingSoonMatch = COMING_SOON_CITIES.find(
      city => minDistance < 150
    )

    return res.json({
      serviceable : false,
      status      : 'COMING_SOON',
      message     : comingSoonMatch
        ? `We're launching in your area soon! Stay connected.`
        : `We haven't reached your location yet. Coming soon!`,
      nearestArea : nearestCity
        ? {
            name: nearestCity.name,
            city: nearestCity.name,
            state: nearestCity.state,
          }
        : null,
      distance    : Math.round(minDistance),
      comingSoon  : true,
    })

  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router;