import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Facebook, Linkedin } from 'lucide-react';

const Contact = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h1>
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
                <p>123 ถนนสุขุมวิท แขวงคลองเตย</p>
                <p>เขตคลองเตย กรุงเทพมหานคร 10110</p>
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
                <p>+66 2 XXX XXXX</p>
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
                <p>info@jwgroup.com</p>
                <p>support@jwgroup.com</p>
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
              <form className="space-y-4">
                <div>
                  <Input placeholder={t('contact.form.name')} />
                </div>
                <div>
                  <Input type="email" placeholder={t('contact.form.email')} />
                </div>
                <div>
                  <Input type="tel" placeholder={t('contact.form.phone')} />
                </div>
                <div>
                  <Input placeholder={t('contact.form.subject')} />
                </div>
                <div>
                  <Textarea placeholder={t('contact.form.message')} rows={5} />
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
              <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Google Maps Integration</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
