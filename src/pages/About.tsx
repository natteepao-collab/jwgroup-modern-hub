import { Route, Routes, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInView } from 'react-intersection-observer';

const AboutHistory = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h1 className="text-4xl font-bold mb-6">{t('about.history')}</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          JW Group ก่อตั้งขึ้นในปี 2009 ด้วยวิสัยทัศน์ในการสร้างสรรค์ธุรกิจที่หลากหลายและยั่งยืน เราเริ่มต้นจากธุรกิจอสังหาริมทรัพย์ขนาดเล็ก และเติบโตขึ้นเป็นกลุ่มธุรกิจชั้นนำที่ครอบคลุมหลายอุตสาหกรรม
        </p>
        <p className="text-lg mb-4">
          ตลอดกว่า 15 ปีที่ผ่านมา เราได้ขยายธุรกิจไปสู่โรงแรมหรู โรงพยาบาลสัตว์ และผลิตภัณฑ์เพื่อสุขภาพ ด้วยความมุ่งมั่นในการนำเสนอคุณภาพและนวัตกรรมที่เหนือกว่า
        </p>
      </div>
    </div>
  );
};

const AboutVision = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h1 className="text-4xl font-bold mb-6">{t('about.vision')}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>วิสัยทัศน์</CardTitle>
          </CardHeader>
          <CardContent>
            <p>เป็นกลุ่มธุรกิจชั้นนำที่สร้างสรรค์นวัตกรรมและคุณค่าที่ยั่งยืนให้กับสังคม</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>พันธกิจ</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>นำเสนอผลิตภัณฑ์และบริการคุณภาพสูง</li>
              <li>พัฒนานวัตกรรมอย่างต่อเนื่อง</li>
              <li>สร้างคุณค่าให้กับลูกค้าและสังคม</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AboutStructure = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h1 className="text-4xl font-bold mb-6">{t('about.structure')}</h1>
      <p className="text-lg mb-6">โครงสร้างองค์กรของ JW Group ประกอบด้วยธุรกิจหลัก 4 สายงาน</p>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>JW Real Estates</CardTitle>
            <CardDescription>อสังหาริมทรัพย์</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>12 The Residence Hotel</CardTitle>
            <CardDescription>โรงแรมและการบริการ</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>3DPet Hospital & Hotel</CardTitle>
            <CardDescription>สัตวแพทย์และดูแลสัตว์เลี้ยง</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>JW Herbal & Wellness</CardTitle>
            <CardDescription>สมุนไพรและสุขภาพ</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

const AboutTeam = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h1 className="text-4xl font-bold mb-6">{t('about.team')}</h1>
      <p className="text-lg mb-8">ทีมผู้บริหารของเราประกอบด้วยผู้เชี่ยวชาญที่มีประสบการณ์กว่า 20 ปีในแต่ละอุตสาหกรรม</p>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>ผู้บริหาร {i}</CardTitle>
              <CardDescription>ตำแหน่ง</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">ประสบการณ์และความเชี่ยวชาญในอุตสาหกรรม</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AboutAwards = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h1 className="text-4xl font-bold mb-6">{t('about.awards')}</h1>
      <div className="space-y-6">
        {[
          { year: '2024', award: 'รางวัลบริษัทดีเด่นแห่งปี' },
          { year: '2023', award: 'รางวัลนวัตกรรมธุรกิจอสังหาริมทรัพย์' },
          { year: '2022', award: 'รางวัลโรงแรมบูติกยอดเยี่ยม' },
        ].map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">{item.year}</CardTitle>
              <CardDescription className="text-lg">{item.award}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex flex-wrap gap-2 text-sm">
          <Link to="/about/history" className="text-primary hover:underline">{t('about.history')}</Link>
          <span>•</span>
          <Link to="/about/vision" className="text-primary hover:underline">{t('about.vision')}</Link>
          <span>•</span>
          <Link to="/about/structure" className="text-primary hover:underline">{t('about.structure')}</Link>
          <span>•</span>
          <Link to="/about/team" className="text-primary hover:underline">{t('about.team')}</Link>
          <span>•</span>
          <Link to="/about/awards" className="text-primary hover:underline">{t('about.awards')}</Link>
        </div>

        <Routes>
          <Route path="history" element={<AboutHistory />} />
          <Route path="vision" element={<AboutVision />} />
          <Route path="structure" element={<AboutStructure />} />
          <Route path="team" element={<AboutTeam />} />
          <Route path="awards" element={<AboutAwards />} />
          <Route path="*" element={<AboutHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default About;
