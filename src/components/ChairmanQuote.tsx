import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import chairmanDefault from '@/assets/chairman-portrait.jpg';

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Parallax mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = (e.clientX - centerX) / rect.width;
      const y = (e.clientY - centerY) / rect.height;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Split quote into sentences for hierarchy
  const highlightQuote = (text: string) => {
    const sentences = text.split(/([。.！!？?])/);
    const result: JSX.Element[] = [];
    
    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i];
      const punctuation = sentences[i + 1] || '';
      
      if (sentence.trim()) {
        // First sentence or sentences with key words get emphasis
        const isEmphasis = i === 0 || sentence.includes('คุณภาพ') || sentence.includes('ใส่ใจ') || sentence.includes('ยึดมั่น');
        
        if (isEmphasis) {
          result.push(
            <span key={i} className="block text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-2">
              {sentence}{punctuation}
            </span>
          );
        } else {
          result.push(
            <span key={i} className="block text-lg md:text-xl text-muted-foreground">
              {sentence}{punctuation}
            </span>
          );
        }
      }
    }
    
    return result;
  };

  return (
    <section
      ref={ref}
      className={`py-24 md:py-32 bg-gradient-to-br from-background via-accent/5 to-background overflow-hidden transition-all duration-1000 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div 
        ref={containerRef}
        className="container mx-auto px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 lg:gap-24">
            {/* Chairman Image - Breaking out of frame */}
            <div 
              className={`flex-shrink-0 relative transition-all duration-700 delay-200 ${
                inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
              style={{
                transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              {/* Background glow effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-full blur-3xl scale-150"
                style={{
                  transform: `translate(${mousePosition.x * -25}px, ${mousePosition.y * -25}px)`,
                }}
              />
              
              {/* Main image container - image breaks out of frame */}
              <div className="relative">
                {/* Decorative rings */}
                <div 
                  className="absolute top-8 left-8 w-56 h-56 md:w-64 md:h-64 rounded-full border-2 border-primary/20"
                  style={{
                    transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
                    transition: 'transform 0.4s ease-out'
                  }}
                />
                <div 
                  className="absolute top-4 left-4 w-56 h-56 md:w-64 md:h-64 rounded-full border border-primary/10"
                  style={{
                    transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`,
                    transition: 'transform 0.5s ease-out'
                  }}
                />
                
                {/* Image that breaks out of frame */}
                <div className="relative w-64 h-72 md:w-72 md:h-80 overflow-visible">
                  {/* Background circle (partial) */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20" />
                  
                  {/* The actual image - positioned to break out */}
                  <img 
                    src={imageUrl} 
                    alt={name}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 md:w-64 h-auto object-cover object-top z-10 drop-shadow-2xl"
                    style={{
                      maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quote Content */}
            <div 
              className={`flex-1 transition-all duration-700 delay-400 ${
                inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              <div className="relative">
                {/* Large floating quote icon with parallax */}
                <div
                  className="absolute -top-8 -left-4 md:-top-12 md:-left-8"
                  style={{
                    transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
                    transition: 'transform 0.3s ease-out'
                  }}
                >
                  <Quote className="w-16 h-16 md:w-24 md:h-24 text-primary/30 fill-primary/10" />
                </div>
                
                {/* Quote text with hierarchy */}
                <blockquote className="relative pl-4 md:pl-8 pt-8 md:pt-12">
                  <div className="space-y-3">
                    {highlightQuote(quote)}
                  </div>
                </blockquote>
                
                {/* Name and title */}
                <div className="mt-8 pl-4 md:pl-8 border-l-4 border-primary/50">
                  <div className="text-xl md:text-2xl font-bold text-foreground">{name}</div>
                  <div className="text-base md:text-lg text-muted-foreground mt-1">{title}</div>
                </div>
                
                {/* Decorative element */}
                <div 
                  className="absolute -bottom-4 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"
                  style={{
                    transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
                    transition: 'transform 0.4s ease-out'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChairmanQuote;
