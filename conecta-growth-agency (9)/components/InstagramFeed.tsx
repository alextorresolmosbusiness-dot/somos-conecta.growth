
import React from 'react';
import { Instagram, ExternalLink, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

const InstagramFeed: React.FC = () => {
  return (
    <section id="instagram" className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 text-center md:text-left">
          <Reveal variant="right" className="flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2 text-brand-blue">
               <Instagram size={20} />
               <span className="font-bold tracking-wider text-sm uppercase">Social Media</span>
            </div>
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Síguenos en <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">@conectagrowth.mx</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto md:mx-0">
              Mantente al día con nuestras últimas estrategias, diseños y consejos para potenciar tu marca.
            </p>
          </Reveal>
        </div>

        {/* Big CTA */}
        <Reveal variant="up" delay={0.2} className="flex justify-center">
            <a 
              href="https://www.instagram.com/conectagrowth.mx/"
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-4 px-10 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-[0_0_50px_rgba(219,39,119,0.5)] hover:scale-105 transition-all duration-300 overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <Instagram size={32} />
                </div>
                <div className="text-left">
                    <span className="block text-xs uppercase tracking-wider opacity-90">Instagram Oficial</span>
                    <span className="text-xl">Unirse a la comunidad</span>
                </div>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </a>
        </Reveal>

      </div>
    </section>
  );
};

export default InstagramFeed;
