
import React, { useState, useEffect, useRef } from 'react';

interface NexMascotProps {
  onClick: () => void;
  isOpen: boolean;
}

const NexMascot: React.FC<NexMascotProps> = ({ onClick, isOpen }) => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [showGreeting, setShowGreeting] = useState(false);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Mostrar saludo después de 1.5 segundos
    const showTimer = setTimeout(() => {
      setShowGreeting(true);

      // 2. Ocultar saludo después de 5 segundos
      const hideTimer = setTimeout(() => {
        setShowGreeting(false);
      }, 5000);

      return () => clearTimeout(hideTimer);
    }, 1500);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headRef.current) return;
      
      const rect = headRef.current.getBoundingClientRect();
      const headCenterX = rect.left + rect.width / 2;
      const headCenterY = rect.top + rect.height / 2;

      // Calculate angle to mouse
      const angle = Math.atan2(e.clientY - headCenterY, e.clientX - headCenterX);
      // Limit eye movement distance
      const distance = Math.min(3, Math.hypot(e.clientX - headCenterX, e.clientY - headCenterY) / 20);

      setEyePosition({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={headRef}
      onClick={onClick}
      className={`fixed bottom-8 right-8 z-[60] cursor-pointer transition-all duration-500 ease-in-out hover:scale-110 group ${
        isOpen ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Speech Bubble (Greeting) */}
      <div 
        className={`absolute -top-16 right-4 bg-white text-brand-black px-4 py-2 rounded-2xl rounded-br-sm shadow-[0_0_20px_rgba(37,99,235,0.4)] text-sm font-bold whitespace-nowrap transition-all duration-500 transform origin-bottom-right group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 ${
          showGreeting ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-4'
        }`}
      >
        Hola soy Nex, habla conmigo
        {/* Little tail for the speech bubble */}
        <div className="absolute -bottom-1 right-0 w-3 h-3 bg-white transform rotate-45"></div>
      </div>

      {/* Floating Container */}
      <div className="w-20 h-20 md:w-24 md:h-24 animate-float relative">
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-brand-blue/30 blur-xl rounded-full scale-75 animate-pulse"></div>

        {/* SVG Robot */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-2xl"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Ears */}
          <path d="M15 45 L10 40 L10 60 L15 55 Z" fill="#1e3a8a" />
          <path d="M85 45 L90 40 L90 60 L85 55 Z" fill="#1e3a8a" />

          {/* Head */}
          <rect x="15" y="25" width="70" height="60" rx="18" fill="url(#robotGradient)" stroke="#93c5fd" strokeWidth="1" />

          {/* Visor */}
          <rect x="22" y="35" width="56" height="32" rx="10" fill="#0a0a0a" stroke="#1d4ed8" strokeWidth="1" />

          {/* Moving Eyes */}
          <g transform={`translate(${eyePosition.x}, ${eyePosition.y})`}>
             <circle cx="38" cy="51" r="6" fill="#00f3ff" filter="url(#glow)" className="animate-blink" />
             <circle cx="38" cy="51" r="2" fill="#ffffff" opacity="0.8" />
             
             <circle cx="62" cy="51" r="6" fill="#00f3ff" filter="url(#glow)" className="animate-blink" />
             <circle cx="62" cy="51" r="2" fill="#ffffff" opacity="0.8" />
          </g>

          {/* Mouth */}
          <rect x="42" y="75" width="16" height="2" rx="1" fill="#1e3a8a" opacity="0.5" />

          {/* Antenna */}
          <line x1="50" y1="25" x2="50" y2="10" stroke="#60a5fa" strokeWidth="3" />
          <circle cx="50" cy="8" r="4" fill="#ef4444" className="animate-pulse" />

          {/* Shine */}
          <path d="M25 30 Q50 30 75 30" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3" />

        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
        .animate-blink {
          transform-origin: center;
          animation: blink 4s infinite;
        }
      `}</style>
    </div>
  );
};

export default NexMascot;
