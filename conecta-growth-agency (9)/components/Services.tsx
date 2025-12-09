import React, { useRef, useEffect, useState } from 'react';
import { 
  Palette, 
  Share2, 
  MessageCircle, 
  Layout, 
  TrendingUp, 
  Cpu, 
  Mail, 
  Instagram, 
  Box 
} from 'lucide-react';
import { ServiceItem } from '../types';
import Reveal from './Reveal';
import ParticleBackground from './ParticleBackground';

const services: ServiceItem[] = [
  { 
    id: '1', 
    title: 'Diseño Web Profesional', 
    description: 'Creamos páginas web modernas, rápidas y estratégicas que conectan y convierten. Incluye: estructura optimizada, copy estratégico, diseño visual atractivo, integraciones y versión móvil.', 
    icon: Layout, 
    color: 'text-brand-blue' 
  },
  { 
    id: '2', 
    title: 'Manejo Profesional de Redes Sociales', 
    description: 'Construimos una presencia digital sólida, creativa y activa. Incluye: diseño de posts, planeación de contenido, estadísticas, estrategias de crecimiento, mensajes claros y atractivos, y optimización mensual.', 
    icon: Share2, 
    color: 'text-brand-blue' 
  },
  { 
    id: '3', 
    title: 'WhatsApp Business & Automatizaciones', 
    description: 'Optimizamos tu flujo de atención con respuestas automatizadas, embudos, plantillas y configuración completa para que conviertas más rápido, sin perder tiempo.', 
    icon: MessageCircle, 
    color: 'text-brand-blue' 
  },
  { 
    id: '4', 
    title: 'Estrategias de Crecimiento con ROI Real', 
    description: 'Creamos planes personalizados para que tu negocio crezca con bases sólidas. Incluye: análisis, auditoría de marca, proyección, estrategia mensual y seguimiento.', 
    icon: TrendingUp, 
    color: 'text-brand-blue' 
  },
  { 
    id: '5', 
    title: 'Branding & Identidad Visual', 
    description: 'Diseñamos identidades modernas, creativas y memorables. Incluye: paleta de colores, tipografías, logotipo, estilo visual y manual de marca.', 
    icon: Palette, 
    color: 'text-brand-blue' 
  },
  { 
    id: '6', 
    title: 'Impulso por IA', 
    description: 'Usamos herramientas de inteligencia artificial para acelerar procesos, mejorar resultados y crear contenido más potente, rápido y estratégico.', 
    icon: Cpu, 
    color: 'text-brand-blue' 
  },
  { 
    id: '7', 
    title: 'Email Marketing Profesional', 
    description: 'Creamos campañas que conectan, generan confianza y convierten clientes. Incluye: secuencias, automatizaciones, diseño y análisis de rendimiento.', 
    icon: Mail, 
    color: 'text-brand-blue' 
  },
  { 
    id: '8', 
    title: 'Optimización y Mejora de Instagram', 
    description: 'Analizamos tu perfil y lo transformamos: diseño, orden, estrategia, biografía, idea central y estilo visual alineado a tu marca.', 
    icon: Instagram, 
    color: 'text-brand-blue' 
  },
  { 
    id: '9', 
    title: 'CGI y Contenido Visual Avanzado', 
    description: 'Creamos contenido visual de alto impacto utilizando CGI para que tu marca se vea moderna e innovadora. Renders hiperrealistas, animaciones y contenido publicitario de cine.', 
    icon: Box, 
    color: 'text-brand-blue' 
  },
];

// Skeleton Component
const ServiceSkeleton = () => (
  <div className="rounded-2xl p-[1px] bg-white/5 h-full border border-white/5">
    <div className="h-full bg-brand-gray/50 rounded-2xl p-8 flex flex-col animate-pulse">
      {/* Icon Placeholder */}
      <div className="w-12 h-12 rounded-lg bg-white/10 mb-6" /> 
      
      {/* Title Placeholder */}
      <div className="h-6 w-3/4 bg-white/10 rounded mb-4" /> 
      
      {/* Description Placeholders */}
      <div className="space-y-3 flex-grow">
        <div className="h-3 w-full bg-white/5 rounded" />
        <div className="h-3 w-full bg-white/5 rounded" />
        <div className="h-3 w-5/6 bg-white/5 rounded" />
        <div className="h-3 w-4/6 bg-white/5 rounded" />
      </div>
    </div>
  </div>
);

const Services: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds delay
    return () => clearTimeout(timer);
  }, []);

  // Network Effect Canvas (Global Background)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI Setup
    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setSize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    };
    setSize();

    let particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const mouse = { x: -1000, y: -1000 };

    // Create particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3
      });
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw Dot
        ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Connect to mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          ctx.strokeStyle = `rgba(37, 99, 235, ${0.4 * (1 - dist / 150)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
      requestAnimationFrame(animate);
    };

    const handleResize = () => setSize();
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    animate();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty('--mouse-x', `${x}px`);
    target.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section id="services" className="py-24 relative bg-brand-black overflow-hidden">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" />
      
      <div className="container mx-auto px-6 relative z-10">
        <Reveal variant="up" className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-white">Nuestros Servicios</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Soluciones integrales para escalar tu negocio.
          </p>
        </Reveal>

        {/* Updated Grid to 3 Columns for 9 items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton Loader
            Array.from({ length: 6 }).map((_, index) => (
              <ServiceSkeleton key={index} />
            ))
          ) : (
            // Real Content
            services.map((service, index) => (
              <Reveal 
                key={service.id} 
                variant="zoom" 
                delay={index * 0.1} 
                className="h-full"
              >
                <div 
                  className="spotlight-card rounded-2xl p-[1px] group interactive-card transition-transform duration-300 hover:-translate-y-2 h-full relative"
                  onMouseMove={handleCardMouseMove}
                >
                  {/* Internal Card Background */}
                  <div className="relative h-full bg-brand-gray/90 backdrop-blur-md rounded-2xl p-8 border border-white/5 group-hover:border-brand-blue/30 transition-colors overflow-hidden flex flex-col">
                    
                    {/* Added Internal Particle Effect */}
                    <ParticleBackground 
                       particleCount={15} 
                       interactionRadius={100} 
                       color="rgba(255, 255, 255, 0.15)" 
                       className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    <div className={`relative z-10 w-12 h-12 rounded-lg bg-brand-blue/10 flex items-center justify-center mb-6 group-hover:bg-brand-blue group-hover:scale-110 transition-all duration-300 shrink-0`}>
                      <service.icon size={24} className="text-brand-blue group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="relative z-10 font-display text-xl font-bold mb-3 text-white">
                      {service.title}
                    </h3>
                    <p className="relative z-10 text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 flex-grow">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;