import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { COMBOS } from '../data/services';

const ComboCard: React.FC<{ combo: typeof COMBOS[0]; index: number }> = ({ combo, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  const handleBook = () => {
    navigate('/book?combo=' + combo.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="perspective-container"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transition: 'transform 0.1s ease',
          transformStyle: 'preserve-3d',
          background: combo.is_popular
            ? 'linear-gradient(135deg, rgba(10,255,230,0.15) 0%, #161616 60%)'
            : 'linear-gradient(135deg, #161616, #0F1A1A)',
          border: combo.is_popular
            ? '2px solid rgba(10,255,230,0.5)'
            : '1.5px solid rgba(10,255,230,0.18)',
          boxShadow: combo.is_popular
            ? '0 8px 40px rgba(10,255,230,0.2), 0 2px 12px rgba(0,0,0,0.06)'
            : '0 2px 16px rgba(0,0,0,0.05)',
        }}
        className="relative rounded-2xl p-8 h-full"
      >
        {/* Popular badge */}
        {combo.is_popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold font-syne px-4 py-1.5 rounded-full"
            style={{ background: 'linear-gradient(135deg,#0AFFE6,#00CDB7)', color: '#000000' }}>
            ✦ MOST POPULAR
          </div>
        )}

        {/* BHK Badge */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
          style={{ background: 'rgba(10,255,230,0.12)', border: '1.5px solid rgba(10,255,230,0.3)' }}>
          <span className="font-syne font-bold text-lg" style={{ color: '#0AFFE6' }}>{combo.bhk}</span>
        </div>

        <h3 className="font-syne font-bold text-2xl mb-2" style={{ color: '#FFFFFF' }}>{combo.name}</h3>

        {/* Badge text */}
        <span className="text-xs font-dm font-semibold px-3 py-1 rounded-full mb-4 inline-block"
          style={combo.is_popular
            ? { background: 'rgba(10,255,230,0.15)', color: '#0AFFE6' }
            : { background: 'rgba(10,255,230,0.08)', color: '#0AFFE6', border: '1px solid rgba(10,255,230,0.2)' }}>
          {combo.badge_text}
        </span>

        {/* Price */}
        <div className="flex items-end gap-2 my-5">
          <div className="font-syne font-bold text-5xl" style={{ color: '#FFFFFF' }}>
            ₹{combo.price}
          </div>
          <div className="text-sm font-dm pb-2" style={{ color: '#A0A0A0' }}>/ visit</div>
        </div>

        {/* Included services */}
        <ul className="space-y-3 mb-8">
          {combo.includes.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                item.includes('FREE') ? 'bg-yellow-400/20' : 'bg-teal-400/15'
              }`}>
                {item.includes('FREE') ? (
                  <span className="text-yellow-400 text-xs">★</span>
                ) : (
                  <svg className="w-3 h-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-dm ${item.includes('FREE') ? 'font-semibold' : ''}`}
                style={{ color: item.includes('FREE') ? '#F59E0B' : '#A0A0A0' }}>
                {item}
                {item.includes('FREE') && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: '#0AFFE6', color: '#000000' }}>FREE</span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={handleBook}
          className={`w-full py-3.5 rounded-xl font-dm font-semibold text-sm transition-all duration-300 ripple ${combo.is_popular ? 'btn-teal' : ''}`}
          style={!combo.is_popular ? { background: 'rgba(10,255,230,0.08)', color: '#0AFFE6', border: '1.5px solid rgba(10,255,230,0.3)', borderRadius: 12 } : {}}
        >
          Book This Combo
          <span className="ml-2">→</span>
        </button>
      </div>
    </motion.div>
  );
};

const CombosSection: React.FC = () => {
  return (
    <section id="combos" className="py-24 relative overflow-hidden section-dark">
      {/* Decorative orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(10,255,230,0.4) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
            style={{ background: 'rgba(10,255,230,0.1)', border: '1px solid rgba(10,255,230,0.3)' }}>
            <span className="text-xs font-medium font-dm tracking-wider uppercase" style={{ color: '#0AFFE6' }}>Combo Packages</span>
          </div>
          <h2 className="section-heading text-4xl md:text-5xl mb-4" style={{ color: '#FFFFFF' }}>
            Best Value <span className="teal-gradient-text">Packages</span>
          </h2>
          <p className="text-lg font-dm max-w-2xl mx-auto" style={{ color: '#A0A0A0' }}>
            Complete home cleaning packages at unbeatable prices. Save more when you book a combo.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {COMBOS.map((combo, i) => (
            <ComboCard key={combo.id} combo={combo} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-dm mt-10" style={{ color: '#A0A0A0' }}
        >
          ✦ All combos include eco-friendly cleaning products and trained staff ✦
        </motion.p>
      </div>
    </section>
  );
};

export default CombosSection;
