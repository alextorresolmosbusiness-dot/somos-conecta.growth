
import React, { useEffect, useState } from 'react';

const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sectionPositions, setSectionPositions] = useState<{id: string, top: number, label: string}[]>([]);

  useEffect(() => {
    // Function to calculate the relative position of each section
    const calculatePositions = () => {
      const sections = [
        { id: 'services', label: 'Servicios' },
        { id: 'ai-tool', label: 'IA Tools' },
        { id: 'portfolio', label: 'Portafolio' },
        { id: 'about', label: 'Nosotros' },
        { id: 'instagram', label: 'Instagram' },
        { id: 'contact', label: 'Contacto' }
      ];

      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) return;

      const newPositions = sections.map(section => {
        const el = document.getElementById(section.id);
        if (el) {
          // Calculate percentage position relative to the scrollable height
          const top = el.offsetTop / docHeight;
          return { ...section, top: Math.min(Math.max(top, 0), 1) * 100 };
        }
        return null;
      }).filter((p): p is {id: string, top: number, label: string} => p !== null);

      setSectionPositions(newPositions);
    };

    // Initial calculation
    calculatePositions();
    
    // Recalculate on resize and after a delay (to allow images/content to load)
    window.addEventListener('resize', calculatePositions);
    const timeout = setTimeout(calculatePositions, 1500);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const height = windowHeight > 0 ? windowHeight : 1;
      const scroll = totalScroll / height;
      setScrollProgress(Math.min(Math.max(scroll, 0), 1));
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculatePositions);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="fixed left-6 top-0 bottom-0 w-px z-40 hidden md:block pointer-events-none">
      {/* Base Track */}
      <div className="absolute inset-0 bg-white/5 w-px"></div>
      
      {/* Active Liquid Line */}
      <div 
        className="absolute top-0 w-[2px] transition-all duration-100 ease-out"
        style={{ 
          height: `${scrollProgress * 100}%`,
          background: 'linear-gradient(to bottom, #2563eb 0%, #60a5fa 50%, #ffffff 100%)',
          backgroundSize: '100% 200%',
          animation: 'energyFlow 2s linear infinite',
          boxShadow: '0 0 15px rgba(37, 99, 235, 0.6)'
        }}
      >
        {/* The "Head" / Spark */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4">
           {/* Outer Pulsing Ring */}
           <div className="absolute inset-0 rounded-full bg-brand-blue opacity-75 animate-ping"></div>
           
           {/* Inner Core */}
           <div className="absolute inset-1 rounded-full bg-white shadow-[0_0_15px_#fff,0_0_30px_#2563eb]"></div>
        </div>
      </div>

      {/* Dynamic Section Markers */}
      {sectionPositions.map((section) => (
         <div 
           key={section.id} 
           className={`absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all duration-500 group pointer-events-auto cursor-pointer ${
             scrollProgress * 100 >= section.top - 2 // Small offset for visual readiness
               ? 'bg-brand-blue shadow-[0_0_10px_#2563eb] scale-150' 
               : 'bg-white/20 hover:bg-white hover:scale-125'
           }`}
           style={{ top: `${section.top}%` }}
           onClick={() => {
             const el = document.getElementById(section.id);
             el?.scrollIntoView({ behavior: 'smooth' });
           }}
         >
            {/* Tooltip on Hover */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 bg-brand-black/90 backdrop-blur px-3 py-1.5 rounded-md border border-brand-blue/30 text-[10px] uppercase font-bold tracking-wider text-white whitespace-nowrap shadow-xl">
              {section.label}
              {/* Arrow */}
              <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-4 border-transparent border-r-brand-blue/30"></div>
            </div>
         </div>
      ))}

      <style>{`
        @keyframes energyFlow {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 200%; }
        }
      `}</style>
    </div>
  );
};

export default ScrollProgress;
