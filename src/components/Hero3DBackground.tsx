import { useEffect, useRef, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import heroPoster from '@/assets/hero-bg.jpg';

const HERO_VIDEO_URL = 'https://storage.googleapis.com/nbcloudbucket/video/jw/JW%20PARK%20HOME%20OFFICE_Final_260623.mp4';

const Hero3DBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const isMobile = useIsMobile();
  const rafRef = useRef<number>();

  // Defer video loading until after first paint (or skip entirely on mobile / slow connection / data-saver)
  useEffect(() => {
    if (isMobile) return; // mobile: poster only, save bandwidth

    const conn = (navigator as any).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return;

    const idle = (cb: () => void) =>
      'requestIdleCallback' in window
        ? (window as any).requestIdleCallback(cb, { timeout: 1500 })
        : setTimeout(cb, 600);

    const id = idle(() => setShouldLoadVideo(true));
    return () => {
      if ('cancelIdleCallback' in window) (window as any).cancelIdleCallback(id);
      else clearTimeout(id as any);
    };
  }, [isMobile]);

  // Parallax mouse effect - skip on mobile for performance
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x: x * 8, y: y * 5 });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  const handleVideoLoaded = useCallback(() => setIsVideoLoaded(true), []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden bg-secondary"
    >
      {/* Poster image - shown instantly for fast LCP, stays as fallback on mobile/slow networks */}
      <img
        src={heroPoster}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          objectPosition: 'center 30%',
          filter: 'saturate(1.2) contrast(1.1) brightness(1.15)',
        }}
      />

      {/* Video Background - desktop only, loads after first paint */}
      {shouldLoadVideo && (
        <div
          className="absolute inset-0"
          style={isMobile ? undefined : {
            transform: `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale(1.05)`,
            transition: 'transform 0.7s ease-out',
            willChange: 'transform',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={handleVideoLoaded}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              objectPosition: 'center 30%',
              filter: 'saturate(1.2) contrast(1.1) brightness(1.15)',
            }}
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, hsl(var(--background) / 0.8) 0%, hsl(var(--background) / 0.3) 10%, transparent 30%)',
        }}
      />
    </div>
  );
};

export default Hero3DBackground;
