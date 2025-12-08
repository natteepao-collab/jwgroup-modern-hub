import { useEffect, useRef, useState, useCallback } from 'react';
import stationRamintra from '@/assets/station-ramintra-hero.webp';
import jwProject02 from '@/assets/jw-project-02.jpg';

const heroImages = [
  stationRamintra,
  jwProject02,
];

const Hero3DBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Auto slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Parallax mouse effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      setMousePosition({ x: x * 12, y: y * 8 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden"
    >
      {/* Slideshow images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentIndex 
              ? isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100' 
              : 'opacity-0 scale-110'
          }`}
          style={{
            transform: index === currentIndex 
              ? `translate(${-mousePosition.x}px, ${-mousePosition.y}px) scale(1.05)` 
              : 'scale(1.1)',
            transition: 'transform 0.7s ease-out, opacity 1s ease-in-out',
          }}
        >
          <img
            src={image}
            alt={`JW Group Project ${index + 1}`}
            className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
              loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad(index)}
            style={{
              filter: 'saturate(1.1) contrast(1.02)',
            }}
          />
        </div>
      ))}

      {/* Subtle gradient overlay - minimal for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      
      {/* Very subtle side vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />

      {/* Slideshow indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 300);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary w-8' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Subtle ambient glow */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
    </div>
  );
};

export default Hero3DBackground;