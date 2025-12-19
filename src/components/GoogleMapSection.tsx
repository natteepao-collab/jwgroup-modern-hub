import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { Button } from '@/components/ui/button';

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
  const googleMapsUrl = "https://maps.app.goo.gl/OfficialJWGroupLink"; // Replace with actual link if available dynamically, or keep static

  return (
    <section className="relative w-full h-[600px] lg:h-[700px] overflow-hidden">
      {/* Full Background Map */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(0%)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="JW Group Location"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Modern Overlay Content */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="container mx-auto h-full px-4 flex items-center justify-center lg:justify-start">

          {/* Glassmorphism Card */}
          <div className="pointer-events-auto max-w-md w-full bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl p-8 overflow-hidden relative group">

            {/* Decorative Top Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-orange-400 to-primary" />

            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                  <MapPin className="h-3 w-3" />
                  Head Office
                </span>
                <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                  {t('contact.location', 'JW GROUP')}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {addressContent.content || t('footer.address')}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-dashed border-foreground/10">
                <div className="flex items-center gap-3 group/item">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors duration-300">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t('contact.phoneTitle', 'เบอร์ติดต่อ')}</div>
                    <a href={`tel:${phoneContent.content?.replace(/\s/g, '') || '+6622345678'}`} className="font-medium hover:text-primary transition-colors">
                      {phoneContent.content || '+66 2 234 5678'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 group/item">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors duration-300">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t('contact.emailTitle', 'อีเมล')}</div>
                    <a href={`mailto:${emailContent.content || 'info@jwgroup.com'}`} className="font-medium hover:text-primary transition-colors">
                      {emailContent.content || 'info@jwgroup.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 group/item">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors duration-300">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t('contact.hoursTitle', 'เวลาทำการ')}</div>
                    <div className="font-medium">{hoursContent.content || t('footer.hours')}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
                  onClick={() => window.open(defaultMapSrc.match(/!1s([^!]+)!/)?.[0] ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('JW Group Head Office')}` : 'https://maps.google.com', '_blank')}
                >
                  <Navigation className="mr-2 h-5 w-5" />
                  {t('contact.getDirections', 'ขอเส้นทาง')}
                  <ExternalLink className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
