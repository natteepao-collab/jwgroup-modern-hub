import React from 'react';
import {
    Building2,
    Heart,
    Briefcase,
    Wallet,
    Sparkles,
    GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type FocusType = 'wealth' | 'love' | 'work' | 'health' | 'luck' | 'education';

const options = [
    {
        id: 'wealth',
        label: 'โชคลาภและการเงิน',
        en: 'Wealth',
        icon: Wallet,
        className: 'hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary/5',
        iconColor: 'text-primary',
    },
    {
        id: 'work',
        label: 'การงานและธุรกิจ',
        en: 'Career',
        icon: Briefcase,
        className: 'hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary/5',
        iconColor: 'text-primary',
    },
    {
        id: 'love',
        label: 'ความรัก',
        en: 'Love',
        icon: Heart,
        className: 'hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary/5',
        iconColor: 'text-primary',
    },
    {
        id: 'luck',
        label: 'โชคดีและแคล้วคลาด',
        en: 'Luck',
        icon: Sparkles,
        className: 'hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary/5',
        iconColor: 'text-primary',
    },
    {
        id: 'health',
        label: 'สุขภาพแข็งแรง',
        en: 'Health',
        icon: Building2,
        className: 'hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary/5',
        iconColor: 'text-primary',
    },
    {
        id: 'education',
        label: 'การเรียนและปัญญา',
        en: 'Education',
        icon: GraduationCap,
        className: 'hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary/5',
        iconColor: 'text-primary',
    },
];

interface FocusSelectorProps {
    value?: string;
    onChange: (value: string) => void;
}

export const FocusSelector: React.FC<FocusSelectorProps> = ({ value, onChange }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {options.map((option) => {
                const isSelected = value === option.id;
                const Icon = option.icon;

                return (
                    <Button variant="ghost" aria-pressed={isSelected}
                        key={option.id}
                        type="button"
                        onClick={() => onChange(option.id)}
                        data-state={isSelected ? 'checked' : 'unchecked'}
                        className={cn(
                            "relative group flex flex-col items-center justify-center p-3 h-36 rounded-lg border border-muted transition-all duration-300 bg-card hover:scale-[1.02] cursor-pointer",
                            option.className
                        )}
                    >
                        <div className={cn(
                            "p-3 rounded-full bg-primary/10 mb-3 transition-colors group-hover:bg-background",
                            isSelected && "bg-background"
                        )}>
                            <Icon className={cn("w-6 h-6", option.iconColor)} />
                        </div>
                        <div className="text-center">
                            <span className="block font-semibold text-foreground text-sm whitespace-normal leading-relaxed">
                                {option.label}
                            </span>
                            <span className="block text-xs text-muted-foreground mt-0.5">
                                {option.en}
                            </span>
                        </div>

                        {isSelected && (
                            <div className="absolute top-2 right-2">
                                <span className="flex h-2 w-2">
                                    <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", option.iconColor.replace('text-', 'bg-'))}></span>
                                    <span className={cn("relative inline-flex rounded-full h-2 w-2", option.iconColor.replace('text-', 'bg-'))}></span>
                                </span>
                            </div>
                        )}
                    </Button>
                );
            })}
        </div>
    );
};

export default FocusSelector;
