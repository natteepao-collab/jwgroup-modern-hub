import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'th', label: 'ไทย' },
  { code: 'en', label: 'English' },
  { code: 'cn', label: '中文' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group relative flex items-center gap-2 h-10 px-3 rounded-xl bg-gradient-to-br from-rose-500/10 via-red-500/10 to-orange-500/10 border border-rose-500/30 hover:from-rose-500/25 hover:via-red-500/25 hover:to-orange-500/25 hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/25 transition-all duration-300 hover:scale-105 active:scale-95">
          <Globe className="h-4 w-4 text-rose-500 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
          <span className="text-sm font-semibold text-foreground/80 group-hover:text-rose-500 transition-colors duration-300">
            <span className="hidden sm:inline">{currentLanguage?.label}</span>
            <span className="sm:hidden">{currentLanguage?.code.toUpperCase()}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-rose-500/20 shadow-xl shadow-black/10 z-50 min-w-[140px] p-2 rounded-xl">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => i18n.changeLanguage(language.code)}
            className={`cursor-pointer font-semibold rounded-lg px-4 py-2.5 transition-all duration-200 ${
              i18n.language === language.code 
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/30' 
                : 'text-foreground/70 hover:bg-rose-500/10 hover:text-rose-500'
            }`}
          >
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
