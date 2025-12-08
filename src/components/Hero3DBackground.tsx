import { useEffect, useRef, useState } from 'react';
import stationRamintra from '@/assets/station-ramintra-hero.webp';

const Hero3DBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      setMousePosition({ x: x * 15, y: y * 10 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden"
    >
      {/* Animated background container with parallax */}
      <div 
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px) scale(1.08)`,
        }}
      >
        {/* Main image - full display */}
        <img
          src={stationRamintra}
          alt="Station Ramintra"
          className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          style={{
            minHeight: '100%',
            minWidth: '100%',
          }}
        />
      </div>

      {/* Subtle gradient overlay - only at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-70" />
      
      {/* Very subtle side vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30" />

      {/* Subtle light flares for premium effect */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
    </div>
  );
};

export default Hero3DBackground;