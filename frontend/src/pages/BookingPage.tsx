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
};

// Dark map style
const darkMapStyle = [
  { elementType: 'geometry',
    stylers: [{ color: '#0a0a0a' }] },
  { elementType: 'labels.text.stroke',
    stylers: [{ color: '#0a0a0a' }] },
  { elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1a1a1a' }] },
  { featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#1a1a2e' }] },
  { featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0a1628' }] },
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
        background    : 'rgba(10,255,230,0.03)',
        border        : '1px solid rgba(10,255,230,0.15)',
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
            stroke="#0AFFE6" strokeWidth="3"
            strokeDasharray="50 30"
          />
        </svg>
        <span style={{ color: '#A0A0A0', fontSize: '13px' }}>
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
        styles           : darkMapStyle,
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
          fillColor   : '#0AFFE6',
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
          fillColor   : '#0AFFE6',
          fillOpacity : 0.06,
          strokeColor : '#0AFFE6',
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
      const formattedCombos = comboRes.data.combos.map((c: any, i: number) => ({
        ...c,
        price: Number(c.price),
        is_popular: i === 1
      }));
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

  // ── Pay Online via Razorpay checkout modal ────────────────────
const handlePayment = async () => {
  setLoading(true)
  setBookingStep('creating')
  try {
    // Step 1: Create booking
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
      paymentMethod : 'RAZORPAY',
      scheduledDate : selectedDate,
      scheduledTime : selectedTime,
      notes         : '',
    })

    const { bookingId, bookingNumber } = bookingRes.data
    
    // Store for success page
    localStorage.setItem('last_booking_number', bookingNumber)
    localStorage.setItem('last_booking_id',     bookingId)
    
    console.log('New Booking ID:', bookingNumber)

    // Show booking ID to user immediately
    toast.success(
      `Booking created! ID: ${bookingNumber}`,
      { duration: 5000 }
    )

    // Step 2: Create Razorpay order
    const orderRes = await api.post('/payments/create-order', {
      bookingId
    })

    const {
      orderId,
      amount,
      keyId,
      customerName,
      customerPhone,
      customerEmail,
    } = orderRes.data

    console.log('✅ Razorpay order:', orderId)

    // Step 3: Check Razorpay is loaded
    if (!(window as any).Razorpay) {
      toast.error('Payment gateway not loaded. Refresh and try again.')
      setLoading(false)
      return
    }

    // Step 4: Open Razorpay checkout
    setBookingStep('payment')
    const options = {
      key         : keyId,
      amount      : amount,
      currency    : 'INR',
      name        : 'SuciHome',
      description : `Booking #${bookingNumber}`,
      image       : '/logo-primary-cropped.png',
      
      order_id: orderId,
      
      prefill: {
        name   : customerName,
        email  : customerEmail  || '',
        contact: customerPhone,
      },
      
      notes: {
        booking_number: bookingNumber,
        area          : form.area,
        address       : form.address,
      },

      theme: {
        color    : '#0AFFE6',
        hide_topbar: false,
      },

      retry: {
        enabled: true,
        max_count: 3,
      },

      modal: {
        confirm_close : true,
        animation     : true,
        backdropclose : false,
        escape        : false,
        handleback    : true,
        ondismiss     : () => {
          console.log('Razorpay modal closed')
          setLoading(false)
          setBookingStep('idle')
        }
      },

      handler: async (response: any) => {
        try {
          setLoading(true)
          setBookingStep('verifying')
          console.log('Payment success:', response)

          await api.post('/payments/verify', {
            razorpay_order_id  : response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature : response.razorpay_signature,
            bookingId,
          })

          clearCart();
          toast.success('Payment successful! 🎉')
          
          localStorage.setItem('sc_booking_number', bookingNumber)
          localStorage.setItem('sc_booking_id', bookingId)

          navigate(`/success?booking=${bookingId}&number=${bookingNumber}`)

        } catch (err) {
          console.error('Verification failed:', err)
          toast.error('Payment done but verification failed. Contact support.')
          setLoading(false)
          setBookingStep('idle')
        }
      }
    }

    const rzp = new (window as any).Razorpay(options)

    rzp.on('payment.failed', (response: any) => {
      const { code, description } = response.error
      console.error('Payment failed:', code, description)

      // Show specific error to user
      const errorMessages: Record<string, string> = {
        'BAD_REQUEST_ERROR'    : 'Invalid payment details. Please retry.',
        'GATEWAY_ERROR'        : 'Bank gateway error. Please try another method.',
        'NETWORK_ERROR'        : 'Network issue. Check connection and retry.',
        'SERVER_ERROR'         : 'Payment server error. Please retry.',
      }

      toast.error(
        errorMessages[code] || 
        description || 
        'Payment failed. Please try again.'
      )
      setLoading(false)
      setBookingStep('idle')
    })

    rzp.open()

  } catch (error: any) {
    console.error('Payment error:', error)
    toast.error(
      error.response?.data?.message || 
      'Something went wrong'
    )
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
    
    localStorage.setItem('sc_booking_number', bookingNumber)
    localStorage.setItem('sc_booking_id', bookingId)
    
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
  const cardSelected = { border: '1.5px solid #0AFFE6', background: 'rgba(10,255,230,0.06)', borderRadius: 14 };
  const cardDefault = { border: '1.5px solid rgba(10,255,230,0.18)', background: '#FFFFFF', borderRadius: 14 };

  return (
    <div className="min-h-screen" style={{ background: '#F0FFFE' }}>
      {/* Top nav */}
      <div className="px-4 py-4" style={{ background: '#FFFFFF', borderBottom: '1px solid rgba(10,255,230,0.2)', boxShadow: '0 1px 16px rgba(10,255,230,0.08)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 transition-colors" style={{ color: '#4A4A6A' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#00897B')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4A4A6A')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-dm text-sm">Back to Home</span>
          </button>
          <span className="font-syne font-bold" style={{ color: '#1A1A2E' }}>Book a Cleaning</span>
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
                    background: step > i + 1 ? 'rgba(10,255,230,0.2)' : step === i + 1 ? 'linear-gradient(135deg,#0AFFE6,#00CDB7)' : 'rgba(10,255,230,0.06)',
                    border: `2px solid ${step >= i + 1 ? '#0AFFE6' : 'rgba(10,255,230,0.2)'}`,
                    color: step === i + 1 ? '#0A1628' : step > i + 1 ? '#00897B' : 'rgba(26,26,46,0.35)',
                  }}
                >
                  {step > i + 1 ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-sm font-dm hidden sm:block`}
                  style={{ color: step === i + 1 ? '#1A1A2E' : 'rgba(26,26,46,0.35)' }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 transition-all duration-500 rounded-full"
                  style={{ background: step > i + 1 ? 'linear-gradient(90deg,#0AFFE6,#00CDB7)' : 'rgba(10,255,230,0.15)' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <h2 className="font-syne font-bold text-2xl mb-6" style={{ color: '#1A1A2E' }}>Choose Your Services</h2>

              {/* Combos */}
              <div className="mb-8">
                <h3 className="text-xs font-dm uppercase tracking-wider mb-4" style={{ color: '#00897B' }}>Combo Packages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {loadingSvc ? <p className="text-sm">Loading...</p> : combos.map(combo => (
                    <button
                      key={combo.id}
                      onClick={() => { setSelectedCombo(selectedCombo?.id === combo.id ? null : combo); setSelectedServices([]); }}
                      className="p-4 text-left transition-all duration-300 card-glow"
                      style={selectedCombo?.id === combo.id ? cardSelected : cardDefault}
                    >
                      {combo.is_popular && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-dm font-semibold mb-2 inline-block"
                          style={{ background: 'rgba(10,255,230,0.15)', color: '#00897B' }}>★ Popular</span>
                      )}
                      <p className="font-syne font-bold" style={{ color: '#1A1A2E' }}>{combo.name}</p>
                      <p className="font-syne font-bold text-xl" style={{ color: '#0AFFE6' }}>₹{combo.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual services */}
              <div>
                <h3 className="text-xs font-dm uppercase tracking-wider mb-4" style={{ color: '#00897B' }}>Individual Services</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {loadingSvc ? <p className="text-sm">Loading...</p> : services.map(service => {
                    const isSelected = selectedServices.some(s => s.id === service.id);
                    return (
                      <button
                        key={service.id}
                        onClick={() => toggleService(service)}
                        className="p-4 text-left flex items-center gap-4 transition-all duration-300"
                        style={isSelected ? cardSelected : cardDefault}
                      >
                        <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all"
                          style={{ background: isSelected ? '#0AFFE6' : 'transparent', borderColor: isSelected ? '#0AFFE6' : 'rgba(10,255,230,0.3)' }}>
                          {isSelected && (
                            <svg className="w-3 h-3" fill="none" stroke="#0A1628" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-dm font-medium text-sm" style={{ color: '#1A1A2E' }}>{service.name}</p>
                          <p className="text-xs font-dm" style={{ color: '#8A8AAA' }}>{service.unit}</p>
                        </div>
                        <span className="font-syne font-bold flex-shrink-0" style={{ color: '#0AFFE6' }}>
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
                  style={{ background: 'rgba(10,255,230,0.08)', border: '1.5px solid rgba(10,255,230,0.3)' }}>
                  <span className="font-dm text-sm" style={{ color: '#00897B' }}>
                    {selectedCombo ? selectedCombo.name : `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected`}
                  </span>
                  <span className="font-syne font-bold text-xl" style={{ color: '#0AFFE6' }}>{formatIndianCurrency(total)}</span>
                </div>
              )}

              <button
                disabled={!isStep1Valid}
                onClick={() => setStep(2)}
                className={`mt-6 w-full py-4 rounded-xl font-dm font-semibold text-base transition-all ${isStep1Valid ? 'btn-teal' : ''}`}
                style={!isStep1Valid ? { background: 'rgba(10,255,230,0.08)', color: 'rgba(26,26,46,0.3)', border: '1.5px solid rgba(10,255,230,0.15)', cursor: 'not-allowed', borderRadius: 12 } : {}}
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <h2 className="font-syne font-bold text-2xl mb-6" style={{ color: '#1A1A2E' }}>Your Details</h2>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-dm mb-1.5" style={{ color: '#4A4A6A' }}>Full Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name" className="form-input light" required />
                  </div>
                  <div>
                    <label className="block text-xs font-dm mb-1.5" style={{ color: '#4A4A6A' }}>Phone Number *</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="10-digit mobile" className="form-input light" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-dm mb-1.5" style={{ color: '#4A4A6A' }}>Email (optional — for payment receipt)</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com" className="form-input light" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-dm" style={{ color: '#4A4A6A' }}>Full Address *</label>
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
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-[#0AFFE6]/20 text-[#07A696] hover:bg-[#0AFFE6]/30 transition-colors"
                    >
                      📍 Auto-detect
                    </button>
                  </div>
                  <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="House/flat no., street, landmark..." className="form-input light min-h-[80px]" required />
                </div>

                <div>
                  <label className="block text-xs font-dm mb-1.5" style={{ color: '#4A4A6A' }}>Area *</label>
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
                      border       : '2px solid #e2e8f0',
                      borderRadius : '12px',
                      fontSize     : '15px',
                      color        : '#1a1a2e',
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
                    <option value="Other (Not listed)">Other (Not listed)</option>
                  </select>

                  {form.area === 'Other (Not listed)' && (
                    <div style={{ marginTop: '12px' }}>
                      <input
                        type="text"
                        placeholder="Enter your custom area or city"
                        className="form-input light"
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
                            color     : '#1A1A2E',
                            fontSize  : '14px',
                            fontWeight: '600',
                          }}>
                            {form.area}
                          </p>
                          <p style={{
                            color   : '#4A4A6A',
                            fontSize: '12px',
                          }}>
                            {areaCoordinates[form.area]?.city}, India
                          </p>
                        </div>
                      </div>

                      {/* Live service badge */}
                      <span style={{
                        background   : 'rgba(10,255,230,0.12)',
                        color        : '#00897B',
                        border       : '1px solid rgba(10,255,230,0.3)',
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
                          border      : '1px solid rgba(10,255,230,0.2)',
                          borderRadius: '14px',
                          overflow    : 'hidden',
                          boxShadow   : '0 0 20px rgba(10,255,230,0.05)',
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
                      color     : 'rgba(26,26,46,0.5)',
                      fontSize  : '12px',
                      textAlign : 'center',
                      marginTop : '8px',
                      display   : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap       : '4px',
                    }}>
                      <span style={{
                        width       : '8px',
                        height      : '8px',
                        borderRadius: '50%',
                        background  : 'rgba(10,255,230,0.4)',
                        display     : 'inline-block',
                      }} />
                      Teal circle shows our ~2km service coverage area
                    </p>
                  </div>
                )}

                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-dm mb-2" style={{ color: '#4A4A6A' }}>Select Date *</label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {nextDates.map(date => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className="rounded-xl p-2 text-center transition-all duration-200"
                        style={selectedDate === date
                          ? { border: '1.5px solid #0AFFE6', background: 'rgba(10,255,230,0.1)', color: '#00897B' }
                          : { border: '1.5px solid rgba(10,255,230,0.18)', background: '#FFFFFF', color: '#4A4A6A' }}
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
                  <label className="block text-xs font-dm mb-2" style={{ color: '#4A4A6A' }}>Select Time Slot *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {TIME_SLOTS.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className="rounded-xl py-2.5 px-3 text-sm font-dm font-medium transition-all duration-200"
                        style={selectedTime === time
                          ? { border: '1.5px solid #0AFFE6', background: 'rgba(10,255,230,0.1)', color: '#00897B' }
                          : { border: '1.5px solid rgba(10,255,230,0.18)', background: '#FFFFFF', color: '#4A4A6A' }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-xl font-dm transition-colors"
                  style={{ background: '#FFFFFF', border: '1.5px solid rgba(10,255,230,0.2)', color: '#4A4A6A' }}>
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
                  className={`flex-[2] py-4 rounded-xl font-dm font-semibold text-base transition-all ${isStep2Valid ? 'btn-teal' : ''}`}
                  style={!isStep2Valid ? { background: 'rgba(10,255,230,0.08)', color: 'rgba(26,26,46,0.3)', border: '1.5px solid rgba(10,255,230,0.15)', cursor: 'not-allowed', borderRadius: 12 } : { borderRadius: 12 }}
                >
                  Continue to Payment →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Summary + Payment */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <h2 className="font-syne font-bold text-2xl mb-6" style={{ color: '#1A1A2E' }}>Order Summary</h2>

              <div className="rounded-2xl p-6 mb-6 space-y-4"
                style={{ background: '#FFFFFF', border: '1.5px solid rgba(10,255,230,0.2)', boxShadow: '0 4px 24px rgba(10,255,230,0.08)' }}>
                {/* Service */}
                <div>
                  <p className="text-xs font-dm uppercase tracking-wider mb-2" style={{ color: '#8A8AAA' }}>Service</p>
                  {selectedCombo ? (
                    <div className="flex items-center justify-between">
                      <p className="font-dm font-medium" style={{ color: '#1A1A2E' }}>{selectedCombo.name}</p>
                      <p className="font-syne font-bold" style={{ color: '#0AFFE6' }}>₹{selectedCombo.price}</p>
                    </div>
                  ) : (
                    selectedServices.map(s => (
                      <div key={s.id} className="flex items-center justify-between py-1">
                        <p className="font-dm text-sm" style={{ color: '#4A4A6A' }}>{s.name} × {s.quantity}</p>
                        <p className="font-dm font-medium text-sm" style={{ color: '#1A1A2E' }}>{formatIndianCurrency(s.price * s.quantity)}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="h-px" style={{ background: 'rgba(10,255,230,0.15)' }} />

                {/* Customer details */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Name', value: form.name },
                    { label: 'Phone', value: form.phone },
                    { label: 'Area', value: form.area },
                    { label: 'Date & Time', value: `${formatDateDisplay(selectedDate)} at ${selectedTime}` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-dm" style={{ color: '#8A8AAA' }}>{label}</p>
                      <p className="font-dm text-sm font-medium" style={{ color: '#1A1A2E' }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div className="h-px" style={{ background: 'rgba(10,255,230,0.15)' }} />

                {/* Order Summary Map */}
                {form.area && areaCoordinates[form.area] && (
                  <div style={{
                    background   : 'rgba(10,255,230,0.02)',
                    border       : '1px solid rgba(10,255,230,0.08)',
                    borderRadius : '14px',
                    padding      : '16px',
                    marginBottom : '16px',
                  }}>
                    <p style={{
                      color        : '#00897B',
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
                      border      : '1px solid rgba(10,255,230,0.15)',
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
                      <span style={{ color: '#0AFFE6', fontSize: '16px' }}>
                        📍
                      </span>
                      <div>
                        <p style={{
                          color     : '#1A1A2E',
                          fontSize  : '14px',
                          fontWeight: '500',
                        }}>
                          {form.address}
                        </p>
                        <p style={{
                          color   : '#4A4A6A',
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
                        border         : '1px solid rgba(10,255,230,0.3)',
                        borderRadius   : '10px',
                        color          : '#00897B',
                        fontSize       : '12px',
                        textDecoration : 'none',
                        transition     : 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(10,255,230,0.05)'
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
                  style={{ background: 'rgba(10,255,230,0.08)', border: '1.5px solid rgba(10,255,230,0.25)' }}>
                  <span className="font-dm font-semibold" style={{ color: '#1A1A2E' }}>Total Amount</span>
                  <span className="font-syne font-bold text-3xl" style={{ color: '#0AFFE6' }}>{formatIndianCurrency(total)}</span>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-3 mb-6">
                {/* Razorpay Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-[#0AFFE6] text-black 
                            font-bold py-4 rounded-xl text-base
                            hover:brightness-110 transition-all
                            disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" 
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
                  className="w-full border border-[#0AFFE6] 
                            text-[#0AFFE6] font-semibold py-4 
                            rounded-xl mt-3 hover:bg-[#0AFFE6] 
                            hover:text-black transition-all
                            disabled:opacity-50"
                >
                  Pay at Doorstep (Cash on Service)
                </button>
              </div>

              <p className="text-center text-xs font-dm" style={{ color: '#8A8AAA' }}>
                🔒 Secure payments powered by Razorpay. We'll send a WhatsApp confirmation instantly.
              </p>

              <button onClick={() => setStep(2)} className="mt-4 w-full text-sm font-dm transition-colors" style={{ color: '#8A8AAA' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1A1A2E')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8A8AAA')}>
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

