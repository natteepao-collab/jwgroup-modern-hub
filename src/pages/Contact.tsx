import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  MapPin, Phone, Mail, Clock, Facebook, Youtube,
  Loader2, User, Tag, MessageSquare, Send,
} from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { SEO } from '@/components/SEO';
import { buildBreadcrumb, localBusinessSchema } from '@/lib/seoSchemas';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSocialLinks } from '@/hooks/useSocialLinks';
import { managedPhone } from '@/lib/publicContent';
import { trackEvent } from '@/lib/analytics';
import { requiredContactFields } from '@/lib/applicationValidation';

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const reduceMotion = useReducedMotion();
  const { getContent } = useSiteContent();
  const { links: social } = useSocialLinks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requiredContactFields(formData)) {
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
  const phone = managedPhone(getContent('contact_phone').content)?.display || '';
  const email = getContent('contact_email').content || 'jwgroupmkt@gmail.com';
  const hours = getContent('contact_hours').content || t('footer.hours');
  const mapSrc = getContent('contact_map').content || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5!2d100.5!3d13.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ1JzAwLjAiTiAxMDDCsDMwJzAwLjAiRQ!5e0!3m2!1sen!2sth!4v1234567890';

  const infoCards = [
    { icon: MapPin, title: t('contact.address'), lines: [address] },
    { icon: Phone, title: t('contact.phone'), lines: [phone] },
    { icon: Mail, title: t('contact.email'), lines: [email] },
    { icon: Clock, title: t('contact.businessHours'), lines: [hours] },
  ];

  const fadeUp = {
    hidden: { opacity: 1, y: reduceMotion ? 0 : 12 },
    show: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.08, duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <div className="contact-page app-page-safe min-h-screen bg-background">
      <SEO
        title="ติดต่อ JW Group | ที่อยู่ เบอร์โทร อีเมล สำนักงานใหญ่ดอนเมือง"
        description="ติดต่อ JW Group สำนักงานใหญ่ ดอนเมือง กรุงเทพฯ โทร 02-566-1111 อีเมล jwgroupmkt@gmail.com หรือทักผ่าน LINE @jwgroup สอบถามธุรกิจในเครือและร่วมงานกับเรา"
        canonicalUrl="/contact"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [localBusinessSchema, buildBreadcrumb([{ name: t('contact.title'), path: '/contact' }])],
        }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <header className="public-page-heading mb-10 border-b border-border pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{t('contact.title')}</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">{t('contact.subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-8 lg:gap-16 max-w-6xl mx-auto">
          {/* Info column */}
          <div className="space-y-4">
            {infoCards.filter(item => item.lines.some(Boolean)).map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                  whileHover={reduceMotion ? undefined : { y: -2, transition: { duration: 0.3 } }}
                  className="group relative border-b border-border transition-colors"
                >
                  <div className="flex items-start gap-4 py-5">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors scale-110" />
                      <div className="relative w-12 h-12 rounded-lg border border-border flex items-center justify-center group-hover:border-primary  transition-all duration-300">
                        <Icon className="w-7 h-7 text-primary" strokeWidth={1.7} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-foreground mb-1">{item.title}</h3>
                      {item.lines.map((line, idx) => (
                        <p key={idx} className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                          {item.title === t('contact.phone') && idx === 0 ? (
                            <a href={`tel:${line.replace(/[^0-9+]/g, '')}`} className="hover:text-primary transition-colors">{line}</a>
                          ) : item.title === t('contact.email') ? (
                            <a href={`mailto:${line}`} className="hover:text-primary transition-colors">{line}</a>
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
              className="py-5"
            >
              <h3 className="text-xl font-bold text-foreground mb-3">{t('footer.followUs')}</h3>
              <div className="flex gap-3">
                {[
                  { href: social.facebook, Icon: Facebook, label: 'Facebook' },
                  { href: social.youtube, Icon: Youtube, label: 'YouTube' },
                ].filter(item => item.href).map(({ href, Icon, label }, idx) => (
                  <motion.a
                    key={idx} href={href} aria-label={label} title={label} target="_blank" rel="noopener noreferrer"
                    whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                    className="w-11 h-11 rounded-full border-2 border-border flex items-center justify-center text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={false} viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-card rounded-lg border border-border p-5 sm:p-8"
          >
            <h3 className="text-2xl font-bold text-foreground mb-1 pl-3">{t('contact.sendMessage')}</h3>
            <p className="text-muted-foreground text-sm mb-6 pl-3">{t('contact.sendMessageDesc')}</p>

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
                  <label htmlFor={`contact-${name}`} className="block text-sm font-medium mb-2">{placeholder}{required && <span className="text-primary"> *</span>}</label>
                  <Icon className="absolute left-4 bottom-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={1.8} />
                  <Input
                    id={`contact-${name}`} aria-label={placeholder} name={name} type={type} required={required} autoComplete={name === "name" ? "name" : name === "email" ? "email" : name === "phone" ? "tel" : "off"}
                    value={formData[name as keyof typeof formData]} onChange={handleChange} placeholder={placeholder}
                    className="h-12 pl-12 bg-background border-input focus-visible:border-primary focus-visible:ring-ring/20 rounded-xl text-foreground placeholder:text-muted-foreground"
                  />
                </motion.div>
              ))}

              <motion.div
                custom={4} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="relative group"
              >
                <label htmlFor="contact-message" className="block text-sm font-medium mb-2">{t('contact.form.message')} <span className="text-primary">*</span></label>
                <MessageSquare className="absolute left-4 top-12 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={1.8} />
                <Textarea
                  id="contact-message" aria-label={t('contact.form.message')} name="message" required value={formData.message} onChange={handleChange}
                  placeholder={t('contact.form.message')} rows={5}
                  className="pl-12 pt-3 bg-background border-input focus-visible:border-primary focus-visible:ring-ring/20 rounded-xl text-foreground placeholder:text-muted-foreground resize-none"
                />
              </motion.div>

              <motion.div custom={5} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
                <Button
                  type="submit" disabled={isSubmitting} size="lg"
                  className="w-full min-h-12 h-auto py-3 whitespace-normal text-base font-bold group"
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
          initial={false} viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 max-w-6xl mx-auto overflow-hidden border-t border-border bg-muted"
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
