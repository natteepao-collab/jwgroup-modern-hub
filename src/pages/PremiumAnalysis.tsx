import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FocusSelector } from '@/components/FocusSelector';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import { th } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SEO } from '@/components/SEO';

const PremiumAnalysis = () => {
    const { t } = useTranslation();
    const [surname, setSurname] = useState('');
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState('');
    const [sex, setSex] = useState<'male' | 'female'>('male');
    const [focus, setFocus] = useState('wealth');

    const handleAnalyze = () => {
        console.log('Analyzing with:', { surname, date, time, sex, focus });
        // Add analysis logic here
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-white py-12 px-4 relative overflow-hidden">
            <SEO
                title={t('premium.title') || "วิเคราะห์ชื่อมงคลขั้นสูง"}
                description="บริการวิเคราะห์ชื่อมงคลขั้นสูง ด้วยศาสตร์ทักษาปกรณ์และเลขศาสตร์ชั้นสูง โดย JW Group"
                url="/premium-analysis"
                image="/og-premium.jpg"
            />
            {/* Background Ambience */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto max-w-3xl relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        Advanced Analysis (PRO)
                    </div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 mb-2">
                        วิเคราะห์ชื่อมงคลขั้นสูง
                    </h1>
                    <p className="text-slate-400">
                        ค้นหาชื่อที่เหมาะสมที่สุดด้วยศาสตร์ทักษาปกรณ์และเลขศาสตร์ชั้นสูง
                        <br />
                        วิเคราะห์เจาะลึกเฉพาะบุคคล ตามวันเวลาเกิดจริง
                    </p>
                </div>

                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-2xl">
                    <CardContent className="p-6 md:p-8 space-y-8">
                        {/* Surname Input */}
                        <div className="space-y-2">
                            <Label className="text-slate-200">นามสกุล * (ใช้เพื่อคำนวณความเข้ากันได้)</Label>
                            <Input
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                placeholder="กรอกนามสกุลของคุณ"
                                className="bg-slate-950/50 border-slate-800 text-slate-200 focus:ring-amber-500/50 focus:border-amber-500/50 py-6"
                            />
                        </div>

                        {/* Date and Time Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-slate-200">วันเกิด</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal bg-slate-950/50 border-slate-800 text-slate-200 hover:bg-slate-900 hover:text-white py-6",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP", { locale: th }) : <span>วัน/เดือน/ปี</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-800 text-white">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            className="bg-slate-900 text-white"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-200">เวลาเกิด (โดยประมาณ)</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                    <Input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="bg-slate-950/50 border-slate-800 text-slate-200 pl-10 py-6 [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Gender Selection */}
                        <div className="space-y-2">
                            <Label className="text-slate-200">เพศ</Label>
                            <div className="grid grid-cols-2 gap-4 bg-slate-950/50 p-1.5 rounded-lg border border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setSex('male')}
                                    className={cn(
                                        "py-2.5 rounded-md text-sm font-medium transition-all duration-300",
                                        sex === 'male'
                                            ? "bg-slate-700 text-white shadow-lg"
                                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                    )}
                                >
                                    ชาย
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSex('female')}
                                    className={cn(
                                        "py-2.5 rounded-md text-sm font-medium transition-all duration-300",
                                        sex === 'female'
                                            ? "bg-slate-700 text-white shadow-lg"
                                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                    )}
                                >
                                    หญิง
                                </button>
                            </div>
                        </div>

                        {/* Focus Selection - The Hero Component */}
                        <div className="space-y-4">
                            <Label className="text-amber-400 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                เรื่องที่เน้นเสริม (FOCUS)
                            </Label>

                            {/* Using our new Premium Component */}
                            <FocusSelector
                                value={focus}
                                onChange={setFocus}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button
                                onClick={handleAnalyze}
                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-8 text-lg rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] border-t border-amber-400/20"
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        วิเคราะห์ชื่อมงคล
                                    </div>
                                    <span className="text-xs font-normal opacity-90 px-2 py-0.5 bg-black/20 rounded-full">
                                        ใช้ 10 Credits
                                    </span>
                                </div>
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PremiumAnalysis;
