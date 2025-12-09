import React, { useState, useEffect } from 'react';
import { Menu, X, Gamepad2 } from 'lucide-react';

interface HeaderProps {
  onOpenGame?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenGame }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Servicios', href: '#services' },
    { name: 'IA Tools', href: '#ai-tool' },
    { name: 'Portafolio', href: '#portfolio' },
    { name: 'Nosotros', href: '#about' },
  ];

  // FUNCIÓN CRÍTICA: Previene la recarga y maneja el scroll manualmente
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault(); // Detiene el intento de navegación URL
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      setIsMenuOpen(false); // Cierra menú móvil si está abierto
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-brand-black/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" onClick={handleLogoClick} className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-[0_0_15px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform duration-300 border border-white/10">
            <img 
              src="/logo.png" 
              alt="Conecta Growth Logo" 
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.backgroundColor = '#2563eb';
              }}
            />
            <div className="absolute inset-0 hidden bg-brand-blue flex items-center justify-center text-xs font-bold text-white">CG</div>
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white">
            Conecta<span className="text-brand-blue">Growth</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative text-sm font-medium text-gray-400 hover:text-white transition-colors py-2 group cursor-pointer"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          
          {/* Game Button */}
          {onOpenGame && (
             <button 
               onClick={onOpenGame}
               className="p-2 text-brand-blue hover:text-white hover:bg-brand-blue/20 rounded-full transition-all duration-300 animate-pulse-slow"
               title="Jugar Minijuego"
             >
                <Gamepad2 size={20} />
             </button>
          )}

          <a 
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="px-6 py-2 bg-white text-brand-black font-bold rounded-full hover:bg-brand-blue hover:text-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] cursor-pointer"
          >
            Hablemos
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl h-screen">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-2xl font-medium text-gray-300 hover:text-brand-blue transition-colors border-b border-white/5 py-4 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          
          {/* Mobile Game Button */}
          {onOpenGame && (
             <button 
               onClick={() => {
                 setIsMenuOpen(false);
                 onOpenGame();
               }}
               className="flex items-center gap-3 text-2xl font-medium text-brand-blue hover:text-white transition-colors border-b border-white/5 py-4 cursor-pointer"
             >
                <Gamepad2 /> Zona Arcade
             </button>
          )}

           <a 
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="px-6 py-4 bg-brand-blue text-white font-bold rounded-lg text-center mt-4 text-xl shadow-lg cursor-pointer"
          >
            Empezar Proyecto
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;