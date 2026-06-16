import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  MapPin, Phone, Mail, Clock, Facebook, Linkedin,
  Loader2, User, Tag, MessageSquare, Send,
} from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { SEO } from '@/components/SEO';
import { buildBreadcrumb, localBusinessSchema } from '@/lib/seoSchemas';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/analytics';

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { getContent } = useSiteContent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: t('common.fillRequired'), description: t('common.fillRequiredDesc'), variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', { body: formData });
      if (error) throw error;
      trackEvent('contact_submit', { label: formData.subject || 'general', metadata: { has_phone: !!formData.phone } });
      toast({ title: t('common.sendSuccess'), description: t('common.sendSuccessDesc') });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast({ title: t('common.sendError'), description: t('common.sendErrorDesc'), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const address = getContent('contact_address').content || 'เลขที่ 9 ซอยสรณคมน์ 12 ถนนสรณคมน์ แขวงสีกัน เขตดอนเมือง กรุงเทพมหานคร 10210';
  const phone = getContent('contact_phone').content || '02-566-1111';
  const email = getContent('contact_email').content || 'jwgroupmkt@gmail.com';
  const hours = getContent('contact_hours').content || t('footer.hours');
  const mapSrc = getContent('contact_map').content || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5!2d100.5!3d13.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ1JzAwLjAiTiAxMDDCsDMwJzAwLjAiRQ!5e0!3m2!1sen!2sth!4v1234567890';

  const infoCards = [
    { icon: MapPin, title: t('contact.address'), lines: [address] },
    { icon: Phone, title: t('contact.phone'), lines: [phone, 'LINE: @jwgroup'] },
    { icon: Mail, title: t('contact.email'), lines: [email] },
    { icon: Clock, title: t('contact.businessHours'), lines: [hours] },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <div className="app-page-safe min-h-screen relative overflow-hidden bg-gradient-to-b from-[#fdf7f4] via-[#fbeee7] to-[#fdf7f4]">
      <SEO
        title="ติดต่อ JW Group | ที่อยู่ เบอร์โทร อีเมล สำนักงานใหญ่ดอนเมือง"
        description="ติดต่อ JW Group สำนักงานใหญ่ ดอนเมือง กรุงเทพฯ โทร 02-566-1111 อีเมล jwgroupmkt@gmail.com หรือทักผ่าน LINE @jwgroup สอบถามธุรกิจในเครือและร่วมงานกับเรา"
        canonicalUrl="/contact"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [localBusinessSchema, buildBreadcrumb([{ name: t('contact.title'), path: '/contact' }])],
        }}
      />

      {/* Decorative line corners */}
      <svg className="pointer-events-none absolute top-0 left-0 w-72 h-72 opacity-40" viewBox="0 0 300 300" fill="none">
        <motion.path
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, ease: 'easeInOut' }}
          d="M0,140 Q60,80 140,60 T280,0" stroke="#8B2E2E" strokeWidth="0.8" />
        <circle cx="40" cy="120" r="2" fill="#8B2E2E" />
        <circle cx="140" cy="60" r="2" fill="#8B2E2E" />
        <circle cx="240" cy="20" r="2" fill="#8B2E2E" />
      </svg>
      <svg className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 opacity-40 rotate-180" viewBox="0 0 300 300" fill="none">
        <motion.path
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, ease: 'easeInOut' }}
          d="M0,140 Q60,80 140,60 T280,0" stroke="#8B2E2E" strokeWidth="0.8" />
        <circle cx="40" cy="120" r="2" fill="#8B2E2E" />
        <circle cx="240" cy="20" r="2" fill="#8B2E2E" />
      </svg>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-12 bg-[#8B2E2E]/40" />
            <span className="text-[#8B2E2E] text-lg">✦</span>
            <span className="h-px w-12 bg-[#8B2E2E]/40" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-display text-[#7a1f1f] tracking-wide">
            {t('contact.title')}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="h-px w-10 bg-[#8B2E2E]/40" />
            <p className="text-[#7a1f1f]/70 text-base">{t('contact.subtitle')}</p>
            <span className="h-px w-10 bg-[#8B2E2E]/40" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Info column */}
          <div className="space-y-4">
            {infoCards.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="group relative bg-white rounded-2xl shadow-[0_8px_24px_-12px_rgba(122,31,31,0.15)] hover:shadow-[0_16px_40px_-12px_rgba(122,31,31,0.25)] transition-shadow overflow-hidden"
                >
                  <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#8B2E2E] to-[#5d1414] rounded-l-2xl" />
                  <div className="flex items-center gap-5 p-5 pl-7">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 rounded-full bg-[#8B2E2E]/5 group-hover:bg-[#8B2E2E]/10 transition-colors scale-110" />
                      <div className="relative w-16 h-16 rounded-full border-2 border-[#8B2E2E]/30 flex items-center justify-center group-hover:border-[#8B2E2E] group-hover:rotate-6 transition-all duration-300">
                        <Icon className="w-7 h-7 text-[#8B2E2E]" strokeWidth={1.7} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-[#7a1f1f] mb-1">{item.title}</h3>
                      {item.lines.map((line, idx) => (
                        <p key={idx} className="text-[#3a2424]/80 text-sm leading-relaxed whitespace-pre-line">
                          {item.title === t('contact.phone') && idx === 0 ? (
                            <a href={`tel:${line.replace(/[^0-9+]/g, '')}`} className="hover:text-[#8B2E2E] transition-colors">{line}</a>
                          ) : item.title === t('contact.email') ? (
                            <a href={`mailto:${line}`} className="hover:text-[#8B2E2E] transition-colors">{line}</a>
                          ) : line}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Follow us */}
            <motion.div
              custom={infoCards.length} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="bg-white rounded-2xl shadow-[0_8px_24px_-12px_rgba(122,31,31,0.15)] p-5"
            >
              <h3 className="text-xl font-bold text-[#7a1f1f] mb-3">{t('footer.followUs')}</h3>
              <div className="flex gap-3">
                {[
                  { href: 'https://facebook.com', Icon: Facebook },
                  { href: 'https://linkedin.com', Icon: Linkedin },
                ].map(({ href, Icon }, idx) => (
                  <motion.a
                    key={idx} href={href} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.12, rotate: 6 }} whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-full border-2 border-[#8B2E2E]/30 flex items-center justify-center text-[#8B2E2E] hover:border-[#8B2E2E] hover:bg-[#8B2E2E] hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white rounded-2xl shadow-[0_12px_40px_-12px_rgba(122,31,31,0.2)] p-7 md:p-9 overflow-hidden"
          >
            <span className="absolute left-0 top-6 bottom-6 w-1 bg-[#8B2E2E] rounded-r" />
            <h3 className="text-2xl font-bold text-[#7a1f1f] mb-1 pl-3">{t('contact.sendMessage')}</h3>
            <p className="text-[#3a2424]/70 text-sm mb-6 pl-3">{t('contact.sendMessageDesc')}</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {[
                { icon: User, name: 'name', type: 'text', placeholder: t('contact.form.name'), required: true },
                { icon: Mail, name: 'email', type: 'email', placeholder: t('contact.form.email'), required: true },
                { icon: Phone, name: 'phone', type: 'tel', placeholder: t('contact.form.phone'), required: false },
                { icon: Tag, name: 'subject', type: 'text', placeholder: t('contact.form.subject'), required: false },
              ].map(({ icon: Icon, name, type, placeholder, required }, i) => (
                <motion.div
                  key={name} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                  className="relative group"
                >
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B2E2E]/60 group-focus-within:text-[#8B2E2E] transition-colors" strokeWidth={1.8} />
                  <Input
                    name={name} type={type} required={required}
                    value={formData[name as keyof typeof formData]} onChange={handleChange} placeholder={placeholder}
                    className="h-12 pl-12 bg-[#fdf7f4]/50 border-[#e8d5cc] focus-visible:border-[#8B2E2E] focus-visible:ring-[#8B2E2E]/20 rounded-xl text-[#3a2424] placeholder:text-[#3a2424]/40"
                  />
                </motion.div>
              ))}

              <motion.div
                custom={4} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="relative group"
              >
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#8B2E2E]/60 group-focus-within:text-[#8B2E2E] transition-colors" strokeWidth={1.8} />
                <Textarea
                  name="message" required value={formData.message} onChange={handleChange}
                  placeholder={t('contact.form.message')} rows={5}
                  className="pl-12 pt-3 bg-[#fdf7f4]/50 border-[#e8d5cc] focus-visible:border-[#8B2E2E] focus-visible:ring-[#8B2E2E]/20 rounded-xl text-[#3a2424] placeholder:text-[#3a2424]/40 resize-none"
                />
              </motion.div>

              <motion.div custom={5} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
                <Button
                  type="submit" disabled={isSubmitting} size="lg"
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-[#8B2E2E] to-[#5d1414] hover:from-[#7a1f1f] hover:to-[#4a0f0f] text-white text-base font-semibold shadow-[0_10px_30px_-10px_rgba(122,31,31,0.5)] hover:shadow-[0_14px_40px_-10px_rgba(122,31,31,0.7)] hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t('common.sending')}</>
                  ) : (
                    <><Send className="mr-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" /> {t('contact.form.send')}</>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-10 max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-[0_12px_40px_-12px_rgba(122,31,31,0.2)] bg-white"
        >
          <iframe
            src={mapSrc} width="100%" height="400" style={{ border: 0 }}
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
