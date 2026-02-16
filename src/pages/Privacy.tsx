import { useTranslation } from 'react-i18next';
import { Cookie, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/components/CookieConsent';
import { SEO } from '@/components/SEO';

const Privacy = () => {
  const { t } = useTranslation();
  const { openCookieSettings } = useCookieConsent();

  return (
    <div className="pt-24 min-h-screen bg-background">
      <SEO
        title={t('footer.privacy') || "นโยบายความเป็นส่วนตัว"}
        description="นโยบายความเป็นส่วนตัวของ JW Group การเก็บรวบรวม การใช้ และการเปิดเผยข้อมูลส่วนบุคคล"
        canonicalUrl="/privacy"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{t('footer.privacy')}</h1>

        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. การเก็บรวบรวมข้อมูล</h2>
            <p className="text-muted-foreground">
              JW Group เก็บรวบรวมข้อมูลส่วนบุคคลของท่านเพื่อวัตถุประสงค์ในการให้บริการ
              และปรับปรุงประสบการณ์การใช้งานของท่าน
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. การใช้ข้อมูล</h2>
            <p className="text-muted-foreground">
              เราใช้ข้อมูลของท่านเพื่อการให้บริการ การปรับปรุงบริการ การติดต่อสื่อสาร
              และการปฏิบัติตามกฎหมาย
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. การเปิดเผยข้อมูล</h2>
            <p className="text-muted-foreground">
              เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านแก่บุคคลที่สาม
              เว้นแต่จะได้รับความยินยอมจากท่านหรือเป็นไปตามที่กฎหมายกำหนด
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. ความปลอดภัยของข้อมูล</h2>
            <p className="text-muted-foreground">
              เรามีมาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลส่วนบุคคลของท่าน
              จากการสูญหาย การเข้าถึง การใช้ การเปลี่ยนแปลง หรือการเปิดเผยโดยไม่ได้รับอนุญาต
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. สิทธิของเจ้าของข้อมูล</h2>
            <p className="text-muted-foreground">
              ท่านมีสิทธิในการเข้าถึง แก้ไข ลบ หรือจำกัดการใช้ข้อมูลส่วนบุคคลของท่าน
              ตามที่กฎหมายกำหนด
            </p>
          </section>

          {/* Cookie Settings Section */}
          <section className="mt-8 p-6 rounded-2xl bg-muted/50 border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">การตั้งค่าคุกกี้</h2>
                <p className="text-muted-foreground mb-4">
                  ท่านสามารถปรับเปลี่ยนการตั้งค่าคุกกี้ได้ตลอดเวลา
                  เพื่อควบคุมว่าเราจะใช้คุกกี้ประเภทใดบ้างบนเว็บไซต์ของเรา
                </p>
                <Button
                  onClick={openCookieSettings}
                  variant="outline"
                  className="gap-2"
                >
                  <Settings className="w-4 h-4" />
                  ตั้งค่าคุกกี้
                </Button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. การติดต่อ</h2>
            <p className="text-muted-foreground">
              หากท่านมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ กรุณาติดต่อเราที่:
              <br />
              อีเมล: privacy@jwgroup.com
              <br />
              โทรศัพท์: +66 2 XXX XXXX
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
