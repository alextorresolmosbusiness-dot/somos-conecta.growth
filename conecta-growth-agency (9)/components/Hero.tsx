import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

// --- Sub-component for the Text Distortion Effect ---
const DistortedText: React.FC<{ 
  text: string; 
  className?: string; 
  enableGlow?: boolean;
}> = ({ text, className, enableGlow = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);

  useEffect(() => {
    // Track mouse position globally for this component
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      timeRef.current += 0.03; // Speed of the wave
      
      lettersRef.current.forEach((letter, i) => {
        if (!letter) return;

        const rect = letter.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;

        // 1. Ambient Wave Effect calculation
        // Offset Y based on time and index to create the wave
        const waveY = Math.sin(timeRef.current + i * 0.3) * 8; // 8px amplitude

        // 2. Interactive Distortion calculation
        const dx = mouseRef.current.x - letterCenterX;
        const dy = mouseRef.current.y - (letterCenterY + waveY); // Account for wave pos
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = 300; 

        let moveX = 0;
        let moveY = waveY; // Default is just the wave
        let scale = 1;
        let glowIntensity = 0;

        if (distance < radius) {
          const force = (radius - distance) / radius; 
          const ease = Math.pow(force, 2); 
          
          // Add repulsion force to the wave movement
          moveX = (dx / distance) * -1 * ease * 50; 
          moveY = waveY + (dy / distance) * -1 * ease * 50;
          scale = 1 + (ease * 0.3); 
          glowIntensity = ease;
        }

        // Apply transforms
        // Note: Removed CSS transition for transform to make JS animation smooth
        letter.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
        
        // Apply styles based on glow/interaction
        if (distance < radius) {
          if (enableGlow) {
             letter.style.textShadow = `0 0 ${20 + glowIntensity * 30}px rgba(37, 99, 235, 0.8)`; 
             letter.style.color = '#ffffff'; 
          } else {
             letter.style.textShadow = `0 0 ${10 + glowIntensity * 20}px rgba(255, 255, 255, 0.5)`; 
          }
        } else {
          letter.style.textShadow = 'none';
          if (enableGlow) {
             letter.style.color = ''; 
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enableGlow]);

  return (
    <div ref={containerRef} className={`inline-block select-none ${className}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          ref={(el) => { lettersRef.current[i] = el; }}
          className={`inline-block will-change-transform ${char === ' ' ? 'w-4 md:w-8' : ''}`}
          style={{ 
            // We only transition colors/shadows via CSS. 
            // Transform is handled by JS requestAnimationFrame for performance.
            transition: 'text-shadow 0.2s, color 0.2s',
            position: 'relative',
            zIndex: 30
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};


const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // MANEJO SEGURO DEL SCROLL
  const handleScrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setLoaded(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI Setup
    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let particles: any[] = [];
    const particleSpacing = 50; 
    const connectionDistance = 120;
    const mouse = { x: -1000, y: -1000, radius: 200 };

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      density: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = 1.5;
        this.density = (Math.random() * 30) + 1;
        this.color = 'rgba(37, 99, 235, 0.4)';
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
          this.x -= directionX * 5; 
          this.y -= directionY * 5;
          this.color = 'rgba(255, 255, 255, 0.8)'; 
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 15;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 15;
          }
          this.color = 'rgba(37, 99, 235, 0.2)';
        }
      }
    }

    const init = () => {
      particles = [];
      for (let y = 0; y < height; y += particleSpacing) {
        for (let x = 0; x < width; x += particleSpacing) {
          particles.push(new Particle(x, y));
        }
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      connect();
      requestAnimationFrame(animate);
    };

    const connect = () => {
      if (!ctx) return;
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            opacityValue = 1 - (distance / connectionDistance);
            
            let mouseDx = mouse.x - particles[a].x;
            let mouseDy = mouse.y - particles[a].y;
            let mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
            
            if (mouseDist < mouse.radius) {
               ctx.strokeStyle = `rgba(255,255,255,${opacityValue * 0.5})`;
            } else {
               ctx.strokeStyle = `rgba(37, 99, 235, ${opacityValue * 0.1})`;
            }
            
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    init();
    animate();

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black"
    >
      {/* Canvas Layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 w-full h-full"
      />
      
      {/* Vignette used to darken edges but keep center visible */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.8)_80%,#050505_100%)] z-10 pointer-events-none"></div>

      {/* Content Layer */}
      <div className={`container mx-auto px-6 relative z-20 text-center transition-all duration-1000 ease-out transform ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="space-y-4">
          
          {/* Animated Badge */}
          <div className={`inline-block transition-all duration-700 delay-100 mb-6 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
             <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
                </span>
                <span className="text-brand-blue text-sm font-bold tracking-wider uppercase">Agencia Digital 360°</span>
             </div>
          </div>

          {/* Main Title with Distortion & Wave Effect */}
          <div className={`font-display font-bold leading-none tracking-tighter transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="block mb-2 md:mb-4">
               <DistortedText 
                 text="CONECTA" 
                 className="text-6xl md:text-8xl lg:text-[10rem] text-white"
               />
            </div>
            
            <div className="block">
              <DistortedText 
                text="GROWTH" 
                enableGlow={true}
                className="text-6xl md:text-8xl lg:text-[10rem] text-brand-blue"
              />
            </div>
          </div>

          {/* Slogan */}
          <div className={`max-w-3xl mx-auto mt-8 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
             <p className="text-2xl md:text-4xl text-gray-300 font-light tracking-wide">
               <span className="text-white font-medium">Ideas que atraen.</span>{' '}
               <span className="text-brand-blue font-medium">Estrategias que convierten.</span>
             </p>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center mt-12 transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <a 
              href="#contact"
              onClick={(e) => handleScrollTo(e, 'contact')}
              className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] cursor-pointer"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              <span className="relative flex items-center gap-2">
                Iniciar Proyecto
                <ArrowRight className="w-5 h-5" />
              </span>
            </a>
            
            <a 
              href="#services" 
              onClick={(e) => handleScrollTo(e, 'services')}
              className="px-8 py-4 border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm cursor-pointer"
            >
              Ver Servicios
            </a>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-white/50 transition-opacity duration-1000 delay-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <ChevronDown className="w-8 h-8" />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;