import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Hotel, Heart, Leaf, Target, CheckCircle, Sparkles, ChevronDown, Eye, ListChecks, Quote, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Default fallback images
import realEstateImg from '@/assets/business-realestate.jpg';
import hotelImg from '@/assets/business-hotel.jpg';
import petImg from '@/assets/business-pet.jpg';
import herbalImg from '@/assets/business-wellness.jpg';

// Business styling constants
const businessStyles: Record<string, {
  icon: React.ElementType;
  color: string;
  lightColor: string;
  bgGradient: string;
  accentColor: string;
  borderColor: string;
  dotColor: string;
  defaultImage: string;
}> = {
  realestate: {
    icon: Building2,
    color: 'from-amber-500 to-orange-600',
    lightColor: 'from-amber-400 to-orange-500',
    bgGradient: 'from-amber-50/80 to-orange-50/80 dark:from-amber-950/50 dark:to-orange-950/50',
    accentColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500',
    dotColor: 'bg-amber-500',
    defaultImage: realEstateImg
  },
  hotel: {
    icon: Hotel,
    color: 'from-gray-700 to-gray-900',
    lightColor: 'from-gray-600 to-gray-800',
    bgGradient: 'from-gray-100/80 to-slate-100/80 dark:from-gray-900/50 dark:to-slate-900/50',
    accentColor: 'text-gray-700 dark:text-gray-300',
    borderColor: 'border-gray-700',
    dotColor: 'bg-gray-700',
    defaultImage: hotelImg
  },
  pet: {
    icon: Heart,
    color: 'from-teal-400 to-emerald-500',
    lightColor: 'from-teal-300 to-emerald-400',
    bgGradient: 'from-teal-50/80 to-emerald-50/80 dark:from-teal-950/50 dark:to-emerald-950/50',
    accentColor: 'text-teal-600 dark:text-teal-400',
    borderColor: 'border-teal-500',
    dotColor: 'bg-teal-500',
    defaultImage: petImg
  },
  herbal: {
    icon: Leaf,
    color: 'from-blue-800 to-indigo-900',
    lightColor: 'from-blue-700 to-indigo-800',
    bgGradient: 'from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50',
    accentColor: 'text-blue-800 dark:text-blue-400',
    borderColor: 'border-blue-800',
    dotColor: 'bg-blue-800',
    defaultImage: herbalImg
  }
};

// Business display names
const businessNames: Record<string, string> = {
  realestate: 'JW Real Estates',
  hotel: '12 The Residence Hotel',
  pet: '3DPet Hospital',
  herbal: 'JW Herbal'
};

interface Mission {
  title_th: string;
  title_en?: string;
  title_cn?: string;
  description_th: string;
  description_en?: string;
  description_cn?: string;
}

interface CoreConcept {
  title_th: string;
  title_en?: string;
  title_cn?: string;
  subtitle_th: string;
  subtitle_en?: string;
  subtitle_cn?: string;
  description_th: string;
  description_en?: string;
  description_cn?: string;
}

interface VisionMissionData {
  id: string;
  business_type: string;
  vision_th: string;
  vision_en: string | null;
  vision_cn: string | null;
  vision_sub_th: string | null;
  vision_sub_en: string | null;
  vision_sub_cn: string | null;
  missions: Mission[];
  core_concept: CoreConcept | null;
  image_url: string | null;
  is_published: boolean;
}

const VisionMission = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('realestate');
  const [expandedMission, setExpandedMission] = useState<number | null>(null);

  // Fetch vision missions from database
  const { data: visionMissions, isLoading } = useQuery({
    queryKey: ['vision-missions-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vision_missions')
        .select('*')
        .eq('is_published', true)
        .order('position_order');

      if (error) throw error;

      // Parse missions from JSON with proper typing
      const parsed: VisionMissionData[] = (data || []).map(item => ({
        id: item.id,
        business_type: item.business_type,
        vision_th: item.vision_th,
        vision_en: item.vision_en,
        vision_cn: item.vision_cn,
        vision_sub_th: item.vision_sub_th,
        vision_sub_en: item.vision_sub_en,
        vision_sub_cn: item.vision_sub_cn,
        missions: Array.isArray(item.missions) ? (item.missions as unknown as Mission[]) : [],
        core_concept: item.core_concept ? (item.core_concept as unknown as CoreConcept) : null,
        image_url: (item as any).image_url || null,
        is_published: item.is_published ?? true
      }));

      return parsed;
    }
  });

  // Get current business data
  const currentData = visionMissions?.find(vm => vm.business_type === activeTab);
  const style = businessStyles[activeTab] || businessStyles.realestate;
  const Icon = style.icon;

  // Get localized text helper
  const getLocalizedText = (th: string, en?: string | null, cn?: string | null) => {
    const lang = i18n.language;
    if (lang === 'en' && en) return en;
    if (lang === 'cn' && cn) return cn;
    return th;
  };

  // Get image URL (from database or fallback)
  const getImageUrl = () => {
    if (currentData?.image_url) {
      return currentData.image_url;
    }
    return style.defaultImage;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const availableBusinessTypes = visionMissions?.map(vm => vm.business_type) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/95" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920')] bg-cover bg-center opacity-15" />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-5">
            <Target className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Vision & Mission</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-display">
            วิสัยทัศน์และพันธกิจ
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            ทิศทางและเป้าหมายการดำเนินธุรกิจของแต่ละกลุ่มธุรกิจในเครือ JW Group
          </p>
        </div>
      </section>

      {/* Business Selector - Horizontal Cards */}
      <section className="py-8 px-4 bg-muted/30 sticky top-16 z-40 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {Object.keys(businessStyles).filter(key => availableBusinessTypes.includes(key)).map((businessKey) => {
              const bStyle = businessStyles[businessKey];
              const BIcon = bStyle.icon;
              const isActive = activeTab === businessKey;
              return (
                <button
                  key={businessKey}
                  onClick={() => {
                    setActiveTab(businessKey);
                    setExpandedMission(null);
                  }}
                  className={cn(
                    "group flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 transition-all duration-300",
                    "hover:shadow-lg hover:-translate-y-0.5",
                    isActive
                      ? `bg-gradient-to-r ${bStyle.color} text-white border-transparent shadow-lg`
                      : "bg-card border-border/50 hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                    isActive ? "bg-white/20" : `bg-gradient-to-br ${bStyle.lightColor}`
                  )}>
                    <BIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className={cn(
                    "font-semibold text-sm",
                    isActive ? "text-white" : "text-foreground"
                  )}>
                    {businessNames[businessKey]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      {currentData && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Business Hero Card */}
            <div className={cn(
              "relative rounded-3xl overflow-hidden mb-12 transition-all duration-500",
              `bg-gradient-to-br ${style.bgGradient}`
            )}>
              {/* Business Image + Info */}
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative h-64 lg:h-auto lg:min-h-[400px]">
                  <img 
                    src={getImageUrl()}
                    alt={businessNames[activeTab]}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent to-black/40"
                  )} />
                  {/* Floating Badge */}
                  <div className={cn(
                    "absolute bottom-6 left-6 flex items-center gap-3 px-5 py-3 rounded-xl backdrop-blur-md",
                    `bg-gradient-to-r ${style.color}`
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                    <span className="text-white font-bold text-lg">{businessNames[activeTab]}</span>
                  </div>
                </div>

                {/* Vision Side */}
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      `bg-gradient-to-br ${style.color}`
                    )}>
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground font-display">วิสัยทัศน์</h2>
                      <p className="text-muted-foreground text-sm">Vision</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Quote className={cn(
                      "absolute -top-2 -left-2 w-8 h-8 opacity-20",
                      style.accentColor
                    )} />
                    <p className={cn(
                      "text-lg md:text-xl leading-relaxed font-medium pl-6",
                      style.accentColor
                    )}>
                      "{getLocalizedText(currentData.vision_th, currentData.vision_en, currentData.vision_cn)}"
                    </p>
                  </div>
                  
                  {(currentData.vision_sub_th || currentData.vision_sub_en) && (
                    <p className="mt-4 text-muted-foreground leading-relaxed pl-6">
                      {getLocalizedText(currentData.vision_sub_th || '', currentData.vision_sub_en, currentData.vision_sub_cn)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Missions Section */}
            {currentData.missions.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    `bg-gradient-to-br ${style.color}`
                  )}>
                    <ListChecks className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground font-display">พันธกิจ</h2>
                    <p className="text-muted-foreground text-sm">Mission ({currentData.missions.length} ข้อ)</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {currentData.missions.map((mission, idx) => {
                    const isExpanded = expandedMission === idx;
                    return (
                      <Card
                        key={idx}
                        className={cn(
                          "border-l-4 transition-all duration-300 cursor-pointer hover:shadow-lg",
                          style.borderColor
                        )}
                        onClick={() => setExpandedMission(isExpanded ? null : idx)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                              `bg-gradient-to-br ${style.color}`
                            )}>
                              <span className="text-white font-bold">{idx + 1}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg text-foreground">
                                  {getLocalizedText(mission.title_th, mission.title_en, mission.title_cn)}
                                </h3>
                                <ChevronDown className={cn(
                                  "w-5 h-5 text-muted-foreground transition-transform",
                                  isExpanded && "rotate-180"
                                )} />
                              </div>
                              {isExpanded && mission.description_th && (
                                <p className="mt-3 text-muted-foreground leading-relaxed">
                                  {getLocalizedText(mission.description_th, mission.description_en, mission.description_cn)}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Core Concept Section */}
            {currentData.core_concept && (
              <div className={cn(
                "relative rounded-3xl overflow-hidden p-8 lg:p-12",
                `bg-gradient-to-br ${style.bgGradient}`
              )}>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      `bg-gradient-to-br ${style.color}`
                    )}>
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground font-display">แนวคิดหลัก</h2>
                      <p className="text-muted-foreground text-sm">Core Concept</p>
                    </div>
                  </div>

                  <div className="text-center max-w-2xl mx-auto">
                    <h3 className={cn(
                      "text-3xl md:text-4xl font-bold mb-3 font-display",
                      style.accentColor
                    )}>
                      {getLocalizedText(
                        currentData.core_concept.title_th,
                        currentData.core_concept.title_en,
                        currentData.core_concept.title_cn
                      )}
                    </h3>
                    <p className="text-lg text-muted-foreground mb-4">
                      {getLocalizedText(
                        currentData.core_concept.subtitle_th,
                        currentData.core_concept.subtitle_en,
                        currentData.core_concept.subtitle_cn
                      )}
                    </p>
                    {currentData.core_concept.description_th && (
                      <p className="text-muted-foreground">
                        {getLocalizedText(
                          currentData.core_concept.description_th,
                          currentData.core_concept.description_en,
                          currentData.core_concept.description_cn
                        )}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* No data fallback */}
      {!currentData && !isLoading && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-muted-foreground">ไม่พบข้อมูลวิสัยทัศน์และพันธกิจ</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default VisionMission;
