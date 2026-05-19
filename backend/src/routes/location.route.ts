import { Router } from 'express'

const router = Router();

// Serviceable areas data
const SERVICE_AREAS = {
  LIVE: [
    // Bengaluru
    { name: 'Koramangala',     city: 'Bengaluru', state: 'Karnataka',    lat: 12.9352, lng: 77.6245, radius: 5 },
    { name: 'Indiranagar',     city: 'Bengaluru', state: 'Karnataka',    lat: 12.9784, lng: 77.6408, radius: 5 },
    { name: 'Whitefield',      city: 'Bengaluru', state: 'Karnataka',    lat: 12.9698, lng: 77.7499, radius: 5 },
    { name: 'HSR Layout',      city: 'Bengaluru', state: 'Karnataka',    lat: 12.9116, lng: 77.6474, radius: 5 },
    { name: 'Marathahalli',    city: 'Bengaluru', state: 'Karnataka',    lat: 12.9591, lng: 77.6974, radius: 5 },
    { name: 'BTM Layout',      city: 'Bengaluru', state: 'Karnataka',    lat: 12.9165, lng: 77.6101, radius: 5 },
    { name: 'Jayanagar',       city: 'Bengaluru', state: 'Karnataka',    lat: 12.9308, lng: 77.5831, radius: 5 },
    { name: 'Electronic City', city: 'Bengaluru', state: 'Karnataka',    lat: 12.8399, lng: 77.6770, radius: 5 },

    // Mumbai
    { name: 'Bandra',          city: 'Mumbai',    state: 'Maharashtra',  lat: 19.0596, lng: 72.8295, radius: 5 },
    { name: 'Andheri',         city: 'Mumbai',    state: 'Maharashtra',  lat: 19.1136, lng: 72.8697, radius: 5 },
    { name: 'Powai',           city: 'Mumbai',    state: 'Maharashtra',  lat: 19.1176, lng: 72.9060, radius: 5 },
    { name: 'Thane',           city: 'Mumbai',    state: 'Maharashtra',  lat: 19.2183, lng: 72.9781, radius: 5 },
    { name: 'Navi Mumbai',     city: 'Mumbai',    state: 'Maharashtra',  lat: 19.0330, lng: 73.0297, radius: 5 },
    { name: 'Juhu',            city: 'Mumbai',    state: 'Maharashtra',  lat: 19.1075, lng: 72.8263, radius: 5 },
    { name: 'Borivali',        city: 'Mumbai',    state: 'Maharashtra',  lat: 19.2307, lng: 72.8567, radius: 5 },
    { name: 'Worli',           city: 'Mumbai',    state: 'Maharashtra',  lat: 19.0176, lng: 72.8178, radius: 5 },
  ],
  COMING_SOON: [
    { name: 'Hyderabad', state: 'Telangana'     },
    { name: 'Chennai',   state: 'Tamil Nadu'    },
    { name: 'Delhi NCR', state: 'Delhi'         },
    { name: 'Pune',      state: 'Maharashtra'   },
    { name: 'Kolkata',   state: 'West Bengal'   },
  ]
};

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
        message      : 'SparkClean currently operates in India only.',
        nearestArea  : null,
        comingSoon   : false,
      })
    }

    // Check distance to each live service area
    let nearestArea: any   = null
    let minDistance   = Infinity
    let isServiceable = false

    for (const area of SERVICE_AREAS.LIVE) {
      const distance = getDistance(
        lat, lng,
        area.lat, area.lng
      )

      if (distance < minDistance) {
        minDistance = distance
        nearestArea = { ...area, distance }
      }

      if (distance <= area.radius) {
        isServiceable = true
        nearestArea   = { ...area, distance }
        break
      }
    }

    if (isServiceable) {
      return res.json({
        serviceable : true,
        status      : 'LIVE',
        message     : `Great news! We serve ${nearestArea?.name}!`,
        area        : nearestArea,
        comingSoon  : false,
      })
    }

    // Check if in coming soon city
    const comingSoonMatch = SERVICE_AREAS.COMING_SOON.find(
      area => minDistance < 50
    )

    return res.json({
      serviceable : false,
      status      : 'COMING_SOON',
      message     : comingSoonMatch
        ? `We're launching in your area soon! Stay connected.`
        : `We haven't reached your location yet. Coming soon!`,
      nearestArea : nearestArea,
      distance    : Math.round(minDistance),
      comingSoon  : true,
    })

  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router;