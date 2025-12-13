import React, { useEffect, useState, useMemo } from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
  swayAmount: number;
  type: 'flake' | 'dot';
}

const Snowfall: React.FC = () => {
  const { getContent } = useSiteContent();
  const [isEnabled, setIsEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkEnabled = async () => {
      const content = await getContent('snowfall_animation');
      setIsEnabled(content?.content === 'true');
      setMounted(true);
    };
    checkEnabled();
  }, [getContent]);

  // Generate snowflakes with natural variation
  const snowflakes: Snowflake[] = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 8 + Math.random() * 12, // 8-20 seconds for natural fall
      animationDelay: Math.random() * -15, // Stagger start times
      size: Math.random() < 0.3 ? 2 + Math.random() * 3 : 4 + Math.random() * 8, // Mix of small dots and larger flakes
      opacity: 0.4 + Math.random() * 0.6,
      swayAmount: 20 + Math.random() * 40, // Natural horizontal drift
      type: Math.random() < 0.4 ? 'dot' : 'flake',
    }));
  }, []);

  if (!mounted || !isEnabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--snow-opacity);
          }
          90% {
            opacity: var(--snow-opacity);
          }
          100% {
            transform: translateY(100vh) translateX(var(--sway-amount)) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes snowfall-gentle {
          0% {
            transform: translateY(-20px) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: var(--snow-opacity);
          }
          25% {
            transform: translateY(25vh) translateX(calc(var(--sway-amount) * 0.5));
          }
          50% {
            transform: translateY(50vh) translateX(calc(var(--sway-amount) * -0.3));
          }
          75% {
            transform: translateY(75vh) translateX(calc(var(--sway-amount) * 0.7));
          }
          90% {
            opacity: var(--snow-opacity);
          }
          100% {
            transform: translateY(100vh) translateX(var(--sway-amount));
            opacity: 0;
          }
        }
        
        .snowflake {
          position: absolute;
          top: -20px;
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #e8f4f8 40%, #d0e8f0 100%);
          border-radius: 50%;
          filter: blur(0.5px);
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.4);
        }
        
        .snowflake.flake {
          animation: snowfall-gentle var(--duration) linear infinite;
          animation-delay: var(--delay);
        }
        
        .snowflake.dot {
          animation: snowfall var(--duration) linear infinite;
          animation-delay: var(--delay);
          filter: blur(0.3px);
          box-shadow: 0 0 2px rgba(255, 255, 255, 0.6);
        }
      `}</style>
      
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className={`snowflake ${flake.type}`}
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            '--duration': `${flake.animationDuration}s`,
            '--delay': `${flake.animationDelay}s`,
            '--snow-opacity': flake.opacity,
            '--sway-amount': `${flake.swayAmount}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default Snowfall;
