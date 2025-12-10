import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Facebook, Linkedin } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

const Contact = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { getContent, isLoading } = useSiteContent();

  // Get contact data from database
  const addressContent = getContent('contact_address');
  const phoneContent = getContent('contact_phone');
  const emailContent = getContent('contact_email');
  const hoursContent = getContent('contact_hours');
  const mapContent = getContent('contact_map');

  // Fallback values
  const address = addressContent.content || '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110';
  const phone = phoneContent.content || '+66 2 XXX XXXX';
  const email = emailContent.content || 'info@jwgroup.com';
  const hours = hoursContent.content || 'จันทร์ - ศุกร์: 08:30 - 17:30';
  const mapSrc = mapContent.content || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5!2d100.5!3d13.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ1JzAwLjAiTiAxMDDCsDMwJzAwLjAiRQ!5e0!3m2!1sen!2sth!4v1234567890';

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">{t('contact.title')}</h1>
          <p className="text-lg text-muted-foreground">
            เราพร้อมรับฟังและให้บริการคุณ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
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
                <a 
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-primary transition-colors"
                >
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
                <a 
                  href={`mailto:${email}`}
                  className="hover:text-primary transition-colors"
                >
                  {email}
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  เวลาทำการ
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
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <Facebook className="h-8 w-8" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <Linkedin className="h-8 w-8" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>ส่งข้อความถึงเรา</CardTitle>
              <CardDescription>กรอกข้อมูลด้านล่างและเราจะติดต่อกลับโดยเร็ว</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div>
                  <Input placeholder={t('contact.form.name')} className="h-12 text-base" />
                </div>
                <div>
                  <Input type="email" placeholder={t('contact.form.email')} className="h-12 text-base" />
                </div>
                <div>
                  <Input type="tel" placeholder={t('contact.form.phone')} className="h-12 text-base" />
                </div>
                <div>
                  <Input placeholder={t('contact.form.subject')} className="h-12 text-base" />
                </div>
                <div>
                  <Textarea placeholder={t('contact.form.message')} rows={6} className="text-base py-3" />
                </div>
                <Button className="w-full" size="lg">
                  {t('contact.form.send')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
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
