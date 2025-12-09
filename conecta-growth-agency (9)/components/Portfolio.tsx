
import React, { useRef, useEffect } from 'react';
import { PortfolioItem } from '../types';
import Reveal from './Reveal';

const items: PortfolioItem[] = [
  { id: '1', title: 'Future Tech', category: 'Branding', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop' },
  { id: '2', title: 'Minimalist', category: 'Web Design', imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop' },
  { id: '3', title: 'Dark Mode App', category: 'UI/UX', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop' },
  { id: '4', title: 'Neon Nights', category: 'Social Media', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop' },
];

const Portfolio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI Setup
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const orbs: {x: number, y: number, r: number, vx: number, vy: number, color: string}[] = [];
    const mouse = { x: -1000, y: -1000 };

    // Create soft orbs
    for(let i=0; i<15; i++) {
        orbs.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 50 + 20,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            color: `rgba(37, 99, 235, ${Math.random() * 0.1})`
        });
    }

    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        orbs.forEach(orb => {
            // Move
            orb.x += orb.vx;
            orb.y += orb.vy;

            // Bounce walls
            if(orb.x < 0 || orb.x > width) orb.vx *= -1;
            if(orb.y < 0 || orb.y > height) orb.vy *= -1;

            // Mouse Avoidance (Fluid feel)
            const dx = mouse.x - orb.x;
            const dy = mouse.y - orb.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 200) {
                orb.vx -= (dx/dist) * 0.5;
                orb.vy -= (dy/dist) * 0.5;
            }

            // Draw Soft Orb
            const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
            grad.addColorStop(0, orb.color);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, orb.r * 2, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    const handleResize = () => {
        if(canvas) {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        }
    };

    animate();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    return () => {
        window.removeEventListener('resize', handleResize);
        canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section id="portfolio" className="py-24 bg-brand-dark relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <Reveal variant="up" className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-display text-4xl font-bold mb-2 text-white">Selección de Trabajo</h2>
            <p className="text-gray-400">Diseño que trasciende.</p>
          </div>
          <a 
             href="#contact" 
             onClick={handleScrollToContact}
             className="hidden md:block text-white hover:text-brand-blue transition-colors font-medium border-b border-white/20 pb-1 hover:border-brand-blue"
          >
            Ver portafolio completo
          </a>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <Reveal key={item.id} variant="up" delay={index * 0.1}>
              <div 
                className="group relative overflow-hidden rounded-2xl cursor-none interactive-card hover:shadow-[0_0_40px_rgba(37,99,235,0.2)] transition-all duration-500 transform hover:-translate-y-1"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
                }}
              >
                {/* Dynamic Spotlight Overlay */}
                <div 
                  className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-soft-light"
                  style={{
                    background: `radial-gradient(600px circle at var(--x) var(--y), rgba(255, 255, 255, 0.4), transparent 40%)`
                  }}
                />

                <div className="absolute inset-0 bg-brand-blue mix-blend-color z-10 opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  loading="lazy"
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-90 flex flex-col justify-end p-8 z-20">
                  <span className="text-brand-blue font-bold text-xs tracking-[0.2em] uppercase mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.category}
                  </span>
                  <h3 className="text-3xl font-display font-bold text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {item.title}
                  </h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;