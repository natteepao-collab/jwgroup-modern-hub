import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Crown, Sparkles, Award, ChevronRight } from 'lucide-react';
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

export const ChairmanQuote = ({
  quote: defaultQuote,
  name: defaultName,
  title: defaultTitle,
}: ChairmanQuoteProps) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDirector, setActiveDirector] = useState<string | null>(null);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const { data, error } = await supabase
          .from('executives')
          .select('*')
          .order('position_order', { ascending: true });

        if (!error && data) {
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-[#0a1428] via-[#0f1b3d] to-[#0a1428]"
    >
      {/* Ambient luxury background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(212,168,76,0.6) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Intro */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 md:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-amber-400/30 bg-amber-400/5 backdrop-blur-sm mb-6">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                Leadership
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-b from-white via-white to-amber-100/80 bg-clip-text text-transparent">
                คณะผู้บริหาร
              </span>{' '}
              <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                JW Group
              </span>
            </h2>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
            </div>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto font-light">
              วิสัยทัศน์ ประสบการณ์ และความมุ่งมั่น — สามเสาหลักที่ขับเคลื่อน JW Group สู่อนาคต
            </p>
          </motion.div>

          {/* Chairman — Cinematic editorial card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative mb-24 md:mb-32"
          >
            {/* Decorative gold frame */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/40 via-amber-200/20 to-amber-400/40 rounded-[2rem] blur-md opacity-60" />
            <div className="absolute -inset-px bg-gradient-to-br from-amber-400/60 via-transparent to-amber-400/60 rounded-[2rem]" />

            <div className="relative grid md:grid-cols-12 gap-8 md:gap-0 bg-gradient-to-br from-[#0f1b3d] via-[#142554] to-[#0f1b3d] rounded-[2rem] overflow-hidden border border-amber-400/20">
              {/* Portrait Column */}
              <div className="md:col-span-5 relative p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="relative group"
                >
                  {/* Glow */}
                  <div className="absolute -inset-6 bg-gradient-to-br from-amber-400/30 via-amber-300/10 to-amber-500/30 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
                  {/* Gold corner accents */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-amber-400 rounded-tl-xl" />
                  <div className="absolute -top-3 -right-3 w-10 h-10 border-t-2 border-r-2 border-amber-400 rounded-tr-xl" />
                  <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-2 border-l-2 border-amber-400 rounded-bl-xl" />
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-2 border-r-2 border-amber-400 rounded-br-xl" />

                  <div className="relative w-56 h-72 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-amber-400/30">
                    <img
                      src={chairmanImage}
                      alt={chairmanName}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1b3d]/60 via-transparent to-transparent" />

                    {/* Chairman badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-amber-400/40">
                      <Crown className="w-3 h-3 text-amber-300" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200">
                        Chairman
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Content Column */}
              <div className="md:col-span-7 p-8 md:p-14 flex flex-col justify-center relative">
                <div className="flex items-center gap-2 mb-5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-amber-300/90">
                    Chairman's Message
                  </span>
                </div>

                <Quote className="w-14 h-14 text-amber-400/30 mb-3 -ml-2" strokeWidth={1.5} />

                <blockquote className="text-xl md:text-3xl text-white/95 font-light leading-relaxed italic mb-8 font-serif">
                  <span className="text-amber-300/80">"</span>
                  {chairmanQuote}
                  <span className="text-amber-300/80">"</span>
                </blockquote>

                {/* Signature line */}
                <div className="relative pt-6">
                  <div className="absolute top-0 left-0 h-px w-20 bg-gradient-to-r from-amber-400 to-transparent" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1.5 tracking-tight">
                    {chairmanName}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-1 rounded-full bg-amber-400" />
                    <div className="text-amber-300 font-semibold text-sm md:text-base uppercase tracking-wider">
                      {chairmanTitle}
                    </div>
                  </div>
                  {chairman?.description && (
                    <p className="text-sm text-white/60 leading-relaxed max-w-xl font-light">
                      {chairman.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Managing Directors */}
          {directors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="h-px w-10 bg-gradient-to-r from-transparent to-amber-400/60" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-amber-300">
                    Managing Directors
                  </span>
                  <div className="h-px w-10 bg-gradient-to-l from-transparent to-amber-400/60" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  กรรมการผู้จัดการ
                </h3>
                <p className="text-white/50 text-sm md:text-base mt-3 font-light">
                  คลิกที่การ์ดเพื่อดูรายละเอียดเพิ่มเติม
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                {directors.map((director, idx) => {
                  const isActive = activeDirector === director.id;
                  return (
                    <motion.div
                      key={director.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.5 + idx * 0.15 }}
                      onClick={() => setActiveDirector(isActive ? null : director.id)}
                      onHoverStart={() => setActiveDirector(director.id)}
                      className="group relative cursor-pointer"
                    >
                      {/* Gold border glow */}
                      <div
                        className={`absolute -inset-0.5 bg-gradient-to-br from-amber-400/60 via-amber-200/30 to-amber-400/60 rounded-2xl blur transition-opacity duration-500 ${
                          isActive ? 'opacity-100' : 'opacity-30 group-hover:opacity-70'
                        }`}
                      />

                      <div className="relative bg-gradient-to-br from-[#142554] to-[#0f1b3d] border border-amber-400/20 rounded-2xl overflow-hidden">
                        {/* Header with portrait */}
                        <div className="flex items-center gap-5 p-6">
                          <div className="relative flex-shrink-0">
                            <div className="absolute -inset-1 bg-gradient-to-br from-amber-400/50 to-amber-600/50 rounded-2xl blur-sm opacity-70" />
                            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-2 ring-amber-400/40 shadow-xl">
                              {director.image_url ? (
                                <img
                                  src={director.image_url}
                                  alt={director.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-amber-700/20 flex items-center justify-center text-3xl font-bold text-amber-200">
                                  {director.name.charAt(0)}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300/80 mb-1.5">
                              Managing Director
                            </div>
                            <div className="text-xl md:text-2xl font-bold text-white truncate tracking-tight">
                              {director.name}
                            </div>
                            <div className="text-sm text-amber-300 font-medium mt-1">
                              {director.title}
                            </div>
                          </div>

                          <ChevronRight
                            className={`w-5 h-5 text-amber-400/60 transition-transform duration-300 flex-shrink-0 ${
                              isActive ? 'rotate-90' : 'group-hover:translate-x-1'
                            }`}
                          />
                        </div>

                        {/* Expandable description */}
                        <AnimatePresence>
                          {isActive && director.description && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6">
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/30 to-transparent mb-4" />
                                <p className="text-sm text-white/70 leading-relaxed font-light">
                                  {director.description}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Bottom gold accent line */}
                        <div className="h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChairmanQuote;
