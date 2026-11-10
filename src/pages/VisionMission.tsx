import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Hotel, Heart, Leaf, Target, CheckCircle, Sparkles, ChevronDown, Eye, ListChecks, Quote, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { SEO } from '@/components/SEO';
import CorporateLayout from '@/components/CorporateLayout';
import { Button } from '@/components/ui/button';

// Default fallback images
import realEstateImg from '@/assets/business-realestate.jpg';
import hotelImg from '@/assets/business-hotel.jpg';
import petImg from '@/assets/business-pet.jpg';
import herbalImg from '@/assets/business-wellness.jpg';

const businessStyles: Record<string, { icon: React.ElementType; defaultImage: string }> = {
  realestate: { icon: Building2, defaultImage: realEstateImg },
  hotel: { icon: Hotel, defaultImage: hotelImg },
  pet: { icon: Heart, defaultImage: petImg },
  herbal: { icon: Leaf, defaultImage: herbalImg },
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
        image_url: (item as { image_url?: string | null }).image_url || null,
        is_published: item.is_published ?? true
      }));

      return parsed;
    }
  });

  // Get current business data
  const currentData = visionMissions?.find(vm => vm.business_type === activeTab);
  const style = businessStyles[activeTab] || businessStyles.realestate;

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

  const availableBusinessTypes = visionMissions?.map(vm => vm.business_type) || [];

  return (
    <CorporateLayout title={t('visionMission.title')} description={t('visionMission.subtitle')}>
      <SEO title={t('visionMission.title')} description={t('visionMission.subtitle')} canonicalUrl="/vision-mission" />
      {isLoading ? <div role="status" className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="sr-only">{t('common.loading', { defaultValue: 'Loading' })}</span></div> : <>
        <nav aria-label={t('nav.business')} className="mb-8 flex flex-wrap gap-2">
          {Object.keys(businessStyles).filter(key => availableBusinessTypes.includes(key)).map(key => {
            const BusinessIcon = businessStyles[key].icon;
            return <Button key={key} variant={activeTab === key ? 'secondary' : 'ghost'} aria-pressed={activeTab === key}
              className="h-auto min-h-11 whitespace-normal text-left" onClick={() => { setActiveTab(key); setExpandedMission(null); }}>
              <BusinessIcon className="text-primary" />{businessNames[key]}
            </Button>;
          })}
        </nav>
        {currentData ? <>
          <div className="relative mb-10 overflow-hidden corporate-business-image">
            <img src={getImageUrl()} alt={businessNames[activeTab]} className="h-64 w-full object-cover sm:h-80" />
            <div className="absolute bottom-0 inset-x-0 bg-secondary/90 px-5 py-4 text-secondary-foreground">
              <h2 className="text-xl font-bold">{businessNames[activeTab]}</h2>
            </div>
          </div>
          <section className="mb-12 border-b border-border pb-10">
            <h2 className="mb-5 text-2xl font-bold">{t('visionMission.vision')}</h2>
            <blockquote className="border-l-2 border-primary pl-5 text-xl font-medium leading-relaxed text-foreground">
              {getLocalizedText(currentData.vision_th, currentData.vision_en, currentData.vision_cn)}
            </blockquote>
            {(currentData.vision_sub_th || currentData.vision_sub_en) && <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">{getLocalizedText(currentData.vision_sub_th || '', currentData.vision_sub_en, currentData.vision_sub_cn)}</p>}
          </section>
          {currentData.missions.length > 0 && <section className="mb-12">
            <h2 className="mb-5 text-2xl font-bold">{t('visionMission.mission')}</h2>
            {currentData.missions.map((mission, idx) => {
              const expanded = expandedMission === idx;
              return <div key={idx} className="border-b border-border py-3">
                <Button variant="ghost" aria-expanded={expanded} aria-controls={`mission-${idx}`} className="h-auto w-full justify-between whitespace-normal px-0 py-3 text-left text-base font-bold"
                  onClick={() => setExpandedMission(expanded ? null : idx)}>
                  <span>{getLocalizedText(mission.title_th, mission.title_en, mission.title_cn)}</span><ChevronDown className={cn('shrink-0 text-primary transition-transform', expanded && 'rotate-180')} />
                </Button>
                {expanded && <p id={`mission-${idx}`} className="pb-5 text-muted-foreground leading-relaxed">{getLocalizedText(mission.description_th, mission.description_en, mission.description_cn)}</p>}
              </div>;
            })}
          </section>}
          {currentData.core_concept && <section className="border-t border-border py-8">
            <h2 className="mb-5 text-2xl font-bold">{t('visionMissionExtras.coreConcept')}</h2>
            <h3 className="mb-4 text-xl font-bold text-primary">{getLocalizedText(currentData.core_concept.title_th, currentData.core_concept.title_en, currentData.core_concept.title_cn)}</h3>
            <p className="mb-4 leading-relaxed text-foreground">{getLocalizedText(currentData.core_concept.subtitle_th, currentData.core_concept.subtitle_en, currentData.core_concept.subtitle_cn)}</p>
            <p className="leading-relaxed text-muted-foreground">{getLocalizedText(currentData.core_concept.description_th, currentData.core_concept.description_en, currentData.core_concept.description_cn)}</p>
          </section>}
        </> : <p className="py-12 text-muted-foreground">{t('visionMissionExtras.noData')}</p>}
      </>}
    </CorporateLayout>
  );
};

export default VisionMission;
