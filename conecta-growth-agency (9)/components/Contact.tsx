
import React, { useRef, useEffect } from 'react';
import { Mail, Phone, ArrowRight, MessageCircle } from 'lucide-react';
import Reveal from './Reveal';
import ParticleBackground from './ParticleBackground';

const Contact: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background Global Vortex
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

    const particles: {x: number, y: number, size: number, angle: number, radius: number, speed: number}[] = [];
    const mouse = { x: width/2, y: height/2 }; // Default center

    // Create Vortex Particles
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: 0, 
            y: 0,
            size: Math.random() * 2,
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * 400 + 50,
            speed: Math.random() * 0.01 + 0.005
        });
    }

    const animate = () => {
        // Trail effect
        ctx.fillStyle = 'rgba(5, 5, 5, 0.1)'; 
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            // Update spiral position relative to mouse
            p.angle += p.speed;
            p.radius -= 0.2; // Slowly suck in
            
            if(p.radius < 5) {
                p.radius = Math.random() * 400 + 50; // Reset
            }

            p.x = mouse.x + Math.cos(p.angle) * p.radius;
            p.y = mouse.y + Math.sin(p.angle) * p.radius;

            ctx.fillStyle = 'rgba(37, 99, 235, 0.3)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    const handleResize = () => setSize();

    animate();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const email = formData.get('email') as string;
    const service = formData.get('service') as string;
    const details = formData.get('details') as string;

    if (!name || !email) {
      alert("Por favor completa al menos tu nombre y correo.");
      return;
    }

    // Construct Email
    const subject = `Nuevo Proyecto: ${name} (${company || 'Sin Empresa'})`;
    const body = `Hola equipo de Conecta Growth,

Estoy interesado en comenzar un proyecto con ustedes.

Servicio de interés: ${service}

Detalles del proyecto:
${details}

---
Mis datos de contacto:
Nombre: ${name}
Empresa: ${company}
Correo: ${email}
`;

    // Open Mail Client
    window.location.href = `mailto:conectagrowth@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const socialLinks = [
    { id: 'IG', name: 'Instagram', url: 'https://www.instagram.com/conectagrowth.mx/' },
    { id: 'WA', name: 'WhatsApp', url: 'https://wa.me/524623360592' },
  ];

  return (
    <section id="contact" className="py-24 bg-black relative overflow-hidden">
       {/* Vortex Canvas */}
       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <Reveal variant="up" className="glass-card rounded-3xl p-[1px] overflow-hidden border border-white/10 relative">
          
          {/* Internal Form Particle Effect */}
          <div className="absolute inset-0 pointer-events-none">
            <ParticleBackground 
                particleCount={40} 
                interactionRadius={200} 
                color="rgba(255, 255, 255, 0.07)" 
            />
          </div>

          <div className="bg-brand-gray/60 backdrop-blur-xl grid grid-cols-1 lg:grid-cols-2 rounded-[22px] relative z-10">
            
            <div className="p-12 flex flex-col justify-between bg-brand-blue text-white relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
               <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Empecemos algo grande</h2>
                <p className="text-white/80 text-lg mb-12">
                  Cuéntanos sobre tu visión. Nosotros nos encargamos de la tecnología y la creatividad para hacerla realidad.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Mail size={20} />
                    </div>
                    <span className="font-medium">conectagrowth@gmail.com</span>
                  </div>
                  <a 
                    href="https://wa.me/524623360592"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-[#25D366] transition-colors">
                      <Phone size={20} className="group-hover:text-white" />
                    </div>
                    <span className="font-medium group-hover:text-[#25D366] transition-colors">+52 462 336 0592</span>
                  </a>
                </div>
              </div>
              
              <div className="mt-12 flex gap-4 relative z-10">
                 {socialLinks.map((social) => (
                   <a 
                     key={social.id}
                     href={social.url}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="group relative w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-xs font-bold hover:bg-white hover:text-brand-blue cursor-pointer transition-all duration-300 hover:scale-110 interactive-card"
                   >
                     {social.id}
                     
                     {/* Tooltip */}
                     <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 translate-y-2 group-hover:translate-y-0">
                        <div className="bg-brand-black/95 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded border border-white/20 shadow-xl uppercase tracking-wider">
                          {social.name}
                        </div>
                        {/* Arrow */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-black/95 border-r border-b border-white/20 rotate-45 transform"></div>
                     </div>
                   </a>
                 ))}
              </div>
            </div>

            <div className="p-12">
              <form className="space-y-6" onSubmit={handleEmailSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-gray-500">Nombre</label>
                    <input name="name" type="text" className="w-full bg-black/50 border border-white/10 rounded-none border-b-2 px-0 py-3 text-white focus:border-brand-blue focus:outline-none transition-colors placeholder-gray-700" placeholder="Tu nombre" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-gray-500">Empresa</label>
                    <input name="company" type="text" className="w-full bg-black/50 border border-white/10 rounded-none border-b-2 px-0 py-3 text-white focus:border-brand-blue focus:outline-none transition-colors placeholder-gray-700" placeholder="Tu empresa" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-gray-500">Correo</label>
                  <input name="email" type="email" className="w-full bg-black/50 border border-white/10 rounded-none border-b-2 px-0 py-3 text-white focus:border-brand-blue focus:outline-none transition-colors placeholder-gray-700" placeholder="correo@ejemplo.com" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-gray-500">Servicio</label>
                  <select name="service" className="w-full bg-black/50 border border-white/10 rounded-none border-b-2 px-0 py-3 text-white focus:border-brand-blue focus:outline-none transition-colors">
                    <option className="bg-black" value="Branding">Branding</option>
                    <option className="bg-black" value="Marketing Digital">Marketing Digital</option>
                    <option className="bg-black" value="Diseño Web">Diseño Web</option>
                    <option className="bg-black" value="Automatizaciones">Automatizaciones</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-gray-500">Detalles</label>
                  <textarea name="details" rows={3} className="w-full bg-black/50 border border-white/10 rounded-none border-b-2 px-0 py-3 text-white focus:border-brand-blue focus:outline-none transition-colors placeholder-gray-700" placeholder="¿Cómo podemos ayudarte?"></textarea>
                </div>
                
                <button type="submit" className="w-full py-5 bg-white text-black font-bold text-lg hover:bg-brand-blue hover:text-white transition-all flex items-center justify-between px-8 group interactive-card relative overflow-hidden">
                  <div className="absolute inset-0 w-full h-full bg-brand-blue/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                  <span className="relative z-10">Enviar Mensaje</span>
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform relative z-10" />
                </button>
              </form>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
