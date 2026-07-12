import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import ProfileModal from './ProfileModal';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { itemCount, setIsOpen } = useCart();
  const navigate = useNavigate();

  const [user, setUser] = useState<{ id: string; email: string; fullName: string; role: string } | null>(null);

  const syncUserFromStorage = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    } else {
      setUser(null);
    }
  };

  const token = localStorage.getItem('sparkclean_token') || localStorage.getItem('sucihome_token') || localStorage.getItem('token');
  const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const isAdmin = decoded?.role === 'ADMIN';

  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    // Check if user is logged in via localStorage
    syncUserFromStorage();
    
    // Listen for custom profile update events
    window.addEventListener('profileUpdated', syncUserFromStorage);

    const checkBanner = () => {
      const dismissed = localStorage.getItem('vizag_launch_banner_dismissed') === 'true';
      setBannerVisible(!dismissed);
    };
    checkBanner();

    window.addEventListener('launchBannerClosed', checkBanner);

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('profileUpdated', syncUserFromStorage);
      window.removeEventListener('launchBannerClosed', checkBanner);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('sparkclean_token');
    localStorage.removeItem('sucihome_token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/'; // Hard reload to clear state and redirects securely
  };

  const navLinks = [
    { label: 'Services', id: 'services' },
    { label: 'Combos', id: 'combos' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Areas', id: 'areas' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav
      className="navbar fixed left-0 right-0 z-50 transition-all duration-500"
      style={{
        top             : bannerVisible ? '38px' : '0',
        background      : scrolled ? 'rgba(245,240,232,0.95)' : 'rgba(245,240,232,0.85)',
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          display   : 'flex',
          alignItems: 'center',
          gap       : '10px',
          textDecoration: 'none',
        }}
      >
        <img
          src="/logo.png"
          alt="SuciHome"
          loading="lazy"
          decoding="async"
          style={{ height: '44px', width: 'auto' }}
        />
        <div>
          <div style={{ lineHeight: 1 }}>
            <span className="navbar-logo-text" style={{
              color     : '#1B4332',
              fontSize  : '22px',
              fontWeight: '800',
              fontFamily: 'Instrument Serif, serif',
            }}>Suci</span>
            <span className="navbar-logo-text" style={{
              color     : '#C9A84C',
              fontSize  : '22px',
              fontWeight: '800',
              fontFamily: 'Instrument Serif, serif',
            }}>Home</span>
          </div>
          <p className="navbar-logo-sub" style={{
            color        : '#C9A84C',
            fontSize     : '9px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            margin       : 0,
            lineHeight   : 1,
          }}>
            Clean Homes, Better Lives
          </p>
        </div>
      </Link>

      {/* Desktop Nav */}
      <div className="navbar-links">
        {navLinks.map(link => (
          <button
            key={link.id}
            onClick={() => scrollTo(link.id)}
            className="text-sm font-medium font-dm transition-colors"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color         : '#2D4A35',
              fontSize      : '14px',
              fontWeight    : '500',
              textDecoration: 'none',
              transition    : 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1B4332')}
            onMouseLeave={e => (e.currentTarget.style.color = '#2D4A35')}
          >
            {link.label}
          </button>
        ))}
        <a 
          href="/track"
          className="text-sm font-medium font-dm transition-colors"
          style={{
            color         : '#2D4A35',
            fontSize      : '14px',
            fontWeight    : '500',
            textDecoration: 'none',
            transition    : 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1B4332')}
          onMouseLeave={e => (e.currentTarget.style.color = '#2D4A35')}
        >
          Track Order
        </a>
      </div>

      {/* Right Actions */}
      <div className="navbar-right">
        {/* Cart */}
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width       : '40px',
            height      : '40px',
            borderRadius: '50%',
            background  : 'rgba(27,67,50,0.08)',
            border      : '1px solid rgba(27,67,50,0.15)',
            color       : '#1B4332',
            cursor      : 'pointer',
            position    : 'relative',
            display     : 'flex',
            alignItems  : 'center',
            justifyContent: 'center',
          }}
          aria-label="Open cart"
        >
          🛒
          {/* Badge */}
          {itemCount > 0 && (
            <span style={{
              position    : 'absolute',
              top         : '-2px',
              right       : '-2px',
              background  : '#C9A84C',
              color       : '#FFF',
              borderRadius: '50%',
              width       : '16px',
              height      : '16px',
              fontSize    : '10px',
              fontWeight  : '700',
              display     : 'flex',
              alignItems  : 'center',
              justifyContent: 'center',
            }}>{itemCount}</span>
          )}
        </button>

        {/* Conditional User / Sign In */}
        {user ? (
          <div className="user-btn">
            <button 
              onClick={() => setProfileModalOpen(true)} 
              style={{
                display     : 'flex',
                alignItems  : 'center',
                gap         : '6px',
                background  : 'rgba(27,67,50,0.08)',
                border      : '1px solid rgba(27,67,50,0.15)',
                borderRadius: '20px',
                padding     : '8px 14px',
                color       : '#1B4332',
                cursor      : 'pointer',
                fontSize    : '14px',
                fontWeight  : '600',
              }}
            >
              👤 {(user?.fullName || 'User').split(' ')[0]}
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="user-btn"
            style={{
              background  : 'transparent',
              border      : 'none',
              color       : '#1B4332',
              cursor      : 'pointer',
              fontSize    : '14px',
              fontWeight  : '600',
              display     : 'block',
            }}
          >
            Sign In
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className="admin-btn"
            style={{
              display     : 'flex',
              alignItems  : 'center',
              gap         : '6px',
              background  : '#1B4332',
              border      : 'none',
              borderRadius: '20px',
              padding     : '8px 16px',
              color       : '#FFFFFF',
              cursor      : 'pointer',
              fontSize    : '14px',
              fontWeight  : '600',
            }}
          >
            ⚙️ Admin
          </button>
        )}
        
        <button
          onClick={() => {
            const token = localStorage.getItem('sparkclean_token') || localStorage.getItem('sucihome_token') || localStorage.getItem('token');
            if (!token) {
              toast.error('Please login to book a service');
              navigate('/auth?redirect=/book');
              return;
            }
            navigate('/book');
          }}
          className="book-now-btn"
          style={{
            display     : 'flex',
            alignItems  : 'center',
            gap         : '8px',
            background  : '#C9A84C',
            border      : 'none',
            borderRadius: '24px',
            padding     : '12px 24px',
            color       : '#FFFFFF',
            cursor      : 'pointer',
            fontSize    : '15px',
            fontWeight  : '700',
          }}
        >
          📅 Book Now
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hamburger-btn"
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 transition-all rounded-full ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} style={{ background: '#1B4332' }}></span>
            <span className={`block h-0.5 transition-all rounded-full ${menuOpen ? 'opacity-0' : ''}`} style={{ background: '#1B4332' }}></span>
            <span className={`block h-0.5 transition-all rounded-full ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} style={{ background: '#1B4332' }}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mobile-menu open"
            style={{
              top: '64px',
            }}
          >
            {/* Mobile menu brand header logo */}
            <div style={{
              display    : 'flex',
              alignItems : 'center',
              gap        : '8px',
              padding    : '16px',
              borderBottom: '1px solid rgba(27,67,50,0.08)',
            }}>
              <img
                src  ="/logo.png"
                alt  ="SuciHome"
                loading="lazy"
                decoding="async"
                style={{
                  height: '32px',
                  width : 'auto',
                }}
              />
              <span style={{
                color      : '#1B4332',
                fontWeight : '700',
                fontSize   : '18px',
                fontFamily : 'Instrument Serif, serif',
              }}>
                Suci<span style={{ color: '#C9A84C' }}>Home</span>
              </span>
            </div>

            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-left text-sm font-medium font-dm transition-colors"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#2D4A35',
                  cursor: 'pointer',
                  padding: '14px 16px',
                  display: 'block',
                  width: '100%',
                }}
              >
                {link.label}
              </button>
            ))}
            
            <a 
              href="/track"
              onClick={() => setMenuOpen(false)}
              className="text-left text-sm font-medium font-dm transition-colors"
              style={{ color: '#2D4A35', textDecoration: 'none', padding: '14px 16px', display: 'block' }}
            >
              Track Order
            </a>
            
            {user ? (
              <div className="flex flex-col gap-4 border-t border-[rgba(27,67,50,0.15)] pt-4 mt-2">
                 <button 
                   onClick={() => { setMenuOpen(false); setProfileModalOpen(true); }} 
                   className="flex items-center gap-2 text-sm font-medium text-white hover:text-[#1B4332] transition-colors bg-white/5 py-2 px-3 rounded-lg border border-white/10"
                   style={{
                     background: 'rgba(27,67,50,0.08)',
                     border: '1px solid rgba(27,67,50,0.15)',
                     color: '#1B4332',
                     padding: '14px 16px',
                   }}
                 >
                    My Profile ({(user?.fullName || 'User').split(' ')[0]})
                 </button>
              </div>
            ) : (
              <button
                onClick={() => { navigate('/auth'); setMenuOpen(false); }}
                className="text-left text-sm font-medium font-dm transition-colors"
                style={{ color: '#1B4332', background: 'transparent', border: 'none', cursor: 'pointer', padding: '14px 16px', display: 'block', width: '100%' }}
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => {
                setMenuOpen(false);
                const token = localStorage.getItem('sparkclean_token') || localStorage.getItem('sucihome_token') || localStorage.getItem('token');
                if (!token) {
                  toast.error('Please login to book a service');
                  navigate('/auth?redirect=/book');
                  return;
                }
                navigate('/book');
              }}
              className="book-btn-mobile"
              style={{
                width       : '100%',
              }}
            >
              Book Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      {user && (
        <ProfileModal 
          isOpen={profileModalOpen} 
          onClose={() => setProfileModalOpen(false)} 
          onLogout={() => { setProfileModalOpen(false); handleLogout(); }}
          userRole={user.role}
        />
      )}
    </nav>
  );
};

export default Navbar;
