import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  TIME_SLOTS,
  formatIndianCurrency, getNextNDates, formatDateDisplay
} from '../data/services';
import toast from 'react-hot-toast';
import api from '../lib/axiosInstance';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
} from '@react-google-maps/api';

const areaCoordinates: Record<string, {
  lat: number
  lng: number
  city: string
}> = {
  // ── BENGALURU ──
  'Koramangala'    : { lat: 12.9352, lng: 77.6245, city: 'Bengaluru' },
  'Indiranagar'    : { lat: 12.9784, lng: 77.6408, city: 'Bengaluru' },
  'Whitefield'     : { lat: 12.9698, lng: 77.7499, city: 'Bengaluru' },
  'HSR Layout'     : { lat: 12.9116, lng: 77.6474, city: 'Bengaluru' },
  'Marathahalli'   : { lat: 12.9591, lng: 77.6974, city: 'Bengaluru' },
  'BTM Layout'     : { lat: 12.9165, lng: 77.6101, city: 'Bengaluru' },
  'Jayanagar'      : { lat: 12.9308, lng: 77.5831, city: 'Bengaluru' },
  'Electronic City': { lat: 12.8399, lng: 77.6770, city: 'Bengaluru' },
  'Bannerghatta'   : { lat: 12.8635, lng: 77.5957, city: 'Bengaluru' },
  'Hebbal'         : { lat: 13.0353, lng: 77.5950, city: 'Bengaluru' },

  // ── MUMBAI ──
  'Bandra'         : { lat: 19.0596, lng: 72.8295, city: 'Mumbai' },
  'Andheri'        : { lat: 19.1136, lng: 72.8697, city: 'Mumbai' },
  'Powai'          : { lat: 19.1176, lng: 72.9060, city: 'Mumbai' },
  'Thane'          : { lat: 19.2183, lng: 72.9781, city: 'Mumbai' },
  'Navi Mumbai'    : { lat: 19.0330, lng: 73.0297, city: 'Mumbai' },
  'Juhu'           : { lat: 19.1075, lng: 72.8263, city: 'Mumbai' },
  'Borivali'       : { lat: 19.2307, lng: 72.8567, city: 'Mumbai' },
  'Worli'          : { lat: 19.0176, lng: 72.8178, city: 'Mumbai' },
  'Malad'          : { lat: 19.1874, lng: 72.8484, city: 'Mumbai' },
  'Kandivali'      : { lat: 19.2043, lng: 72.8493, city: 'Mumbai' },

  // ── VISAKHAPATNAM (VIZAG) ──
  'MVP Colony'     : { lat: 17.7231, lng: 83.3012, city: 'Visakhapatnam' },
  'Madhurawada'    : { lat: 17.7714, lng: 83.3733, city: 'Visakhapatnam' },
  'Seethammadhara' : { lat: 17.7384, lng: 83.3312, city: 'Visakhapatnam' },
  'Dwaraka Nagar'  : { lat: 17.7326, lng: 83.3162, city: 'Visakhapatnam' },
  'Gajuwaka'       : { lat: 17.6917, lng: 83.2115, city: 'Visakhapatnam' },
  'Rushikonda'     : { lat: 17.7806, lng: 83.3784, city: 'Visakhapatnam' },
  'Gopalapatnam'   : { lat: 17.7474, lng: 83.2722, city: 'Visakhapatnam' },
  'Kommadi'        : { lat: 17.7889, lng: 83.3956, city: 'Visakhapatnam' },
  'NAD Junction'   : { lat: 17.7197, lng: 83.2439, city: 'Visakhapatnam' },
  'Bheemunipatnam' : { lat: 17.8915, lng: 83.4507, city: 'Visakhapatnam' },
  'Siripuram'      : { lat: 17.7231, lng: 83.3178, city: 'Visakhapatnam' },
  'Jagadamba'      : { lat: 17.7203, lng: 83.3132, city: 'Visakhapatnam' },

  // ── HYDERABAD ──
  'Banjara Hills'  : { lat: 17.4156, lng: 78.4347, city: 'Hyderabad' },
  'Jubilee Hills'  : { lat: 17.4320, lng: 78.4071, city: 'Hyderabad' },
  'Gachibowli'     : { lat: 17.4401, lng: 78.3489, city: 'Hyderabad' },
  'Hitech City'    : { lat: 17.4504, lng: 78.3808, city: 'Hyderabad' },
  'Kondapur'       : { lat: 17.4600, lng: 78.3615, city: 'Hyderabad' },
  'Madhapur'       : { lat: 17.4489, lng: 78.3911, city: 'Hyderabad' },
  'Kukatpally'     : { lat: 17.4848, lng: 78.3990, city: 'Hyderabad' },
  'Begumpet'       : { lat: 17.4418, lng: 78.4632, city: 'Hyderabad' },
  'Secunderabad'   : { lat: 17.4399, lng: 78.4983, city: 'Hyderabad' },
  'Ameerpet'       : { lat: 17.4374, lng: 78.4487, city: 'Hyderabad' },
  'Manikonda'      : { lat: 17.4062, lng: 78.3892, city: 'Hyderabad' },
  'Nallagandla'    : { lat: 17.4731, lng: 78.3260, city: 'Hyderabad' },

  // ── BHOPAL ──
  'MP Nagar'       : { lat: 23.2332, lng: 77.4272, city: 'Bhopal' },
  'Arera Colony'   : { lat: 23.2068, lng: 77.4376, city: 'Bhopal' },
  'Kolar Road'     : { lat: 23.1793, lng: 77.4431, city: 'Bhopal' },
  'Hoshangabad Road':{ lat: 23.2072, lng: 77.4697, city: 'Bhopal' },
  'Shahpura'       : { lat: 23.1882, lng: 77.4329, city: 'Bhopal' },
  'Misrod'         : { lat: 23.1736, lng: 77.4751, city: 'Bhopal' },
  'Ayodhya Bypass' : { lat: 23.2476, lng: 77.4638, city: 'Bhopal' },
  'Katara Hills'   : { lat: 23.1965, lng: 77.4184, city: 'Bhopal' },
  'Trilanga'       : { lat: 23.1978, lng: 77.4289, city: 'Bhopal' },
  'Chunabhatti'    : { lat: 23.2145, lng: 77.4521, city: 'Bhopal' },

  // ── CHENNAI ──
  'Anna Nagar'     : { lat: 13.0850, lng: 80.2101, city: 'Chennai' },
  'T. Nagar'       : { lat: 13.0418, lng: 80.2341, city: 'Chennai' },
  'Velachery'      : { lat: 12.9815, lng: 80.2180, city: 'Chennai' },
  'Adyar'          : { lat: 13.0012, lng: 80.2565, city: 'Chennai' },
  'Porur'          : { lat: 13.0359, lng: 80.1567, city: 'Chennai' },
  'OMR'            : { lat: 12.9279, lng: 80.2304, city: 'Chennai' },
  'Nungambakkam'   : { lat: 13.0569, lng: 80.2425, city: 'Chennai' },
  'Mylapore'       : { lat: 13.0335, lng: 80.2676, city: 'Chennai' },
  'Perambur'       : { lat: 13.1181, lng: 80.2344, city: 'Chennai' },
  'Chromepet'      : { lat: 12.9516, lng: 80.1462, city: 'Chennai' },
  'Tambaram'       : { lat: 12.9249, lng: 80.1000, city: 'Chennai' },
  'Sholinganallur' : { lat: 12.9010, lng: 80.2279, city: 'Chennai' },
};

// Light map style
const lightMapStyle = [
  { elementType: 'geometry',
    stylers: [{ color: '#F5F0E8' }] },
  { elementType: 'labels.text.stroke',
    stylers: [{ color: '#F5F0E8' }] },
  { elementType: 'labels.text.fill',
    stylers: [{ color: '#2D4A35' }] },
  { featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#EDE8DC' }] },
  { featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#D2E2D7' }] },
  { featureType: 'poi',
    stylers: [{ visibility: 'off' }] },
  { featureType: 'transit',
    stylers: [{ visibility: 'off' }] },
]

interface BookingMapProps {
  area     : string
  address  : string
}

const libraries: any = ['places'];

function BookingMap({ area, address }: BookingMapProps) {
  const coords = areaCoordinates[area]

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 
      process.env.REACT_APP_GOOGLE_MAPS_KEY || '',
    libraries,
  })

  if (!coords) return null

  if (!isLoaded) {
    return (
      <div style={{
        height        : '220px',
        borderRadius  : '14px',
        background    : 'rgba(27,67,50,0.02)',
        border        : '1px solid #EDE8DC',
        display       : 'flex',
        alignItems    : 'center',
        justifyContent: 'center',
        gap           : '10px',
      }}>
        <svg
          width="20" height="20"
          viewBox="0 0 24 24" fill="none"
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <circle cx="12" cy="12" r="10"
            stroke="#1B4332" strokeWidth="3"
            strokeDasharray="50 30"
          />
        </svg>
        <span style={{ color: '#5C6B5E', fontSize: '13px' }}>
          Loading map...
        </span>
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={{
        width       : '100%',
        height      : '220px',
        borderRadius: '14px',
      }}
      center ={{ lat: coords.lat, lng: coords.lng }}
      zoom   ={14}
      options={{
        styles           : lightMapStyle,
        disableDefaultUI : true,
        zoomControl      : true,
        scrollwheel      : false,
        mapTypeControl   : false,
        streetViewControl: false,
        fullscreenControl: false,
      }}
    >
      {/* Main pin for selected area */}
      <Marker
        position={{ lat: coords.lat, lng: coords.lng }}
        icon={{
          path: window.google.maps.SymbolPath.CIRCLE,
          scale       : 12,
          fillColor   : '#1B4332',
          fillOpacity : 1,
          strokeColor : '#FFFFFF',
          strokeWeight: 2,
        }}
      />

      {/* Service radius circle ~2km */}
      <Circle
        center ={{ lat: coords.lat, lng: coords.lng }}
        radius ={2000}
        options={{
          fillColor   : '#1B4332',
          fillOpacity : 0.06,
          strokeColor : '#1B4332',
          strokeOpacity: 0.3,
          strokeWeight: 1,
        }}
      />
    </GoogleMap>
  )
}

// ── Razorpay type declarations ──────────────────────────────────
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Safe Razorpay loader — SDK is loaded via <script> in index.html

const STEPS = ['Select Services', 'Your Details', 'Payment'];

const areas = [
  // ── BENGALURU ──
  { name: "Koramangala",     city: "Bengaluru", premium: true  },
  { name: "Indiranagar",     city: "Bengaluru", premium: true  },
  { name: "Whitefield",      city: "Bengaluru", premium: false },
  { name: "HSR Layout",      city: "Bengaluru", premium: false },
  { name: "Marathahalli",    city: "Bengaluru", premium: false },
  { name: "BTM Layout",      city: "Bengaluru", premium: false },
  { name: "Jayanagar",       city: "Bengaluru", premium: false },
  { name: "Electronic City", city: "Bengaluru", premium: false },
  { name: "Bannerghatta",    city: "Bengaluru", premium: false },
  { name: "Hebbal",          city: "Bengaluru", premium: false },

  // ── MUMBAI ──
  { name: "Bandra",          city: "Mumbai",    premium: true  },
  { name: "Andheri",         city: "Mumbai",    premium: true  },
  { name: "Powai",           city: "Mumbai",    premium: false },
  { name: "Thane",           city: "Mumbai",    premium: false },
  { name: "Navi Mumbai",     city: "Mumbai",    premium: false },
  { name: "Juhu",            city: "Mumbai",    premium: false },
  { name: "Borivali",        city: "Mumbai",    premium: false },
  { name: "Worli",           city: "Mumbai",    premium: false },
  { name: "Malad",           city: "Mumbai",    premium: false },
  { name: "Kandivali",       city: "Mumbai",    premium: false },

  // ── VISAKHAPATNAM (VIZAG) ──
  { name: "MVP Colony",      city: "Visakhapatnam", premium: true  },
  { name: "Madhurawada",     city: "Visakhapatnam", premium: true  },
  { name: "Seethammadhara",  city: "Visakhapatnam", premium: false },
  { name: "Dwaraka Nagar",   city: "Visakhapatnam", premium: false },
  { name: "Gajuwaka",        city: "Visakhapatnam", premium: false },
  { name: "Rushikonda",      city: "Visakhapatnam", premium: false },
  { name: "Gopalapatnam",    city: "Visakhapatnam", premium: false },
  { name: "Kommadi",         city: "Visakhapatnam", premium: false },
  { name: "NAD Junction",    city: "Visakhapatnam", premium: false },
  { name: "Bheemunipatnam",  city: "Visakhapatnam", premium: false },
  { name: "Siripuram",       city: "Visakhapatnam", premium: false },
  { name: "Jagadamba",       city: "Visakhapatnam", premium: false },

  // ── HYDERABAD ── NEW
  { name: 'Banjara Hills',   city: 'Hyderabad', premium: true  },
  { name: 'Jubilee Hills',   city: 'Hyderabad', premium: true  },
  { name: 'Gachibowli',      city: 'Hyderabad', premium: false },
  { name: 'Hitech City',     city: 'Hyderabad', premium: false },
  { name: 'Kondapur',        city: 'Hyderabad', premium: false },
  { name: 'Madhapur',        city: 'Hyderabad', premium: false },
  { name: 'Kukatpally',      city: 'Hyderabad', premium: false },
  { name: 'Begumpet',        city: 'Hyderabad', premium: false },
  { name: 'Secunderabad',    city: 'Hyderabad', premium: false },
  { name: 'Ameerpet',        city: 'Hyderabad', premium: false },
  { name: 'Manikonda',       city: 'Hyderabad', premium: false },
  { name: 'Nallagandla',     city: 'Hyderabad', premium: false },

  // ── BHOPAL ── NEW
  { name: 'MP Nagar',        city: 'Bhopal',    premium: true  },
  { name: 'Arera Colony',    city: 'Bhopal',    premium: true  },
  { name: 'Kolar Road',      city: 'Bhopal',    premium: false },
  { name: 'Hoshangabad Road',city: 'Bhopal',    premium: false },
  { name: 'Shahpura',        city: 'Bhopal',    premium: false },
  { name: 'Misrod',          city: 'Bhopal',    premium: false },
  { name: 'Ayodhya Bypass',  city: 'Bhopal',    premium: false },
  { name: 'Katara Hills',    city: 'Bhopal',    premium: false },
  { name: 'Trilanga',        city: 'Bhopal',    premium: false },
  { name: 'Chunabhatti',     city: 'Bhopal',    premium: false },

  // ── CHENNAI ── NEW
  { name: 'Anna Nagar',      city: 'Chennai',   premium: true  },
  { name: 'T. Nagar',        city: 'Chennai',   premium: true  },
  { name: 'Velachery',       city: 'Chennai',   premium: false },
  { name: 'Adyar',           city: 'Chennai',   premium: false },
  { name: 'Porur',           city: 'Chennai',   premium: false },
  { name: 'OMR',             city: 'Chennai',   premium: false },
  { name: 'Nungambakkam',    city: 'Chennai',   premium: false },
  { name: 'Mylapore',        city: 'Chennai',   premium: false },
  { name: 'Perambur',        city: 'Chennai',   premium: false },
  { name: 'Chromepet',       city: 'Chennai',   premium: false },
  { name: 'Tambaram',        city: 'Chennai',   premium: false },
  { name: 'Sholinganallur',  city: 'Chennai',   premium: false },
];

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items: cartItems, clearCart } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('sucihome_token') || localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please login to book a service');
      navigate('/auth?redirect=/book');
      return;
    }
    
    // Verify token is not expired
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem('sucihome_token');
        localStorage.removeItem('token');
        toast.error('Session expired. Please login again.');
        navigate('/auth?redirect=/book');
      }
    } catch (e) {
      localStorage.removeItem('sucihome_token');
      localStorage.removeItem('token');
      navigate('/auth?redirect=/book');
    }
  }, [navigate]);

  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<any | null>(null);

  const [services, setServices] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [loadingSvc, setLoadingSvc] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/services/individual'),
      api.get('/services/combos'),
    ])
    .then(([svcRes, comboRes]) => {
      setServices(svcRes.data.services);
      const formattedCombos = comboRes.data.combos.map((c: any, i: number) => {
        let price = Number(c.price);
        let originalPrice = c.originalPrice ? Number(c.originalPrice) : undefined;
        
        if (c.name.includes('1 BHK')) {
          price = 999;
          originalPrice = 1299;
        } else if (c.name.includes('2 BHK')) {
          price = 1499;
          originalPrice = 1999;
        } else if (c.name.includes('3 BHK')) {
          price = 2499;
          originalPrice = 2999;
        }
        
        return {
          ...c,
          price: price,
          originalPrice: originalPrice,
          is_popular: i === 1
        };
      });
      setCombos(formattedCombos);
    })
    .catch(err => console.error('Services load failed:', err))
    .finally(() => setLoadingSvc(false));
  }, []);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    area: searchParams.get('area') || '',
    city: 'India',
    email: '',
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [customArea, setCustomArea] = useState('');
  const [bookingStep, setBookingStep] = useState<'idle' | 'creating' | 'payment' | 'verifying'>('idle');

  const nextDates = getNextNDates(7);

  useEffect(() => {
    const comboId = searchParams.get('combo');
    if (comboId && combos.length > 0) {
      const combo = combos.find(c => c.id === comboId);
      if (combo) setSelectedCombo(combo);
    } else if (cartItems.length > 0) {
      setSelectedServices(cartItems);
    }
  }, [searchParams, combos]); // eslint-disable-line

  const total = selectedCombo
    ? selectedCombo.price
    : selectedServices.reduce((sum, s) => sum + s.price * (s.quantity || 1), 0);

  // Wake backend and preload Razorpay script when user reaches Step 3
  useEffect(() => {
    if (step === 3) {
      // Pre-warm server 
      fetch(`${process.env.REACT_APP_API_URL || 'https://sparkclean-x3ze.onrender.com'}/api/health`)
        .catch(() => {})
      
      // Pre-load Razorpay script
      if (!(window as any).Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.head.appendChild(script)
      }
    }
  }, [step]);

  // ── Pay Online via Razorpay checkout modal ────────────────────
const handlePayment = async () => {
  setLoading(true)
  setBookingStep('creating')

  try {
    // Step 0: Wake backend first
    await fetch(
      `${process.env.REACT_APP_API_URL || 'https://sparkclean-x3ze.onrender.com'}/api/health`
    ).catch(() => {})

    // Step 1: Create booking
    const bookingRes = await api.post('/bookings', {
      customerName  : form.name,
      customerPhone : form.phone,
      customerEmail : form.email || '',
      address       : form.address,
      area          : form.area,
      city          : form.city || 'India',
      services      : selectedCombo
        ? [{ id: selectedCombo.id, name: selectedCombo.name, price: selectedCombo.price, unit: 'combo', category: 'Combo', icon_name: 'combo', is_active: true }]
        : selectedServices,
      subtotal      : total || 0,
      discount      : 0,
      totalAmount   : total,
      paymentMethod : 'RAZORPAY',
      scheduledDate : selectedDate,
      scheduledTime : selectedTime,
      notes         : '',
    })

    const { bookingId, bookingNumber } = bookingRes.data
    
    // Save immediately
    localStorage.setItem('sc_booking_number', bookingNumber)
    localStorage.setItem('sc_booking_id', bookingId)
    localStorage.setItem('sh_booking_number', bookingNumber)
    localStorage.setItem('sh_booking_id', bookingId)
    localStorage.setItem('last_booking_number', bookingNumber)
    localStorage.setItem('last_booking_id',     bookingId)

    setBookingStep('payment')

    // Step 2: Create Razorpay order with retry
    let orderRes
    let retries = 0
    
    while (retries < 3) {
      try {
        orderRes = await api.post(
          '/payments/create-order', 
          { bookingId }
        )
        break
      } catch (err) {
        retries++
        if (retries === 3) throw err
        // Wait 2 seconds before retry
        await new Promise(r => setTimeout(r, 2000))
      }
    }

    const {
      orderId, amount, currency,
      keyId, customerName,
      customerPhone, customerEmail,
    } = orderRes!.data

    // Step 3: Check Razorpay loaded
    if (!(window as any).Razorpay) {
      // Load script dynamically
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 
          'https://checkout.razorpay.com/v1/checkout.js'
        script.onload  = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    // Step 4: Open Razorpay
    const options = {
      key        : keyId,
      amount     : amount,
      currency   : currency || 'INR',
      name       : 'SuciHome',
      description: `Booking ${bookingNumber}`,
      image      : `${window.location.origin}/logo.png`,
      order_id   : orderId,
      prefill: {
        name   : customerName,
        email  : customerEmail  || '',
        contact: customerPhone,
      },
      theme: { color: '#1B4332' },
      modal: {
        confirm_close: true,
        ondismiss    : () => {
          setLoading(false)
          setBookingStep('idle')
          toast.error('Payment cancelled')
        }
      },
      handler: async (response: any) => {
        setBookingStep('verifying')
        try {
          await api.post('/payments/verify', {
            razorpay_order_id  : 
              response.razorpay_order_id,
            razorpay_payment_id: 
              response.razorpay_payment_id,
            razorpay_signature : 
              response.razorpay_signature,
            bookingId,
          })
          clearCart()
          toast.success('Payment successful! 🎉')
          navigate(
            `/success?booking=${bookingId}` +
            `&number=${bookingNumber}`
          )
        } catch {
          toast.error(
            'Payment done but verification failed.' +
            ' Contact: 9392420643'
          )
          setLoading(false)
          setBookingStep('idle')
        }
      }
    }

    const rzp = new (window as any).Razorpay(options)
    rzp.on('payment.failed', (response: any) => {
      toast.error(
        'Payment failed: ' + 
        response.error.description
      )
      setLoading(false)
      setBookingStep('idle')
    })
    rzp.open()

  } catch (error: any) {
    console.error('Payment error:', error)
    
    const msg = error.response?.data?.error 
      || error.response?.data?.message
      || error.message 
      || 'Something went wrong'
    
    if (msg.includes('401') || 
        msg.includes('Unauthorized')) {
      toast.error('Session expired. Please login again.')
      navigate('/auth?redirect=/book')
    } else if (msg.includes('network') || 
               msg.includes('fetch')) {
      toast.error(
        'Server is starting up. ' +
        'Please wait 30 seconds and retry.'
      )
    } else {
      toast.error(msg)
    }
    setLoading(false)
    setBookingStep('idle')
  }
}

const handleCODBooking = async () => {
  setLoading(true)
  try {
    const bookingRes = await api.post('/bookings', {
      customerName  : form.name,
      customerPhone : form.phone,
      customerEmail : form.email,
      address       : form.address,
      area          : form.area,
      city          : form.city || 'India',
      services      : selectedCombo
        ? [{ id: selectedCombo.id, name: selectedCombo.name, price: selectedCombo.price, unit: 'combo', category: 'Combo', icon_name: 'combo', is_active: true }]
        : selectedServices,
      subtotal      : total || 0,
      discount      : 0,
      totalAmount   : total,
      paymentMethod : 'COD',
      scheduledDate : selectedDate,
      scheduledTime : selectedTime,
      notes         : '',
    })

    const { bookingId, bookingNumber } = bookingRes.data
    
    localStorage.setItem('sh_booking_number', bookingNumber)
    localStorage.setItem('sh_booking_id', bookingId)
    
    clearCart();
    navigate(`/success?booking=${bookingId}&number=${bookingNumber}`)

  } catch (error: any) {
    toast.error('Booking failed. Try again.')
    setLoading(false)
  }
}

  /*
  const saveBooking = async (
    method: 'razorpay' | 'cod',
    status: 'paid' | 'pending',
    paymentId?: string
  ) => {
    const bookingData: Booking = {
      customer_name: form.name,
      phone: form.phone,
      address: form.address,
      area: form.area,
      services: selectedCombo
        ? [{ id: selectedCombo.id, name: selectedCombo.name, price: selectedCombo.price, unit: 'combo', category: 'Combo', icon_name: 'combo', is_active: true }]
        : selectedServices,
      total_price: total,
      payment_method: method,
      payment_status: status,
      payment_id: paymentId,
      scheduled_date: selectedDate,
      scheduled_time: selectedTime,
      status: 'pending',
    };

    const { data, error } = await supabase.from('bookings').insert([bookingData]).select();

    if (error) {
      toast.error('Booking failed. Please call us directly at 9392420643');
      return;
    }

    clearCart();
    const bookingId = data?.[0]?.id || 'BK' + Date.now();

    // WhatsApp confirmation
    const waMsg = encodeURIComponent(
      `Hi SuciHome! ✨ I've booked a cleaning service.\n\n` +
      `📋 Booking ID: ${bookingId}\n` +
      `🏠 Service: ${selectedCombo?.name || selectedServices.map(s => s.name).join(', ')}\n` +
      `📅 Date: ${formatDateDisplay(selectedDate)} at ${selectedTime}\n` +
      `📍 Area: ${form.area}\n` +
      `💰 Total: ${formatIndianCurrency(total)}\n` +
      `💳 Payment: ${method === 'cod' ? 'Pay at Doorstep' : 'Online Paid via Razorpay'}\n\n` +
      `Please confirm my booking. Thank you!`
    );
    window.open(`https://wa.me/919392420643?text=${waMsg}`, '_blank');

    navigate(`/success?id=${bookingId}&name=${encodeURIComponent(form.name)}`);
  };
  */

  const toggleService = (service: any) => {
    setSelectedCombo(null);
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) return prev.filter(s => s.id !== service.id);
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const isStep1Valid = (selectedCombo || selectedServices.length > 0);
  const isStep2Valid = form.name && form.phone && form.address && form.area && selectedDate && selectedTime && (form.area !== 'Other (Not listed)' || customArea.trim() !== '');

  // ── Shared style tokens ──────────────────────────────────────
  const cardSelected = { border: '1.5px solid #1B4332', background: 'rgba(27,67,50,0.05)', borderRadius: 14 };
  const cardDefault = { border: '1.5px solid #EDE8DC', background: '#FFFFFF', borderRadius: 14 };

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
      {/* Top nav */}
      <div className="px-4 py-4" style={{ background: '#FFFFFF', borderBottom: '1px solid #EDE8DC', boxShadow: '0 4px 20px rgba(27,67,50,0.03)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 transition-colors" style={{ color: '#5C6B5E' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1B4332')}
            onMouseLeave={e => (e.currentTarget.style.color = '#5C6B5E')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-dm text-sm">Back to Home</span>
          </button>
          <span className="font-syne font-bold text-[#2D4A35]" style={{ fontSize: '18px' }}>Book a Cleaning</span>
          <div></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-syne font-bold text-sm transition-all duration-300`}
                  style={{
                    background: step > i + 1 ? 'rgba(27,67,50,0.1)' : step === i + 1 ? 'linear-gradient(135deg,#1B4332,#0D2B1F)' : 'rgba(27,67,50,0.03)',
                    border: `2px solid ${step >= i + 1 ? '#1B4332' : '#EDE8DC'}`,
                    color: step === i + 1 ? '#FFFFFF' : step > i + 1 ? '#1B4332' : '#5C6B5E',
                  }}
                >
                  {step > i + 1 ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-sm font-dm hidden sm:block`}
                  style={{ color: step === i + 1 ? '#2D4A35' : '#5C6B5E' }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 transition-all duration-500 rounded-full"
                  style={{ background: step > i + 1 ? 'linear-gradient(90deg,#1B4332,#0D2B1F)' : '#EDE8DC' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <h2 className="font-syne font-bold text-2xl mb-6 text-[#2D4A35]">Choose Your Services</h2>

              {/* Combos */}
              <div className="mb-8">
                <h3 className="text-xs font-dm font-semibold uppercase tracking-wider mb-4 text-[#1B4332]">Combo Packages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {loadingSvc ? <p className="text-sm text-[#5C6B5E]">Loading...</p> : combos.map(combo => (
                    <button
                      key={combo.id}
                      onClick={() => { setSelectedCombo(selectedCombo?.id === combo.id ? null : combo); setSelectedServices([]); }}
                      className="p-4 text-left transition-all duration-300 card-glow bg-white shadow-sm hover:shadow-md"
                      style={selectedCombo?.id === combo.id ? cardSelected : cardDefault}
                    >
                      {combo.is_popular && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-dm font-semibold mb-2 inline-block"
                          style={{ background: 'rgba(201,168,76,0.15)', color: '#1B4332' }}>★ Popular</span>
                      )}
                      <p className="font-syne font-bold text-[#2D4A35]">{combo.name}</p>
                      <p className="font-syne font-bold text-xl text-[#1B4332] mt-1">₹{combo.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual services */}
              <div>
                <h3 className="text-xs font-dm font-semibold uppercase tracking-wider mb-4 text-[#1B4332]">Individual Services</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {loadingSvc ? <p className="text-sm text-[#5C6B5E]">Loading...</p> : services.map(service => {
                    const isSelected = selectedServices.some(s => s.id === service.id);
                    return (
                      <button
                        key={service.id}
                        onClick={() => toggleService(service)}
                        className="p-4 text-left flex items-center gap-4 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                        style={isSelected ? cardSelected : cardDefault}
                      >
                        <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all"
                          style={{ background: isSelected ? '#1B4332' : 'transparent', borderColor: isSelected ? '#1B4332' : '#EDE8DC' }}>
                          {isSelected && (
                            <svg className="w-3 h-3" fill="none" stroke="#FFFFFF" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-dm font-medium text-sm text-[#2D4A35]">{service.name}</p>
                          <p className="text-xs font-dm text-[#5C6B5E]">{service.unit}</p>
                        </div>
                        <span className="font-syne font-bold flex-shrink-0 text-[#1B4332]">
                          ₹{service.unit === 'per cloth' ? '10/cloth' : Number(service.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected summary */}
              {(selectedCombo || selectedServices.length > 0) && (
                <div className="mt-6 rounded-xl p-4 flex items-center justify-between"
                  style={{ background: 'rgba(27,67,50,0.05)', border: '1.5px solid rgba(27,67,50,0.2)' }}>
                  <span className="font-dm text-sm text-[#2D4A35]">
                    {selectedCombo ? selectedCombo.name : `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected`}
                  </span>
                  <span className="font-syne font-bold text-xl text-[#1B4332]">{formatIndianCurrency(total)}</span>
                </div>
              )}

              <button
                disabled={!isStep1Valid}
                onClick={() => setStep(2)}
                className={`mt-6 w-full py-4 rounded-xl font-dm font-semibold text-base transition-all duration-300 shadow-md ${
                  isStep1Valid 
                    ? 'bg-[#1B4332] text-white hover:bg-[#0D2B1F] cursor-pointer' 
                    : 'bg-[#1B4332]/10 text-[#5C6B5E]/50 border border-[#EDE8DC] cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <h2 className="font-syne font-bold text-2xl mb-6 text-[#2D4A35]">Your Details</h2>

              <div className="space-y-5 bg-white p-6 md:p-8 rounded-2xl border border-[#EDE8DC] shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-dm mb-1.5 text-[#5C6B5E]">Full Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name" className="w-full bg-white text-[#2D4A35] border border-[#EDE8DC] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1B4332] font-dm transition-all shadow-inner" required />
                  </div>
                  <div>
                    <label className="block text-xs font-dm mb-1.5 text-[#5C6B5E]">Phone Number *</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="10-digit mobile" className="w-full bg-white text-[#2D4A35] border border-[#EDE8DC] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1B4332] font-dm transition-all shadow-inner" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-dm mb-1.5 text-[#5C6B5E]">Email (optional — for payment receipt)</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com" className="w-full bg-white text-[#2D4A35] border border-[#EDE8DC] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1B4332] font-dm transition-all shadow-inner" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-dm text-[#5C6B5E]">Full Address *</label>
                    <button
                      type="button"
                      onClick={() => {
                        const loadingToast = toast.loading('Detecting address...');
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            async (position) => {
                              try {
                                const res = await fetch(`https://photon.komoot.io/reverse?lon=${position.coords.longitude}&lat=${position.coords.latitude}`);
                                if (res.ok) {
                                  const data = await res.json();
                                  const props = data?.features?.[0]?.properties;
                                  if (props) {
                                    const fullAddress = [props.name, props.street, props.district, props.city, props.state].filter(Boolean).join(', ');
                                    const detectedCity = props.city || props.state;
                                    
                                    // Try to match area
                                    let matchedArea = form.area;
                                    if (props.district || props.city) {
                                      const possibleArea = areas.find(a => 
                                        (props.district && props.district.includes(a.name)) || 
                                        (props.city && props.city.includes(a.name))
                                      );
                                      if (possibleArea) matchedArea = possibleArea.name;
                                    }

                                    setForm({ ...form, address: fullAddress, area: matchedArea, city: detectedCity });
                                    toast.success('Address auto-filled');
                                  } else {
                                    toast.error('Could not determine address exactly. Please enter manually.');
                                  }
                                }
                              } catch (err) {
                                toast.error('Failed to resolve address');
                              } finally {
                                toast.dismiss(loadingToast);
                              }
                            },
                            () => {
                              toast.dismiss(loadingToast);
                              toast.error('Location permission denied or failed.');
                            }
                          );
                        } else {
                          toast.dismiss(loadingToast);
                          toast.error('Geolocation is not supported by this browser.');
                        }
                      }}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] hover:bg-[#1B4332]/20 transition-all"
                    >
                      📍 Auto-detect
                    </button>
                  </div>
                  <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="House/flat no., street, landmark..." className="w-full bg-white text-[#2D4A35] border border-[#EDE8DC] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1B4332] font-dm transition-all shadow-inner min-h-[80px]" required />
                </div>

                <div>
                  <label className="block text-xs font-dm mb-1.5 text-[#5C6B5E]">Area *</label>
                  <select
                    value={form.area}
                    onChange={e => {
                      const selectedArea = areas.find(
                        a => a.name === e.target.value
                      )
                      setForm({
                        ...form,
                        area: e.target.value,
                        city: selectedArea?.city || 'India'
                      })
                    }}
                    style={{
                      width        : '100%',
                      padding      : '14px 16px',
                      background   : 'white',
                      border       : '1.5px solid #EDE8DC',
                      borderRadius : '12px',
                      fontSize     : '15px',
                      color        : '#2D4A35',
                      cursor       : 'pointer',
                      outline      : 'none',
                    }}
                    required
                  >
                    <option value="" disabled>Select your area</option>
                  
                    <optgroup label="📍 Bengaluru, Karnataka">
                      {areas
                        .filter(a => a.city === 'Bengaluru')
                        .map(a => (
                          <option key={a.name} value={a.name}>
                            {a.premium ? '⭐ ' : ''}{a.name}
                          </option>
                        ))
                      }
                    </optgroup>
                  
                    <optgroup label="📍 Mumbai, Maharashtra">
                      {areas
                        .filter(a => a.city === 'Mumbai')
                        .map(a => (
                          <option key={a.name} value={a.name}>
                            {a.premium ? '⭐ ' : ''}{a.name}
                          </option>
                        ))
                      }
                    </optgroup>

                    <optgroup label="📍 Visakhapatnam (Vizag), AP">
                      {areas
                        .filter(a => a.city === 'Visakhapatnam')
                        .map(a => (
                          <option key={a.name} value={a.name}>
                            {a.premium ? '⭐ ' : ''}{a.name}
                          </option>
                        ))
                      }
                    </optgroup>

                    <optgroup label="📍 Hyderabad, Telangana">
                      {areas
                        .filter(a => a.city === 'Hyderabad')
                        .map(a => (
                          <option key={a.name} value={a.name}>
                            {a.premium ? '⭐ ' : ''}{a.name}
                          </option>
                        ))
                      }
                    </optgroup>

                    <optgroup label="📍 Bhopal, Madhya Pradesh">
                      {areas
                        .filter(a => a.city === 'Bhopal')
                        .map(a => (
                          <option key={a.name} value={a.name}>
                            {a.premium ? '⭐ ' : ''}{a.name}
                          </option>
                        ))
                      }
                    </optgroup>

                    <optgroup label="📍 Chennai, Tamil Nadu">
                      {areas
                        .filter(a => a.city === 'Chennai')
                        .map(a => (
                          <option key={a.name} value={a.name}>
                            {a.premium ? '⭐ ' : ''}{a.name}
                          </option>
                        ))
                      }
                    </optgroup>
                    <option value="Other (Not listed)">Other (Not listed)</option>
                  </select>

                  {form.area === 'Other (Not listed)' && (
                    <div style={{ marginTop: '12px' }}>
                      <input
                        type="text"
                        placeholder="Enter your custom area or city"
                        className="w-full bg-white text-[#2D4A35] border border-[#EDE8DC] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1B4332] font-dm transition-all shadow-inner"
                        value={customArea}
                        onChange={(e) => setCustomArea(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>

                {form.area && areaCoordinates[form.area] && (
                  <div style={{ marginTop: '16px' }}>
                    {/* Map header */}
                    <div style={{
                      display      : 'flex',
                      alignItems   : 'center',
                      justifyContent: 'space-between',
                      marginBottom : '10px',
                    }}>
                      <div style={{
                        display   : 'flex',
                        alignItems: 'center',
                        gap       : '8px',
                      }}>
                        <span style={{ fontSize: '16px' }}>📍</span>
                        <div>
                          <p style={{
                            color     : '#2D4A35',
                            fontSize  : '14px',
                            fontWeight: '600',
                          }}>
                            {form.area}
                          </p>
                          <p style={{
                            color   : '#5C6B5E',
                            fontSize: '12px',
                          }}>
                            {areaCoordinates[form.area]?.city}, India
                          </p>
                        </div>
                      </div>

                      {/* Live service badge */}
                      <span style={{
                        background   : 'rgba(27,67,50,0.1)',
                        color        : '#1B4332',
                        border       : '1px solid rgba(27,67,50,0.2)',
                        borderRadius : '20px',
                        padding      : '3px 10px',
                        fontSize     : '11px',
                        fontWeight   : '700',
                      }}>
                        ✦ SERVICE AVAILABLE
                      </span>
                    </div>
                
                    {/* Map */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key        ={form.area}
                        initial    ={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate    ={{ opacity: 1, y: 0,  scale: 1    }}
                        exit       ={{ opacity: 0, y: -10             }}
                        transition ={{ duration: 0.3, ease: 'easeOut' }}
                        style={{
                          border      : '1px solid #EDE8DC',
                          borderRadius: '14px',
                          overflow    : 'hidden',
                          boxShadow   : '0 4px 20px rgba(27,67,50,0.03)',
                        }}
                      >
                        <BookingMap
                          area   ={form.area}
                          address={form.address}
                        />
                      </motion.div>
                    </AnimatePresence>
                
                    {/* Service radius note */}
                    <p style={{
                      color     : '#5C6B5E',
                      fontSize  : '12px',
                      textAlign : 'center',
                      marginTop : '8px',
                      display   : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap       : '6px',
                    }}>
                      <span style={{
                        width       : '8px',
                        height      : '8px',
                        borderRadius: '50%',
                        background  : '#1B4332',
                        display     : 'inline-block',
                      }} />
                      Teal circle shows our ~2km service coverage area
                    </p>
                  </div>
                )}

                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-dm mb-2 text-[#5C6B5E]">Select Date *</label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {nextDates.map(date => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className="rounded-xl p-2 text-center transition-all duration-200"
                        style={selectedDate === date
                          ? { border: '1.5px solid #1B4332', background: 'rgba(27,67,50,0.1)', color: '#1B4332' }
                          : { border: '1.5px solid #EDE8DC', background: '#FFFFFF', color: '#5C6B5E' }}
                      >
                        <div className="text-xs font-dm">{formatDateDisplay(date).split(' ')[0]}</div>
                        <div className="font-syne font-bold text-sm">{formatDateDisplay(date).split(' ')[1]}</div>
                        <div className="text-xs font-dm">{formatDateDisplay(date).split(' ')[2]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-xs font-dm mb-2 text-[#5C6B5E]">Select Time Slot *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {TIME_SLOTS.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className="rounded-xl py-2.5 px-3 text-sm font-dm font-medium transition-all duration-200"
                        style={selectedTime === time
                          ? { border: '1.5px solid #1B4332', background: 'rgba(27,67,50,0.1)', color: '#1B4332' }
                          : { border: '1.5px solid #EDE8DC', background: '#FFFFFF', color: '#5C6B5E' }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-xl font-dm transition-colors bg-white hover:bg-gray-50"
                  style={{ border: '1.5px solid #EDE8DC', color: '#5C6B5E' }}>
                  ← Back
                </button>
                <button
                  disabled={!isStep2Valid}
                  onClick={() => {
                    if (form.area === 'Other (Not listed)') {
                      toast.error('Service is not started in your location');
                      return;
                    }
                    setStep(3);
                  }}
                  className={`flex-[2] py-4 rounded-xl font-dm font-semibold text-base transition-all duration-300 shadow-md ${
                    isStep2Valid 
                      ? 'bg-[#1B4332] text-white hover:bg-[#0D2B1F] cursor-pointer' 
                      : 'bg-[#1B4332]/10 text-[#5C6B5E]/50 border border-[#EDE8DC] cursor-not-allowed'
                  }`}
                >
                  Continue to Payment →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Summary + Payment */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <h2 className="font-syne font-bold text-2xl mb-6 text-[#2D4A35]">Order Summary</h2>

              <div className="rounded-2xl p-6 mb-6 space-y-4 bg-white border border-[#EDE8DC] shadow-sm">
                {/* Service */}
                <div>
                  <p className="text-xs font-dm uppercase tracking-wider mb-2 text-[#5C6B5E]">Service</p>
                  {selectedCombo ? (
                    <div className="flex items-center justify-between">
                      <p className="font-dm font-medium text-[#2D4A35]">{selectedCombo.name}</p>
                      <p className="font-syne font-bold text-[#1B4332]">₹{selectedCombo.price}</p>
                    </div>
                  ) : (
                    selectedServices.map(s => (
                      <div key={s.id} className="flex items-center justify-between py-1">
                        <p className="font-dm text-sm text-[#5C6B5E]">{s.name} × {s.quantity}</p>
                        <p className="font-dm font-medium text-sm text-[#2D4A35]">{formatIndianCurrency(s.price * s.quantity)}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="h-px bg-[#EDE8DC]" />

                {/* Customer details */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Name', value: form.name },
                    { label: 'Phone', value: form.phone },
                    { label: 'Area', value: form.area },
                    { label: 'Date & Time', value: `${formatDateDisplay(selectedDate)} at ${selectedTime}` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-dm text-[#5C6B5E]">{label}</p>
                      <p className="font-dm text-sm font-medium text-[#2D4A35]">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-[#EDE8DC]" />

                {/* Order Summary Map */}
                {form.area && areaCoordinates[form.area] && (
                  <div className="bg-[#1B4332]/5 border border-[#EDE8DC] rounded-xl p-4 mb-4">
                    <p style={{
                      color        : '#1B4332',
                      fontSize     : '12px',
                      fontWeight   : '600',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      marginBottom : '10px',
                    }}>
                      Service Location
                    </p>

                    {/* Mini map */}
                    <div style={{
                      height      : '160px',
                      borderRadius: '10px',
                      overflow    : 'hidden',
                      marginBottom: '10px',
                      border      : '1px solid #EDE8DC',
                    }}>
                      <BookingMap
                        area   ={form.area}
                        address={form.address}
                      />
                    </div>

                    {/* Address details */}
                    <div style={{
                      display      : 'flex',
                      alignItems   : 'flex-start',
                      gap          : '8px',
                    }}>
                      <span style={{ fontSize: '16px' }}>
                        📍
                      </span>
                      <div>
                        <p style={{
                          color     : '#2D4A35',
                          fontSize  : '14px',
                          fontWeight: '500',
                        }}>
                          {form.address}
                        </p>
                        <p style={{
                          color   : '#5C6B5E',
                          fontSize: '13px',
                          marginTop: '2px',
                        }}>
                          {form.area}, {areaCoordinates[form.area]?.city}
                        </p>
                      </div>
                    </div>
                    {/* OPEN IN GOOGLE MAPS BUTTON */}
                     <a
                      href={`https://www.google.com/maps/search/${
                        encodeURIComponent(
                          form.area + ' ' + 
                          areaCoordinates[form.area]?.city
                        )
                      }/@${areaCoordinates[form.area]?.lat},${
                        areaCoordinates[form.area]?.lng
                      },15z`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display        : 'flex',
                        alignItems     : 'center',
                        justifyContent : 'center',
                        gap            : '6px',
                        marginTop      : '8px',
                        padding        : '8px',
                        background     : 'transparent',
                        border         : '1px solid #1B4332',
                        borderRadius   : '10px',
                        color          : '#1B4332',
                        fontSize       : '12px',
                        textDecoration : 'none',
                        transition     : 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(27,67,50,0.05)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      🗺️ Open in Google Maps
                    </a>
                  </div>
                )}

                {/* Total */}
                <div className="rounded-xl p-4 flex items-center justify-between"
                  style={{ background: 'rgba(27,67,50,0.05)', border: '1.5px solid rgba(27,67,50,0.15)' }}>
                  <span className="font-dm font-semibold text-[#2D4A35]">Total Amount</span>
                  <span className="font-syne font-bold text-3xl text-[#1B4332]">{formatIndianCurrency(total)}</span>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-3 mb-6">
                {/* Razorpay Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-[#1B4332] text-white 
                            font-bold py-4 rounded-xl text-base
                            hover:bg-[#0D2B1F] transition-all shadow-md
                            disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" 
                          viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"
                        className="opacity-25"/>
                      <path fill="currentColor" className="opacity-75"
                        d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      {
                        {
                          idle      : `✦ Pay ₹${total} with Razorpay`,
                          creating  : 'Creating booking...',
                          payment   : 'Opening payment...',
                          verifying : 'Verifying payment...'
                        }[bookingStep]
                      }
                    </span>
                  ) : (
                    `✦ Pay ₹${total} with Razorpay`
                  )}
                </button>

                {/* COD Button */}
                <button
                  onClick={handleCODBooking}
                  disabled={loading}
                  className="w-full border border-[#1B4332] 
                            text-[#1B4332] font-semibold py-4 
                            rounded-xl mt-3 hover:bg-[#1B4332] 
                            hover:text-white transition-all duration-300
                            disabled:opacity-50 cursor-pointer"
                >
                  Pay at Doorstep (Cash on Service)
                </button>
              </div>

              <p className="text-center text-xs font-dm text-[#5C6B5E]">
                🔒 Secure payments powered by Razorpay. We'll send a WhatsApp confirmation instantly.
              </p>

              <button onClick={() => setStep(2)} className="mt-4 w-full text-sm font-dm transition-colors text-[#5C6B5E] hover:text-[#2D4A35]">
                ← Change details
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingPage;

