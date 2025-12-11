import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Building2, Users, Briefcase, Award } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  labelEn: string;
}

const stats: StatItem[] = [
  {
    icon: <Building2 className="w-8 h-8" />,
    value: 2007,
    suffix: '',
    label: 'ปีที่ก่อตั้ง',
    labelEn: 'Year Founded',
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    value: 50,
    suffix: '+',
    label: 'โครงการที่สำเร็จ',
    labelEn: 'Completed Projects',
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: 10000,
    suffix: '+',
    label: 'ลูกค้าที่ไว้วางใจ',
    labelEn: 'Happy Customers',
  },
  {
    icon: <Award className="w-8 h-8" />,
    value: 15,
    suffix: '+',
    label: 'รางวัลที่ได้รับ',
    labelEn: 'Awards Won',
  },
];

const useCountUp = (end: number, duration: number = 2000, start: boolean = false) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      countRef.current = Math.floor(easeOutQuart * end);
      setCount(countRef.current);

      if (percentage < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      startTimeRef.current = null;
    };
  }, [end, duration, start]);

  return count;
};

const StatCard = ({ stat, index, inView }: { stat: StatItem; index: number; inView: boolean }) => {
  const count = useCountUp(stat.value, 2500, inView);

  return (
    <div
      className={`relative group p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${
        inView ? 'animate-fade-in opacity-100' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Icon */}
      <div className="relative mb-4 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        {stat.icon}
      </div>

      {/* Value */}
      <div className="relative">
        <span className="text-4xl md:text-5xl font-bold text-foreground">
          {stat.value === 2007 ? count : count.toLocaleString()}
        </span>
        <span className="text-3xl md:text-4xl font-bold text-primary">
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <p className="relative mt-2 text-muted-foreground font-medium">
        {stat.label}
      </p>
    </div>
  );
};

const AnimatedStats = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ความสำเร็จของเรา
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ตัวเลขที่บ่งบอกถึงความมุ่งมั่นและความสำเร็จของ JW Group ตลอดระยะเวลาที่ผ่านมา
          </p>
        </div>

        {/* Stats Grid */}
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;
