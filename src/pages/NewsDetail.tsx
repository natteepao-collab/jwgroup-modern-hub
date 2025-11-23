import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import realEstate from '@/assets/business-realestate.jpg';

const NewsDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  // Mock data - in real app, fetch based on id
  const newsItem = {
    id: id,
    title: 'JW Group เปิดตัวโครงการอสังหาริมทรัพย์ใหม่มูลค่ากว่า 5,000 ล้านบาท',
    category: t('news.companyNews'),
    date: '15 มกราคม 2024',
    image: realEstate,
    content: `
      กลุ่มบริษัท JW Group ประกาศเปิดตัวโครงการอสังหาริมทรัพย์ระดับพรีเมียมใจกลางกรุงเทพฯ 
      มูลค่าโครงการกว่า 5,000 ล้านบาท พร้อมสิ่งอำนวยความสะดวกครบครันและดีไซน์สมัยใหม่

      โครงการนี้ตั้งอยู่ในทำเลศักยภาพสูงใจกลางเมือง ใกล้สถานีรถไฟฟ้า ห้างสรรพสินค้า และสถานที่สำคัญต่างๆ 
      ออกแบบโดยสถาปนิกชื่อดังระดับสากล ด้วยแนวคิด "Modern Luxury Living"

      คุณสมบัติเด่นของโครงการ:
      - ห้องชุดขนาด 1-3 ห้องนอน
      - ส่วนกลางกว่า 3,000 ตารางเมตร
      - สระว่ายน้ำ ฟิตเนส สวนสวย
      - ระบบรักษาความปลอดภัย 24 ชั่วโมง
      - ที่จอดรถเพียงพอ

      นายกฤษฎา ประธานกรรมการบริหาร JW Group กล่าวว่า "โครงการนี้สะท้อนความมุ่งมั่นของเรา
      ในการสร้างสรรค์ที่อยู่อาศัยคุณภาพสูง ตอบโจทย์ไลฟ์สไตล์คนเมืองยุคใหม่"

      เปิดจองวันที่ 1 กุมภาพันธ์ 2024 พร้อมโปรโมชั่นพิเศษสำหรับลูกค้ารายแรก
    `,
  };

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/news" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Link>
        </Button>

        <article className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Badge className="mb-4">{newsItem.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{newsItem.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{newsItem.date}</span>
            </div>
          </div>

          <div className="mb-8">
            <img
              src={newsItem.image}
              alt={newsItem.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="prose max-w-none">
            {newsItem.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-lg mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;
