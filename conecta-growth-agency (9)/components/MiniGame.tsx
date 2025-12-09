
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, Trophy, Play, RotateCcw, ShieldAlert, Zap, MousePointer2, Loader2 } from 'lucide-react';

interface MiniGameProps {
  isOpen: boolean;
  onClose: () => void;
}

const MiniGame: React.FC<MiniGameProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'booting' | 'playing' | 'gameover'>('start');
  const [levelUpNotification, setLevelUpNotification] = useState(false);
  
  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('conecta_growth_highscore');
    if (stored) setHighScore(parseInt(stored));
  }, []);

  const playSound = useCallback((type: 'collect' | 'hit' | 'start' | 'levelup') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'collect') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'start') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'levelup') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {
      // Ignore audio errors
    }
  }, []);

  // Level Up logic
  useEffect(() => {
    if (score > 0 && score % 500 === 0) {
        setLevel(l => l + 1);
        setLevelUpNotification(true);
        playSound('levelup');
        setTimeout(() => setLevelUpNotification(false), 2000);
    }
  }, [score, playSound]);

  useEffect(() => {
    if (!isOpen) {
        setGameState('start');
        setScore(0);
        setLevel(1);
        return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Adjust canvas size
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // Game Objects
    let player = { x: width / 2, y: height / 2, r: 10, color: '#2563eb', history: [] as {x: number, y: number}[] };
    let enemies: { x: number; y: number; r: number; vx: number; vy: number; color: string }[] = [];
    let particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];
    let pickups: { x: number; y: number; r: number; color: string }[] = [];
    
    // Input
    const mouse = { x: width / 2, y: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Spawners
    let enemySpawnTimer = 0;
    let pickupSpawnTimer = 0;

    const resetGame = () => {
      enemies = [];
      particles = [];
      pickups = [];
      player.x = width / 2;
      player.y = height / 2;
      mouse.x = width / 2;
      mouse.y = height / 2;
    };

    // When playing starts (or re-mounts), variables are naturally fresh, 
    // but we can call resetGame to be sure if using state persistence logic later.
    resetGame();

    // --- GAME LOOP ---
    const loop = () => {
      if (gameState !== 'playing') {
        return; 
      }

      // Difficulty Scaling based on SCORE
      const currentLevel = Math.floor(score / 500) + 1;
      
      // Clear with trail effect
      ctx.fillStyle = 'rgba(5, 5, 5, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // --- PLAYER LOGIC ---
      // Smooth lerp movement
      player.x += (mouse.x - player.x) * 0.15;
      player.y += (mouse.y - player.y) * 0.15;

      // Player Trail (Longer on higher levels)
      player.history.push({x: player.x, y: player.y});
      if(player.history.length > 5 + (currentLevel * 2)) player.history.shift();

      ctx.beginPath();
      for(let i=0; i<player.history.length; i++) {
          const p = player.history[i];
          ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = `rgba(37, 99, 235, 0.5)`;
      ctx.lineWidth = player.r;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Draw Player Head
      ctx.shadowBlur = 15;
      ctx.shadowColor = player.color;
      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // --- SPAWNERS (Difficulty Logic) ---
      enemySpawnTimer++;
      // Spawn Rate: Starts at 45 frames, decreases by 3 per level, min 15 frames
      const spawnRate = Math.max(15, 45 - (currentLevel * 3)); 
      
      if (enemySpawnTimer > spawnRate) { 
        const r = Math.random() * 10 + 10;
        let x, y;
        // Spawn from edges
        if (Math.random() < 0.5) {
          x = Math.random() < 0.5 ? -r : width + r;
          y = Math.random() * height;
        } else {
          x = Math.random() * width;
          y = Math.random() < 0.5 ? -r : height + r;
        }
        
        const angle = Math.atan2(player.y - y, player.x - x);
        // Speed: Base 2 + Random(3) + Level Bonus (0.5 per level)
        const speed = (Math.random() * 3 + 2) + (currentLevel * 0.5);
        
        enemies.push({
          x, y, r,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: '#ef4444' 
        });
        enemySpawnTimer = 0;
      }

      pickupSpawnTimer++;
      if (pickupSpawnTimer > 60) { // Pickups spawn slightly faster too
          pickups.push({
              x: Math.random() * (width - 40) + 20,
              y: Math.random() * (height - 40) + 20,
              r: 6,
              color: '#ffffff'
          });
          pickupSpawnTimer = 0;
      }

      // --- UPDATE ENEMIES ---
      enemies.forEach((enemy, index) => {
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;

        // Draw Enemy (Triangle)
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y - enemy.r);
        ctx.lineTo(enemy.x + enemy.r, enemy.y + enemy.r);
        ctx.lineTo(enemy.x - enemy.r, enemy.y + enemy.r);
        ctx.closePath();
        ctx.fill();

        // Remove if out of bounds (far)
        if (enemy.x < -100 || enemy.x > width + 100 || enemy.y < -100 || enemy.y > height + 100) {
            enemies.splice(index, 1);
            return;
        }

        // Collision with Player
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < player.r + enemy.r) {
           setGameState('gameover');
           playSound('hit');
           
           setScore(prev => {
             const newScore = prev;
             setHighScore(curr => {
                const max = Math.max(curr, newScore);
                localStorage.setItem('conecta_growth_highscore', max.toString());
                return max;
             });
             return prev;
           });
        }
      });

      // --- UPDATE PICKUPS ---
      pickups.forEach((p, i) => {
          // Pulse effect
          const pulse = Math.sin(Date.now() / 200) * 2;
          
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#fff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          const dx = player.x - p.x;
          const dy = player.y - p.y;
          const dist = Math.sqrt(dx*dx + dy*dy);

          if (dist < player.r + p.r + 15) { // Increased pickup radius slightly
              // COLLECT
              setScore(prev => prev + 100); 
              playSound('collect');
              
              // Add particles
              for(let j=0; j<8; j++) {
                  particles.push({
                      x: p.x,
                      y: p.y,
                      vx: (Math.random() - 0.5) * 8,
                      vy: (Math.random() - 0.5) * 8,
                      life: 1,
                      color: '#60a5fa'
                  });
              }
              pickups.splice(i, 1);
          }
      });

      // --- UPDATE PARTICLES ---
      particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.04;
          
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;

          if(p.life <= 0) particles.splice(i, 1);
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    // Start loop
    if (gameState === 'playing') {
        loop();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen, gameState, playSound, score]); 

  const startGame = () => {
    playSound('start');
    setGameState('booting');
    
    // Simulate system boot transition
    setTimeout(() => {
        setGameState('playing');
        setScore(0);
        setLevel(1);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center font-sans">
      <canvas ref={canvasRef} className="absolute inset-0 block touch-none" />
      
      {/* UI Overlay */}
      <div className="relative z-10 text-center pointer-events-none w-full max-w-2xl px-6">
        
        {/* Header HUD - Only visible when playing */}
        {gameState === 'playing' && (
            <div className="absolute top-8 left-0 w-full flex justify-between px-8 md:px-12 pointer-events-none animate-fade-in">
                <div className="text-left bg-black/40 backdrop-blur px-4 py-2 rounded-lg border border-white/5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Data (Score)</p>
                    <p className="text-3xl font-display font-bold text-white tabular-nums">{score}</p>
                </div>
                
                {/* Level Indicator */}
                <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden mt-2">
                        <div 
                        className="h-full bg-brand-blue transition-all duration-300"
                        style={{ width: `${(score % 500) / 5}%` }}
                        ></div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase">Next Level</p>
                </div>

                <div className="text-right bg-black/40 backdrop-blur px-4 py-2 rounded-lg border border-white/5">
                    <p className="text-[10px] text-brand-blue uppercase tracking-widest font-bold">Level</p>
                    <p className="text-3xl font-display font-bold text-brand-blue tabular-nums">{level}</p>
                </div>
            </div>
        )}

        {/* Level Up Notification */}
        {levelUpNotification && (
           <div className="absolute top-32 left-0 right-0 flex justify-center animate-bounce">
              <div className="bg-gradient-to-r from-brand-blue to-cyan-500 text-black font-bold px-8 py-2 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.6)] text-xl tracking-widest uppercase transform scale-125">
                 System Upgrade
              </div>
           </div>
        )}

        {/* Booting Sequence Screen */}
        {gameState === 'booting' && (
            <div className="flex flex-col items-center justify-center animate-pulse">
                <Loader2 className="w-16 h-16 text-brand-blue animate-spin mb-6" />
                <h2 className="text-2xl font-mono text-white tracking-[0.2em] mb-4">INITIALIZING SYSTEM...</h2>
                <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-brand-blue animate-[loading_1.5s_ease-in-out_forwards]"></div>
                </div>
                <div className="mt-4 font-mono text-xs text-brand-blue/70">
                    <p>LOADING ASSETS... OK</p>
                    <p className="mt-1">ESTABLISHING UPLINK... OK</p>
                </div>
                <style>{`
                    @keyframes loading {
                        0% { width: 0%; }
                        100% { width: 100%; }
                    }
                `}</style>
            </div>
        )}

        {/* Start / Instructions Screen */}
        {gameState === 'start' && (
            <div className="bg-black/80 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-xl pointer-events-auto animate-fade-in max-w-lg mx-auto shadow-2xl">
                <div className="inline-block px-3 py-1 rounded-full bg-brand-blue/20 text-brand-blue text-xs font-bold mb-4 border border-brand-blue/30 uppercase tracking-wider">
                  Mini-Game Arcade
                </div>
                <h2 className="text-5xl font-display font-bold text-white mb-2">GROWTH RUSH</h2>
                <p className="text-gray-400 mb-8 text-sm">Escapa de los glitches, recolecta datos y escala tu nivel.</p>
                
                {/* Instructions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                   <div className="bg-white/5 p-4 rounded-xl flex items-center gap-4 border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                         <MousePointer2 size={20} />
                      </div>
                      <div>
                         <p className="font-bold text-white text-sm">Muévete</p>
                         <p className="text-xs text-gray-500">Usa el mouse o dedo.</p>
                      </div>
                   </div>

                   <div className="bg-white/5 p-4 rounded-xl flex items-center gap-4 border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 shadow-[0_0_10px_white]">
                         <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div>
                         <p className="font-bold text-white text-sm">Recolecta (+100)</p>
                         <p className="text-xs text-gray-500">Atrapa los orbes blancos.</p>
                      </div>
                   </div>

                   <div className="bg-white/5 p-4 rounded-xl flex items-center gap-4 border border-white/5 md:col-span-2">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                         <ShieldAlert size={20} />
                      </div>
                      <div>
                         <p className="font-bold text-white text-sm">Evita los Glitches</p>
                         <p className="text-xs text-gray-500">Los triángulos rojos reinician el sistema.</p>
                      </div>
                   </div>
                </div>

                <button 
                    onClick={startGame}
                    className="w-full group relative px-8 py-4 bg-brand-blue text-white font-bold rounded-xl overflow-hidden hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(37,99,235,0.4)]"
                >
                    <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                    <span className="flex items-center justify-center gap-3 relative z-10 text-lg tracking-widest">
                        <Play size={24} fill="currentColor" /> INICIAR MISIÓN
                    </span>
                </button>
                <div className="mt-4 text-xs text-gray-600">High Score: <span className="text-brand-blue">{highScore}</span></div>
            </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
            <div className="bg-black/80 border border-red-500/30 p-8 md:p-12 rounded-3xl backdrop-blur-xl pointer-events-auto animate-fade-in shadow-[0_0_100px_rgba(220,38,38,0.2)] max-w-lg mx-auto">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                   <ShieldAlert size={40} className="text-red-500" />
                </div>
                
                <h2 className="text-4xl font-display font-bold text-white mb-1">SYSTEM FAILURE</h2>
                <p className="text-red-400 mb-8 text-sm font-mono tracking-widest">ERROR DE CONEXIÓN DETECTADO</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-xs text-gray-400 uppercase mb-1">Puntuación Final</div>
                        <div className="text-3xl font-bold text-white">{score}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-xs text-gray-400 uppercase mb-1">Nivel Alcanzado</div>
                        <div className="text-3xl font-bold text-brand-blue">{level}</div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => onClose()}
                        className="px-8 py-4 border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl font-medium transition-colors text-sm"
                    >
                        SALIR
                    </button>
                    <button 
                        onClick={startGame}
                        className="flex-1 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center gap-2 text-sm shadow-lg"
                    >
                        <RotateCcw size={18} /> INTENTAR DE NUEVO
                    </button>
                </div>
            </div>
        )}

      </div>

      {/* Close Button (Always visible) */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white pointer-events-auto z-50 transition-colors backdrop-blur-md group"
      >
        <X size={24} className="group-hover:rotate-90 transition-transform" />
      </button>

      {/* Retro Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] bg-[length:100%_2px,3px_100%] opacity-20"></div>
    </div>
  );
};

export default MiniGame;
