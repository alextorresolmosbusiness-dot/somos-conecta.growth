import React, { useState, useRef, useEffect } from 'react';
import { generateMarketingStrategy } from '../services/geminiService';
import { StrategyResult } from '../types';
import { Loader2, Sparkles, BrainCircuit, Rocket, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

const AiStrategyGenerator: React.FC = () => {
  const [industry, setIndustry] = useState('');
  const [audience, setAudience] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StrategyResult | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matrix / Data Rain Effect
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

    const columns = Math.floor(width / 20);
    const drops: number[] = new Array(columns).fill(1);
    const mouse = { x: -1000, y: -1000 };

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)'; // Fade effect
      ctx.fillRect(0, 0, width, height);

      ctx.font = '14px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        // Disturbance from mouse
        const x = i * 20;
        const y = drops[i] * 20;
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Color based on distance to mouse
        if (dist < 100) {
           ctx.fillStyle = '#ffffff'; // White when near mouse (Activation)
           ctx.shadowBlur = 10;
           ctx.shadowColor = '#ffffff';
        } else {
           ctx.fillStyle = '#2563eb'; // Blue normal
           ctx.shadowBlur = 0;
        }

        const text = Math.random() > 0.5 ? '1' : '0';
        ctx.fillText(text, x, y);

        // Reset drop or move down
        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Mouse interaction: Slow down or speed up
        if (dist < 100) {
            drops[i] += 0.2; // Slow matrix time
        } else {
            drops[i] += 1;
        }
      }
      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };
    
    const handleResize = () => {
        if (canvas) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry || !audience || !goal) return;

    setLoading(true);
    setResult(null);
    try {
      const strategy = await generateMarketingStrategy(industry, audience, goal);
      setResult(strategy);
    } catch (error) {
      console.error(error);
      alert("Hubo un error generando la estrategia. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleScrollToContact = () => {
      const element = document.getElementById('contact');
      element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="ai-tool" className="py-24 relative overflow-hidden bg-brand-black">
      {/* Matrix Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 opacity-30 pointer-events-auto" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <Reveal variant="right" className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/20 text-brand-blue text-xs font-bold mb-4 border border-brand-blue/30 backdrop-blur-md">
              <BrainCircuit size={14} />
              <span>POWERED BY GEMINI AI</span>
            </div>
            <h2 className="font-display text-4xl font-bold mb-6 text-white">
              Inteligencia <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-lightBlue">Generativa</span>
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              La creatividad humana potenciada por datos. Describe tu negocio y deja que nuestra IA genere un concepto inicial para tu marca.
            </p>
          </Reveal>

          {/* Right Interface */}
          <Reveal variant="left" delay={0.2} className="lg:w-2/3 w-full interactive-card">
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-brand-blue/50 to-transparent shadow-2xl shadow-brand-blue/10">
              <div className="bg-brand-black/80 backdrop-blur-xl rounded-xl p-6 md:p-8 border border-white/5 min-h-[400px] flex flex-col justify-center">
                
                {!result ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Tu Industria</label>
                        <input 
                          type="text" 
                          placeholder="Ej. Arquitectura, SaaS, Moda..." 
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-white placeholder-gray-600"
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Público Objetivo</label>
                        <input 
                          type="text" 
                          placeholder="Ej. Startups, Gen Z..." 
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-white placeholder-gray-600"
                          value={audience}
                          onChange={(e) => setAudience(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Objetivo Principal</label>
                      <input 
                        type="text" 
                        placeholder="Ej. Posicionamiento de marca..." 
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-white placeholder-gray-600"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={loading || !industry || !goal}
                      className="w-full py-4 bg-brand-blue hover:bg-brand-blue/90 rounded-lg font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                         {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                         {loading ? 'Procesando Datos...' : 'Generar Concepto'}
                      </span>
                    </button>
                  </form>
                ) : (
                  <div className="animate-fade-in text-center flex flex-col items-center justify-center h-full gap-8">
                     
                     {/* Slogan Section */}
                     <div className="relative">
                       <div className="absolute -inset-4 bg-brand-blue/20 blur-xl rounded-full opacity-50"></div>
                       <p className="text-xs uppercase tracking-[0.2em] text-brand-blue font-bold mb-3">Tu Nuevo Slogan</p>
                       <h3 className="text-3xl md:text-5xl font-display font-bold text-white italic relative z-10">
                         "{result.slogan}"
                       </h3>
                     </div>

                     <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                     {/* Pitch Section */}
                     <div className="max-w-lg">
                        <div className="inline-flex items-center gap-2 text-white font-bold mb-3">
                           <Rocket size={18} className="text-brand-blue" />
                           <span>Cómo Conecta Growth te ayuda</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-lg">
                           {result.howWeHelp}
                        </p>
                     </div>

                     {/* Actions */}
                     <div className="flex gap-4 mt-4 w-full justify-center">
                        <button 
                          onClick={() => setResult(null)}
                          className="px-6 py-3 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white transition-colors text-sm font-medium"
                        >
                          Intentar de nuevo
                        </button>
                        <button 
                          onClick={handleScrollToContact}
                          className="px-6 py-3 rounded-full bg-brand-blue text-white font-bold hover:bg-brand-lightBlue transition-all shadow-[0_0_15px_rgba(37,99,235,0.5)] flex items-center gap-2 text-sm group"
                        >
                          Hacerlo Realidad
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                     </div>
                  </div>
                )}

              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default AiStrategyGenerator;