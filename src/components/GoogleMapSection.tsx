import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const GoogleMapSection = () => {
  const { t } = useTranslation();
  
  // Coordinates: 13.9264, 100.6043136
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3871.5!2d100.6043136!3d13.9264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDU1JzM1LjAiTiAxMDDCsDM2JzE1LjUiRQ!5e0!3m2!1sth!2sth!4v1699999999999!5m2!1sth!2sth";

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-block mb-2">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              {t('contact.sectionLabel', 'Contact Us')}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('contact.mapTitle', 'ติดต่อเรา')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('contact.mapSubtitle', 'พบกับเราที่สำนักงานใหญ่ JW GROUP')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t('contact.addressTitle', 'ที่อยู่')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('footer.address', 'เลขที่ 123 อาคาร JW Tower ชั้น 15 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t('contact.phoneTitle', 'โทรศัพท์')}
                  </h3>
                  <a href="tel:+6622345678" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    +66 2 234 5678
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t('contact.emailTitle', 'อีเมล')}
                  </h3>
                  <a href="mailto:info@jwgroup.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    info@jwgroup.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t('contact.hoursTitle', 'เวลาทำการ')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('footer.hours', 'จันทร์ - ศุกร์: 08:30 - 17:30')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="lg:col-span-2">
            <div className="relative w-full h-[400px] lg:h-full min-h-[400px] rounded-xl overflow-hidden shadow-xl">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="JW Group Location"
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
