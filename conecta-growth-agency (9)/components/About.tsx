import React from 'react';
import Reveal from './Reveal';
import { Rocket, Zap, Users, Target } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-brand-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.08),_transparent_70%)] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03),_transparent_70%)] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal variant="up" className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-white">
            Somos <span className="text-brand-blue">Conecta Growth</span>
          </h2>
          <p className="text-gray-400 text-lg">Tu socio estratégico en el mundo digital.</p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <Reveal variant="right" className="space-y-8 text-lg text-gray-300 leading-relaxed order-2 lg:order-1">
             <p>
               <span className="text-white font-bold text-xl">Conecta Growth</span> nació con una idea clara: transformar marcas con <span className="text-brand-blue font-medium">creatividad, estrategia y tecnología</span>. Somos una agencia joven, dinámica y enfocada en resultados reales. Creemos en las ideas frescas, la innovación constante y el poder de una buena ejecución.
             </p>
             
             <p>
               Trabajamos de cerca con cada cliente para crear marcas memorables, crecer sus comunidades y convertir su presencia digital en una <span className="text-white font-medium border-b border-brand-blue/50">máquina de ventas</span>.
             </p>

             <div className="pl-6 border-l-4 border-brand-blue bg-white/5 p-6 rounded-r-xl italic text-gray-200">
               "Aquí no improvisamos: analizamos, construimos, optimizamos y escalamos."
             </div>

             <p className="font-medium text-white pt-2">
               Somos la agencia que combina <span className="inline-block bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm mx-1 mb-1 border border-brand-blue/20">creatividad</span> + <span className="inline-block bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm mx-1 mb-1 border border-brand-blue/20">marketing digital</span> + <span className="inline-block bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm mx-1 mb-1 border border-brand-blue/20">automatización inteligente</span> para que tu negocio avance más rápido.
             </p>
          </Reveal>

          {/* Visual Grid */}
          <Reveal variant="left" className="order-1 lg:order-2">
             <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 interactive-card group hover:bg-white/5 transition-colors">
                   <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <Target size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-lg">Resultados</h4>
                      <p className="text-sm text-gray-400">Enfoque en métricas reales.</p>
                   </div>
                </div>
                
                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 interactive-card group hover:bg-white/5 transition-colors mt-8">
                   <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <Rocket size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-lg">Impulso</h4>
                      <p className="text-sm text-gray-400">Escalamos tu negocio.</p>
                   </div>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 interactive-card group hover:bg-white/5 transition-colors -mt-8">
                   <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Zap size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-lg">Energía</h4>
                      <p className="text-sm text-gray-400">Ideas jóvenes y frescas.</p>
                   </div>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 interactive-card group hover:bg-white/5 transition-colors">
                   <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Users size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-lg">Alianza</h4>
                      <p className="text-sm text-gray-400">Trabajamos contigo.</p>
                   </div>
                </div>
             </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;