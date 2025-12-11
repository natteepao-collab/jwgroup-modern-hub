import { useInView } from 'react-intersection-observer';
import { Building, Hotel, Heart, Leaf, Star, Rocket } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '2007',
    title: 'ก่อตั้ง JW Group',
    description: 'เริ่มต้นธุรกิจอสังหาริมทรัพย์ด้วยวิสัยทัศน์ในการสร้างที่อยู่อาศัยคุณภาพสูงสำหรับคนไทย',
    icon: <Building className="w-6 h-6" />,
    highlight: true,
  },
  {
    year: '2012',
    title: 'ขยายสู่ธุรกิจโรงแรม',
    description: 'เปิดตัว 12 The Residence Hotel โรงแรมบูติกหรูใจกลางเมือง',
    icon: <Hotel className="w-6 h-6" />,
  },
  {
    year: '2016',
    title: 'เปิดตัว 3DPet Hospital',
    description: 'ก้าวสู่ธุรกิจสุขภาพสัตว์เลี้ยงด้วยโรงพยาบาลสัตว์มาตรฐานสากล',
    icon: <Heart className="w-6 h-6" />,
  },
  {
    year: '2019',
    title: 'JW Herbal',
    description: 'ขยายธุรกิจสู่ผลิตภัณฑ์เพื่อสุขภาพและความงามจากสมุนไพรไทย',
    icon: <Leaf className="w-6 h-6" />,
  },
  {
    year: '2021',
    title: 'รางวัลความเป็นเลิศ',
    description: 'ได้รับรางวัลองค์กรดีเด่นด้านการพัฒนาอสังหาริมทรัพย์อย่างยั่งยืน',
    icon: <Star className="w-6 h-6" />,
    highlight: true,
  },
  {
    year: '2024',
    title: 'ก้าวสู่อนาคต',
    description: 'มุ่งมั่นพัฒนานวัตกรรมและขยายธุรกิจเพื่อตอบโจทย์ไลฟ์สไตล์ยุคใหม่',
    icon: <Rocket className="w-6 h-6" />,
  },
];

const TimelineItem = ({ 
  event, 
  index, 
  isLeft 
}: { 
  event: TimelineEvent; 
  index: number; 
  isLeft: boolean;
}) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
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
          className={`p-6 rounded-2xl bg-card border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
            event.highlight 
              ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10' 
              : 'border-border/50'
          }`}
        >
          {/* Year Badge */}
          <span 
            className={`inline-block px-3 py-1 text-sm font-bold rounded-full mb-3 ${
              event.highlight 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {event.year}
          </span>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-2">
            {event.title}
          </h3>
          
          {/* Description */}
          <p className="text-muted-foreground">
            {event.description}
          </p>
        </div>
      </div>

      {/* Center Line & Icon */}
      <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex flex-col items-center">
        {/* Icon Circle */}
        <div
          className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
            inView ? 'scale-100' : 'scale-0'
          } ${
            event.highlight 
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
              : 'bg-card border-2 border-primary text-primary'
          }`}
          style={{ transitionDelay: `${index * 100 + 200}ms` }}
        >
          {event.icon}
        </div>
      </div>

      {/* Empty space for opposite side (desktop only) */}
      <div className="hidden md:block md:w-5/12" />
    </div>
  );
};

const CompanyTimeline = () => {
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            เส้นทางแห่งความสำเร็จ
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            จากจุดเริ่มต้นเล็กๆ สู่กลุ่มธุรกิจที่ครบวงจร ร่วมเดินทางไปกับเรา
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent md:-translate-x-1/2" />

          {/* Timeline Events */}
          <div className="space-y-12 md:space-y-16">
            {timelineEvents.map((event, index) => (
              <TimelineItem
                key={index}
                event={event}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyTimeline;
