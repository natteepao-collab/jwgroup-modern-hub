import { Moon, Sun } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const theme = localStorage.getItem('theme');

    // Default to light mode if no theme is stored
    if (theme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      if (!theme) {
        localStorage.setItem('theme', 'light');
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);

    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "group relative flex items-center justify-center w-10 h-10 rounded-full",
        "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
        "border border-border/50 shadow-sm",
        "hover:shadow-md hover:border-primary/30 hover:scale-105",
        "active:scale-95 transition-all duration-300",
        "btn-ripple btn-press"
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className={cn(
        "relative transition-transform duration-500",
        isAnimating && "animate-[spin-once_0.5s_ease-out]"
      )}>
        {isDark ? (
          <Sun className={cn(
            "h-5 w-5 text-amber-500 transition-all duration-300",
            "group-hover:rotate-45 group-hover:text-amber-400",
            isAnimating && "scale-110"
          )} />
        ) : (
          <Moon className={cn(
            "h-5 w-5 text-primary/80 transition-all duration-300",
            "group-hover:-rotate-12 group-hover:text-primary",
            isAnimating && "scale-110"
          )} />
        )}
      </div>
      
      {/* Ripple ring effect on click */}
      <span className={cn(
        "absolute inset-0 rounded-full border-2 border-primary/50 opacity-0",
        isAnimating && "animate-[ripple_0.6s_ease-out]"
      )} />
    </button>
  );
};

export default ThemeToggle;
