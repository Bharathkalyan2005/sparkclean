import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const footerAreas = [
  // LIVE cities — with star badge
  { name: "Koramangala",    city: "Bengaluru", live: true  },
  { name: "Indiranagar",    city: "Bengaluru", live: true  },
  { name: "Bandra",         city: "Mumbai",    live: true  },
  { name: "Andheri",        city: "Mumbai",    live: true  },
  // Coming Soon
  { name: "Hyderabad",      city: "",          live: false },
  { name: "Chennai",        city: "",          live: false },
  { name: "Delhi NCR",      city: "",          live: false },
];

// Price overrides for display only in footer if needed, otherwise mapping over SERVICES is fine.
const servicePriceOverrides: Record<string, number> = {
  "Fridge Cleaning": 199,
  "Utensils Cleaning": 49,
  "Kitchen Prep Help": 99,
  "Dusting & Wiping": 199,
  "Kitchen Cleaning": 399,
  "Pre-Party Express": 699,
};

const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative" style={{ background: '#0A0A0A', borderTop: '1px solid rgba(10,255,230,0.2)' }}>
      {/* Top footer */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1">
            <div className="mb-4">
              <Logo subText="India's Cleanest Choice" />
            </div>
            <p className="font-dm text-sm leading-relaxed mb-5" style={{ color: '#606060' }}>
              India's most trusted home cleaning service. Trained staff, transparent pricing, instant booking.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="https://wa.me/919392420643" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-syne font-bold mb-4" style={{ color: '#0AFFE6' }}>Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
                { label: 'Services', action: () => scrollTo('services') },
                { label: 'Combo Packages', action: () => scrollTo('combos') },
                { label: 'How It Works', action: () => scrollTo('how-it-works') },
                { label: 'Book Now', href: '/book' },
                { label: 'Admin Login', href: '/sparkadmin' },
                { label: 'Track Booking', href: '/track' },
                { label: 'My Profile', href: '/profile' },
                { label: 'My Bookings', href: '/bookings' },
              ].map((link, i) => (
                <li key={i}>
                  {link.href ? (
                    <Link to={link.href} className="font-dm text-sm transition-colors text-[#606060] hover:text-[#0AFFE6]">
                      {link.label}
                    </Link>
                  ) : (
                    <button onClick={link.action!} className="font-dm text-sm transition-colors text-left text-[#606060] hover:text-[#0AFFE6]">
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-syne font-bold mb-4" style={{ color: '#0AFFE6' }}>Our Services</h4>
            <ul className="space-y-2.5">
              {Object.entries(servicePriceOverrides).map(([name, price], idx) => (
                <li key={idx}>
                  <Link to="/book" className="font-dm text-sm transition-colors text-[#606060] hover:text-[#0AFFE6]">
                    {name} — ₹{price}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h4 style={{
              color        : '#0AFFE6',
              fontWeight   : '700',
              fontSize     : '16px',
              marginBottom : '16px',
              letterSpacing: '0.5px',
            }}>
              Service Areas
            </h4>

            {/* Live Cities */}
            <p style={{
              color       : 'rgba(255,255,255,0.3)',
              fontSize    : '11px',
              fontWeight  : '600',
              letterSpacing:'1.5px',
              marginBottom: '8px',
              textTransform:'uppercase',
            }}>
              Live Now
            </p>

            {footerAreas
              .filter(a => a.live)
              .map(area => (
                <p key={area.name} style={{
                  color      : '#A0A0A0',
                  fontSize   : '14px',
                  marginBottom:'6px',
                  display    : 'flex',
                  alignItems : 'center',
                  gap        : '6px',
                }}>
                  <span style={{ color: '#0AFFE6' }}>✦</span>
                  {area.name}
                  <span style={{
                    fontSize  : '11px',
                    color     : 'rgba(255,255,255,0.3)',
                  }}>
                    {area.city}
                  </span>
                </p>
              ))
            }

            {/* Coming Soon Cities */}
            <p style={{
              color        : 'rgba(255,255,255,0.3)',
              fontSize     : '11px',
              fontWeight   : '600',
              letterSpacing: '1.5px',
              margin       : '12px 0 8px',
              textTransform: 'uppercase',
            }}>
              Coming Soon
            </p>

            {footerAreas
              .filter(a => !a.live)
              .map(area => (
                <p key={area.name} style={{
                  color      : 'rgba(255,255,255,0.3)',
                  fontSize   : '13px',
                  marginBottom:'6px',
                  display    : 'flex',
                  alignItems : 'center',
                  gap        : '6px',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>
                    🔒
                  </span>
                  {area.name}
                </p>
              ))
            }
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="py-5" style={{ borderTop: '1px solid rgba(10,255,230,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-dm text-sm text-center md:text-left" style={{ color: '#606060' }}>
            Serving India with ❤️ | © 2026 SuciHome by VRC Pvt Ltd
          </p>
          <p className="font-dm text-xs" style={{ color: '#606060' }}>
            All rights reserved. GST &amp; business compliant.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;