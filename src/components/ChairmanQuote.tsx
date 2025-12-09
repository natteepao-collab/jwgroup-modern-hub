import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';
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
      name: 'คุณชาลิสา กอวรกุล',
      title: 'กรรมการผู้จัดการ',
      image: chalisaImg
    },
    {
      name: 'คุณพรณัชชา กอวรกุล',
      title: 'กรรมการผู้จัดการ',
      image: pornnatchaImg
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
        <div className="max-w-5xl mx-auto">
          {/* Chairman Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Chairman Image */}
            <div 
              className={`flex-shrink-0 transition-all duration-700 delay-200 ${
                inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
              <div className="relative">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
                  <img 
                    src={imageUrl} 
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 scale-110" />
                <div className="absolute inset-0 rounded-full border border-primary/20 scale-125" />
              </div>
            </div>

            {/* Quote Content */}
            <div 
              className={`flex-1 transition-all duration-700 delay-400 ${
                inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              <div className="relative">
                {/* Quote Icon */}
                <Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary/20" />
                
                <blockquote className="text-xl md:text-2xl text-foreground font-light leading-relaxed italic pl-8">
                  "{quote}"
                </blockquote>
                
                <div className="mt-6 pl-8">
                  <div className="text-lg font-semibold text-foreground">{name}</div>
                  <div className="text-muted-foreground">{title}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Managing Directors - Daughters */}
          <div 
            className={`mt-12 transition-all duration-700 delay-600 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex justify-center gap-8 md:gap-16">
              {directors.map((director, index) => (
                <div 
                  key={index}
                  className="text-center group"
                >
                  <div className="relative mb-4">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-3 border-primary/15 shadow-lg mx-auto group-hover:border-primary/30 transition-all duration-300">
                      <img 
                        src={director.image} 
                        alt={director.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {/* Subtle decorative ring */}
                    <div className="absolute inset-0 rounded-full border border-primary/15 scale-110 mx-auto w-28 h-28 md:w-36 md:h-36 left-1/2 -translate-x-1/2" />
                  </div>
                  <div className="text-base font-semibold text-foreground">{director.name}</div>
                  <div className="text-sm text-muted-foreground">{director.title}</div>
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
