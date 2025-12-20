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
        <button className="group relative flex items-center gap-2 h-10 px-3 rounded-xl bg-gradient-to-br from-muted/80 via-muted to-muted/60 border border-border/50 hover:from-primary/20 hover:via-primary/15 hover:to-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95">
          <Globe className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
          <span className="text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors duration-300">
            <span className="hidden sm:inline">{currentLanguage?.label}</span>
            <span className="sm:hidden">{currentLanguage?.code.toUpperCase()}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-primary/20 shadow-xl shadow-black/10 z-50 min-w-[140px] p-2 rounded-xl">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => i18n.changeLanguage(language.code)}
            className={`cursor-pointer font-semibold rounded-lg px-4 py-2.5 transition-all duration-200 ${
              i18n.language === language.code 
                ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/30' 
                : 'text-foreground/70 hover:bg-primary/10 hover:text-primary'
            }`}
          >
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
