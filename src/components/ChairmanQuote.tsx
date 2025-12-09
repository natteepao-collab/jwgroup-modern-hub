import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Quote, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import chairmanDefault from '@/assets/chairman-portrait.jpg';
import chalisaImg from '@/assets/executives/chalisa-koworakul.jpg';
import pornnatchaImg from '@/assets/executives/pornnatcha-koworakul.jpg';

interface ChairmanQuoteProps {
  quote: string;
  name: string;
  title: string;
}

export const ChairmanQuote = ({ 
  quote, 
  name, 
  title
}: ChairmanQuoteProps) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [imageUrl, setImageUrl] = useState<string>(chairmanDefault);
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const { data, error } = await supabase
          .from('site_images')
          .select('image_url')
          .eq('section_key', 'chairman_portrait')
          .single();

        if (!error && data?.image_url) {
          setImageUrl(data.image_url);
        }
      } catch (error) {
        console.error('Error fetching chairman image:', error);
      }
    };

    fetchImage();
  }, []);

  const directors = [
    {
      id: 'chalisa',
      name: 'คุณชาลิสา กอวรกุล',
      title: 'กรรมการผู้จัดการ',
      image: chalisaImg,
      description: 'บริหารธุรกิจอสังหาริมทรัพย์และโรงแรม'
    },
    {
      id: 'pornnatcha',
      name: 'คุณพรณัชชา กอวรกุล',
      title: 'กรรมการผู้จัดการ',
      image: pornnatchaImg,
      description: 'บริหารธุรกิจสุขภาพและสัตว์เลี้ยง'
    }
  ];

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
            {/* Chairman - Top of Tree */}
            <div 
              className={`flex flex-col items-center transition-all duration-700 delay-200 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
              }`}
            >
              <div 
                className={`relative cursor-pointer group ${
                  hoveredMember === 'chairman' ? 'z-10' : ''
                }`}
                onMouseEnter={() => setHoveredMember('chairman')}
                onMouseLeave={() => setHoveredMember(null)}
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-full bg-primary/20 blur-xl transition-opacity duration-300 ${
                  hoveredMember === 'chairman' ? 'opacity-100 scale-125' : 'opacity-0'
                }`} />
                
                {/* Image container */}
                <div className={`relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 shadow-2xl transition-all duration-500 ${
                  hoveredMember === 'chairman' 
                    ? 'border-primary scale-110 shadow-primary/30' 
                    : 'border-primary/20'
                }`}>
                  <img 
                    src={imageUrl} 
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                {/* Decorative rings */}
                <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
                  hoveredMember === 'chairman' ? 'border-primary/50 scale-[1.15]' : 'border-primary/20 scale-110'
                }`} />
                <div className={`absolute inset-0 rounded-full border transition-all duration-500 ${
                  hoveredMember === 'chairman' ? 'border-primary/30 scale-[1.3]' : 'border-primary/10 scale-125'
                }`} />
              </div>
              
              {/* Chairman Info */}
              <div className={`mt-4 text-center transition-all duration-300 ${
                hoveredMember === 'chairman' ? 'transform scale-105' : ''
              }`}>
                <div className="text-xl font-bold text-foreground">{name}</div>
                <div className="text-primary font-medium">{title}</div>
              </div>

              {/* Quote */}
              <div className={`max-w-2xl mt-6 transition-all duration-500 ${
                hoveredMember === 'chairman' ? 'opacity-100 translate-y-0' : 'opacity-80'
              }`}>
                <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
                  <Quote className="absolute -top-3 -left-3 w-8 h-8 text-primary/40" />
                  <blockquote className="text-lg text-foreground/90 font-light leading-relaxed italic text-center">
                    "{quote}"
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Connecting Lines SVG */}
            <div className={`relative h-20 md:h-24 transition-all duration-700 delay-400 ${
              inView ? 'opacity-100' : 'opacity-0'
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
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="20" to="0" 
                    dur="1s" 
                    fill="freeze"
                  />
                </line>
                
                {/* Horizontal line */}
                <line 
                  x1="100" y1="30" x2="300" y2="30" 
                  className="stroke-primary/40" 
                  strokeWidth="2"
                  strokeDasharray="4 2"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="200" to="0" 
                    dur="1s" 
                    begin="0.3s"
                    fill="freeze"
                  />
                </line>
                
                {/* Left vertical line to daughter 1 */}
                <line 
                  x1="100" y1="30" x2="100" y2="80" 
                  className="stroke-primary/40" 
                  strokeWidth="2"
                  strokeDasharray="4 2"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="50" to="0" 
                    dur="0.5s" 
                    begin="0.6s"
                    fill="freeze"
                  />
                </line>
                
                {/* Right vertical line to daughter 2 */}
                <line 
                  x1="300" y1="30" x2="300" y2="80" 
                  className="stroke-primary/40" 
                  strokeWidth="2"
                  strokeDasharray="4 2"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="50" to="0" 
                    dur="0.5s" 
                    begin="0.6s"
                    fill="freeze"
                  />
                </line>

                {/* Connection points */}
                <circle cx="200" cy="30" r="4" className="fill-primary/60" />
                <circle cx="100" cy="30" r="4" className="fill-primary/60" />
                <circle cx="300" cy="30" r="4" className="fill-primary/60" />
              </svg>
              
              {/* Animated arrow indicator */}
              <div className="absolute left-1/2 top-8 -translate-x-1/2 animate-bounce">
                <ChevronDown className="w-6 h-6 text-primary/50" />
              </div>
            </div>

            {/* Managing Directors - Daughters */}
            <div 
              className={`flex justify-center gap-8 md:gap-24 lg:gap-32 transition-all duration-700 delay-600 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {directors.map((director, index) => (
                <div 
                  key={director.id}
                  className={`text-center group cursor-pointer transition-all duration-500 ${
                    hoveredMember === director.id ? 'z-10' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
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
                        src={director.image} 
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

          </div>
        </div>
      </div>
    </section>
  );
};

export default ChairmanQuote;
