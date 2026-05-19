import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { Service } from '../lib/supabase';
import LoginPromptModal from './LoginPromptModal';

type IconProps = { name: string };

const ServiceIcon: React.FC<IconProps> = ({ name }) => {
  const icons: Record<string, React.ReactElement> = {
    bath: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z" strokeLinecap="round"/>
        <path d="M6 12V6a2 2 0 012-2h1" strokeLinecap="round"/>
        <path d="M4 20l-1 2M20 20l1 2" strokeLinecap="round"/>
      </svg>
    ),
    fridge: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <path d="M5 10h14" strokeLinecap="round"/>
        <circle cx="8" cy="6" r="1" fill="currentColor"/>
        <circle cx="8" cy="15" r="1" fill="currentColor"/>
      </svg>
    ),
    utensils: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" strokeLinecap="round"/>
        <path d="M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" strokeLinecap="round"/>
      </svg>
    ),
    kitchen: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    dust: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <path d="M4 4h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2V4zM4 20h16" strokeLinecap="round"/>
        <path d="M4 14h16M4 9h16" strokeLinecap="round"/>
        <circle cx="12" cy="14" r="1" fill="currentColor"/>
      </svg>
    ),
    cabinet: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <rect x="2" y="3" width="20" height="18" rx="2"/>
        <path d="M2 9h20M12 9v12" strokeLinecap="round"/>
        <circle cx="7" cy="15" r="1" fill="currentColor"/>
        <circle cx="17" cy="15" r="1" fill="currentColor"/>
      </svg>
    ),
    party: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    aftersparty: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>
        <circle cx="20" cy="6" r="2" fill="#0AFFE6"/>
        <circle cx="20" cy="12" r="2" fill="#0AFFE6"/>
        <circle cx="20" cy="18" r="2" fill="#0AFFE6"/>
      </svg>
    ),
    iron: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <path d="M4 16h16l-2-8H6L4 16zM2 16h20" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 8V6a2 2 0 00-2-2H10A2 2 0 008 6v2" strokeLinecap="round"/>
      </svg>
    ),
  };
  return icons[name] || icons['dust'];
};

const CategoryFilter: React.FC<{ active: string; onChange: (cat: string) => void }> = ({ active, onChange }) => {
  const categories = ['All', 'Cleaning', 'Kitchen', 'Appliances', 'Laundry', 'Special'];
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-10">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`category-tab ${active === cat ? 'active' : ''}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

const ServiceCard: React.FC<{ service: Service, onClick: () => void }> = ({ service, onClick }) => {
  const { addItem, items } = useCart();
  const isIroning = service.id === 'svc-9';
  const [quantity, setQuantity] = useState(isIroning ? 5 : 1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const inCart = items.some(i => i.id === service.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem('sparkclean_token') || localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    addItem(service, isIroning ? quantity : 1);
    toast.success(`${service.name} added to cart!`);
  };

  return (
    <>
    <LoginPromptModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 card-glow transition-all duration-300 cursor-pointer group relative overflow-hidden"
      style={{ background: '#161616', border: '1px solid rgba(10,255,230,0.2)', boxShadow: '0 2px 16px rgba(0,0,0,0.5)', borderLeft: '3px solid #0AFFE6' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(10,255,230,0.07) 0%, transparent 70%)' }}
      />

      {/* LIMITED OFFER Badge */}
      {service.originalPrice && (
        <div style={{
          position   : 'absolute',
          top        : '12px',
          right      : '12px',
          background : 'linear-gradient(135deg, #0AFFE6, #088C7A)',
          color      : '#000000',
          fontSize   : '10px',
          fontWeight : '700',
          padding    : '3px 10px',
          borderRadius: '20px',
          letterSpacing: '0.5px',
          zIndex: 10
        }}>
          LIMITED OFFER
        </div>
      )}

      {/* Icon */}
      <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
        style={{ background: 'rgba(10,255,230,0.1)', border: '1.5px solid rgba(10,255,230,0.25)', color: '#0AFFE6' }}>
        <ServiceIcon name={service.iconName} />
      </div>

      {/* Info */}
      <h3 className="font-syne font-bold text-lg mb-1" style={{ color: '#FFFFFF' }}>{service.name}</h3>
      <p className="text-xs font-dm mb-4" style={{ color: '#A0A0A0' }}>{service.unit}</p>

      {/* Price */}
      {service.originalPrice ? (
        <div className="flex items-center gap-2 mt-2 mb-5">
          {/* Original price crossed out */}
          <span style={{
            textDecoration : 'line-through',
            color          : 'rgba(255,255,255,0.35)',
            fontSize       : '14px',
          }}>
            ₹{service.originalPrice}
          </span>

          {/* New discounted price */}
          <span style={{
            color      : '#0AFFE6',
            fontSize   : '28px',
            fontWeight : '700',
          }}>
            ₹{service.price}
          </span>
          {service.id === 'svc-9' && (
            <span style={{ color: '#22C55E', fontSize: '11px' }}>
              /cloth
            </span>
          )}

          {/* Save badge */}
          <span style={{
            background   : 'rgba(34,197,94,0.15)',
            color        : '#22C55E',
            border       : '1px solid rgba(34,197,94,0.3)',
            borderRadius : '20px',
            padding      : '2px 8px',
            fontSize     : '11px',
            fontWeight   : '600',
            marginLeft   : '4px'
          }}>
            Save ₹{service.originalPrice - service.price}{service.id === 'svc-9' ? ' per cloth' : ''}
          </span>
        </div>
      ) : (
        <div className="flex items-end gap-1 mt-2 mb-5">
          <span className="font-syne font-bold text-3xl text-teal-400">
            {service.id === 'svc-9' ? '₹10' : `₹${service.price}`}
          </span>
          {service.id === 'svc-9' && <span className="text-sm font-dm pb-1" style={{ color: '#A0A0A0' }}>/cloth</span>}
        </div>
      )}

      {/* Ironing quantity */}
      {isIroning && (
        <div className="mb-4">
          <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
            <button
              onClick={(e) => { e.stopPropagation(); if (quantity > 1) setQuantity(q => q - 1); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all"
              style={{ background: 'rgba(10,255,230,0.08)', border: '1px solid rgba(10,255,230,0.2)', color: '#0AFFE6' }}
            >-</button>
            <input
              type="number"
              value={quantity}
              onChange={e => {
                let val = parseInt(e.target.value);
                if (isNaN(val)) val = 1;
                setQuantity(Math.min(50, Math.max(1, val)));
              }}
              className="w-16 text-center form-input py-1.5 text-sm"
              min={1}
              max={50}
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); if (quantity < 50) setQuantity(q => q + 1); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all"
              style={{ background: 'rgba(10,255,230,0.08)', border: '1px solid rgba(10,255,230,0.2)', color: '#0AFFE6' }}
            >+</button>
            <span className="text-xs font-dm" style={{ color: '#A0A0A0' }}>clothes</span>
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            Min 1 • Max 50 cloths
          </p>
        </div>
      )}

      {/* Total for ironing */}
      {isIroning && (
        <div style={{ marginBottom: '16px' }}>
          <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600 }}>Total: </span>
          <span style={{ color: '#0AFFE6', fontWeight: 700, fontSize: '16px' }}>
            ₹{quantity * 10}
          </span>
        </div>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        className={`w-full py-3 px-4 rounded-xl font-dm font-semibold text-sm transition-all duration-300 ripple flex items-center justify-center gap-2 ${!inCart ? 'btn-teal' : ''}`}
        style={inCart ? { background: 'rgba(10,255,230,0.1)', color: '#0AFFE6', border: '1.5px solid rgba(10,255,230,0.35)', borderRadius: 12 } : {}}
      >
        {inCart ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Added to Cart
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add to Cart
          </>
        )}
      </button>
    </motion.div>
    </>
  );
};

const ServicesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  React.useEffect(() => {
    import('../lib/axiosInstance').then(({ default: api }) => {
      api.get('/services/individual')
        .then(res => setServices(res.data.services))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    });
  }, []);

  const filtered = activeCategory === 'All'
    ? services
    : services.filter(s => {
        // Map frontend categories to our DB iconNames for backward compatibility
        const catLower = activeCategory.toLowerCase();
        if (catLower === 'kitchen' && (s.iconName === 'kitchen' || s.iconName === 'fridge')) return true;
        if (catLower === 'cleaning' && (s.iconName === 'bath' || s.iconName === 'dust' || s.iconName === 'clean')) return true;
        if (catLower === 'appliances' && s.iconName === 'fridge') return true;
        if (catLower === 'laundry' && s.iconName === 'iron') return true;
        if (catLower === 'special' && s.iconName === 'party') return true;
        return false;
      });

  const closeModal = () => setSelectedService(null);

  return (
    <section id="services" className="py-24 relative section-black">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(10,255,230,0.05) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
            style={{ background: 'rgba(10,255,230,0.1)', border: '1px solid rgba(10,255,230,0.3)' }}>
            <span className="text-xs font-medium font-dm tracking-wider uppercase" style={{ color: '#0AFFE6' }}>Our Services</span>
          </div>
          <h2 className="section-heading text-4xl md:text-5xl gradient-text mb-4">
            Everything Your Home Needs
          </h2>
          <p className="text-lg font-dm max-w-2xl mx-auto" style={{ color: '#A0A0A0' }}>
            Professional cleaning services with transparent pricing. No hidden fees, ever.
          </p>
        </motion.div>

        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

        <div style={{
          background     : 'linear-gradient(135deg, rgba(10,255,230,0.1), rgba(10,255,230,0.05))',
          border         : '1px solid rgba(10,255,230,0.3)',
          borderRadius   : '12px',
          padding        : '12px 24px',
          textAlign      : 'center',
          marginBottom   : '32px',
          display        : 'flex',
          alignItems     : 'center',
          justifyContent : 'center'
        }}>
          <span style={{ color: '#0AFFE6', fontWeight: 600, fontSize: '15px' }}>
            🎉 FLAT ₹100 OFF ON ALL CLEANING SERVICES! LIMITED TIME OFFER.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(service => (
            <ServiceCard key={service.id} service={service} onClick={() => setSelectedService(service)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl z-10"
              style={{ backgroundColor: '#111', border: '1px solid rgba(10,255,230,0.3)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white hover:text-teal-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-5/12 relative bg-[#1a1a1a] flex items-center justify-center border-b md:border-b-0 md:border-r" style={{ borderColor: 'rgba(10,255,230,0.2)' }}>
                  {selectedService.image_url ? (
                    <img src={selectedService.image_url} alt={selectedService.name} className="w-full h-full object-cover max-h-[300px] md:max-h-none" />
                  ) : (
                    <div className="p-12 text-teal-400 opacity-50 flex items-center justify-center h-[200px] md:h-full">
                      <ServiceIcon name={selectedService.iconName} />
                    </div>
                  )}
                  {selectedService.highlight && (
                    <div className="absolute bottom-0 left-0 right-0 bg-teal-500 bg-opacity-90 text-black text-center py-2 px-3 font-bold text-sm">
                      {selectedService.highlight}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="w-full md:w-7/12 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-syne font-bold text-2xl mb-2 text-white">
                      {selectedService.name}
                    </h3>
                    
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-dm mb-4 bg-teal-500 bg-opacity-10 text-teal-300 border border-teal-500 border-opacity-30">
                      {selectedService.category} Service
                    </div>

                    {selectedService.description && (
                      <p className="text-gray-400 font-dm text-sm mb-4 leading-relaxed">
                        {selectedService.description}
                      </p>
                    )}

                    {selectedService.features && selectedService.features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-white font-syne font-semibold mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Key Features
                        </h4>
                        <ul className="space-y-2">
                          {selectedService.features.map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-300 font-dm">
                              <span className="text-teal-400 mt-0.5">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm text-gray-400 font-dm mb-1">Starting at</p>
                        <div className="flex items-end gap-1">
                          <span className="font-syne font-bold text-2xl text-teal-400">
                            {selectedService.id === 'svc-9' ? '₹10' : `₹${selectedService.price}`}
                          </span>
                          <span className="text-sm font-dm pb-1 text-gray-400">
                            {selectedService.id === 'svc-9' ? '/cloth' : selectedService.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ServicesSection;
