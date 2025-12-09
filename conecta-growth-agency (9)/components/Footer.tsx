import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="container mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full overflow-hidden shadow-[0_0_10px_rgba(37,99,235,0.3)] border border-white/10">
             <img 
               src="/logo.png" 
               alt="Logo" 
               loading="lazy"
               className="w-full h-full object-cover"
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
                 e.currentTarget.parentElement!.style.backgroundColor = '#2563eb';
               }}
             />
           </div>
           <span className="font-display font-bold text-xl text-white">
            Conecta<span className="text-brand-blue">Growth</span>
          </span>
        </div>

        <div className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Conecta Growth Agency.
        </div>

        <div className="flex gap-6 text-sm font-medium text-gray-500">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors interactive-card">Privacidad</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors interactive-card">Términos</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;