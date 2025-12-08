import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
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

  return (
    <section
      ref={ref}
      className={`py-16 md:py-24 bg-background overflow-hidden transition-all duration-1000 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div 
        ref={containerRef}
        className="container mx-auto px-4"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Chairman Image - Breaking out of frame */}
            <div 
              className={`flex-shrink-0 relative transition-all duration-700 delay-200 ${
                inView ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-10 scale-95'
              }`}
              style={{
                transform: `translate(${mousePosition.x * -12}px, ${mousePosition.y * -12}px)`,
                transition: 'transform 0.4s ease-out'
              }}
            >
              {/* Image container - no frame, image breaks out */}
              <div className="relative w-48 h-56 md:w-56 md:h-64">
                <img 
                  src={imageUrl} 
                  alt={name}
                  className="w-full h-full object-cover object-top rounded-2xl shadow-2xl"
                />
              </div>
            </div>

            {/* Quote Content */}
            <div 
              className={`flex-1 transition-all duration-700 delay-400 ${
                inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              <div className="relative">
                {/* Large floating quote mark with parallax */}
                <div
                  className="absolute -top-2 -left-2 md:-top-4 md:-left-4"
                  style={{
                    transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
                    transition: 'transform 0.3s ease-out'
                  }}
                >
                  <span className="text-6xl md:text-8xl font-serif text-primary leading-none select-none">"</span>
                </div>
                
                {/* Quote text with hierarchy */}
                <blockquote className="relative pl-8 md:pl-12 pt-6 md:pt-8">
                  {/* Main emphasized text */}
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-primary leading-snug mb-2">
                    เรายึดมั่นและใส่ใจ
                  </p>
                  <p className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed">
                    กับการเลือกสรร
                    <br />
                    และคัดสรรผลิตผลงาน
                    <br />
                    <span className="font-semibold text-primary">ให้มีคุณภาพ</span>
                  </p>
                </blockquote>
                
                {/* Name and title - aligned right */}
                <div className="mt-6 md:mt-8 pl-8 md:pl-12">
                  <div className="text-base md:text-lg font-bold text-foreground">{name}</div>
                  <div className="text-sm md:text-base text-muted-foreground">{title}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChairmanQuote;
