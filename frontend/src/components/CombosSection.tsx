import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
type ComboCardProps = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  bhk: string;
  badge_text: string;
  is_popular: boolean;
  includes: string[];
};

const ComboCard: React.FC<{ combo: ComboCardProps; index: number }> = ({ combo, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [btnHover, setBtnHover] = useState(false);

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
          transition: 'transform 0.1s ease, background 0.3s ease',
          transformStyle: 'preserve-3d',
          background: combo.is_popular
            ? 'linear-gradient(135deg, #1B4332 0%, #0D2B1F 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F0 100%)',
          color: combo.is_popular ? '#FFFFFF' : '#2D4A35',
          border: combo.is_popular
            ? '2px solid #C9A84C'
            : '1px solid rgba(27,67,50,0.15)',
          boxShadow: '0 4px 20px rgba(27,67,50,0.06)',
        }}
        className="relative rounded-2xl p-8 h-full"
      >
        {/* Popular badge */}
        {combo.is_popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold font-syne px-4 py-1.5 rounded-full"
            style={{ background: '#C9A84C', color: '#0D2B1F' }}>
            ✦ MOST POPULAR
          </div>
        )}

        {/* BHK Badge */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
          style={{
            background: combo.is_popular ? 'rgba(255,255,255,0.1)' : 'rgba(27,67,50,0.08)',
            border: combo.is_popular ? '1.5px solid rgba(255,255,255,0.2)' : '1.5px solid rgba(27,67,50,0.15)',
          }}
        >
          <span className="font-syne font-bold text-lg" style={{ color: combo.is_popular ? '#C9A84C' : '#1B4332' }}>{combo.bhk}</span>
        </div>

        <h3 className="font-syne font-bold text-2xl mb-2" style={{ color: combo.is_popular ? '#FFFFFF' : '#0D2B1F' }}>{combo.name}</h3>

        {/* Badge text */}
        <span className="text-xs font-dm font-semibold px-3 py-1 rounded-full mb-4 inline-block"
          style={combo.is_popular
            ? { background: 'rgba(255,255,255,0.15)', color: '#C9A84C' }
            : { background: 'rgba(27,67,50,0.08)', color: '#1B4332', border: '1px solid rgba(27,67,50,0.15)' }}>
          {combo.badge_text}
        </span>

        {/* LIMITED OFFER Badge */}
        {combo.originalPrice && (
          <div style={{
            position   : 'absolute',
            top        : '12px',
            right      : '12px',
            background : '#C9A84C',
            color      : '#0D2B1F',
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

        {/* Price */}
        {combo.originalPrice ? (
          <div className="my-5">
            <div className="flex items-center gap-3">
              <span style={{ textDecoration: 'line-through', color: combo.is_popular ? 'rgba(255,255,255,0.4)' : 'rgba(93,107,94,0.5)', fontSize: '20px' }}>
                ₹{combo.originalPrice}
              </span>
              <div className="flex items-end gap-2">
                <div className="font-syne font-bold text-5xl" style={{ color: combo.is_popular ? '#FFFFFF' : '#1B4332' }}>
                  ₹{combo.price}
                </div>
                <div className="text-sm font-dm pb-2" style={{ color: combo.is_popular ? 'rgba(255,255,255,0.7)' : '#5C6B5E' }}>/ visit</div>
              </div>
            </div>
            <div style={{
              background   : combo.is_popular ? 'rgba(255,255,255,0.15)' : 'rgba(27,67,50,0.1)',
              border       : combo.is_popular ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(27,67,50,0.2)',
              borderRadius : '20px',
              padding      : '3px 12px',
              fontSize     : '11px',
              fontWeight   : '700',
              color        : combo.is_popular ? '#C9A84C' : '#1B4332',
              display      : 'inline-block',
              marginTop    : '8px',
            }}>
              🎉 SAVE ₹{combo.originalPrice - combo.price} — BEST VALUE!
            </div>
          </div>
        ) : (
          <div className="flex items-end gap-2 my-5">
            <div className="font-syne font-bold text-5xl" style={{ color: combo.is_popular ? '#FFFFFF' : '#1B4332' }}>
              ₹{combo.price}
            </div>
            <div className="text-sm font-dm pb-2" style={{ color: combo.is_popular ? 'rgba(255,255,255,0.7)' : '#5C6B5E' }}>/ visit</div>
          </div>
        )}

        {/* Included services */}
        <ul className="space-y-3 mb-8">
          {combo.includes.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: combo.is_popular ? 'rgba(255,255,255,0.15)' : 'rgba(27,67,50,0.08)' }}>
                {item.includes('FREE') ? (
                  <span style={{ color: '#C9A84C', fontSize: '12px' }}>★</span>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: combo.is_popular ? '#C9A84C' : '#1B4332' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-dm ${item.includes('FREE') ? 'font-semibold' : ''}`}
                style={{ color: item.includes('FREE') ? '#C9A84C' : (combo.is_popular ? '#FFFFFF' : '#2D4A35') }}>
                {item}
                {item.includes('FREE') && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: '#C9A84C', color: '#0D2B1F' }}>FREE</span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={handleBook}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          className="w-full py-3.5 rounded-xl font-dm font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
          style={combo.is_popular ? {
            background: btnHover ? '#1B4332' : '#C9A84C',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
          } : {
            background: btnHover ? '#C9A84C' : '#1B4332',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Book This Combo
          <span className="ml-2">→</span>
        </button>
      </div>
    </motion.div>
  );
};

const CombosSection: React.FC = () => {
  const [combos, setCombos] = React.useState<any[]>([]);
  const [, setLoading] = React.useState(true);

  React.useEffect(() => {
    import('../lib/axiosInstance').then(({ default: api }) => {
      api.get('/services/combos')
        .then(res => setCombos(res.data.combos))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    });
  }, []);

  const getComboIncludes = (name: string) => {
    const includes: Record<string, string[]> = {
      '1 BHK Combo': [
        'Sweeping & mopping',
        'Dusting & wiping',
        '1 Bathroom cleaning',
        'Kitchen basic cleaning',
        '2 Fans FREE ✦',
      ],
      '2 BHK Combo': [
        'Full house cleaning',
        '2 Bathrooms cleaning',
        'Kitchen cleaning',
        'Dusting & wiping',
        '4 Fans FREE ✦',
      ],
      '3 BHK Combo': [
        'Full home cleaning',
        '2-3 Bathrooms cleaning',
        'Kitchen deep cleaning',
        'Balcony basic cleaning',
        '6 Fans FREE ✦',
      ],
    };
    return includes[name] || [];
  };

  const getBadgeText = (name: string) => {
    if (name.includes('1 BHK')) return 'Basic Care';
    if (name.includes('2 BHK')) return 'Most Popular';
    if (name.includes('3 BHK')) return 'Deep Clean';
    return 'Special Package';
  };

  const formattedCombos = combos.map((c, i) => {
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
      id: c.id,
      name: c.name,
      price: price,
      originalPrice: originalPrice,
      bhk: c.name.split(' ')[0] + ' BHK',
      badge_text: getBadgeText(c.name),
      is_popular: i === 1,
      includes: getComboIncludes(c.name)
    };
  });

  return (
    <section id="combos" className="py-24 relative overflow-hidden" style={{ background: '#EDE8DC' }}>
      {/* Decorative orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(27,67,50,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />

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
            style={{ background: 'rgba(27,67,50,0.08)', border: '1px solid rgba(27,67,50,0.2)' }}>
            <span className="text-xs font-medium font-dm tracking-wider uppercase" style={{ color: '#1B4332' }}>Combo Packages</span>
          </div>
          <h2 className="section-heading text-4xl md:text-5xl mb-4" style={{ color: '#0D2B1F' }}>
            Best Value <span style={{ color: '#1B4332' }}>Packages</span>
          </h2>
          <p className="text-lg font-dm max-w-2xl mx-auto" style={{ color: '#5C6B5E' }}>
            Complete home cleaning packages at unbeatable prices. Save more when you book a combo.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {formattedCombos.map((combo, i) => (
            <ComboCard key={combo.id} combo={combo as any} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-dm mt-10" style={{ color: '#5C6B5E' }}
        >
          ✦ All combos include eco-friendly cleaning products and trained staff ✦
        </motion.p>
      </div>
    </section>
  );
};

export default CombosSection;
