import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Facebook, Linkedin, Loader2 } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { SEO } from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { getContent, isLoading } = useSiteContent();
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
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData,
      });
      if (error) throw error;
      toast({ title: t('common.sendSuccess'), description: t('common.sendSuccessDesc') });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast({ title: t('common.sendError'), description: t('common.sendErrorDesc'), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addressContent = getContent('contact_address');
  const phoneContent = getContent('contact_phone');
  const emailContent = getContent('contact_email');
  const hoursContent = getContent('contact_hours');
  const mapContent = getContent('contact_map');

  const address = addressContent.content || t('footer.address');
  const phone = phoneContent.content || '+66 2 XXX XXXX';
  const email = emailContent.content || 'info@jwgroup.com';
  const hours = hoursContent.content || t('footer.hours');
  const mapSrc = mapContent.content || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5!2d100.5!3d13.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ1JzAwLjAiTiAxMDDCsDMwJzAwLjAiRQ!5e0!3m2!1sen!2sth!4v1234567890';

  return (
    <div className="pt-24 min-h-screen bg-background">
      <SEO
        title={t('contact.title')}
        description={t('contact.subtitle')}
        canonicalUrl="/contact"
      />
      <div className="container mx-auto px-4 py-12">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">{t('contact.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t('contact.address')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{address}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  {t('contact.phone')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-primary transition-colors">
                  {phone}
                </a>
                <p>LINE: @jwgroup</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  {t('contact.email')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                  {email}
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  {t('contact.businessHours')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{hours}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('footer.followUs')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                    <Facebook className="h-8 w-8" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                    <Linkedin className="h-8 w-8" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('contact.sendMessage')}</CardTitle>
              <CardDescription>{t('contact.sendMessageDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Input name="name" value={formData.name} onChange={handleChange} placeholder={t('contact.form.name')} className="h-12 text-base" required />
                </div>
                <div>
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t('contact.form.email')} className="h-12 text-base" required />
                </div>
                <div>
                  <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder={t('contact.form.phone')} className="h-12 text-base" />
                </div>
                <div>
                  <Input name="subject" value={formData.subject} onChange={handleChange} placeholder={t('contact.form.subject')} className="h-12 text-base" />
                </div>
                <div>
                  <Textarea name="message" value={formData.message} onChange={handleChange} placeholder={t('contact.form.message')} rows={6} className="text-base py-3" required />
                </div>
                <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('common.sending')}</> : t('contact.form.send')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-0">
              <iframe
                src={mapSrc}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
