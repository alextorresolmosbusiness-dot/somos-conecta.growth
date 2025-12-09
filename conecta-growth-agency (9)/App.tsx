
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import AiStrategyGenerator from './components/AiStrategyGenerator';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import ChatBot from './components/ChatBot';
import MiniGame from './components/MiniGame';
import InstagramFeed from './components/InstagramFeed';
import WhatsAppButton from './components/WhatsAppButton';
import RoamingRobots from './components/RoamingRobots';

function App() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

  useEffect(() => {
    // --- WELCOME SOUND SYSTEM ---
    // Browsers block autoplay until the user interacts. 
    // We attach a one-time listener to play the sound on the first click/scroll.
    const playWelcomeSound = () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        
        // Oscillator 1: The Base Swell
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        // Oscillator 2: The High Harmony
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        const now = ctx.currentTime;

        // Sound Design: "Ethereal Startup"
        
        // Osc 1 Settings (Low to Mid)
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(150, now);
        osc1.frequency.exponentialRampToValueAtTime(400, now + 2);
        
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.1, now + 0.5); // Fade in
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 3); // Long Fade out

        // Osc 2 Settings (Shimmer)
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(300, now);
        osc2.frequency.exponentialRampToValueAtTime(800, now + 2.5);

        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(0.05, now + 0.5);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 3);

        // Play
        osc1.start(now);
        osc1.stop(now + 3);
        osc2.start(now);
        osc2.stop(now + 3);

        // Remove listeners so it only plays once
        window.removeEventListener('click', playWelcomeSound);
        window.removeEventListener('scroll', playWelcomeSound);
        window.removeEventListener('keydown', playWelcomeSound);
        
      } catch (e) {
        console.error("Audio autoplay prevented", e);
      }
    };

    // Add listeners for the first interaction
    window.addEventListener('click', playWelcomeSound);
    window.addEventListener('scroll', playWelcomeSound);
    window.addEventListener('keydown', playWelcomeSound);

    // --- CURSOR LOGIC ---
    const moveCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.closest('.interactive-card')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('click', playWelcomeSound);
      window.removeEventListener('scroll', playWelcomeSound);
      window.removeEventListener('keydown', playWelcomeSound);
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-black text-white overflow-x-hidden relative selection:bg-brand-blue selection:text-white">
      {/* Custom Global Cursor */}
      <div 
        className={`cursor-follower hidden md:block ${isHovering ? 'hovered' : ''}`}
        style={{ 
          left: `${cursorPos.x}px`, 
          top: `${cursorPos.y}px`,
          opacity: 1
        }}
      />

      {/* Visual Connection Line */}
      <ScrollProgress />
      
      {/* AI Assistant */}
      <ChatBot />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* Roaming Maintenance Robots */}
      <RoamingRobots />

      {/* Arcade MiniGame */}
      <MiniGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />

      <Header onOpenGame={() => setIsGameOpen(true)} />
      <main>
        <Hero />
        <Services />
        <AiStrategyGenerator />
        <Portfolio />
        <About />
        <InstagramFeed />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
