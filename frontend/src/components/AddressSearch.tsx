import React, { useState } from 'react'

interface PhotonFeature {
  properties: {
    name: string
    city?: string
    state?: string
    country?: string
  }
  geometry: {
    coordinates: [number, number] // [lng, lat]
  }
}

interface AddressSearchProps {
  onSelectAddress: (address: string, lat: number, lng: number) => void
  placeholder?: string
}

export default function AddressSearch({ onSelectAddress, placeholder = 'Search your address...' }: AddressSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PhotonFeature[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)

    if (val.length < 3) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      // Photon API is free and doesn't require an API key
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(val)}&limit=5`)
      const data = await res.json()
      setResults(data.features || [])
    } catch (err) {
      console.error('Photon search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (feature: PhotonFeature) => {
    const { name, city, state } = feature.properties
    const [lng, lat] = feature.geometry.coordinates

    const displayName = [name, city, state].filter(Boolean).join(', ')

    setQuery(displayName)
    setResults([])
    onSelectAddress(displayName, lat, lng)
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        className="w-full bg-white border border-[#EDE8DC] p-3 rounded-lg text-[#2D4A35] focus:outline-none focus:border-[#1B4332] transition-colors shadow-md"
        placeholder={placeholder}
        value={query}
        onChange={handleSearch}
      />
      {loading && (
        <span className="absolute right-3 top-3 text-[#1B4332] text-sm animate-pulse">
          Searching...
        </span>
      )}

      {results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-[#EDE8DC] rounded-lg shadow-xl z-50 overflow-hidden">
          {results.map((r, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-3 hover:bg-[#1B4332]/5 text-[#2D4A35] transition-colors border-b border-[#EDE8DC] last:border-0"
            >
              <div className="font-semibold">{r.properties.name}</div>
              <div className="text-xs text-[#5C6B5E]">
                {[r.properties.city, r.properties.state, r.properties.country].filter(Boolean).join(', ')}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
