import React, { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, size = 32 }) => {
  const [hovered, setHovered] = useState(0);

  const labels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good', 
    4: 'Very Good',
    5: 'Excellent! ✦'
  };

  return (
    <div>
      <div style={{ display:'flex', gap:'8px' }}>
        {[1,2,3,4,5].map(star => (
          <span
            key={star}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            style={{
              fontSize : size,
              cursor   : 'pointer',
              color    : star <= (hovered || value)
                ? '#FFD700' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.1s',
              transform : star <= (hovered || value)
                ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            ★
          </span>
        ))}
      </div>
      {(hovered || value) > 0 && (
        <p style={{ 
          color    : '#FFD700',
          fontSize : '14px',
          marginTop: '8px',
          fontWeight:'600'
        }}>
          {labels[hovered || value]}
        </p>
      )}
    </div>
  );
};

export default StarRating;
