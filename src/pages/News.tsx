import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { BentoNewsSection } from '@/components/BentoNewsSection';
import realEstate from '@/assets/business-realestate.jpg';
import hotel from '@/assets/business-hotel.jpg';
import pet from '@/assets/business-pet.jpg';
import wellness from '@/assets/business-wellness.jpg';

const News = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const allNews = [
    {
      id: '1',
      title: 'JW Group เปิดตัวโครงการอสังหาริมทรัพย์ใหม่มูลค่ากว่า 5,000 ล้านบาท',
      excerpt: 'กลุ่มบริษัท JW Group ประกาศเปิดตัวโครงการอสังหาริมทรัพย์ระดับพรีเมียมใจกลางกรุงเทพฯ พร้อมสิ่งอำนวยความสะดวกครบครันและดีไซน์สมัยใหม่ ตอบโจทย์ไลฟ์สไตล์คนเมืองยุคใหม่',
      category: t('news.companyNews'),
      categoryType: 'company' as const,
      date: '2024-01-15',
      image: realEstate,
      isVideo: true,
    },
    {
      id: '2',
      title: '12 The Residence Hotel คว้ารางวัลโรงแรมบูติกยอดเยี่ยม 2024',
      excerpt: 'โรงแรม 12 The Residence ได้รับรางวัลโรงแรมบูติกยอดเยี่ยมแห่งปี 2024 จากสมาคมโรงแรมไทย ด้วยมาตรฐานการบริการที่เป็นเลิศ',
      category: t('news.pressRelease'),
      categoryType: 'press' as const,
      date: '2024-01-10',
      image: hotel,
    },
    {
      id: '3',
      title: '3DPet Hospital เปิดสาขาใหม่ พร้อมเทคโนโลยีการรักษาสัตว์ล้ำสมัย',
      excerpt: 'โรงพยาบาลสัตว์ 3DPet ขยายสาขาครั้งใหญ่ พร้อมนำเข้าเทคโนโลยีการรักษาสัตว์ระดับโลก เพื่อให้บริการที่ดีที่สุดแก่สัตว์เลี้ยงของคุณ',
      category: t('news.companyNews'),
      categoryType: 'company' as const,
      date: '2024-01-05',
      image: pet,
    },
    {
      id: '4',
      title: 'JW Group ร่วมกับมหาวิทยาลัยชั้นนำพัฒนาผลิตภัณฑ์สมุนไพร',
      excerpt: 'ความร่วมมือครั้งใหม่ในการวิจัยและพัฒนาผลิตภัณฑ์สมุนไพรและเวลเนส เพื่อสุขภาพที่ดีของคนไทย',
      category: t('news.companyNews'),
      categoryType: 'company' as const,
      date: '2023-12-28',
      image: wellness,
    },
    {
      id: '5',
      title: 'JW Group ประกาศนโยบาย ESG และความยั่งยืน',
      excerpt: 'เปิดตัวนโยบาย ESG ฉบับใหม่ มุ่งสู่องค์กรที่ยั่งยืนและเป็นมิตรต่อสิ่งแวดล้อม',
      category: t('news.pressRelease'),
      categoryType: 'press' as const,
      date: '2023-12-20',
      image: hotel,
    },
    {
      id: '6',
      title: '3DPet Hospital จัดกิจกรรมรับบริจาคเพื่อสัตว์จรจัด',
      excerpt: 'โครงการ CSR ครั้งใหญ่ช่วยเหลือสัตว์จรจัดในชุมชน พร้อมให้บริการรักษาฟรี',
      category: t('news.companyNews'),
      categoryType: 'company' as const,
      date: '2023-12-15',
      image: pet,
    },
    {
      id: '7',
      title: 'JW Real Estate เปิดตัว Station Ramintra โครงการใหม่ล่าสุด',
      excerpt: 'โครงการคอนโดมิเนียมระดับพรีเมียมทำเลรามอินทรา ใกล้รถไฟฟ้าสายสีชมพู',
      category: t('news.companyNews'),
      categoryType: 'company' as const,
      date: '2023-12-10',
      image: realEstate,
    },
    {
      id: '8',
      title: 'JW Herbal เปิดตัวผลิตภัณฑ์สมุนไพรออร์แกนิก',
      excerpt: 'ผลิตภัณฑ์สมุนไพรจากธรรมชาติ 100% ปลอดสารเคมี',
      category: t('news.pressRelease'),
      categoryType: 'press' as const,
      date: '2023-12-05',
      image: wellness,
    },
  ];

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('news.title')}</h1>
          <p className="text-lg text-muted-foreground">
            ติดตามข่าวสารและความเคลื่อนไหวล่าสุดจาก JW Group
          </p>
        </div>

        <BentoNewsSection news={allNews} showFilters={true} />
      </div>
    </div>
  );
};

export default News;
