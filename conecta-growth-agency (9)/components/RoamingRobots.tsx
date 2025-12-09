
import React, { useState, useEffect, useRef } from 'react';

interface RobotState {
  id: number;
  targetX: number;
  targetY: number;
  status: 'moving' | 'working' | 'idle';
  direction: 'left' | 'right';
  targetElementHeight: number;
  targetElement: HTMLElement | null; // Added to track the actual DOM element
}

const RoamingRobots: React.FC = () => {
  const [robots, setRobots] = useState<RobotState[]>([
    { id: 1, targetX: 100, targetY: 300, status: 'idle', direction: 'right', targetElementHeight: 0, targetElement: null },
    { id: 2, targetX: window.innerWidth - 100, targetY: 500, status: 'idle', direction: 'left', targetElementHeight: 0, targetElement: null },
  ]);

  const robotsRef = useRef(robots);
  robotsRef.current = robots;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const moveRobot = (robotId: number, forceFollowScroll = false) => {
      setRobots(prevRobots => {
        return prevRobots.map(bot => {
          if (bot.id !== robotId) return bot;

          // Clean up previous highlight if forced to move early
          if (forceFollowScroll && bot.targetElement) {
            bot.targetElement.classList.remove('robot-scan-active');
          }

          const scrollY = window.scrollY;
          const viewHeight = window.innerHeight;
          const viewWidth = window.innerWidth;

          let newX = Math.random() * (viewWidth - 100) + 50;
          let newY = scrollY + (Math.random() * (viewHeight * 0.7)) + (viewHeight * 0.15); 
          
          let newStatus: 'moving' | 'working' | 'idle' = 'moving';
          let elementHeight = 0;
          let selectedElement: HTMLElement | null = null;

          // 40% probability to find an element, but ONLY if visible and not forced by scroll
          const findElement = !forceFollowScroll && Math.random() > 0.6;

          if (findElement) {
            // Select interactive elements and headers
            const targets = document.querySelectorAll('h1, h2, button, a, .glass-card, input');
            const visibleTargets = Array.from(targets).filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.top > 100 && rect.bottom < viewHeight - 100 && rect.left > 0 && rect.right < viewWidth;
            });

            if (visibleTargets.length > 0) {
              const randomTarget = visibleTargets[Math.floor(Math.random() * visibleTargets.length)] as HTMLElement;
              const rect = randomTarget.getBoundingClientRect();
              
              newX = rect.left + (rect.width / 2) - 25; 
              newY = rect.top + scrollY - 60; // Position slightly above the element
              elementHeight = rect.height + 60;
              selectedElement = randomTarget;
            }
          }

          // Determine direction
          const direction = newX > bot.targetX ? 'right' : 'left';

          return {
            ...bot,
            targetX: newX,
            targetY: newY,
            status: newStatus,
            direction,
            targetElementHeight: elementHeight,
            targetElement: selectedElement
          };
        });
      });
    };

    // 1. Autonomous Behavior Loop
    const intervals = robots.map(bot => {
      moveRobot(bot.id);

      return setInterval(() => {
        setRobots(currentBots => {
          const currentBot = currentBots.find(b => b.id === bot.id);
          if (!currentBot) return currentBots;

          if (currentBot.status === 'moving') {
             // Arrived at destination, start working
             if (currentBot.targetElement) {
                currentBot.targetElement.classList.add('robot-scan-active');
             }
             return currentBots.map(b => b.id === bot.id ? { ...b, status: 'working' } : b);

          } else if (currentBot.status === 'working') {
             // Finished working, go to idle
             if (currentBot.targetElement) {
                currentBot.targetElement.classList.remove('robot-scan-active');
             }
             setTimeout(() => moveRobot(bot.id), 2000); 
             return currentBots.map(b => b.id === bot.id ? { ...b, status: 'idle' } : b);

          } else {
             // Was idle, start moving again
             moveRobot(bot.id);
             return currentBots;
          }
        });
      }, Math.random() * 3000 + 4000); 
    });

    // 2. Scroll Listener
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            const scrollY = window.scrollY;
            const viewHeight = window.innerHeight;

            robotsRef.current.forEach(bot => {
                if (bot.targetY < scrollY - 200 || bot.targetY > scrollY + viewHeight + 200) {
                    // Force move, ensuring we clean up any active highlights first
                    if (bot.targetElement) {
                        bot.targetElement.classList.remove('robot-scan-active');
                    }
                    moveRobot(bot.id, true);
                }
            });
        }, 150);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
        intervals.forEach(clearInterval);
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
        // Cleanup all highlights on unmount
        document.querySelectorAll('.robot-scan-active').forEach(el => el.classList.remove('robot-scan-active'));
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40 h-full w-full">
      {robots.map(bot => (
        <div
          key={bot.id}
          className="absolute will-change-transform z-50"
          style={{
            left: bot.targetX,
            top: bot.targetY,
            transition: 'left 3s linear, top 3s ease-in-out', 
          }}
        >
          <div className={`relative w-14 h-14 flex flex-col items-center ${bot.status === 'moving' ? 'animate-walk-bounce' : 'animate-float'}`}>
            
            {/* LASER BEAM */}
            <div 
                className={`absolute top-full left-1/2 -translate-x-1/2 w-[2px] bg-cyan-400/50 shadow-[0_0_10px_#06b6d4] origin-top transition-all duration-300 ${
                    bot.status === 'working' ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
                }`}
                style={{ 
                    height: `${bot.targetElementHeight || 100}px`,
                }}
            >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full blur-md opacity-50 animate-pulse"></div>
            </div>

            {/* ROBOT SVG */}
            <div className={`w-full h-full transition-transform duration-500 ${bot.direction === 'left' ? 'scale-x-[-1]' : 'scale-x-1'}`}>
               <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                  <g className={bot.status === 'moving' ? 'animate-walk-cycle' : ''}>
                    <path d="M8 17L6 22" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" className={bot.status === 'moving' ? 'animate-leg-left' : ''} />
                    <path d="M16 17L18 22" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" className={bot.status === 'moving' ? 'animate-leg-right' : ''} />
                  </g>
                  <rect x="5" y="6" width="14" height="11" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
                  <rect x="7" y="9" width="10" height="4" rx="2" fill={bot.status === 'working' ? '#ef4444' : '#06b6d4'} className={bot.status === 'working' ? 'animate-scan' : ''} />
                  <path d="M12 6V3" stroke="#60a5fa" strokeWidth="1.5" />
                  <circle cx="12" cy="3" r="1.5" fill={bot.status === 'working' ? '#ef4444' : '#22c55e'} className={bot.status === 'working' ? 'animate-ping' : ''} />
                  <path d="M5 11H2" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" className={bot.status === 'moving' ? 'animate-arm-swing' : ''} />
                  <path d="M19 11H22" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" className={bot.status === 'moving' ? 'animate-arm-swing-reverse' : ''} />
               </svg>
            </div>

            {/* Scanning Cone Visual */}
            <div 
                className={`absolute top-full left-1/2 -translate-x-1/2 w-24 h-32 bg-gradient-to-b from-cyan-500/20 to-transparent clip-triangle transition-all duration-300 pointer-events-none ${
                    bot.status === 'working' ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            ></div>

          </div>
        </div>
      ))}
      
      <style>{`
        /* Highlight Class Applied to Targeted Elements */
        .robot-scan-active {
          animation: glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
          text-shadow: 2px 0 #06b6d4, -2px 0 #ef4444;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.6), inset 0 0 10px rgba(6, 182, 212, 0.2) !important;
          border-color: #06b6d4 !important;
          z-index: 50;
        }

        @keyframes glitch-skew {
          0% { transform: skew(0deg); }
          20% { transform: skew(-2deg); }
          40% { transform: skew(2deg); }
          60% { transform: skew(0deg); }
          80% { transform: skew(1deg); }
          100% { transform: skew(0deg); }
        }

        /* Robot Animations */
        @keyframes walk-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-walk-bounce { animation: walk-bounce 0.4s infinite ease-in-out; }

        @keyframes leg-left {
          0% { transform: rotate(20deg); }
          50% { transform: rotate(-20deg); }
          100% { transform: rotate(20deg); }
        }
        @keyframes leg-right {
          0% { transform: rotate(-20deg); }
          50% { transform: rotate(20deg); }
          100% { transform: rotate(-20deg); }
        }
        .animate-leg-left { transform-origin: 8px 17px; animation: leg-left 0.8s infinite linear; }
        .animate-leg-right { transform-origin: 16px 17px; animation: leg-right 0.8s infinite linear; }

        @keyframes arm-swing {
           0% { transform: rotate(-10deg); }
           50% { transform: rotate(10deg); }
           100% { transform: rotate(-10deg); }
        }
        .animate-arm-swing { transform-origin: 5px 11px; animation: arm-swing 0.8s infinite ease-in-out; }
        .animate-arm-swing-reverse { transform-origin: 19px 11px; animation: arm-swing 0.8s infinite ease-in-out reverse; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }

        @keyframes scan {
          0%, 100% { width: 10px; x: 7; }
          50% { width: 2px; x: 11; }
        }
        .animate-scan { animation: scan 1s infinite alternate; }
      `}</style>
    </div>
  );
};

export default RoamingRobots;
