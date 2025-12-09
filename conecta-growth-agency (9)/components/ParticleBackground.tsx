import React, { useRef, useEffect } from 'react';

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  interactionRadius?: number;
  color?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  className = '', 
  particleCount = 20, 
  interactionRadius = 80,
  color = 'rgba(37, 99, 235, 0.4)' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Responsive Canvas
    const dpr = window.devicePixelRatio || 1;
    let width = canvas.parentElement?.clientWidth || 300;
    let height = canvas.parentElement?.clientHeight || 300;
    
    const setSize = () => {
        width = canvas.parentElement?.clientWidth || 300;
        height = canvas.parentElement?.clientHeight || 300;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
    };
    setSize();

    // Particle System
    const particles: {x: number, y: number, vx: number, vy: number, size: number}[] = [];
    const mouse = { x: -1000, y: -1000 };

    for(let i=0; i<particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 1.5 + 0.5
        });
    }

    const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            // Physics
            p.x += p.vx;
            p.y += p.vy;

            // Borders (Bounce softly)
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Mouse Interaction (Vortex/Flow)
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < interactionRadius) {
                const angle = Math.atan2(dy, dx);
                const force = (interactionRadius - dist) / interactionRadius;
                
                // Vortex Effect (Tangential force)
                // We add to velocity based on the angle perpendicular to the mouse
                const swirlForce = 0.05 * force;
                
                // Slight attraction
                p.vx += Math.cos(angle) * 0.02 * force;
                p.vy += Math.sin(angle) * 0.02 * force;

                // Swirl
                p.vx -= Math.sin(angle) * swirlForce;
                p.vy += Math.cos(angle) * swirlForce;
            } else {
                // Return to normal chaos slowly
                // Max speed cap
                const maxSpeed = 0.5;
                const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
                if(speed > maxSpeed) {
                    p.vx *= 0.95;
                    p.vy *= 0.95;
                }
            }

            // Draw
            ctx.fillStyle = color;
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

    const handleMouseLeave = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    };

    animate();
    
    // Listeners attached to parent to catch events properly or window for resize
    window.addEventListener('resize', setSize);
    
    // Attach mouse events to the canvas's parent container for better UX
    const parent = canvas.parentElement;
    if(parent) {
        parent.addEventListener('mousemove', handleMouseMove);
        parent.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
        window.removeEventListener('resize', setSize);
        if(parent) {
            parent.removeEventListener('mousemove', handleMouseMove);
            parent.removeEventListener('mouseleave', handleMouseLeave);
        }
    };
  }, [particleCount, interactionRadius, color]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};

export default ParticleBackground;