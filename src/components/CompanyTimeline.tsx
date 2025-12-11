import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Building, Hotel, Heart, Leaf, Star, Rocket, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface TimelineEvent {
  id: string;
  year: string;
  title_th: string;
  title_en: string | null;
  title_cn: string | null;
  description_th: string | null;
  description_en: string | null;
  description_cn: string | null;
  image_url: string | null;
  icon_name: string;
  is_highlight: boolean;
}

// Mock data for initial display
const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    year: '2550',
    title_th: 'ก่อตั้ง JW Group',
    title_en: 'JW Group Founded',
    title_cn: null,
    description_th: 'เริ่มต้นธุรกิจอสังหาริมทรัพย์ด้วยวิสัยทัศน์ในการสร้างที่อยู่อาศัยคุณภาพสูงสำหรับคนไทย',
    description_en: 'Started real estate business with a vision to create high-quality housing for Thai people',
    description_cn: null,
    image_url: null,
    icon_name: 'building',
    is_highlight: true,
  },
  {
    id: '2',
    year: '2019',
    title_th: 'JW Herbal',
    title_en: 'JW Herbal',
    title_cn: null,
    description_th: 'ขยายธุรกิจสู่ผลิตภัณฑ์เพื่อสุขภาพและความงามจากสมุนไพรไทย',
    description_en: 'Expanded to health and beauty products from Thai herbs',
    description_cn: null,
    image_url: null,
    icon_name: 'leaf',
    is_highlight: false,
  },
  {
    id: '3',
    year: '2020',
    title_th: 'เปิดตัว 3DPet Hospital',
    title_en: 'Launched 3DPet Hospital',
    title_cn: null,
    description_th: 'ก้าวสู่ธุรกิจสุขภาพสัตว์เลี้ยงด้วยโรงพยาบาลสัตว์มาตรฐานสากล',
    description_en: 'Entered pet healthcare business with an international standard animal hospital',
    description_cn: null,
    image_url: null,
    icon_name: 'heart',
    is_highlight: false,
  },
  {
    id: '4',
    year: '2021',
    title_th: 'รางวัลความเป็นเลิศ',
    title_en: 'Excellence Awards',
    title_cn: null,
    description_th: 'ได้รับรางวัลองค์กรดีเด่นด้านการพัฒนาอสังหาริมทรัพย์อย่างยั่งยืน',
    description_en: 'Received excellence award for sustainable real estate development',
    description_cn: null,
    image_url: null,
    icon_name: 'star',
    is_highlight: true,
  },
  {
    id: '5',
    year: '2022',
    title_th: 'ขยายสู่ธุรกิจโรงแรม',
    title_en: 'Expanded to Hotel Business',
    title_cn: null,
    description_th: 'เปิดตัว 12 The Residence Hotel โรงแรมบูติกหรูใจกลางเมือง',
    description_en: 'Launched 12 The Residence Hotel, a luxury boutique hotel in the city center',
    description_cn: null,
    image_url: null,
    icon_name: 'hotel',
    is_highlight: false,
  },
  {
    id: '6',
    year: 'ปัจจุบัน',
    title_th: 'ก้าวสู่อนาคต',
    title_en: 'Stepping into the Future',
    title_cn: null,
    description_th: 'มุ่งมั่นพัฒนานวัตกรรมและขยายธุรกิจเพื่อตอบโจทย์ไลฟ์สไตล์ยุคใหม่',
    description_en: 'Committed to innovation and business expansion for modern lifestyle',
    description_cn: null,
    image_url: null,
    icon_name: 'rocket',
    is_highlight: true,
  },
];

const iconMap: Record<string, React.ReactNode> = {
  building: <Building className="w-6 h-6" />,
  hotel: <Hotel className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
  leaf: <Leaf className="w-6 h-6" />,
  star: <Star className="w-6 h-6" />,
  rocket: <Rocket className="w-6 h-6" />,
};

const TimelineItem = ({ 
  event, 
  index, 
  isLeft,
  isExpanded,
  onToggle,
}: { 
  event: TimelineEvent; 
  index: number; 
  isLeft: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const { i18n } = useTranslation();
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const getTitle = () => {
    const lang = i18n.language;
    if (lang === 'en' && event.title_en) return event.title_en;
    if (lang === 'cn' && event.title_cn) return event.title_cn;
    return event.title_th;
  };

  const getDescription = () => {
    const lang = i18n.language;
    if (lang === 'en' && event.description_en) return event.description_en;
    if (lang === 'cn' && event.description_cn) return event.description_cn;
    return event.description_th;
  };

  return (
    <div
      ref={ref}
      className={`relative flex items-start ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
    >
      {/* Content Card */}
      <div
        className={`w-full md:w-5/12 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'} pl-16 md:pl-0 transition-all duration-700 ${
          inView 
            ? 'opacity-100 translate-x-0' 
            : `opacity-0 ${isLeft ? 'md:-translate-x-10' : 'md:translate-x-10'} -translate-x-10`
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div
          onClick={onToggle}
          className={`cursor-pointer p-6 rounded-2xl bg-card border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
            event.is_highlight 
              ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10' 
              : 'border-border/50'
          } ${isExpanded ? 'ring-2 ring-primary/30' : ''}`}
        >
          {/* Year Badge */}
          <div className={`flex items-center gap-2 mb-3 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
            <span 
              className={`inline-block px-3 py-1 text-sm font-bold rounded-full ${
                event.is_highlight 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {event.year}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-2">
            {getTitle()}
          </h3>

          {/* Expanded Content */}
          <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {/* Description */}
            <p className="text-muted-foreground mb-4">
              {getDescription()}
            </p>
            
            {/* Image */}
            {event.image_url && (
              <div className={`mt-4 ${isLeft ? 'md:ml-auto' : ''}`}>
                <img 
                  src={event.image_url} 
                  alt={getTitle()}
                  className="rounded-xl w-full max-w-[300px] h-auto object-cover shadow-md"
                />
              </div>
            )}
          </div>

          {/* Preview text when collapsed */}
          {!isExpanded && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {getDescription()}
            </p>
          )}
        </div>
      </div>

      {/* Center Line & Icon */}
      <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex flex-col items-center">
        {/* Icon Circle */}
        <div
          onClick={onToggle}
          className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ${
            inView ? 'scale-100' : 'scale-0'
          } ${
            event.is_highlight 
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
              : 'bg-card border-2 border-primary text-primary'
          } ${isExpanded ? 'ring-4 ring-primary/20 scale-110' : 'hover:scale-110'}`}
          style={{ transitionDelay: `${index * 100 + 200}ms` }}
        >
          {iconMap[event.icon_name] || <Calendar className="w-6 h-6" />}
        </div>
      </div>

      {/* Empty space for opposite side (desktop only) */}
      <div className="hidden md:block md:w-5/12" />
    </div>
  );
};

const CompanyTimeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>(mockTimelineEvents);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .eq('is_published', true)
        .order('position_order', { ascending: true });

      if (!error && data && data.length > 0) {
        setEvents(data);
      }
    };

    fetchEvents();
  }, []);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleAll = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Expand first item when opening
      if (events.length > 0) {
        setExpandedItems(new Set([events[0].id]));
      }
    } else {
      setExpandedItems(new Set());
    }
  };

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header - Clickable */}
        <div 
          ref={headerRef}
          onClick={toggleAll}
          className={`text-center mb-8 cursor-pointer group transition-all duration-700 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              เส้นทางแห่งความสำเร็จ
            </h2>
            <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            {isOpen ? 'คลิกที่แต่ละเหตุการณ์เพื่อดูรายละเอียด' : 'คลิกเพื่อดูเส้นทางการเติบโตของ JW Group'}
          </p>
        </div>

        {/* Timeline Content - Collapsible */}
        <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {/* Timeline */}
          <div className="relative pt-8">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent md:-translate-x-1/2" />

            {/* Timeline Events */}
            <div className="space-y-8 md:space-y-12">
              {events.map((event, index) => (
                <TimelineItem
                  key={event.id}
                  event={event}
                  index={index}
                  isLeft={index % 2 === 0}
                  isExpanded={expandedItems.has(event.id)}
                  onToggle={() => toggleItem(event.id)}
                />
              ))}
            </div>
          </div>

          {/* Collapse Button */}
          <div className="text-center mt-12">
            <Button variant="outline" onClick={toggleAll} className="gap-2">
              <ChevronUp className="w-4 h-4" />
              ย่อ Timeline
            </Button>
          </div>
        </div>

        {/* Preview when collapsed */}
        {!isOpen && (
          <div className="flex justify-center gap-4 flex-wrap mt-4">
            {events.slice(0, 4).map((event, index) => (
              <div 
                key={event.id}
                className={`px-4 py-2 rounded-full bg-card border border-border/50 shadow-sm transition-all duration-300 ${
                  headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ transitionDelay: `${index * 100 + 300}ms` }}
              >
                <span className="text-sm font-medium text-primary">{event.year}</span>
                <span className="text-sm text-muted-foreground ml-2">{event.title_th.slice(0, 15)}...</span>
              </div>
            ))}
            {events.length > 4 && (
              <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                +{events.length - 4} เหตุการณ์
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyTimeline;
