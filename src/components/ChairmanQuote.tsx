import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Quote, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import chairmanDefault from '@/assets/chairman-portrait.jpg';

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

// Department display names + brand-aligned accent classes
const departmentInfo: Record<string, { name: string; accent: string; dot: string }> = {
  real_estate: { name: 'อสังหาริมทรัพย์', accent: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
  hotel: { name: 'โรงแรม', accent: 'text-sky-700 bg-sky-50 border-sky-200', dot: 'bg-sky-500' },
  veterinary: { name: 'สัตวแพทย์', accent: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  wellness: { name: 'สุขภาพ', accent: 'text-rose-700 bg-rose-50 border-rose-200', dot: 'bg-rose-500' },
  finance: { name: 'การเงิน', accent: 'text-yellow-700 bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' },
  hr: { name: 'ทรัพยากรบุคคล', accent: 'text-pink-700 bg-pink-50 border-pink-200', dot: 'bg-pink-500' },
  marketing: { name: 'การตลาด', accent: 'text-indigo-700 bg-indigo-50 border-indigo-200', dot: 'bg-indigo-500' },
  it: { name: 'เทคโนโลยี', accent: 'text-teal-700 bg-teal-50 border-teal-200', dot: 'bg-teal-500' },
};

export const ChairmanQuote = ({
  quote: defaultQuote,
  name: defaultName,
  title: defaultTitle,
}: ChairmanQuoteProps) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const { data, error } = await supabase
          .from('executives')
          .select('*')
          .order('position_order', { ascending: true });

        if (!error && data) {
          // Defensive filter: hide any leftover placeholder rows
          setExecutives(
            (data as Executive[]).filter(
              (e) => e.name && e.name !== 'ผู้จัดการใหม่' && e.title !== 'ตำแหน่ง'
            )
          );
        }
      } catch (error) {
        console.error('Error fetching executives:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExecutives();
  }, []);

  const chairman = executives.find((e) => e.is_chairman);
  const directors = executives.filter((e) => !e.is_chairman && e.level !== 'manager');
  const managers = executives.filter((e) => e.level === 'manager');

  const chairmanName = chairman?.name || defaultName || 'คุณวิสิษฐ กอวรกุล';
  const chairmanTitle = chairman?.title || defaultTitle || 'ประธานกรรมการบริษัท';
  const chairmanQuote =
    chairman?.quote ||
    defaultQuote ||
    'เราเชื่อมั่นในการสร้างธุรกิจที่ยั่งยืน ควบคู่ไปกับการพัฒนาคุณภาพชีวิตของสังคม';
  const chairmanImage = chairman?.image_url || chairmanDefault;

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
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
      className={`py-16 md:py-24 bg-gradient-to-b from-background via-muted/20 to-background transition-all duration-1000 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Intro */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
              <Briefcase className="w-4 h-4" />
              Leadership
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
              คณะผู้บริหาร JW Group
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              ทีมผู้นำที่มีประสบการณ์และวิสัยทัศน์ ขับเคลื่อนทุกธุรกิจในกลุ่ม
            </p>
          </div>

          {/* Chairman — Editorial Layout */}
          <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center bg-card border border-border/50 rounded-3xl p-6 md:p-10 shadow-lg mb-16">
            {/* Portrait */}
            <div className="md:col-span-2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-3 rounded-2xl bg-primary/10" />
                <div className="relative w-48 h-60 md:w-64 md:h-80 rounded-2xl overflow-hidden shadow-xl border border-border/30">
                  <img
                    src={chairmanImage}
                    alt={chairmanName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Quote + Credentials */}
            <div className="md:col-span-3">
              <div className="text-xs uppercase tracking-widest text-primary font-bold mb-3">
                Chairman's Message
              </div>
              <Quote className="w-10 h-10 text-primary/20 mb-2" />
              <blockquote className="text-lg md:text-2xl text-foreground/90 font-light leading-relaxed italic mb-6">
                "{chairmanQuote}"
              </blockquote>
              <div className="border-t border-border/40 pt-5">
                <div className="text-xl md:text-2xl font-bold text-foreground">
                  {chairmanName}
                </div>
                <div className="text-primary font-semibold mt-1">{chairmanTitle}</div>
                {chairman?.description && (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {chairman.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Managing Directors */}
          {directors.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-8">
                <div className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
                  Managing Directors
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  กรรมการผู้จัดการ
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {directors.map((director) => (
                  <div
                    key={director.id}
                    className="group bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-border/40 shadow-sm">
                          {director.image_url ? (
                            <img
                              src={director.image_url}
                              alt={director.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                              {director.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-lg font-bold text-foreground truncate">
                          {director.name}
                        </div>
                        <div className="text-sm text-primary font-medium mt-0.5">
                          {director.title}
                        </div>
                        {director.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {director.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Department Managers — Clean Grid */}
          {managers.length > 0 && (
            <div>
              <div className="text-center mb-8">
                <div className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
                  Department Heads
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  ผู้จัดการแผนก
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  ผู้นำในแต่ละสายงานของกลุ่ม
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {managers.map((manager) => {
                  const dept =
                    departmentInfo[manager.department || ''] || {
                      name: 'แผนกอื่นๆ',
                      accent: 'text-muted-foreground bg-muted border-border',
                      dot: 'bg-muted-foreground',
                    };

                  return (
                    <div
                      key={manager.id}
                      className="group bg-card border border-border/50 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Department badge */}
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] md:text-xs font-semibold mb-4 ${dept.accent}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${dept.dot}`} />
                        {dept.name}
                      </div>

                      {/* Avatar */}
                      <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-full overflow-hidden border border-border/40 shadow-sm bg-muted">
                        {manager.image_url ? (
                          <img
                            src={manager.image_url}
                            alt={manager.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                            {manager.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="text-center">
                        <div className="text-sm md:text-base font-bold text-foreground leading-tight">
                          {manager.name}
                        </div>
                        <div className="text-[11px] md:text-xs text-muted-foreground mt-1 line-clamp-2">
                          {manager.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChairmanQuote;
