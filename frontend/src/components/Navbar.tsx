import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { User as UserIcon } from 'lucide-react';
import ProfileModal from './ProfileModal';
import toast from 'react-hot-toast';

const SparkLogo = () => (
  <img src="/logo-primary-cropped.png" alt="SparkClean Logo" className="h-8 w-auto" />
);

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

  useEffect(() => {
    // Check if user is logged in via localStorage
    syncUserFromStorage();
    
    // Listen for custom profile update events
    window.addEventListener('profileUpdated', syncUserFromStorage);

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('profileUpdated', syncUserFromStorage);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        height: '72px',
        background: scrolled ? 'rgba(10,10,10,0.85)' : 'rgba(10,10,10,0)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: scrolled ? '0 2px 24px rgba(10,255,230,0.12), 0 1px 0 rgba(10,255,230,0.15)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(10,255,230,0.15)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group mt-2">
          <SparkLogo />
          <div>
            <span className="font-['Syne'] font-bold tracking-wider text-xl transition-colors group-hover:opacity-80" style={{ color: '#FFFFFF' }}>
              SparkClean
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-sm font-medium font-dm transition-colors"
              style={{ color: '#A0A0A0' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 rounded-xl transition-all mr-2"
            style={{
              background: 'rgba(10,255,230,0.08)',
              border: '1px solid rgba(10,255,230,0.25)',
            }}
            aria-label="Open cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="#FFFFFF" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#0AFFE6,#00CDB7)', color: '#0A1628' }}>
                {itemCount}
              </span>
            )}
          </button>

          {/* Conditional User / Sign In */}
          {user ? (
             <div className="hidden md:flex items-center gap-4">
                <button 
                  onClick={() => setProfileModalOpen(true)} 
                  className="flex items-center gap-2 text-sm font-medium hover:text-[#0AFFE6] transition-colors bg-white/5 py-1.5 px-3 rounded-full border border-white/10" 
                  style={{ color: '#E0E0E0' }}
                >
                  <div className="bg-[#0AFFE6]/20 p-1.5 rounded-full">
                    <UserIcon className="w-3.5 h-3.5 text-[#0AFFE6]" />
                  </div>
                  {user.fullName.split(' ')[0]}
                </button>
             </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="text-sm font-dm transition-colors hover:text-white hidden md:block"
              style={{ color: '#0AFFE6' }}
            >
              Sign In
            </button>
          )}
          
          <button
            onClick={() => {
              const token = localStorage.getItem('sparkclean_token') || localStorage.getItem('token')
              if (!token) {
                toast.error('Please login to book a service')
                navigate('/auth?redirect=/book')
                return
              }
              navigate('/book')
            }}
            className="btn-teal text-sm px-5 py-2.5 hidden md:block ripple ml-2"
          >
            Book Now
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl transition-all"
            style={{ background: 'rgba(10,255,230,0.08)', border: '1px solid rgba(10,255,230,0.2)' }}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 transition-all rounded-full ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} style={{ background: '#FFFFFF' }}></span>
              <span className={`block h-0.5 transition-all rounded-full ${menuOpen ? 'opacity-0' : ''}`} style={{ background: '#FFFFFF' }}></span>
              <span className={`block h-0.5 transition-all rounded-full ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} style={{ background: '#FFFFFF' }}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden px-4 py-4 flex flex-col gap-4"
            style={{
              background: 'rgba(16,16,16,0.97)',
              borderTop: '1px solid rgba(10,255,230,0.15)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-left text-sm font-medium font-dm transition-colors"
                style={{ color: '#A0A0A0' }}
              >
                {link.label}
              </button>
            ))}
            
            {user ? (
              <div className="flex flex-col gap-4 border-t border-[rgba(10,255,230,0.15)] pt-4 mt-2">
                 <button 
                   onClick={() => { setMenuOpen(false); setProfileModalOpen(true); }} 
                   className="flex items-center gap-2 text-sm font-medium text-white hover:text-[#0AFFE6] transition-colors bg-white/5 py-2 px-3 rounded-lg border border-white/10"
                 >
                   <div className="bg-[#0AFFE6]/20 p-1.5 rounded-full">
                     <UserIcon className="w-4 h-4 text-[#0AFFE6]" />
                   </div>
                   My Profile ({user.fullName.split(' ')[0]})
                 </button>
              </div>
            ) : (
              <button
                onClick={() => { navigate('/auth'); setMenuOpen(false); }}
                className="text-left text-sm font-medium font-dm transition-colors"
                style={{ color: '#0AFFE6' }}
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => {
                setMenuOpen(false);
                const token = localStorage.getItem('sparkclean_token') || localStorage.getItem('token')
                if (!token) {
                  toast.error('Please login to book a service')
                  navigate('/auth?redirect=/book')
                  return
                }
                navigate('/book');
              }}
              className="btn-teal text-sm py-3 text-center"
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
