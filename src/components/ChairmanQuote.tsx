import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Quote, ChevronDown, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import chairmanDefault from '@/assets/chairman-portrait.jpg';
import chalisaImg from '@/assets/executives/chalisa-koworakul.jpg';
import pornnatchaImg from '@/assets/executives/pornnatcha-koworakul.jpg';

interface Executive {
  id: string;
  name: string;
  title: string;
  description: string | null;
  image_url: string | null;
  is_chairman: boolean;
  quote: string | null;
  position_order: number;
  department: string | null;
  level: string | null;
}

interface ChairmanQuoteProps {
  quote?: string;
  name?: string;
  title?: string;
}

// Department display names and colors
const departmentInfo: Record<string, { name: string; color: string; icon: string }> = {
  real_estate: { name: 'อสังหาริมทรัพย์', color: 'from-orange-500 to-amber-500', icon: '🏢' },
  hotel: { name: 'โรงแรม', color: 'from-blue-500 to-cyan-500', icon: '🏨' },
  veterinary: { name: 'สัตวแพทย์', color: 'from-green-500 to-emerald-500', icon: '🐾' },
  wellness: { name: 'สุขภาพ', color: 'from-purple-500 to-pink-500', icon: '🌿' },
  finance: { name: 'การเงิน', color: 'from-yellow-500 to-orange-500', icon: '💰' },
  hr: { name: 'ทรัพยากรบุคคล', color: 'from-rose-500 to-red-500', icon: '👥' },
  marketing: { name: 'การตลาด', color: 'from-indigo-500 to-purple-500', icon: '📣' },
  it: { name: 'เทคโนโลยี', color: 'from-teal-500 to-cyan-500', icon: '💻' },
};

export const ChairmanQuote = ({ 
  quote: defaultQuote, 
  name: defaultName, 
  title: defaultTitle
}: ChairmanQuoteProps) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [showDirectors, setShowDirectors] = useState(false);
  const [showManagers, setShowManagers] = useState(false);
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const managersScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const { data, error } = await supabase
          .from('executives')
          .select('*')
          .order('position_order', { ascending: true });

        if (!error && data) {
          setExecutives(data as Executive[]);
        }
      } catch (error) {
        console.error('Error fetching executives:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExecutives();
  }, []);

  // Get chairman, directors, and managers from database
  const chairman = executives.find(e => e.is_chairman);
  const directors = executives.filter(e => !e.is_chairman && e.level !== 'manager');
  const managers = executives.filter(e => e.level === 'manager');

  // Use database data or fallback to props/defaults
  const chairmanName = chairman?.name || defaultName || 'คุณวิสิทธิ์ กอวรกุล';
  const chairmanTitle = chairman?.title || defaultTitle || 'ประธานกรรมการบริษัท';
  const chairmanQuote = chairman?.quote || defaultQuote || 'เราเชื่อมั่นในการสร้างธุรกิจที่ยั่งยืน ควบคู่ไปกับการพัฒนาคุณภาพชีวิตของสังคม';
  const chairmanImage = chairman?.image_url || chairmanDefault;

  // Fallback images for directors if no database image
  const getDirectorImage = (director: Executive, index: number) => {
    if (director.image_url) return director.image_url;
    return index === 0 ? chalisaImg : pornnatchaImg;
  };

  const handleChairmanClick = () => {
    setShowDirectors(!showDirectors);
    if (showDirectors) {
      setShowManagers(false);
    }
  };

  const handleShowManagers = () => {
    setShowManagers(!showManagers);
  };

  const scrollManagers = (direction: 'left' | 'right') => {
    if (managersScrollRef.current) {
      const scrollAmount = 320;
      managersScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className={`py-20 bg-accent/10 transition-all duration-1000 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className={`text-center mb-12 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">ทีมผู้บริหาร</h2>
            <p className="text-muted-foreground">ครอบครัว กอวรกุล</p>
          </div>

          {/* Family Tree Container */}
          <div className="relative">
            {/* Chairman Section with Triangle Button */}
            <div 
              className={`flex items-center justify-center gap-8 transition-all duration-700 delay-200 group/chairman ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
              }`}
              onMouseEnter={() => setHoveredMember('chairman-area')}
              onMouseLeave={() => setHoveredMember(null)}
            >
              {/* Chairman - Top of Tree */}
              <div className="flex flex-col items-center">
                <div 
                  className={`relative cursor-pointer group ${
                    hoveredMember === 'chairman' ? 'z-10' : ''
                  }`}
                  onClick={handleChairmanClick}
                  onMouseEnter={() => setHoveredMember('chairman')}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-300 ${
                    showDirectors 
                      ? 'bg-primary/30 opacity-100 scale-125' 
                      : hoveredMember === 'chairman' 
                        ? 'bg-primary/20 opacity-100 scale-125' 
                        : 'opacity-0'
                  }`} />
                  
                  {/* Image container */}
                  <div className={`relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 shadow-2xl transition-all duration-500 ${
                    showDirectors
                      ? 'border-primary scale-110 shadow-primary/40'
                      : hoveredMember === 'chairman' 
                        ? 'border-primary scale-110 shadow-primary/30' 
                        : 'border-primary/20'
                  }`}>
                    <img 
                      src={chairmanImage} 
                      alt={chairmanName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Click indicator overlay */}
                    {directors.length > 0 && (
                      <div className={`absolute inset-0 bg-primary/10 flex items-center justify-center transition-opacity duration-300 ${
                        !showDirectors && hoveredMember === 'chairman' ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <div className="bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium text-foreground">ดูทีมผู้บริหาร</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Decorative rings */}
                  <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
                    showDirectors || hoveredMember === 'chairman' ? 'border-primary/50 scale-[1.15]' : 'border-primary/20 scale-110'
                  }`} />
                  <div className={`absolute inset-0 rounded-full border transition-all duration-500 ${
                    showDirectors || hoveredMember === 'chairman' ? 'border-primary/30 scale-[1.3]' : 'border-primary/10 scale-125'
                  }`} />
                  
                  {/* Pulse animation when not expanded */}
                  {!showDirectors && directors.length > 0 && (
                    <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping" style={{ animationDuration: '2s' }} />
                  )}
                </div>
                
                {/* Chairman Info */}
                <div className={`mt-4 text-center transition-all duration-300 ${
                  hoveredMember === 'chairman' || showDirectors ? 'transform scale-105' : ''
                }`}>
                  <div className="text-xl font-bold text-foreground">{chairmanName}</div>
                  <div className="text-primary font-medium">{chairmanTitle}</div>
                  {!showDirectors && directors.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2 animate-pulse">คลิกเพื่อดูทีมผู้บริหาร</p>
                  )}
                </div>
              </div>

              {/* Triangle Button for Managers - Hidden until hover */}
              {managers.length > 0 && (
                <div className={`flex flex-col items-center transition-all duration-300 ${
                  hoveredMember === 'chairman-area' || hoveredMember === 'chairman' || showManagers
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-2 pointer-events-none'
                }`}>
                  <button
                    onClick={handleShowManagers}
                    className={`group relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 transition-all duration-300 ${
                      showManagers ? 'scale-105' : 'hover:scale-105'
                    }`}
                    aria-label="ดูทีมผู้จัดการ"
                  >
                    {/* Very subtle background */}
                    <div className={`absolute inset-0 rounded-full border transition-all duration-300 ${
                      showManagers 
                        ? 'bg-foreground/5 border-foreground/20' 
                        : 'bg-transparent border-foreground/10 group-hover:bg-foreground/5 group-hover:border-foreground/15'
                    }`} />
                    
                    {/* Arrow icon - subtle */}
                    <div className={`relative flex items-center justify-center transition-all duration-300 ${
                      showManagers ? 'rotate-90' : ''
                    }`}>
                      <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${
                        showManagers 
                          ? 'text-foreground/60' 
                          : 'text-foreground/30 group-hover:text-foreground/50'
                      }`} />
                    </div>
                  </button>
                  <p className="text-[10px] text-muted-foreground/50 mt-1 text-center">
                    {showManagers ? 'ซ่อน' : 'ดูทีม'}
                  </p>
                </div>
              )}
            </div>

            {/* Quote */}
            <div className={`max-w-2xl mx-auto mt-6 transition-all duration-500 ${
              hoveredMember === 'chairman' ? 'opacity-100 translate-y-0' : 'opacity-80'
            }`}>
              <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
                <Quote className="absolute -top-3 -left-3 w-8 h-8 text-primary/40" />
                <blockquote className="text-lg text-foreground/90 font-light leading-relaxed italic text-center">
                  "{chairmanQuote}"
                </blockquote>
              </div>
            </div>

            {/* Managers Interactive Section */}
            {managers.length > 0 && (
              <div className={`mt-12 transition-all duration-700 overflow-hidden ${
                showManagers ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'
              }`}>
                {/* Section Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">ทีมผู้จัดการแผนก</h3>
                  <p className="text-muted-foreground text-sm">เลื่อนเพื่อดูทั้งหมด</p>
                </div>

                {/* Scroll Navigation */}
                <div className="relative">
                  {/* Left Arrow */}
                  <button
                    onClick={() => scrollManagers('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-background/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                    aria-label="เลื่อนไปทางซ้าย"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  {/* Managers Horizontal Scroll */}
                  <div 
                    ref={managersScrollRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide px-14 py-4 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {managers.map((manager, index) => {
                      const dept = departmentInfo[manager.department || ''] || { 
                        name: 'แผนกอื่นๆ', 
                        color: 'from-gray-500 to-slate-500',
                        icon: '📋'
                      };
                      
                      return (
                        <div
                          key={manager.id}
                          className="flex-shrink-0 w-64 md:w-72 group"
                          style={{
                            animationDelay: `${index * 0.1}s`
                          }}
                        >
                          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full">
                            {/* Department Badge */}
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${dept.color} text-white text-xs font-medium mb-4`}>
                              <span>{dept.icon}</span>
                              <span>{dept.name}</span>
                            </div>

                            {/* Profile Image */}
                            <div className="relative w-24 h-24 mx-auto mb-4">
                              <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${dept.color} opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300`} />
                              <div className="relative w-full h-full rounded-full overflow-hidden border-3 border-border group-hover:border-primary transition-colors duration-300">
                                {manager.image_url ? (
                                  <img 
                                    src={manager.image_url} 
                                    alt={manager.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className={`w-full h-full bg-gradient-to-br ${dept.color} flex items-center justify-center text-white text-3xl`}>
                                    {manager.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Info */}
                            <div className="text-center">
                              <h4 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors duration-300">
                                {manager.name}
                              </h4>
                              <p className="text-primary text-sm font-medium mt-1">
                                {manager.title}
                              </p>
                              {manager.description && (
                                <p className="text-muted-foreground text-xs mt-3 line-clamp-2">
                                  {manager.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={() => scrollManagers('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-background/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                    aria-label="เลื่อนไปทางขวา"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>

                {/* Scroll Indicator Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {managers.map((_, index) => (
                    <div 
                      key={index}
                      className="w-2 h-2 rounded-full bg-primary/30"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Only show directors section if there are directors */}
            {directors.length > 0 && (
              <>
                {/* Connecting Lines SVG - Only show when expanded */}
                <div className={`relative h-20 md:h-24 transition-all duration-700 overflow-hidden ${
                  showDirectors ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0'
                }`}>
                  <svg 
                    className="absolute inset-0 w-full h-full" 
                    viewBox="0 0 400 80" 
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Vertical line from chairman */}
                    <line 
                      x1="200" y1="0" x2="200" y2="30" 
                      className="stroke-primary/40" 
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      style={{
                        strokeDashoffset: showDirectors ? 0 : 20,
                        transition: 'stroke-dashoffset 0.5s ease-out'
                      }}
                    />
                    
                    {/* Horizontal line */}
                    <line 
                      x1="100" y1="30" x2="300" y2="30" 
                      className="stroke-primary/40" 
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      style={{
                        strokeDashoffset: showDirectors ? 0 : 200,
                        transition: 'stroke-dashoffset 0.8s ease-out 0.3s'
                      }}
                    />
                    
                    {/* Left vertical line to director 1 */}
                    <line 
                      x1="100" y1="30" x2="100" y2="80" 
                      className="stroke-primary/40" 
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      style={{
                        strokeDashoffset: showDirectors ? 0 : 50,
                        transition: 'stroke-dashoffset 0.5s ease-out 0.6s'
                      }}
                    />
                    
                    {/* Right vertical line to director 2 */}
                    <line 
                      x1="300" y1="30" x2="300" y2="80" 
                      className="stroke-primary/40" 
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      style={{
                        strokeDashoffset: showDirectors ? 0 : 50,
                        transition: 'stroke-dashoffset 0.5s ease-out 0.6s'
                      }}
                    />

                    {/* Connection points */}
                    <circle cx="200" cy="30" r="4" className="fill-primary/60" style={{
                      opacity: showDirectors ? 1 : 0,
                      transition: 'opacity 0.3s ease-out 0.2s'
                    }} />
                    <circle cx="100" cy="30" r="4" className="fill-primary/60" style={{
                      opacity: showDirectors ? 1 : 0,
                      transition: 'opacity 0.3s ease-out 0.5s'
                    }} />
                    <circle cx="300" cy="30" r="4" className="fill-primary/60" style={{
                      opacity: showDirectors ? 1 : 0,
                      transition: 'opacity 0.3s ease-out 0.5s'
                    }} />
                  </svg>
                  
                  {/* Animated arrow indicator */}
                  <div className={`absolute left-1/2 top-8 -translate-x-1/2 transition-opacity duration-300 ${
                    showDirectors ? 'opacity-100 animate-bounce' : 'opacity-0'
                  }`}>
                    <ChevronDown className="w-6 h-6 text-primary/50" />
                  </div>
                </div>

                {/* Managing Directors */}
                <div 
                  className={`flex justify-center gap-8 md:gap-24 lg:gap-32 transition-all duration-700 overflow-hidden ${
                    showDirectors 
                      ? 'opacity-100 translate-y-0 max-h-96' 
                      : 'opacity-0 -translate-y-10 max-h-0'
                  }`}
                >
                  {directors.map((director, index) => (
                    <div 
                      key={director.id}
                      className={`text-center group cursor-pointer transition-all duration-500 ${
                        hoveredMember === director.id ? 'z-10' : ''
                      }`}
                      style={{ 
                        transitionDelay: showDirectors ? `${0.3 + index * 0.15}s` : '0s',
                        transform: showDirectors ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.9)',
                        opacity: showDirectors ? 1 : 0
                      }}
                      onMouseEnter={() => setHoveredMember(director.id)}
                      onMouseLeave={() => setHoveredMember(null)}
                    >
                      <div className="relative">
                        {/* Glow effect */}
                        <div className={`absolute inset-0 rounded-full bg-primary/20 blur-xl transition-all duration-300 ${
                          hoveredMember === director.id ? 'opacity-100 scale-125' : 'opacity-0'
                        }`} />
                        
                        {/* Image container */}
                        <div className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-3 shadow-lg mx-auto transition-all duration-500 ${
                          hoveredMember === director.id 
                            ? 'border-primary scale-110 shadow-primary/30 shadow-xl' 
                            : 'border-primary/15'
                        }`}>
                          <img 
                            src={getDirectorImage(director, index)} 
                            alt={director.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        
                        {/* Decorative ring */}
                        <div className={`absolute inset-0 rounded-full border transition-all duration-500 mx-auto w-32 h-32 md:w-40 md:h-40 left-1/2 -translate-x-1/2 ${
                          hoveredMember === director.id ? 'border-primary/40 scale-[1.15]' : 'border-primary/15 scale-110'
                        }`} />
                      </div>
                      
                      {/* Info */}
                      <div className={`mt-4 transition-all duration-300 ${
                        hoveredMember === director.id ? 'transform scale-105' : ''
                      }`}>
                        <div className="text-lg font-bold text-foreground">{director.name}</div>
                        <div className="text-primary font-medium text-sm">{director.title}</div>
                        
                        {/* Description - shows on hover */}
                        <div className={`mt-2 text-sm text-muted-foreground transition-all duration-300 overflow-hidden ${
                          hoveredMember === director.id ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          {director.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Collapse hint when expanded */}
                {showDirectors && (
                  <div className="text-center mt-8">
                    <button 
                      onClick={() => setShowDirectors(false)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      คลิกที่รูปประธานเพื่อซ่อน
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChairmanQuote;