import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Testimonial {
  id: string;
  client_name: string;
  client_title: string | null;
  client_company: string | null;
  client_image_url: string | null;
  content_th: string;
  content_en: string | null;
  content_cn: string | null;
  rating: number;
}

// Mock data for initial display
const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    client_name: 'คุณสมศักดิ์ เจริญสุข',
    client_title: 'ผู้จัดการทั่วไป',
    client_company: 'บริษัท ABC จำกัด',
    client_image_url: null,
    content_th: 'ประทับใจมากกับบริการของ JW Group ทีมงานมืออาชีพ ใส่ใจทุกรายละเอียด โครงการมีคุณภาพสูงมาก',
    content_en: 'Very impressed with JW Group\'s service. Professional team, attention to detail, and high-quality projects.',
    content_cn: null,
    rating: 5,
  },
  {
    id: '2',
    client_name: 'คุณวิภา รักษ์ธรรม',
    client_title: 'เจ้าของธุรกิจ',
    client_company: 'ร้าน XYZ',
    client_image_url: null,
    content_th: 'เลือกใช้บริการ 12 The Residence Hotel สำหรับจัดประชุมบริษัท บรรยากาศดี อาหารอร่อย พนักงานบริการดีเยี่ยม',
    content_en: 'Chose 12 The Residence Hotel for our company meeting. Great atmosphere, delicious food, and excellent staff service.',
    content_cn: null,
    rating: 5,
  },
  {
    id: '3',
    client_name: 'คุณนภา สุขใจ',
    client_title: 'เจ้าของสัตว์เลี้ยง',
    client_company: null,
    client_image_url: null,
    content_th: 'พาน้องหมาไปรักษาที่ 3DPet Hospital หมอใจดีมาก ดูแลสัตว์เลี้ยงเหมือนลูกหลานตัวเอง ขอบคุณมากค่ะ',
    content_en: 'Brought my dog to 3DPet Hospital. The doctors are very kind and treat pets like their own family. Thank you so much!',
    content_cn: null,
    rating: 5,
  },
  {
    id: '4',
    client_name: 'คุณประเสริฐ มั่นคง',
    client_title: 'นักลงทุนอสังหาริมทรัพย์',
    client_company: null,
    client_image_url: null,
    content_th: 'ลงทุนกับโครงการของ JW Real Estate มาหลายปี ผลตอบแทนดี โครงการมีคุณภาพ ไว้วางใจได้',
    content_en: 'Invested with JW Real Estate projects for many years. Good returns, quality projects, and trustworthy.',
    content_cn: null,
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const { i18n } = useTranslation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('position_order', { ascending: true });

      if (!error && data && data.length > 0) {
        setTestimonials(data);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const getContent = (testimonial: Testimonial) => {
    const lang = i18n.language;
    if (lang === 'en' && testimonial.content_en) return testimonial.content_en;
    if (lang === 'cn' && testimonial.content_cn) return testimonial.content_cn;
    return testimonial.content_th;
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section ref={ref} className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            เสียงจากลูกค้าของเรา
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ความไว้วางใจจากลูกค้าคือความภาคภูมิใจของเรา
          </p>
        </div>

        {/* Testimonial Card */}
        <div
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="relative bg-card rounded-3xl p-8 md:p-12 shadow-xl border border-border/50">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Quote className="w-6 h-6 text-primary-foreground" />
            </div>

            {/* Content */}
            <div className="mt-4">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < (currentTestimonial?.rating || 5)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 min-h-[80px]">
                "{currentTestimonial && getContent(currentTestimonial)}"
              </p>

              {/* Client Info */}
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 border-2 border-primary/20">
                  <AvatarImage src={currentTestimonial?.client_image_url || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {currentTestimonial?.client_name?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-foreground">
                    {currentTestimonial?.client_name}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {currentTestimonial?.client_title}
                    {currentTestimonial?.client_company && ` - ${currentTestimonial.client_company}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(index);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-primary w-8'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrev}
                  className="rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  className="rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
