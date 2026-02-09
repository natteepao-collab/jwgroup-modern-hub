import { useEffect, useState, useRef, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { Building, Hotel, Heart, Leaf, Star, Rocket, ChevronDown, ChevronUp, Calendar, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

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
  isHighlighted,
}: { 
  event: TimelineEvent; 
  index: number; 
  isLeft: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  isHighlighted?: boolean;
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
      className={`relative flex flex-col md:flex-row items-start ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Content Card */}
      <div
        className={`w-full md:w-5/12 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'} pl-14 sm:pl-16 md:pl-0 transition-all duration-700 ${
          inView 
            ? 'opacity-100 translate-x-0' 
            : `opacity-0 ${isLeft ? 'md:-translate-x-10' : 'md:translate-x-10'} -translate-x-10`
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div
          onClick={onToggle}
          className={`relative cursor-pointer p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-card border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
            event.is_highlight 
              ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10' 
              : 'border-border/50'
          } ${isExpanded ? 'ring-2 ring-primary/30' : ''} ${
            isHighlighted ? 'animate-highlight-pulse ring-4 ring-primary/50' : ''
          }`}
        >
          {/* Highlight glow effect */}
          {isHighlighted && (
            <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping pointer-events-none" style={{ animationDuration: '1s', animationIterationCount: '2' }} />
          )}
          {/* Year Badge */}
          <div className={`flex items-center gap-2 mb-2 sm:mb-3 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
            <span 
              className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-bold rounded-full ${
                event.is_highlight 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {event.year}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            )}
          </div>
          
          {/* Title */}
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1 sm:mb-2 leading-tight">
            {getTitle()}
          </h3>

          {/* Expanded Content */}
          <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
              {getDescription()}
            </p>
            
            {/* Image */}
            {event.image_url && (
              <div className={`mt-3 sm:mt-4 ${isLeft ? 'md:ml-auto' : ''} group/image`}>
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 max-w-full sm:max-w-[350px]">
                  {/* Image with zoom effect */}
                  <img 
                    src={event.image_url} 
                    alt={getTitle()}
                    className="w-full h-[140px] sm:h-[180px] md:h-[200px] object-cover transform group-hover/image:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
                  {/* Year badge on image */}
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs sm:text-sm font-bold rounded-full shadow-lg">
                    {event.year}
                  </div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/image:translate-x-full transition-transform duration-1000 ease-out" />
                </div>
              </div>
            )}
          </div>

          {/* Preview text when collapsed */}
          {!isExpanded && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1">
              {getDescription()}
            </p>
          )}
        </div>
      </div>

      {/* Center Line & Icon */}
      <div className="absolute left-0 sm:left-2 md:left-1/2 md:-translate-x-1/2 flex flex-col items-center">
        {/* Icon Circle */}
        <div
          onClick={onToggle}
          className={`relative z-10 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ${
            inView ? 'scale-100' : 'scale-0'
          } ${
            event.is_highlight 
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
              : 'bg-card border-2 border-primary text-primary'
          } ${isExpanded ? 'ring-4 ring-primary/20 scale-110' : 'hover:scale-110'}`}
          style={{ transitionDelay: `${index * 100 + 200}ms` }}
        >
          <div className="[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6">{iconMap[event.icon_name] || <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />}</div>
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
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const eventRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  // Get unique years from events
  const uniqueYears = useMemo(() => {
    const years = [...new Set(events.map(e => e.year))];
    return years;
  }, [events]);

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
      setSelectedYear(null);
      setHighlightedEventId(null);
    }
  };

  const jumpToYear = (year: string) => {
    // Open timeline if not already open
    if (!isOpen) {
      setIsOpen(true);
    }
    
    setSelectedYear(year);
    
    // Find first event of that year and expand it
    const eventOfYear = events.find(e => e.year === year);
    if (eventOfYear) {
      setExpandedItems(new Set([eventOfYear.id]));
      setHighlightedEventId(eventOfYear.id);
      
      // Scroll to the event after a short delay to allow timeline to expand
      setTimeout(() => {
        const element = eventRefs.current.get(eventOfYear.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
      
      // Clear highlight after animation completes
      setTimeout(() => {
        setHighlightedEventId(null);
      }, 2500);
    }
  };

  const setEventRef = (id: string, el: HTMLDivElement | null) => {
    if (el) {
      eventRefs.current.set(id, el);
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Section Header - Clickable */}
        <div 
          ref={headerRef}
          onClick={toggleAll}
          className={`text-center mb-6 sm:mb-8 cursor-pointer group transition-all duration-700 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
              เส้นทางแห่งความสำเร็จ
            </h2>
            <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto px-2">
            {isOpen ? 'คลิกที่แต่ละเหตุการณ์เพื่อดูรายละเอียด' : 'คลิกเพื่อดูเส้นทางการเติบโตของ JW Group'}
          </p>
        </div>

        {/* Jump to Year - Improved Mobile Layout */}
        {isOpen && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">ข้ามไปยังปี</span>
            </div>
            
            {/* Mobile: Grid Layout for better display */}
            <div className="block sm:hidden">
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {uniqueYears.slice(0, 6).map((year) => (
                  <button
                    key={year}
                    onClick={() => jumpToYear(year)}
                    className={`px-2 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                      selectedYear === year
                        ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                        : 'bg-card border border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/50'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
              {/* Show more button if there are more years */}
              {uniqueYears.length > 6 && (
                <div className="mt-2 text-center">
                  <ScrollArea className="w-full">
                    <div className="flex justify-center gap-2 pb-2 px-2">
                      {uniqueYears.slice(6).map((year) => (
                        <button
                          key={year}
                          onClick={() => jumpToYear(year)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-300 whitespace-nowrap ${
                            selectedYear === year
                              ? 'bg-primary text-primary-foreground shadow-md'
                              : 'bg-muted/50 text-muted-foreground hover:bg-primary/10'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              )}
            </div>
            
            {/* Tablet & Desktop: Horizontal Scroll */}
            <div className="hidden sm:block">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex justify-center gap-2 pb-3 px-2">
                  {uniqueYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => jumpToYear(year)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        selectedYear === year
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                          : 'bg-card border border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/50'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Timeline Content - Collapsible */}
        <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[8000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {/* Timeline */}
          <div className="relative pt-4 sm:pt-6 md:pt-8">
            {/* Vertical Line */}
            <div className="absolute left-[18px] sm:left-[22px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent md:-translate-x-1/2" />

            {/* Timeline Events */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-12">
              {events.map((event, index) => (
                <div key={event.id} ref={(el) => setEventRef(event.id, el)}>
                  <TimelineItem
                    event={event}
                    index={index}
                    isLeft={index % 2 === 0}
                    isExpanded={expandedItems.has(event.id)}
                    onToggle={() => toggleItem(event.id)}
                    isHighlighted={highlightedEventId === event.id}
                  />
                </div>
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
