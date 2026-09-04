import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = 'w-8 h-8', size = 32 }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: size, height: size }}
    >
      <defs>
        <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded container with outer rim */}
      <rect x="2" y="2" width="96" height="96" rx="24" fill="url(#logoBg)" stroke="#38bdf8" strokeWidth="2.5" strokeOpacity="0.4" />
      
      {/* Atomic / Orbit Ring (Physics) */}
      <ellipse cx="50" cy="48" rx="36" ry="14" transform="rotate(-28 50 48)" stroke="url(#cyanGrad)" strokeWidth="2" strokeDasharray="6 3" opacity="0.6" />
      <ellipse cx="50" cy="48" rx="36" ry="14" transform="rotate(28 50 48)" stroke="#93c5fd" strokeWidth="1.5" opacity="0.4" />

      {/* Orbit electron particles */}
      <circle cx="20" cy="34" r="2.5" fill="#38bdf8" />
      <circle cx="80" cy="62" r="2.5" fill="#fbbf24" />

      {/* Open Knowledge Book (Foundation) */}
      <path 
        d="M26 64 C36 59 44 60 50 63 C56 60 64 59 74 64 L74 72 C64 67 56 68 50 71 C44 68 36 67 26 72 Z" 
        fill="#1e293b" 
        stroke="#60a5fa" 
        strokeWidth="2" 
        strokeLinejoin="round" 
      />
      <line x1="50" y1="63" x2="50" y2="71" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />

      {/* Academic Cap / Apex of Excellence */}
      <g transform="translate(50, 36) scale(0.95)">
        {/* Diamond Crown */}
        <polygon points="0,-18 24,-6 0,6 -24,-6" fill="url(#goldGrad)" filter="url(#glow)" />
        <polygon points="0,-16 22,-5 0,5 -22,-5" fill="#fef08a" opacity="0.3" />
        
        {/* Cap Base */}
        <path d="M-13,0 L-13,10 C-13,17 13,17 13,10 L13,0 Z" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
        
        {/* Golden Tassel & Jewel */}
        <path d="M16,-2 C19,5 21,12 22,18" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
        <circle cx="22" cy="19" r="2.2" fill="#fbbf24" />
      </g>

      {/* Center Mathematics Symbol: Sigma / Integral spark */}
      <g transform="translate(50, 52) scale(0.65)">
        <path d="M-10,-8 L8,-8 L-3,0 L8,8 L-10,8" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};
