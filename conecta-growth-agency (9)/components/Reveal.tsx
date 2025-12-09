import React, { useEffect, useRef, useState } from 'react';

type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'zoom';

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number; // in seconds
  className?: string;
  threshold?: number;
}

const Reveal: React.FC<RevealProps> = ({ 
  children, 
  variant = 'up', 
  delay = 0, 
  className = '',
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we can unobserve if we want it to only animate once
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  const getVariantClass = () => {
    switch (variant) {
      case 'up': return 'reveal-up';
      case 'down': return 'reveal-down';
      case 'left': return 'reveal-left';
      case 'right': return 'reveal-right';
      case 'zoom': return 'reveal-zoom';
      default: return 'reveal-up';
    }
  };

  return (
    <div
      ref={ref}
      className={`reveal-base ${getVariantClass()} ${isVisible ? 'reveal-active' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default Reveal;
