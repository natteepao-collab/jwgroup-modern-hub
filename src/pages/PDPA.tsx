import { useTranslation } from 'react-i18next';
import { Cookie, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/components/CookieConsent';

const PDPA = () => {
  const { t } = useTranslation();
  const { openCookieSettings } = useCookieConsent();

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{t('footer.pdpa')}</h1>
        
        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">นโยบายการคุ้มครองข้อมูลส่วนบุคคล</h2>
            <p className="text-muted-foreground">
              JW Group ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่าน
              และปฏิบัติตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. ข้อมูลส่วนบุคคลที่เก็บรวบรวม</h2>
            <p className="text-muted-foreground mb-2">
              เราอาจเก็บรวบรวมข้อมูลส่วนบุคคลของท่าน ดังนี้:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>ข้อมูลส่วนตัว เช่น ชื่อ นามสกุล วันเดือนปีเกิด</li>
              <li>ข้อมูลติดต่อ เช่น ที่อยู่ อีเมล เบอร์โทรศัพท์</li>
              <li>ข้อมูลการใช้งานเว็บไซต์</li>
              <li>ข้อมูลการทำธุรกรรม</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
            <p className="text-muted-foreground mb-2">
              เราใช้ข้อมูลส่วนบุคคลของท่านเพื่อ:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>การให้บริการและดำเนินการตามสัญญา</li>
              <li>การปรับปรุงและพัฒนาบริการ</li>
              <li>การติดต่อสื่อสารและการตลาด</li>
              <li>การปฏิบัติตามกฎหมายและข้อบังคับ</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. สิทธิของเจ้าของข้อมูล</h2>
            <p className="text-muted-foreground mb-2">
              ท่านมีสิทธิตามกฎหมาย ดังนี้:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>สิทธิในการเข้าถึงและขอสำเนาข้อมูลส่วนบุคคล</li>
              <li>สิทธิในการขอแก้ไขข้อมูลส่วนบุคคลให้ถูกต้อง</li>
              <li>สิทธิในการขอลบหรือทำลายข้อมูลส่วนบุคคล</li>
              <li>สิทธิในการขอระงับการใช้ข้อมูลส่วนบุคคล</li>
              <li>สิทธิในการคัดค้านการประมวลผลข้อมูลส่วนบุคคล</li>
              <li>สิทธิในการถอนความยินยอม</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. การรักษาความปลอดภัยของข้อมูล</h2>
            <p className="text-muted-foreground">
              เรามีมาตรการรักษาความปลอดภัยทางเทคนิคและองค์กรที่เหมาะสม
              เพื่อป้องกันการสูญหาย การเข้าถึง การใช้ การเปลี่ยนแปลง แก้ไข
              หรือเปิดเผยข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต
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
                  ท่านสามารถจัดการความยินยอมในการใช้คุกกี้ได้ตลอดเวลา 
                  ตามสิทธิในการถอนความยินยอมภายใต้ PDPA
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
            <h2 className="text-2xl font-semibold mb-4">5. การติดต่อ</h2>
            <p className="text-muted-foreground">
              หากท่านมีคำถามหรือต้องการใช้สิทธิตาม PDPA กรุณาติดต่อเราที่:
              <br />
              <strong>เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)</strong>
              <br />
              อีเมล: dpo@jwgroup.com
              <br />
              โทรศัพท์: +66 2 XXX XXXX
              <br />
              ที่อยู่: 123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. การเปลี่ยนแปลงนโยบาย</h2>
            <p className="text-muted-foreground">
              เราอาจปรับปรุงนโยบายนี้เป็นครั้งคราว
              การเปลี่ยนแปลงจะมีผลทันทีที่ประกาศบนเว็บไซต์นี้
              เราขอแนะนำให้ท่านตรวจสอบนโยบายนี้เป็นประจำ
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            <strong>วันที่ปรับปรุงล่าสุด:</strong> 1 มกราคม 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDPA;
