import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

export const GoogleMapSection = () => {
  const { t } = useTranslation();
  const { getContent } = useSiteContent();
  
  // Get contact data from database
  const addressContent = getContent('contact_address');
  const phoneContent = getContent('contact_phone');
  const emailContent = getContent('contact_email');
  const hoursContent = getContent('contact_hours');
  const mapContent = getContent('contact_map');

  // Default map URL fallback
  const defaultMapSrc = "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d2738.3039992956906!2d100.5983544271213!3d13.926024549077948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x30e2826bc528edb1%3A0x1a95b4253779ef2c!2sJW%20Group%20Head%20Office!3m2!1d13.9273592!2d100.600054!4m5!1s0x30e2826bc528edb1%3A0x1a95b4253779ef2c!2z4LmA4Lil4LiC4LiX4Li14LmIIDkg4LiL4Lit4Lia4Liq4Lij4LiT4LiE4Lih4LiZ4LmMIDEyIFRoYW5vbiBTb25nIFByYXBoYSwgU2kgS2FuLCBEb24gTXVlYW5nLCBCYW5na29rIDEwMjEw!3m2!1d13.9273592!2d100.600054!5e0!3m2!1sth!2sth!4v1765186944901!5m2!1sth!2sth";
  
  const mapSrc = mapContent.content || defaultMapSrc;

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
                    {addressContent.title || t('contact.addressTitle', 'ที่อยู่')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {addressContent.content || t('footer.address')}
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
                    {phoneContent.title || t('contact.phoneTitle', 'โทรศัพท์')}
                  </h3>
                  <a 
                    href={`tel:${phoneContent.content?.replace(/\s/g, '') || '+6622345678'}`} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {phoneContent.content || '+66 2 234 5678'}
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
                    {emailContent.title || t('contact.emailTitle', 'อีเมล')}
                  </h3>
                  <a 
                    href={`mailto:${emailContent.content || 'info@jwgroup.com'}`} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {emailContent.content || 'info@jwgroup.com'}
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
                    {hoursContent.title || t('contact.hoursTitle', 'เวลาทำการ')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {hoursContent.content || t('footer.hours')}
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
