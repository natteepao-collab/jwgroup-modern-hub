import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

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
      onClick={toggleTheme}
      className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-muted/80 via-muted to-muted/60 border border-border/50 hover:from-primary/20 hover:via-primary/15 hover:to-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative">
        {isDark ? (
          <Sun className="h-5 w-5 text-amber-500 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" />
        ) : (
          <Moon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
