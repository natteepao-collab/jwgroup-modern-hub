import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'th', label: 'ไทย', flag: '🇹🇭' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'cn', label: '中文', flag: '🇨🇳' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "group relative flex items-center justify-center gap-2 h-10 px-4 rounded-full",
          "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
          "border border-border/50 shadow-sm",
          "hover:shadow-md hover:border-primary/30 hover:scale-105",
          "active:scale-95 transition-all duration-300 min-w-[90px]"
        )}>
          <Globe className="h-4 w-4 text-primary/80 transition-transform duration-300 group-hover:rotate-12 group-hover:text-primary" />
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
          "z-50 min-w-[160px] p-2 rounded-2xl"
        )}
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => i18n.changeLanguage(language.code)}
            className={cn(
              "cursor-pointer rounded-xl px-4 py-3 transition-all duration-200 flex items-center gap-3",
              i18n.language === language.code
                ? "bg-primary/10 text-primary font-semibold"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="flex-1">{language.label}</span>
            {i18n.language === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
