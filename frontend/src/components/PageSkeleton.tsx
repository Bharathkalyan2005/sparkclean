import React from 'react';

export default function PageSkeleton() {
  return (
    <div style={{
      minHeight  : '100vh',
      background : '#0A0A0A',
      padding    : '80px 24px',
    }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          height      : '200px',
          background  : 'rgba(255,255,255,0.03)',
          borderRadius: '16px',
          marginBottom: '16px',
          animation   : 'shimmer 1.5s infinite',
        }} />
      ))}
      <style>{`
        @keyframes shimmer {
          0%   { opacity: 0.4 }
          50%  { opacity: 0.8 }
          100% { opacity: 0.4 }
        }
      `}</style>
    </div>
  );
}
