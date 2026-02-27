import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const languages = [
  { code: 'th', label: 'ไทย', flag: '🇹🇭' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'cn', label: '中文', flag: '🇨🇳' },
  { code: 'kr', label: '한국어', flag: '🇰🇷' },
  { code: 'jp', label: '日本語', flag: '🇯🇵' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "group relative flex items-center justify-center gap-2 h-10 px-4 rounded-full",
          "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
          "border border-border/50 shadow-sm",
          "hover:shadow-md hover:border-primary/30 hover:scale-105",
          "active:scale-95 transition-all duration-300 min-w-[90px]",
          "btn-ripple btn-press",
          isOpen && "border-primary/50 shadow-md"
        )}>
          <Globe className={cn(
            "h-4 w-4 text-primary/80 transition-all duration-300",
            "group-hover:rotate-12 group-hover:text-primary",
            isOpen && "rotate-12 text-primary"
          )} />
          <span className="text-sm font-semibold text-foreground/80 group-hover:text-foreground">
            <span className="hidden sm:inline">{currentLanguage?.label}</span>
            <span className="sm:hidden">{currentLanguage?.code.toUpperCase()}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "bg-card/95 backdrop-blur-xl border-border/50 shadow-xl shadow-black/5",
          "z-50 min-w-[160px] p-2 rounded-2xl",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
        )}
      >
        {languages.map((language, index) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => i18n.changeLanguage(language.code)}
            className={cn(
              "cursor-pointer rounded-xl px-4 py-3 transition-all duration-200 flex items-center gap-3",
              "animate-in fade-in-0 slide-in-from-right-2",
              i18n.language === language.code
                ? "bg-primary/10 text-primary font-semibold"
                : "text-foreground/70 hover:bg-muted hover:text-foreground hover:translate-x-1"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className={cn(
              "text-lg transition-transform duration-200",
              "group-hover:scale-110"
            )}>{language.flag}</span>
            <span className="flex-1">{language.label}</span>
            {i18n.language === language.code && (
              <Check className="h-4 w-4 text-primary animate-in zoom-in-50" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
