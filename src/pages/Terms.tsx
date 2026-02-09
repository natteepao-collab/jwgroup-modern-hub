import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/SEO';

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 min-h-screen bg-background">
      <SEO
        title={t('footer.terms') || "ข้อกำหนดและเงื่อนไข"}
        description="ข้อกำหนดและเงื่อนไขการใช้งานเว็บไซต์ JW Group"
        url="/terms"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{t('footer.terms')}</h1>

        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. การยอมรับข้อกำหนด</h2>
            <p className="text-muted-foreground">
              การเข้าใช้และใช้งานเว็บไซต์นี้ ถือว่าท่านยอมรับและตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขนี้
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. การใช้งานเว็บไซต์</h2>
            <p className="text-muted-foreground">
              ท่านตกลงที่จะใช้เว็บไซต์นี้เพื่อวัตถุประสงค์ที่ถูกต้องตามกฎหมายเท่านั้น
              และจะไม่กระทำการใดๆ ที่ละเมิดสิทธิของผู้อื่นหรือเป็นการผิดกฎหมาย
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. ทรัพย์สินทางปัญญา</h2>
            <p className="text-muted-foreground">
              เนื้อหาทั้งหมดบนเว็บไซต์นี้ รวมถึงข้อความ รูปภาพ โลโก้ และซอฟต์แวร์
              เป็นทรัพย์สินของ JW Group และได้รับการคุ้มครองตามกฎหมายทรัพย์สินทางปัญญา
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. การจำกัดความรับผิด</h2>
            <p className="text-muted-foreground">
              JW Group จะไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดจากการใช้งานเว็บไซต์นี้
              หรือไม่สามารถเข้าใช้งานเว็บไซต์ได้
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. การเปลี่ยนแปลงข้อกำหนด</h2>
            <p className="text-muted-foreground">
              JW Group ขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อกำหนดและเงื่อนไขนี้ได้ตลอดเวลา
              โดยจะแจ้งให้ทราบผ่านเว็บไซต์นี้
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. กฎหมายที่ใช้บังคับ</h2>
            <p className="text-muted-foreground">
              ข้อกำหนดและเงื่อนไขนี้อยู่ภายใต้บังคับของกฎหมายไทย
              และศาลไทยมีเขตอำนาจในการพิจารณาพิพากษาคดีที่เกี่ยวข้อง
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
