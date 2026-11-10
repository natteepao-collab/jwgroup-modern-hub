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
        <div className="app-page-safe min-h-screen bg-background text-foreground pb-12 px-4 relative overflow-hidden">
            <SEO
                title={t('premium.title') || "วิเคราะห์ชื่อมงคลขั้นสูง"}
                description="บริการวิเคราะห์ชื่อมงคลขั้นสูง ด้วยศาสตร์ทักษาปกรณ์และเลขศาสตร์ชั้นสูง โดย JW Group"
                canonicalUrl="/premium-search"
                ogImage="/og-premium.jpg"
            />
            <div className="container mx-auto max-w-3xl relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        วิเคราะห์ชื่อมงคลขั้นสูง
                    </h1>
                    <p className="text-muted-foreground">
                        ค้นหาชื่อที่เหมาะสมที่สุดด้วยศาสตร์ทักษาปกรณ์และเลขศาสตร์ชั้นสูง
                        <br />
                        วิเคราะห์เจาะลึกเฉพาะบุคคล ตามวันเวลาเกิดจริง
                    </p>
                </div>

                <Card className="bg-card border-border backdrop-blur-sm shadow-2xl">
                    <CardContent className="p-6 md:p-8 space-y-8">
                        {/* Surname Input */}
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">นามสกุล * (ใช้เพื่อคำนวณความเข้ากันได้)</Label>
                            <Input
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                placeholder="กรอกนามสกุลของคุณ"
                                className="bg-card border-border text-muted-foreground focus:ring-ring focus:border-primary py-6"
                            />
                        </div>

                        {/* Date and Time Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">วันเกิด</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal bg-card border-border text-muted-foreground hover:bg-card hover:text-foreground py-6",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP", { locale: th }) : <span>วัน/เดือน/ปี</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-card border-border text-foreground">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            className="bg-card text-foreground"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-muted-foreground">เวลาเกิด (โดยประมาณ)</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="bg-card border-border text-muted-foreground pl-10 py-6 "
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Gender Selection */}
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">เพศ</Label>
                            <div className="grid grid-cols-2 gap-4 bg-card p-1.5 rounded-lg border border-border">
                                <Button variant="ghost"
                                    type="button"
                                    onClick={() => setSex('male')}
                                    className={cn(
                                        "py-2.5 rounded-md text-sm font-medium transition-all duration-300",
                                        sex === 'male'
                                            ? "bg-card text-foreground shadow-lg"
                                            : "text-muted-foreground hover:text-muted-foreground hover:bg-card"
                                    )}
                                >
                                    ชาย
                                </Button>
                                <Button variant="ghost"
                                    type="button"
                                    onClick={() => setSex('female')}
                                    className={cn(
                                        "py-2.5 rounded-md text-sm font-medium transition-all duration-300",
                                        sex === 'female'
                                            ? "bg-card text-foreground shadow-lg"
                                            : "text-muted-foreground hover:text-muted-foreground hover:bg-card"
                                    )}
                                >
                                    หญิง
                                </Button>
                            </div>
                        </div>

                        {/* Focus Selection - The Hero Component */}
                        <div className="space-y-4">
                            <Label className="text-primary flex items-center gap-2">
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
                                className="w-full min-h-16 h-auto py-4 text-lg font-bold"
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        วิเคราะห์ชื่อมงคล
                                    </div>
                                    <span className="text-xs font-normal opacity-90 px-2 py-0.5 bg-muted rounded-full">
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
