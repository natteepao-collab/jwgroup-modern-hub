import jwLogo from '@/assets/jw-group-logo-full.png';

const Loading = () => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0F172A 100%)' }}
      aria-busy="true"
      aria-label="Loading content"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(30 70% 45% / 0.35) 0%, transparent 70%)',
            animation: 'logoGlow 3s ease-in-out infinite'
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: i % 3 === 0 ? 'hsl(30 70% 55%)' : 'hsl(210 20% 90%)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.15 + Math.random() * 0.25,
              animation: `floatParticle ${12 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Logo container */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Logo with animation */}
        <div
          className="relative"
          style={{
            animation: 'logoEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
          }}
        >
          {/* Outer ring glow */}
          <div
            className="absolute -inset-4 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, hsl(30 70% 45% / 0.15), hsl(30 70% 45% / 0.05))',
              animation: 'ringPulse 2.5s ease-in-out infinite'
            }}
          />
          <img
            src={jwLogo}
            alt="JW Group"
            className="relative h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(0 0 30px hsl(30 70% 45% / 0.3)) drop-shadow(0 4px 20px hsl(0 0% 0% / 0.3))'
            }}
          />
        </div>

        {/* Brand tagline */}
        <div
          className="text-center space-y-2"
          style={{
            animation: 'fadeSlideUp 0.6s ease-out 0.4s both'
          }}
        >
          <p
            className="text-sm sm:text-base font-medium tracking-[0.3em] uppercase"
            style={{ color: 'hsl(30 70% 55%)' }}
          >
            Excellence in Every Detail
          </p>
        </div>

        {/* Premium progress indicator */}
        <div
          className="flex flex-col items-center gap-4 w-full max-w-xs"
          style={{
            animation: 'fadeSlideUp 0.6s ease-out 0.7s both'
          }}
        >
          {/* Elegant progress bar */}
          <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: 'hsl(210 20% 25%)' }}>
            <div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, hsl(30 70% 40%), hsl(30 70% 55%), hsl(30 70% 40%))',
                backgroundSize: '200% 100%',
                animation: 'progressSlide 2s ease-in-out infinite, shimmerBar 1.5s linear infinite'
              }}
            />
          </div>

          {/* Loading text */}
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: 'hsl(215 16% 60%)' }}>
            Loading
            <span className="inline-block ml-1" style={{ animation: 'dotPulse 1.4s ease-in-out infinite' }}>.</span>
            <span className="inline-block" style={{ animation: 'dotPulse 1.4s ease-in-out 0.2s infinite' }}>.</span>
            <span className="inline-block" style={{ animation: 'dotPulse 1.4s ease-in-out 0.4s infinite' }}>.</span>
          </p>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3"
        style={{
          animation: 'fadeIn 0.8s ease-out 1s both'
        }}
      >
        <div className="h-[1px] w-12 sm:w-16" style={{ background: 'linear-gradient(90deg, transparent, hsl(30 70% 45% / 0.4))' }} />
        <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: 'hsl(215 16% 50%)' }}>
          Since 2007
        </span>
        <div className="h-[1px] w-12 sm:w-16" style={{ background: 'linear-gradient(90deg, hsl(30 70% 45% / 0.4), transparent)' }} />
      </div>

      {/* Keyframe animations - inline to avoid index.css bloat */}
      <style>{`
        @keyframes logoEntrance {
          0% { opacity: 0; transform: scale(0.7) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes logoGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.35; }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes progressSlide {
          0% { width: 0%; margin-left: 0; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
        @keyframes shimmerBar {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-30px) translateX(15px); }
          50% { transform: translateY(-15px) translateX(-10px); }
          75% { transform: translateY(-40px) translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
