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
      
      setMousePosition({ x: x * 30, y: y * 15 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden"
    >
      {/* Animated background container */}
      <div 
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px) scale(1.15)`,
        }}
      >
        {/* Main panoramic image with auto-pan animation */}
        <div 
          className={`absolute inset-0 animate-pan-horizontal transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${stationRamintra})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '120%',
            height: '120%',
            left: '-10%',
            top: '-10%',
          }}
        />
        
        {/* Preload image */}
        <img 
          src={stationRamintra} 
          alt="" 
          className="hidden" 
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      {/* Gradient overlays for depth effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background opacity-80" />
      
      {/* Animated particles overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle light flares */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default Hero3DBackground;