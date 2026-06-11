import React, { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

export default function CleanerApp() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [bookingId, setBookingId] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [statusText, setStatusText] = useState('Disconnected')
  const [watchId, setWatchId] = useState<number | null>(null)

  useEffect(() => {
    // Connect to Backend Socket.io
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:3001', {
      withCredentials: true
    })
    
    newSocket.on('connect', () => {
      setStatusText('Connected to Command Center')
    })

    setSocket(newSocket)

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
      newSocket.disconnect()
    }
  }, [])

  const startTracking = () => {
    if (!socket || !bookingId) return

    socket.emit('cleaner:join', bookingId)
    setIsActive(true)
    setStatusText('Acquiring GPS Signal...')

    if ('geolocation' in navigator) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          setStatusText(`Transmitting: [${lat.toFixed(4)}, ${lng.toFixed(4)}]`)
          
          socket.emit('cleaner:location', {
            bookingId,
            lat,
            lng
          })
        },
        (error) => {
          setStatusText(`GPS Error: ${error.message}`)
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      )
      setWatchId(id)
    } else {
      setStatusText('Geolocation not supported by device.')
    }
  }

  const stopTracking = () => {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId)
    setWatchId(null)
    setIsActive(false)
    setStatusText('Tracking Offline')
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] p-6 font-mono flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white border border-[#EDE8DC] p-8 rounded-2xl shadow-md text-[#2D4A35]">
        <h1 className="text-2xl font-bold tracking-widest text-[#1B4332] mb-6 flex items-center gap-3">
          <span className="w-3 h-3 bg-[#1B4332] rounded-full animate-pulse"></span>
          CLEANER TERMINAL
        </h1>

        <div className="mb-6">
          <label className="block text-[#5C6B5E] text-xs mb-2">TARGET BOOKING ID</label>
          <input 
            type="text" 
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            disabled={isActive}
            className="w-full bg-white border border-[#EDE8DC] p-3 rounded text-[#2D4A35] focus:outline-none focus:border-[#1B4332] disabled:opacity-50"
            placeholder="Enter UUID..."
          />
        </div>

        <div className="mb-8 p-4 bg-[#EDE8DC]/50 border border-[#EDE8DC] rounded-lg flex flex-col items-center justify-center min-h-[100px]">
          <div className="text-xs text-[#5C6B5E] mb-1">SYSTEM STATUS</div>
          <div className={`text-sm ${isActive ? 'text-[#1B4332] font-bold' : 'text-amber-600'} text-center`}>
            {statusText}
          </div>
        </div>

        {!isActive ? (
          <button 
            onClick={startTracking}
            disabled={!bookingId}
            className="w-full py-4 bg-[#1B4332] text-white font-bold tracking-widest rounded-lg hover:bg-[#0D2B1F] transition-colors disabled:opacity-50"
          >
            INITIALIZE TRACKING
          </button>
        ) : (
          <button 
            onClick={stopTracking}
            className="w-full py-4 bg-red-50 text-red-700 border border-red-200 font-bold tracking-widest rounded-lg hover:bg-red-100 transition-colors"
          >
            TERMINATE CONNECTION
          </button>
        )}
      </div>
    </div>
  )
}