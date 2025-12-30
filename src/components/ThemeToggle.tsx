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
      className="group relative flex items-center justify-center w-12 h-10 rounded-xl bg-purple-100 hover:bg-purple-200 transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative">
        {isDark ? (
          <Sun className="h-5 w-5 text-purple-700 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="h-5 w-5 text-purple-600 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
