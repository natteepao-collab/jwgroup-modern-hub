import { useEffect, useState } from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';

const ChristmasTheme = () => {
  const { getContent, isLoading } = useSiteContent();
  const [isEnabled, setIsEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const result = getContent('christmas_theme');
    setIsEnabled(result.content === 'true');
    setMounted(true);
  }, [getContent, isLoading]);

  useEffect(() => {
    if (!mounted) return;
    
    if (isEnabled) {
      document.documentElement.classList.add('christmas-theme');
    } else {
      document.documentElement.classList.remove('christmas-theme');
    }
    
    return () => {
      document.documentElement.classList.remove('christmas-theme');
    };
  }, [isEnabled, mounted]);

  if (!mounted || !isEnabled) return null;

  return (
    <>
      {/* Christmas decorations - holly corners */}
      <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none z-40 opacity-80">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="hollyGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a5f1a" />
              <stop offset="100%" stopColor="#0d3d0d" />
            </linearGradient>
          </defs>
          {/* Holly leaves */}
          <ellipse cx="25" cy="35" rx="20" ry="12" fill="url(#hollyGreen)" transform="rotate(-30 25 35)" />
          <ellipse cx="45" cy="25" rx="20" ry="12" fill="url(#hollyGreen)" transform="rotate(20 45 25)" />
          <ellipse cx="35" cy="50" rx="18" ry="10" fill="url(#hollyGreen)" transform="rotate(-60 35 50)" />
          {/* Holly berries */}
          <circle cx="30" cy="30" r="6" fill="#c41e3a" />
          <circle cx="38" cy="38" r="5" fill="#c41e3a" />
          <circle cx="25" cy="42" r="5" fill="#c41e3a" />
          {/* Berry highlights */}
          <circle cx="28" cy="28" r="2" fill="#ff6b6b" opacity="0.6" />
          <circle cx="36" cy="36" r="1.5" fill="#ff6b6b" opacity="0.6" />
        </svg>
      </div>

      {/* Top right corner decoration */}
      <div className="fixed top-0 right-0 w-32 h-32 pointer-events-none z-40 opacity-80 transform scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="hollyGreen2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a5f1a" />
              <stop offset="100%" stopColor="#0d3d0d" />
            </linearGradient>
          </defs>
          <ellipse cx="25" cy="35" rx="20" ry="12" fill="url(#hollyGreen2)" transform="rotate(-30 25 35)" />
          <ellipse cx="45" cy="25" rx="20" ry="12" fill="url(#hollyGreen2)" transform="rotate(20 45 25)" />
          <ellipse cx="35" cy="50" rx="18" ry="10" fill="url(#hollyGreen2)" transform="rotate(-60 35 50)" />
          <circle cx="30" cy="30" r="6" fill="#c41e3a" />
          <circle cx="38" cy="38" r="5" fill="#c41e3a" />
          <circle cx="25" cy="42" r="5" fill="#c41e3a" />
          <circle cx="28" cy="28" r="2" fill="#ff6b6b" opacity="0.6" />
          <circle cx="36" cy="36" r="1.5" fill="#ff6b6b" opacity="0.6" />
        </svg>
      </div>

      {/* Hanging ornaments */}
      <div className="fixed top-0 left-1/4 pointer-events-none z-40">
        <div className="flex flex-col items-center animate-[swing_3s_ease-in-out_infinite]">
          <div className="w-0.5 h-8 bg-gradient-to-b from-amber-400 to-amber-600" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg relative">
            <div className="absolute top-1 left-2 w-2 h-2 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>

      <div className="fixed top-0 right-1/4 pointer-events-none z-40">
        <div className="flex flex-col items-center animate-[swing_3.5s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }}>
          <div className="w-0.5 h-12 bg-gradient-to-b from-amber-400 to-amber-600" />
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg relative">
            <div className="absolute top-1.5 left-2.5 w-2.5 h-2.5 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>

      <div className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none z-40">
        <div className="flex flex-col items-center animate-[swing_4s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}>
          <div className="w-0.5 h-6 bg-gradient-to-b from-amber-400 to-amber-600" />
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg relative">
            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Twinkling lights at top */}
      <div className="fixed top-0 left-0 right-0 h-2 pointer-events-none z-40 flex justify-around">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: ['#ff0000', '#00ff00', '#ffff00', '#0066ff', '#ff00ff'][i % 5],
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${1 + (i % 3) * 0.5}s`,
              boxShadow: `0 0 10px ${['#ff0000', '#00ff00', '#ffff00', '#0066ff', '#ff00ff'][i % 5]}`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes swing {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }

        .christmas-theme {
          --christmas-red: 0 70% 45%;
          --christmas-green: 140 60% 25%;
          --christmas-gold: 45 100% 50%;
        }

        .christmas-theme .text-primary {
          color: hsl(var(--christmas-red)) !important;
        }

        .christmas-theme a:hover {
          color: hsl(var(--christmas-green)) !important;
        }
      `}</style>
    </>
  );
};

export default ChristmasTheme;
