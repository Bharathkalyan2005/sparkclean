import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/axiosInstance';
import toast from 'react-hot-toast';
import { Search, MapPin, Calendar, Clock, CreditCard, User, ChevronRight } from 'lucide-react';

const STATUS_COLORS: Record<string, { color: string; label: string }> = {
  PENDING: { color: '#F59E0B', label: 'Booking Received' },
  CONFIRMED: { color: '#0AFFE6', label: 'Confirmed' },
  ASSIGNED: { color: '#3B82F6', label: 'Cleaner Assigned' },
  IN_PROGRESS: { color: '#8B5CF6', label: 'In Progress' },
  COMPLETED: { color: '#22C55E', label: 'Completed ✓' },
  CANCELLED: { color: '#EF4444', label: 'Cancelled' },
};

const TIMELINE_STEPS = [
  { id: 'PENDING', label: 'Booking Received' },
  { id: 'CONFIRMED', label: 'Booking Confirmed' },
  { id: 'ASSIGNED', label: 'Cleaner Assigned' },
  { id: 'IN_PROGRESS', label: 'Service In Progress' },
  { id: 'COMPLETED', label: 'Service Completed' },
  { id: 'REVIEW', label: 'Review & Rating' },
];

const TrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [query, setQuery] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [phoneBookings, setPhoneBookings] = useState<any[]>([]);

  useEffect(() => {
    if (initialId) {
      handleTrack(initialId);
    }
  }, [initialId]);

  const handleTrack = async (searchQuery: string) => {
    if (!searchQuery) return;
    setLoading(true);
    setBooking(null);
    setPhoneBookings([]);

    try {
      const isBookingId = searchQuery.toUpperCase().startsWith('SC-');

      if (isBookingId) {
        const { data } = await api.get(`/bookings/track/${searchQuery.toUpperCase()}`);
        setBooking(data);
        // Update URL
        setSearchParams({ id: searchQuery.toUpperCase() });
      } else {
        // Track by phone
        const { data } = await api.post('/bookings/track-by-phone', { phone: searchQuery });
        if (data.bookings.length === 1) {
          // If only 1 booking, fetch its full details immediately to show the timeline
          const id = data.bookings[0].bookingNumber;
          const { data: fullBooking } = await api.get(`/bookings/track/${id}`);
          setBooking(fullBooking);
          setSearchParams({ id });
        } else {
          setPhoneBookings(data.bookings);
          setSearchParams({});
        }
      }
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Booking not found. Please check your details.';
      toast.error(msg, {
        style: { background: '#1A1A2E', color: '#fff', border: '1px solid rgba(255,107,107,0.3)' }
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepId: string, currentStatus: string) => {
    if (currentStatus === 'CANCELLED') return 'pending'; // Gray out everything if cancelled

    const statusOrder = ['PENDING', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'REVIEW'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="min-h-screen pt-32 pb-24" style={{ background: '#0A0A0A' }}>
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-syne font-bold text-4xl mb-4 text-white"
          >
            Track Your Booking
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 font-dm"
          >
            Enter your Booking ID or Phone Number to check status
          </motion.p>
        </div>

        {/* Search Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-2 mb-12 flex items-center gap-2"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(10,255,230,0.2)' }}
        >
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search className="w-5 h-5 text-teal-400 opacity-70" />
            <input 
              type="text" 
              placeholder="e.g. SC-20260430-MRRHU4 or 9876543210"
              className="w-full bg-transparent border-none outline-none text-white font-dm placeholder-white/30 py-3"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrack(query)}
            />
          </div>
          <button 
            onClick={() => handleTrack(query)}
            disabled={loading || !query}
            className="btn-teal px-6 py-3 rounded-xl disabled:opacity-50 min-w-[120px]"
          >
            {loading ? 'Searching...' : 'Track Now'}
          </button>
        </motion.div>

        {/* Multiple Bookings Found (Phone Search) */}
        <AnimatePresence mode="wait">
          {phoneBookings.length > 0 && !booking && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="font-syne font-bold text-xl text-white mb-6">Recent Bookings</h3>
              {phoneBookings.map((b, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={b.bookingNumber}
                  onClick={() => handleTrack(b.bookingNumber)}
                  className="glass rounded-2xl p-5 flex items-center justify-between cursor-pointer group hover:bg-white/5 transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div>
                    <p className="font-syne font-bold text-lg text-teal-400 mb-1">{b.bookingNumber}</p>
                    <p className="font-dm text-sm text-white/50">{new Date(b.scheduledDate).toLocaleDateString('en-IN')} at {b.scheduledTime}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full text-xs font-dm font-bold" 
                      style={{ background: `${STATUS_COLORS[b.status]?.color}20`, color: STATUS_COLORS[b.status]?.color }}>
                      {STATUS_COLORS[b.status]?.label || b.status}
                    </span>
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-teal-400 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Single Booking Details */}
          {booking && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-5 gap-8"
            >
              {/* Timeline */}
              <div className="md:col-span-2 glass rounded-3xl p-8" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 className="font-syne font-bold text-xl text-white mb-8">Status Timeline</h3>
                
                {booking.status === 'CANCELLED' && (
                  <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="font-syne font-bold text-red-400 mb-1">Booking Cancelled</p>
                    <p className="font-dm text-xs text-red-400/70">This booking has been cancelled.</p>
                  </div>
                )}

                <div className="space-y-6 relative">
                  {/* Vertical Line Connector */}
                  <div className="absolute left-3.5 top-2 bottom-6 w-0.5" style={{ background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />

                  {TIMELINE_STEPS.map((step, idx) => {
                    const status = getStepStatus(step.id, booking.status);
                    
                    return (
                      <div key={step.id} className="flex gap-4 relative z-10">
                        <div className="flex flex-col items-center">
                          {status === 'completed' && (
                            <div className="w-7 h-7 rounded-full bg-teal-400 flex items-center justify-center shadow-[0_0_15px_rgba(10,255,230,0.4)]">
                              <svg className="w-4 h-4 text-[#0A0A0A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          {status === 'current' && (
                            <div className="relative flex items-center justify-center w-7 h-7">
                              <div className="absolute inset-0 rounded-full bg-teal-400/30 animate-ping" />
                              <div className="w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(10,255,230,0.8)]" />
                            </div>
                          )}
                          {status === 'pending' && (
                            <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border-2 border-white/10 flex items-center justify-center" />
                          )}
                          
                          {/* Colored line for completed paths */}
                          {idx < TIMELINE_STEPS.length - 1 && status === 'completed' && (
                            <div className="absolute top-7 w-0.5 h-full bg-teal-400" style={{ left: '13px', zIndex: -1 }} />
                          )}
                        </div>

                        <div className={`pb-2 ${status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                          <p className={`font-dm font-bold text-sm ${status === 'current' ? 'text-teal-400' : 'text-white'}`}>
                            {step.label}
                          </p>
                          
                          {/* Optional context per step */}
                          {step.id === 'PENDING' && status !== 'pending' && (
                            <p className="text-xs text-white/50 mt-1">{new Date(booking.createdAt).toLocaleString('en-IN')}</p>
                          )}
                          {step.id === 'IN_PROGRESS' && status === 'pending' && booking.status !== 'CANCELLED' && (
                            <p className="text-xs text-white/50 mt-1">Scheduled: {new Date(booking.scheduledDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric'})}, {booking.scheduledTime}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details Card */}
              <div className="md:col-span-3 space-y-6">
                <div className="glass rounded-3xl p-8 h-full" style={{ border: '1px solid rgba(10,255,230,0.1)' }}>
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <p className="text-teal-400 font-dm text-sm mb-1 font-bold">Booking Details</p>
                      <h2 className="font-syne font-bold text-2xl text-white tracking-wide">{booking.bookingNumber}</h2>
                    </div>
                    <span className="px-4 py-1.5 rounded-full text-xs font-dm font-bold tracking-wider uppercase" 
                      style={{ background: `${STATUS_COLORS[booking.status]?.color}20`, color: STATUS_COLORS[booking.status]?.color, border: `1px solid ${STATUS_COLORS[booking.status]?.color}40` }}>
                      {STATUS_COLORS[booking.status]?.label || booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 mb-8">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white/50" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-dm mb-0.5">Customer</p>
                        <p className="text-white font-dm text-sm">{booking.customerName}</p>
                        <p className="text-white/50 font-dm text-xs">{booking.customerPhone}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-white/50" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-dm mb-0.5">Location</p>
                        <p className="text-white font-dm text-sm">{booking.area}</p>
                        <p className="text-white/50 font-dm text-xs">{booking.city}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-white/50" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-dm mb-0.5">Schedule</p>
                        <p className="text-white font-dm text-sm">{new Date(booking.scheduledDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-white/50 font-dm text-xs">{booking.scheduledTime}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-4 h-4 text-white/50" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-dm mb-0.5">Payment</p>
                        <p className="text-white font-dm text-sm">{formatIndianCurrency(booking.totalAmount)}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-white/50 font-dm text-xs uppercase">{booking.paymentMethod || 'Online'}</span>
                          {booking.paymentStatus === 'paid' ? (
                            <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold">PAID</span>
                          ) : (
                            <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-bold">PENDING</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services List */}
                  <div className="bg-white/5 rounded-2xl p-4 mb-8">
                    <p className="text-white/40 text-xs font-dm mb-3">Services Booked</p>
                    <div className="space-y-2">
                      {Array.isArray(booking.services) ? booking.services.map((s: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm font-dm">
                          <span className="text-white/90">• {s.name} {s.quantity > 1 ? `x${s.quantity}` : ''}</span>
                          <span className="text-white/50">{formatIndianCurrency(s.price * (s.quantity || 1))}</span>
                        </div>
                      )) : (
                        <p className="text-white/50 text-sm font-dm">Service details not available</p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center font-bold text-sm">
                      <span className="text-white">Total Amount</span>
                      <span className="text-teal-400">{formatIndianCurrency(booking.totalAmount)}</span>
                    </div>
                  </div>

                  {/* WhatsApp Support */}
                  <a
                    href={`https://wa.me/919392420643?text=Hi!%20My%20booking%20ID%20is%20${booking.bookingNumber},%20I%20need%20help.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl font-dm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 bg-white/5 hover:bg-white/10 border border-white/10"
                  >
                    <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Need help? Chat on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrackingPage;
