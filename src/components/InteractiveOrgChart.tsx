import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from 'react-intersection-observer';

// Import all slides
import slide1 from '@/assets/org-slides/slide-1.jpg';
import slide2 from '@/assets/org-slides/slide-2.jpg';
import slide3 from '@/assets/org-slides/slide-3.jpg';
import slide4 from '@/assets/org-slides/slide-4.jpg';
import slide5 from '@/assets/org-slides/slide-5.jpg';
import slide6 from '@/assets/org-slides/slide-6.jpg';

const InteractiveOrgChart = () => {
  const { i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const slides = [
    { image: slide1, title: 'Cover', titleTh: 'หน้าปก', rotate: true },
    { image: slide2, title: 'Chairman of Executive Board', titleTh: 'ประธานกรรมการบริหาร', rotate: false },
    { image: slide3, title: 'Executive Directors', titleTh: 'กรรมการบริหาร', rotate: false },
    { image: slide4, title: 'Organizational Structure', titleTh: 'โครงสร้างองค์กร', rotate: false },
    { image: slide5, title: 'Management Team', titleTh: 'ทีมผู้บริหาร', rotate: false },
    { image: slide6, title: 'Q&A', titleTh: 'ถาม-ตอบ', rotate: false },
  ];

  const isEnglish = i18n.language === 'en';

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay) {
      interval = setInterval(() => {
        nextSlide();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlay((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide]);

  const SlideViewer = ({ fullscreen = false }: { fullscreen?: boolean }) => (
    <div className={`relative ${fullscreen ? 'h-screen w-screen' : 'aspect-video'} bg-background rounded-2xl overflow-hidden shadow-2xl`}>
      {/* Slide Image */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              index === currentSlide 
                ? 'opacity-100 scale-100 z-10' 
                : 'opacity-0 scale-110 z-0 blur-sm'
            }`}
          >
            <div className={`w-full h-full transition-transform duration-1000 ${
              index === currentSlide ? 'scale-100' : 'scale-105'
            }`}>
              <img
                src={slide.image}
                alt={isEnglish ? slide.title : slide.titleTh}
                className={`w-full h-full object-contain bg-gradient-to-br from-muted/50 to-muted transition-all duration-700 ${slide.rotate ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm shadow-lg h-12 w-12 rounded-full"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm shadow-lg h-12 w-12 rounded-full"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4 md:p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Slide Title */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {isEnglish ? 'Slide' : 'สไลด์'} {currentSlide + 1} / {slides.length}
            </p>
            <h3 className="text-lg md:text-xl font-bold text-foreground">
              {isEnglish ? slides[currentSlide].title : slides[currentSlide].titleTh}
            </h3>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20"
            >
              {isAutoPlay ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            {!fullscreen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(true)}
                className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20"
              >
                <Maximize2 className="h-5 w-5" />
              </Button>
            )}
            {fullscreen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(false)}
                className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? 'w-8 h-2 bg-primary' 
                  : 'w-2 h-2 bg-muted-foreground/40 hover:bg-muted-foreground/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display text-foreground">
            {isEnglish ? 'Organizational Structure' : 'โครงสร้างองค์กร'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isEnglish 
              ? 'JW GROUP Executive Committee - Organization Chart & Management'
              : 'คณะกรรมการบริหาร JW GROUP - แผนภูมิองค์กรและการบริหาร'}
          </p>
        </div>

        {/* Main Slide Viewer */}
        <div className="max-w-5xl mx-auto">
          <SlideViewer />
        </div>

        {/* Thumbnail Navigation */}
        <div className="mt-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentSlide 
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 shadow-lg' 
                    : 'opacity-60 hover:opacity-100 hover:scale-102'
                }`}
              >
                <img
                  src={slide.image}
                  alt={isEnglish ? slide.title : slide.titleTh}
                  className={`w-full h-full object-cover ${slide.rotate ? 'rotate-180' : ''}`}
                />
                <div className={`absolute inset-0 bg-primary/20 transition-opacity ${index === currentSlide ? 'opacity-0' : 'opacity-0 hover:opacity-100'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard Hints */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isEnglish 
              ? '💡 Use arrow keys to navigate, Space to play/pause, F for fullscreen'
              : '💡 ใช้ลูกศรซ้าย-ขวาเพื่อเปลี่ยนสไลด์ | Space เพื่อเล่น/หยุดอัตโนมัติ | คลิกขยายเต็มจอ'}
          </p>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-7xl">
            <SlideViewer fullscreen />
          </div>
        </div>
      )}
    </>
  );
};

export default InteractiveOrgChart;
