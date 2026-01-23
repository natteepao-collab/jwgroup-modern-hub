import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Hotel, Heart, Leaf, Target, CheckCircle, Sparkles, ChevronDown, Eye, ListChecks, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Import business images
import realEstateImg from '@/assets/business-realestate.jpg';
import hotelImg from '@/assets/business-hotel.jpg';
import petImg from '@/assets/business-pet.jpg';
import herbalImg from '@/assets/business-wellness.jpg';

// Business data with vision, mission, and core concept
const businessData = [
  {
    id: 'realestate',
    name: 'JW Real Estates',
    icon: Building2,
    color: 'from-amber-500 to-orange-600',
    lightColor: 'from-amber-400 to-orange-500',
    bgGradient: 'from-amber-50/80 to-orange-50/80 dark:from-amber-950/50 dark:to-orange-950/50',
    accentColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500',
    dotColor: 'bg-amber-500',
    image: realEstateImg,
    vision: '"เป็นกลุ่มธุรกิจอสังหาริมทรัพย์ที่มุ่งสร้างคุณค่าการอยู่อาศัยอย่างยั่งยืน ด้วยคุณภาพที่จับต้องได้ บนทำเลที่มีศักยภาพเติบโตจริง เพื่อให้ลูกค้าอยู่อาศัยได้อย่างมั่นคง ในทุกสภาวะเศรษฐกิจ"',
    visionSub: 'ไม่ใช่เพียงการขายที่อยู่อาศัย แต่คือการสร้างความมั่นใจให้กับการตัดสินใจครั้งสำคัญของชีวิต',
    missions: [
      {
        title: 'พัฒนาโครงการที่คุ้มค่าและตอบโจทย์การอยู่อาศัยจริง',
        description: 'ออกแบบและพัฒนาโครงการโดยคำนึงถึงการใช้งานจริงในชีวิตประจำวัน ลดสิ่งที่ไม่จำเป็น เน้นความคุ้มค่าในระยะยาว เพื่อให้ลูกค้าได้ที่อยู่อาศัยที่เหมาะสม ไม่เป็นภาระในอนาคต'
      },
      {
        title: 'รักษามาตรฐานคุณภาพวัสดุและงานก่อสร้างอย่างเคร่งครัด',
        description: 'คัดเลือกวัสดุและระบบก่อสร้างที่มีคุณภาพ ได้มาตรฐาน และเหมาะสมกับการใช้งาน ไม่ลดคุณภาพเพื่อผลกำไรระยะสั้น เพราะเชื่อว่า ที่อยู่อาศัยที่ดี คือการลงทุนเพื่อคุณภาพชีวิต'
      },
      {
        title: 'คัดเลือกทำเลที่มีศักยภาพการเติบโตในระยะยาว',
        description: 'พัฒนาโครงการบนทำเลที่มีโครงสร้างพื้นฐานและระบบคมนาคมรองรับ เป็นพื้นที่ที่มีแนวโน้มการเติบโตของมูลค่าในอนาคต เพื่อให้ลูกค้าอยู่อาศัยได้อย่างมั่นใจ และรักษามูลค่าทรัพย์สินได้จริง'
      },
      {
        title: 'ดำเนินธุรกิจด้วยคุณธรรม ความโปร่งใส และความรับผิดชอบ',
        description: 'ยึดมั่นในความซื่อตรงต่อผู้บริโภค คู่ค้า และสังคม สื่อสารอย่างตรงไปตรงมา ไม่โฆษณาเกินจริง เพราะความเชื่อมั่น คือรากฐานของความยั่งยืนในธุรกิจ'
      },
      {
        title: 'บริหารองค์กรอย่างรอบคอบ พร้อมรับการเปลี่ยนแปลง',
        description: 'บริหารจัดการองค์กรด้วยวินัยทางการเงินและการวางแผนระยะยาว พร้อมปรับกลยุทธ์ให้สอดคล้องกับสภาวะเศรษฐกิจและตลาด เพื่อให้ JW Group เติบโตอย่างมั่นคง ต่อเนื่อง และยั่งยืน'
      }
    ],
    coreConcept: {
      title: 'Good Living for Your Life',
      subtitle: 'การอยู่อาศัยที่ดีกว่า สำหรับคุณ…ในระยะยาว',
      description: 'ไม่ใช่เพียงวันนี้ แต่เพื่อความมั่นคงและคุณภาพชีวิตที่ดีในวันข้างหน้า'
    }
  },
  {
    id: 'hotel',
    name: '12 The Residence Hotel',
    icon: Hotel,
    color: 'from-gray-700 to-gray-900',
    lightColor: 'from-gray-600 to-gray-800',
    bgGradient: 'from-gray-100/80 to-slate-100/80 dark:from-gray-900/50 dark:to-slate-900/50',
    accentColor: 'text-gray-700 dark:text-gray-300',
    borderColor: 'border-gray-700',
    dotColor: 'bg-gray-700',
    image: hotelImg,
    vision: 'มุ่งมั่นเป็นโรงแรมที่ลูกค้าเลือกพักซ้ำ ด้วยประสบการณ์การเข้าพักที่ "มั่นใจ สะดวก และคุ้มค่า"',
    visionSub: 'ผสานความสะดวกสบาย คุณภาพการบริการ และการดูแลอย่างจริงใจตลอด 24 ชั่วโมง เพื่อตอบโจทย์นักเดินทางยุคใหม่ในทุกสถานการณ์',
    missions: [
      {
        title: 'ความสบายที่เชื่อถือได้ (Reliable Comfort)',
        description: 'มอบการเข้าพักที่เรียบง่าย แต่ใส่ใจในรายละเอียด ตั้งแต่การเช็คอิน การพักผ่อน จนถึงการเดินทางต่อ เพื่อให้แขกทุกคนรู้สึกสบายใจ และมั่นใจในทุกการเข้าพัก'
      },
      {
        title: 'บริการ 24 ชั่วโมง ที่ตอบโจทย์การใช้งานจริง',
        description: 'ให้บริการอย่างต่อเนื่องตลอด 24 ชั่วโมง พร้อมสิ่งอำนวยความสะดวกที่ใช้งานได้จริงและคุ้มค่า เช่น พื้นที่ทำงานและนั่งพักผ่อน ฟิตเนส ห้องอาหารญี่ปุ่น Junichi คาเฟ่ & บาร์ เพื่อรองรับทั้งนักธุรกิจ นักเดินทาง และครอบครัว'
      },
      {
        title: 'ความคุ้มค่าในทุกมิติ (Value with Quality)',
        description: 'สร้างความสมดุลระหว่างราคา คุณภาพ และการบริการ มอบประสบการณ์ที่เกินความคาดหวังในราคาที่เหมาะสม โดยไม่ลดมาตรฐาน และไม่สร้างภาระให้กับลูกค้าในภาวะเศรษฐกิจปัจจุบัน'
      },
      {
        title: 'ทำเลที่ช่วยประหยัดเวลาและพลังงาน',
        description: 'ตั้งอยู่ใกล้สนามบินดอนเมือง รองรับผู้โดยสารต่อเครื่อง เที่ยวบินเช้า และนักธุรกิจที่ต้องการที่พักที่ "สะดวก ประหยัดเวลา และวางใจได้"'
      },
      {
        title: 'การเติบโตอย่างมั่นคงและยั่งยืน',
        description: 'ดำเนินธุรกิจด้วยความรับผิดชอบ บริหารต้นทุนอย่างมีประสิทธิภาพ พร้อมพัฒนาคุณภาพบริการอย่างต่อเนื่อง เพื่อความมั่นคงขององค์กร พนักงาน และความเชื่อมั่นของลูกค้าในระยะยาว'
      }
    ]
  },
  {
    id: 'pet',
    name: '3DPet Hospital',
    icon: Heart,
    color: 'from-teal-400 to-emerald-500',
    lightColor: 'from-teal-300 to-emerald-400',
    bgGradient: 'from-teal-50/80 to-emerald-50/80 dark:from-teal-950/50 dark:to-emerald-950/50',
    accentColor: 'text-teal-600 dark:text-teal-400',
    borderColor: 'border-teal-500',
    dotColor: 'bg-teal-500',
    image: petImg,
    vision: '"เป็นโรงพยาบาลสัตว์ครบวงจรระดับมาตรฐานโรงพยาบาลคน ที่ผสานเทคโนโลยีทางการแพทย์สมัยใหม่ ทีมสัตวแพทย์ผู้เชี่ยวชาญ และการบริการด้วยหัวใจตลอด 24 ชั่วโมง เพื่อยกระดับคุณภาพชีวิตและอายุขัยของสัตว์เลี้ยง ภายใต้ราคาที่เป็นธรรมและเข้าถึงได้"',
    visionSub: '',
    missions: [
      {
        title: 'ให้บริการรักษาพยาบาลสัตว์เลี้ยงแบบครบวงจร',
        description: 'ครอบคลุมตั้งแต่การป้องกัน วินิจฉัย รักษา ฟื้นฟูสุขภาพ ไปจนถึงบริการเสริม เช่น อาบน้ำตัดขน โรงแรมสัตว์เลี้ยง และบริการฉุกเฉินตลอด 24 ชั่วโมง สำหรับสุนัข แมว และสัตว์เลี้ยงพิเศษ (Exotic Pets)'
      },
      {
        title: 'ยกระดับมาตรฐานการรักษาเทียบเท่าโรงพยาบาลคน',
        description: 'ด้วยเครื่องมือแพทย์ที่ทันสมัย ระบบการรักษาที่ได้มาตรฐานสากล และทีมสัตวแพทย์เฉพาะทางที่มีประสบการณ์สูง'
      },
      {
        title: 'ให้บริการด้วยคุณธรรม จริยธรรม และความโปร่งใส',
        description: 'ยึดหลักความซื่อสัตย์ต่อผู้รับบริการ ให้ข้อมูลการรักษาและค่าใช้จ่ายอย่างชัดเจน เป็นธรรม และสมเหตุสมผล'
      },
      {
        title: 'ดูแลสัตว์เลี้ยงด้วยความเข้าใจและเอาใจใส่เสมือนสมาชิกในครอบครัว',
        description: 'มุ่งสร้างประสบการณ์การรักษาที่อบอุ่น ปลอดภัย และไว้วางใจได้ ทั้งต่อสัตว์เลี้ยงและเจ้าของ'
      },
      {
        title: 'ส่งเสริมความรับผิดชอบต่อสังคมและความยั่งยืน',
        description: 'มีส่วนร่วมในการลดปัญหาสัตว์จรจัด ส่งเสริมการป้องกันโรค การทำหมัน และการให้ความรู้ด้านสุขภาพสัตว์ เพื่อคุณภาพชีวิตที่ดีของสัตว์เลี้ยงและสังคมโดยรวม'
      }
    ]
  },
  {
    id: 'herbal',
    name: 'JW Herbal',
    icon: Leaf,
    color: 'from-blue-800 to-indigo-900',
    lightColor: 'from-blue-700 to-indigo-800',
    bgGradient: 'from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50',
    accentColor: 'text-blue-800 dark:text-blue-400',
    borderColor: 'border-blue-800',
    dotColor: 'bg-blue-800',
    image: herbalImg,
    vision: '"เป็นแบรนด์ผลิตภัณฑ์ดูแลสุขภาพหลอดเลือดจากสมุนไพร ที่ได้รับความเชื่อมั่นในด้านคุณภาพ มาตรฐาน และความปลอดภัย เพื่อยกระดับคุณภาพชีวิตของผู้คนอย่างยั่งยืน"',
    visionSub: 'ไม่ใช่เพียงการดูแลสุขภาพในวันนี้ แต่คือการสร้างโอกาสให้ผู้คนมีชีวิตที่แข็งแรงในระยะยาว',
    missions: [
      {
        title: 'พัฒนาผลิตภัณฑ์สมุนไพรไทยสู่มาตรฐานสากล',
        description: 'คัดเลือกและพัฒนาสมุนไพรไทยด้วยกระบวนการผลิตที่ได้มาตรฐาน ผ่านการควบคุมคุณภาพ ความปลอดภัย และการวิจัยอย่างเหมาะสม เพื่อให้ผู้บริโภคมั่นใจในทุกขั้นตอนของผลิตภัณฑ์'
      },
      {
        title: 'ส่งเสริมการเข้าถึงการดูแลสุขภาพอย่างมีคุณภาพ',
        description: 'มุ่งพัฒนาผลิตภัณฑ์ที่มีคุณภาพในราคาที่เหมาะสม เพื่อให้คนไทยสามารถเข้าถึงทางเลือกในการดูแลสุขภาพหลอดเลือดได้อย่างทั่วถึง'
      },
      {
        title: 'ดำเนินธุรกิจควบคู่กับความรับผิดชอบต่อสังคม',
        description: 'จัดสรรรายได้ส่วนหนึ่งเพื่อสนับสนุนอุปกรณ์ทางการแพทย์ และกิจกรรมด้านสาธารณสุขให้แก่โรงพยาบาลและชุมชนในพื้นที่ห่างไกล เพื่อร่วมยกระดับคุณภาพชีวิตของสังคมไทย'
      },
      {
        title: 'เป็นส่วนหนึ่งในการส่งเสริมสุขภาพหลอดเลือดของผู้คน',
        description: 'ให้ความรู้และสร้างความตระหนักรู้ด้านการดูแลสุขภาพหลอดเลือด ควบคู่กับการใช้ผลิตภัณฑ์อย่างถูกต้อง เพื่อสนับสนุนการมีสุขภาพที่ดีอย่างยั่งยืน'
      }
    ],
    coreConcept: {
      title: 'ดูแลหลอดเลือดอย่างเข้าใจ',
      subtitle: 'เพื่อชีวิตที่แข็งแรงในระยะยาว',
      description: ''
    }
  }
];

const VisionMission = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('realestate');
  const [expandedMission, setExpandedMission] = useState<number | null>(null);

  const currentBusiness = businessData.find(b => b.id === activeTab) || businessData[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/95" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920')] bg-cover bg-center opacity-15" />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-5">
            <Target className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Vision & Mission</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-display">
            วิสัยทัศน์และพันธกิจ
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            ทิศทางและเป้าหมายการดำเนินธุรกิจของแต่ละกลุ่มธุรกิจในเครือ JW Group
          </p>
        </div>
      </section>

      {/* Business Selector - Horizontal Cards */}
      <section className="py-8 px-4 bg-muted/30 sticky top-16 z-40 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {businessData.map((business) => {
              const Icon = business.icon;
              const isActive = activeTab === business.id;
              return (
                <button
                  key={business.id}
                  onClick={() => {
                    setActiveTab(business.id);
                    setExpandedMission(null);
                  }}
                  className={cn(
                    "group flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 transition-all duration-300",
                    "hover:shadow-lg hover:-translate-y-0.5",
                    isActive
                      ? `bg-gradient-to-r ${business.color} text-white border-transparent shadow-lg`
                      : "bg-card border-border/50 hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                    isActive ? "bg-white/20" : `bg-gradient-to-br ${business.lightColor}`
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      isActive ? "text-white" : "text-white"
                    )} />
                  </div>
                  <span className={cn(
                    "font-semibold text-sm",
                    isActive ? "text-white" : "text-foreground"
                  )}>
                    {business.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Business Hero Card */}
          <div className={cn(
            "relative rounded-3xl overflow-hidden mb-12 transition-all duration-500",
            `bg-gradient-to-br ${currentBusiness.bgGradient}`
          )}>
            {/* Business Image + Info */}
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative h-64 lg:h-auto lg:min-h-[400px]">
                <img 
                  src={currentBusiness.image}
                  alt={currentBusiness.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent to-black/40"
                )} />
                {/* Floating Badge */}
                <div className={cn(
                  "absolute bottom-6 left-6 flex items-center gap-3 px-5 py-3 rounded-xl backdrop-blur-md",
                  `bg-gradient-to-r ${currentBusiness.color}`
                )}>
                  <currentBusiness.icon className="w-6 h-6 text-white" />
                  <span className="text-white font-bold text-lg">{currentBusiness.name}</span>
                </div>
              </div>

              {/* Vision Side */}
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    `bg-gradient-to-br ${currentBusiness.color}`
                  )}>
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground font-display">วิสัยทัศน์</h2>
                    <p className="text-muted-foreground text-sm">Vision</p>
                  </div>
                </div>
                
                <div className="relative">
                  <Quote className={cn(
                    "absolute -top-2 -left-2 w-8 h-8 opacity-20",
                    currentBusiness.accentColor
                  )} />
                  <p className={cn(
                    "text-lg md:text-xl leading-relaxed font-medium pl-6",
                    currentBusiness.accentColor
                  )}>
                    {currentBusiness.vision}
                  </p>
                </div>
                
                {currentBusiness.visionSub && (
                  <p className="text-muted-foreground mt-6 text-base leading-relaxed pl-6 border-l-2 border-muted">
                    {currentBusiness.visionSub}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                `bg-gradient-to-br ${currentBusiness.color}`
              )}>
                <ListChecks className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display">พันธกิจ</h2>
                <p className="text-muted-foreground">Mission</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {currentBusiness.missions.map((mission, index) => (
                <Card 
                  key={index}
                  className={cn(
                    "group border-0 shadow-md bg-card cursor-pointer transition-all duration-300",
                    "hover:shadow-xl hover:-translate-y-1",
                    expandedMission === index && `border-l-4 ${currentBusiness.borderColor} shadow-xl`
                  )}
                  onClick={() => setExpandedMission(expandedMission === index ? null : index)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                        `bg-gradient-to-br ${currentBusiness.color}`,
                        "group-hover:scale-110"
                      )}>
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-foreground text-base leading-tight pr-2">
                            {mission.title}
                          </h4>
                          <ChevronDown 
                            className={cn(
                              "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300",
                              expandedMission === index && "rotate-180"
                            )}
                          />
                        </div>
                        <div className={cn(
                          "overflow-hidden transition-all duration-300",
                          expandedMission === index ? "max-h-40 mt-3 opacity-100" : "max-h-0 opacity-0"
                        )}>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {mission.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Core Concept Section (if exists) */}
          {currentBusiness.coreConcept && (
            <Card className={cn(
              "border-0 shadow-2xl overflow-hidden",
              `bg-gradient-to-br ${currentBusiness.color}`
            )}>
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5 gap-0">
                  {/* Icon Section */}
                  <div className="md:col-span-1 flex items-center justify-center p-8 bg-black/10">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  {/* Content Section */}
                  <div className="md:col-span-4 p-8 md:p-10 flex flex-col justify-center">
                    <p className="text-white/70 text-sm font-medium uppercase tracking-wider mb-2">
                      แนวคิดหลัก / Core Concept
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-display">
                      "{currentBusiness.coreConcept.title}"
                    </h3>
                    <p className="text-lg md:text-xl text-white/90 mb-3">
                      {currentBusiness.coreConcept.subtitle}
                    </p>
                    {currentBusiness.coreConcept.description && (
                      <p className="text-white/70 text-base">
                        {currentBusiness.coreConcept.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* JW Group Values Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-5 py-2 mb-4">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">Core Values</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 font-display">
              JW Group Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ค่านิยมหลักที่ทุกธุรกิจในเครือ JW Group ยึดถือร่วมกัน
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: CheckCircle,
                title: 'คุณภาพ',
                subtitle: 'Quality',
                description: 'มุ่งมั่นรักษามาตรฐานคุณภาพสูงสุดในทุกผลิตภัณฑ์และบริการ',
                gradient: 'from-amber-500 to-orange-600'
              },
              {
                icon: Heart,
                title: 'ความใส่ใจ',
                subtitle: 'Care',
                description: 'ดูแลลูกค้าและสังคมด้วยความจริงใจเสมือนคนในครอบครัว',
                gradient: 'from-rose-500 to-pink-600'
              },
              {
                icon: Target,
                title: 'ความยั่งยืน',
                subtitle: 'Sustainability',
                description: 'ดำเนินธุรกิจโดยคำนึงถึงความยั่งยืนในระยะยาว',
                gradient: 'from-emerald-500 to-teal-600'
              },
              {
                icon: Sparkles,
                title: 'นวัตกรรม',
                subtitle: 'Innovation',
                description: 'พัฒนาและปรับปรุงอย่างต่อเนื่องเพื่อตอบสนองความต้องการ',
                gradient: 'from-blue-500 to-indigo-600'
              }
            ].map((value, index) => (
              <Card 
                key={index} 
                className="group border-0 shadow-lg bg-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <CardContent className="p-6 text-center relative">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300",
                    `bg-gradient-to-br ${value.gradient}`,
                    "group-hover:scale-110 group-hover:shadow-lg"
                  )}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1 font-display">{value.title}</h3>
                  <p className="text-sm text-primary mb-3 font-medium">{value.subtitle}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisionMission;
