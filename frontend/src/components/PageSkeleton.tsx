import React from 'react';

export default function PageSkeleton() {
  return (
    <div style={{
      minHeight : '100vh',
      background: '#F5F0E8',
      padding   : '120px 40px 40px',
    }}>
      {/* Navbar skeleton */}
      <div style={{
        position  : 'fixed',
        top       : 0, left: 0, right: 0,
        height    : '72px',
        background: 'rgba(245,240,232,0.95)',
        zIndex    : 999,
      }} />

      {/* Content skeletons */}
      {[300, 200, 250].map((h, i) => (
        <div key={i} style={{
          height      : `${h}px`,
          background  : 'rgba(27,67,50,0.06)',
          borderRadius: '20px',
          marginBottom: '20px',
          animation   : 'shimmer 1.5s infinite',
        }} />
      ))}

      <style>{`
        @keyframes shimmer {
          0%  { opacity: 0.4 }
          50% { opacity: 0.8 }
          100%{ opacity: 0.4 }
        }
      `}</style>
    </div>
  );
}
