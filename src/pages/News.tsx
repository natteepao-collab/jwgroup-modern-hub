import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { NewsCard } from '@/components/NewsCard';
import realEstate from '@/assets/business-realestate.jpg';
import hotel from '@/assets/business-hotel.jpg';
import pet from '@/assets/business-pet.jpg';

const News = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const allNews = [
    {
      id: '1',
      title: 'JW Group เปิดตัวโครงการอสังหาริมทรัพย์ใหม่มูลค่ากว่า 5,000 ล้านบาท',
      excerpt: 'กลุ่มบริษัท JW Group ประกาศเปิดตัวโครงการอสังหาริมทรัพย์ระดับพรีเมียมใจกลางกรุงเทพฯ พร้อมสิ่งอำนวยความสะดวกครบครันและดีไซน์สมัยใหม่',
      category: t('news.companyNews'),
      date: '2024-01-15',
      image: realEstate,
    },
    {
      id: '2',
      title: '12 The Residence Hotel คว้ารางวัลโรงแรมบูติกยอดเยี่ยม 2024',
      excerpt: 'โรงแรม 12 The Residence ได้รับรางวัลโรงแรมบูติกยอดเยี่ยมแห่งปี 2024 จากสมาคมโรงแรมไทย ด้วยมาตรฐานการบริการที่เป็นเลิศ',
      category: t('news.pressRelease'),
      date: '2024-01-10',
      image: hotel,
    },
    {
      id: '3',
      title: '3DPet Hospital เปิดสาขาใหม่ พร้อมเทคโนโลยีการรักษาสัตว์ล้ำสมัย',
      excerpt: 'โรงพยาบาลสัตว์ 3DPet ขยายสาขาครั้งใหญ่ พร้อมนำเข้าเทคโนโลยีการรักษาสัตว์ระดับโลก เพื่อให้บริการที่ดีที่สุดแก่สัตว์เลี้ยงของคุณ',
      category: t('news.companyNews'),
      date: '2024-01-05',
      image: pet,
    },
    {
      id: '4',
      title: 'JW Group ร่วมกับมหาวิทยาลัยชั้นนำพัฒนาผลิตภัณฑ์สมุนไพร',
      excerpt: 'ความร่วมมือครั้งใหม่ในการวิจัยและพัฒนาผลิตภัณฑ์สมุนไพรและเวลเนส เพื่อสุขภาพที่ดีของคนไทย',
      category: t('news.companyNews'),
      date: '2023-12-28',
      image: realEstate,
    },
    {
      id: '5',
      title: 'JW Group ประกาศนโยบาย ESG และความยั่งยืน',
      excerpt: 'เปิดตัวนโยบาย ESG ฉบับใหม่ มุ่งสู่องค์กรที่ยั่งยืนและเป็นมิตรต่อสิ่งแวดล้อม',
      category: t('news.pressRelease'),
      date: '2023-12-20',
      image: hotel,
    },
    {
      id: '6',
      title: '3DPet Hospital จัดกิจกรรมรับบริจาคเพื่อสัตว์จรจัด',
      excerpt: 'โครงการ CSR ครั้งใหญ่ช่วยเหลือสัตว์จรจัดในชุมชน พร้อมให้บริการรักษาฟรี',
      category: t('news.companyNews'),
      date: '2023-12-15',
      image: pet,
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allNews.map((news, index) => (
            <div
              key={news.id}
              className={`transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <NewsCard {...news} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
