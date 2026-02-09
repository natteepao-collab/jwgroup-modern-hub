import { useTranslation } from 'react-i18next';
import { Leaf, Recycle, Sun, Droplets, TreePine, Heart, Users, Globe, Target, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';

const Sustainability = () => {
  const { t } = useTranslation();

  const initiatives = [
    {
      icon: Sun,
      title: 'พลังงานสะอาด',
      titleEn: 'Clean Energy',
      description: 'ใช้พลังงานแสงอาทิตย์และพลังงานหมุนเวียนในโครงการต่างๆ',
      descriptionEn: 'Utilizing solar and renewable energy in our projects'
    },
    {
      icon: Recycle,
      title: 'การรีไซเคิล',
      titleEn: 'Recycling',
      description: 'ลดของเสียและส่งเสริมการรีไซเคิลในทุกกระบวนการ',
      descriptionEn: 'Reducing waste and promoting recycling in all processes'
    },
    {
      icon: Droplets,
      title: 'การจัดการน้ำ',
      titleEn: 'Water Management',
      description: 'ระบบบำบัดและนำน้ำกลับมาใช้ใหม่อย่างยั่งยืน',
      descriptionEn: 'Sustainable water treatment and recycling systems'
    },
    {
      icon: TreePine,
      title: 'พื้นที่สีเขียว',
      titleEn: 'Green Spaces',
      description: 'สร้างพื้นที่สีเขียวและสวนในทุกโครงการ',
      descriptionEn: 'Creating green spaces and gardens in all projects'
    }
  ];

  const sdgGoals = [
    { number: 3, title: 'สุขภาพและความเป็นอยู่ที่ดี', color: 'bg-green-500' },
    { number: 7, title: 'พลังงานสะอาด', color: 'bg-yellow-500' },
    { number: 11, title: 'เมืองและชุมชนที่ยั่งยืน', color: 'bg-orange-500' },
    { number: 12, title: 'การบริโภคและผลิตอย่างรับผิดชอบ', color: 'bg-amber-600' },
    { number: 13, title: 'การรับมือกับการเปลี่ยนแปลงสภาพภูมิอากาศ', color: 'bg-emerald-600' },
    { number: 15, title: 'ระบบนิเวศบนบก', color: 'bg-lime-600' }
  ];

  const stats = [
    { value: '40%', label: 'ลดการปล่อยคาร์บอน', labelEn: 'Carbon Reduction' },
    { value: '100+', label: 'ต้นไม้ที่ปลูก', labelEn: 'Trees Planted' },
    { value: '30%', label: 'พลังงานหมุนเวียน', labelEn: 'Renewable Energy' },
    { value: '50%', label: 'ลดการใช้น้ำ', labelEn: 'Water Savings' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t('sustainability.title') || "ความยั่งยืน"}
        description="JW Group มุ่งมั่นสร้างธุรกิจที่เติบโตอย่างยั่งยืน ควบคู่ไปกับการดูแลสิ่งแวดล้อมและสังคม (ESG)"
        url="/sustainability"
      />
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-emerald-800/80 to-teal-900/90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920')] bg-cover bg-center opacity-30" />

        {/* Floating Leaves Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <Leaf
              key={i}
              className="absolute text-green-400/20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                fontSize: `${Math.random() * 40 + 20}px`
              }}
              size={40 + i * 10}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <Leaf className="w-5 h-5 text-green-400" />
            <span className="text-white/90 text-sm font-medium">Sustainable Development</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-display">
            ความยั่งยืน
            <span className="block text-green-400 mt-2">Sustainability</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            JW Group มุ่งมั่นสร้างธุรกิจที่เติบโตอย่างยั่งยืน ควบคู่ไปกับการดูแลสิ่งแวดล้อมและสังคม
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-primary mb-4">
                <Target className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">Our Vision</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-display">
                วิสัยทัศน์ด้านความยั่งยืน
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                เรามุ่งมั่นที่จะเป็นผู้นำในการสร้างธุรกิจที่รับผิดชอบต่อสังคมและสิ่งแวดล้อม
                ผ่านการดำเนินธุรกิจที่โปร่งใส การใช้ทรัพยากรอย่างมีประสิทธิภาพ
                และการสร้างคุณค่าร่วมกันกับชุมชน
              </p>
              <p className="text-muted-foreground leading-relaxed">
                ทุกโครงการของ JW Group ถูกออกแบบโดยคำนึงถึงผลกระทบต่อสิ่งแวดล้อม
                ตั้งแต่การเลือกใช้วัสดุที่เป็นมิตรต่อสิ่งแวดล้อม การออกแบบที่ประหยัดพลังงาน
                ไปจนถึงการสร้างพื้นที่สีเขียวที่ส่งเสริมคุณภาพชีวิต
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800"
                  alt="Sustainability Vision"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <Globe className="w-8 h-8 mb-2" />
                <p className="text-sm font-semibold">Net Zero 2040</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-display">
                  {stat.value}
                </div>
                <p className="text-muted-foreground text-sm md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Leaf className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Our Initiatives</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display">
              โครงการด้านความยั่งยืน
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {initiatives.map((item, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-0">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 font-display">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ESG Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              ESG Framework
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              เราดำเนินธุรกิจตามหลักการ ESG (Environment, Social, Governance)
              เพื่อสร้างคุณค่าอย่างยั่งยืนให้กับผู้มีส่วนได้เสียทุกฝ่าย
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Environment */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-2 bg-green-500" />
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-6">
                  <Leaf className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 font-display">Environment</h3>
                <p className="text-lg font-semibold text-green-600 mb-3">สิ่งแวดล้อม</p>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                    ลดการปล่อยก๊าซเรือนกระจก
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                    ใช้พลังงานหมุนเวียน
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                    บริหารจัดการน้ำอย่างยั่งยืน
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                    ลดของเสียและส่งเสริมการรีไซเคิล
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Social */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-2 bg-blue-500" />
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 font-display">Social</h3>
                <p className="text-lg font-semibold text-blue-600 mb-3">สังคม</p>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                    ส่งเสริมความหลากหลายและการมีส่วนร่วม
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                    พัฒนาคุณภาพชีวิตพนักงาน
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                    สนับสนุนชุมชนท้องถิ่น
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                    ความปลอดภัยและสุขอนามัย
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Governance */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-2 bg-purple-500" />
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                  <Award className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 font-display">Governance</h3>
                <p className="text-lg font-semibold text-purple-600 mb-3">ธรรมาภิบาล</p>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                    การดำเนินธุรกิจอย่างโปร่งใส
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                    จริยธรรมทางธุรกิจ
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                    การต่อต้านการทุจริต
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                    การบริหารความเสี่ยง
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SDG Goals Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              UN Sustainable Development Goals
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              JW Group สนับสนุนเป้าหมายการพัฒนาที่ยั่งยืนขององค์การสหประชาชาติ (SDGs)
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sdgGoals.map((goal) => (
              <div
                key={goal.number}
                className={`${goal.color} rounded-xl p-6 text-white text-center hover:scale-105 transition-transform cursor-pointer shadow-lg`}
              >
                <div className="text-3xl font-bold mb-2">{goal.number}</div>
                <p className="text-xs font-medium leading-tight">{goal.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-display">
            ร่วมสร้างอนาคตที่ยั่งยืนไปด้วยกัน
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            เราเชื่อว่าทุกก้าวเล็กๆ สามารถสร้างการเปลี่ยนแปลงที่ยิ่งใหญ่ได้
            ร่วมเป็นส่วนหนึ่งในการสร้างโลกที่ดีกว่าไปกับ JW Group
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              ดูรายงานความยั่งยืน
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              ติดต่อเรา
            </Button>
          </div>
        </div>
      </section>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 0.4; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Sustainability;
