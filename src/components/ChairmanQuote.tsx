import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';
import chairmanImage from '@/assets/chairman-portrait.jpg';

interface ChairmanQuoteProps {
  quote: string;
  name: string;
  title: string;
  image?: string;
}

export const ChairmanQuote = ({ 
  quote, 
  name, 
  title, 
  image = chairmanImage 
}: ChairmanQuoteProps) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className={`py-20 bg-accent/10 transition-all duration-1000 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
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
                    src={image} 
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
        </div>
      </div>
    </section>
  );
};

export default ChairmanQuote;
