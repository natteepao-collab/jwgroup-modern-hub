import jwLogo from '@/assets/jw-group-logo-full.png';

const Loading = () => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8"
      style={{
        background:
          'linear-gradient(160deg, #FFFFFF 0%, #FAFAF8 40%, #F5F3EF 70%, #EDEAE4 100%)',
      }}
      aria-busy="true"
      aria-label="Loading content"
    >
      <img
        src={jwLogo}
        alt="JW Group"
        className="h-40 w-auto max-w-[78vw] object-contain"
        style={{
          filter: 'drop-shadow(0 6px 20px rgba(15,23,42,0.10))',
          animation: 'logoEntrance 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}
      />

      <p
        className="text-center px-6 max-w-[380px] text-[15px] font-medium leading-relaxed"
        style={{
          color: '#1E293B',
          letterSpacing: '0.08em',
          opacity: 0,
          animation: 'fadeSlideUp 0.6s ease-out 0.45s forwards',
        }}
      >
        We believe in building a sustainable business while improving quality of life.
      </p>

      <div
        className="relative w-[260px] h-[6px] rounded-full overflow-hidden"
        style={{
          background: 'rgba(15,23,42,0.10)',
          boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.06)',
          opacity: 0,
          animation: 'fadeSlideUp 0.6s ease-out 0.65s forwards',
        }}
      >
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: '45%',
            background:
              'linear-gradient(90deg, transparent, #D4812A 30%, #F59E0B 50%, #D4812A 70%, transparent)',
            animation: 'slideBar 1.4s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes logoEntrance {
          0% { opacity: 0; transform: scale(0.7) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
