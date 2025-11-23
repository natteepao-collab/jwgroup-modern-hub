import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 min-h-screen bg-background">
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
