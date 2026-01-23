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

export type FocusType = 'wealth' | 'love' | 'work' | 'health' | 'luck' | 'education';

const options = [
    {
        id: 'wealth',
        label: 'โชคลาภและการเงิน',
        en: 'Wealth',
        icon: Wallet,
        className: 'hover:border-amber-500 hover:shadow-amber-500/20 data-[state=checked]:border-amber-500 data-[state=checked]:shadow-amber-500/50 data-[state=checked]:bg-amber-500/5',
        iconColor: 'text-amber-500',
    },
    {
        id: 'work',
        label: 'การงานและธุรกิจ',
        en: 'Career',
        icon: Briefcase,
        className: 'hover:border-blue-500 hover:shadow-blue-500/20 data-[state=checked]:border-blue-500 data-[state=checked]:shadow-blue-500/50 data-[state=checked]:bg-blue-500/5',
        iconColor: 'text-blue-500',
    },
    {
        id: 'love',
        label: 'ความรัก',
        en: 'Love',
        icon: Heart,
        className: 'hover:border-rose-500 hover:shadow-rose-500/20 data-[state=checked]:border-rose-500 data-[state=checked]:shadow-rose-500/50 data-[state=checked]:bg-rose-500/5',
        iconColor: 'text-rose-500',
    },
    {
        id: 'luck',
        label: 'โชคดีและแคล้วคลาด',
        en: 'Luck',
        icon: Sparkles,
        className: 'hover:border-purple-500 hover:shadow-purple-500/20 data-[state=checked]:border-purple-500 data-[state=checked]:shadow-purple-500/50 data-[state=checked]:bg-purple-500/5',
        iconColor: 'text-purple-500',
    },
    {
        id: 'health',
        label: 'สุขภาพแข็งแรง',
        en: 'Health',
        icon: Building2,
        className: 'hover:border-emerald-500 hover:shadow-emerald-500/20 data-[state=checked]:border-emerald-500 data-[state=checked]:shadow-emerald-500/50 data-[state=checked]:bg-emerald-500/5',
        iconColor: 'text-emerald-500',
    },
    {
        id: 'education',
        label: 'การเรียนและปัญญา',
        en: 'Education',
        icon: GraduationCap,
        className: 'hover:border-cyan-500 hover:shadow-cyan-500/20 data-[state=checked]:border-cyan-500 data-[state=checked]:shadow-cyan-500/50 data-[state=checked]:bg-cyan-500/5',
        iconColor: 'text-cyan-500',
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
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => onChange(option.id)}
                        data-state={isSelected ? 'checked' : 'unchecked'}
                        className={cn(
                            "relative group flex flex-col items-center justify-center p-4 h-32 rounded-xl border-2 border-muted transition-all duration-300 bg-card hover:scale-[1.02] cursor-pointer",
                            option.className
                        )}
                    >
                        <div className={cn(
                            "p-3 rounded-full bg-secondary/50 mb-3 transition-colors group-hover:bg-background",
                            isSelected && "bg-background"
                        )}>
                            <Icon className={cn("w-6 h-6", option.iconColor)} />
                        </div>
                        <div className="text-center">
                            <span className="block font-semibold text-foreground text-sm">
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
                    </button>
                );
            })}
        </div>
    );
};

export default FocusSelector;
