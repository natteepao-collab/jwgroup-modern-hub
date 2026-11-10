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
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const isMobile = useIsMobile();
  const rafRef = useRef<number>();

  // Defer video loading until after first paint (or skip entirely on mobile / slow connection / data-saver)
  useEffect(() => {
    if (isMobile || reduceMotion) return; // mobile: poster only, save bandwidth

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
  }, [isMobile, reduceMotion]);

  // Parallax mouse effect - skip on mobile for performance
  useEffect(() => {
    if (isMobile || reduceMotion) return;

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
  }, [isMobile, reduceMotion]);

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
        className={`home-media-image absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isVideoLoaded && shouldLoadVideo && !isMobile && !reduceMotion ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Video Background - desktop only, loads after first paint */}
      {shouldLoadVideo && !isMobile && !reduceMotion && (
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
            poster={heroPoster}
            onLoadedData={handleVideoLoaded}
            className={`home-media-video w-full h-full object-cover transition-opacity duration-700 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Gradient overlay */}
      <div
        className="home-media-overlay absolute inset-0 pointer-events-none"
      />
    </div>
  );
};

export default Hero3DBackground;
