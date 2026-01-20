import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Hotel, Heart, Leaf, Target, CheckCircle, Sparkles, ChevronDown, Eye, ListChecks } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Business data with vision, mission, and core concept
const businessData = [
  {
    id: 'realestate',
    name: 'JW Real Estates',
    icon: Building2,
    color: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
    accentColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500/30',
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
    color: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30',
    accentColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500/30',
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
    name: '3DPet Hospital & Hotel',
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    bgGradient: 'from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30',
    accentColor: 'text-rose-600 dark:text-rose-400',
    borderColor: 'border-rose-500/30',
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
    name: 'JW Herbal & Wellness',
    icon: Leaf,
    color: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-500/30',
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
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920')] bg-cover bg-center opacity-20" />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <Target className="w-5 h-5 text-white" />
            <span className="text-white/90 text-sm font-medium">Vision & Mission</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-display">
            วิสัยทัศน์และพันธกิจ
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            ทิศทางและเป้าหมายการดำเนินธุรกิจของแต่ละกลุ่มธุรกิจในเครือ JW Group
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Business Tabs Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Business Selector Tabs */}
            <TabsList className="w-full flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0 mb-12">
              {businessData.map((business) => {
                const Icon = business.icon;
                const isActive = activeTab === business.id;
                return (
                  <TabsTrigger
                    key={business.id}
                    value={business.id}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all duration-300",
                      "data-[state=active]:shadow-lg",
                      isActive
                        ? `bg-gradient-to-r ${business.color} text-white border-transparent`
                        : "bg-card border-border hover:border-primary/50"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold text-sm md:text-base">{business.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Content for each business */}
            {businessData.map((business) => {
              const Icon = business.icon;
              return (
                <TabsContent key={business.id} value={business.id} className="mt-0">
                  <div className={cn(
                    "rounded-3xl p-8 md:p-12 transition-all duration-500",
                    `bg-gradient-to-br ${business.bgGradient}`
                  )}>
                    {/* Business Header */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center",
                        `bg-gradient-to-br ${business.color}`
                      )}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display">
                          {business.name}
                        </h2>
                      </div>
                    </div>

                    {/* Vision Section */}
                    <div className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          `bg-gradient-to-br ${business.color}`
                        )}>
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground font-display">
                          วิสัยทัศน์ (Vision)
                        </h3>
                      </div>
                      
                      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                        <CardContent className="p-6 md:p-8">
                          <p className={cn(
                            "text-lg md:text-xl leading-relaxed font-medium",
                            business.accentColor
                          )}>
                            {business.vision}
                          </p>
                          {business.visionSub && (
                            <p className="text-muted-foreground mt-4 text-base md:text-lg">
                              {business.visionSub}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Mission Section */}
                    <div className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          `bg-gradient-to-br ${business.color}`
                        )}>
                          <ListChecks className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground font-display">
                          พันธกิจ (Mission)
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {business.missions.map((mission, index) => (
                          <Card 
                            key={index}
                            className={cn(
                              "border-0 shadow-md bg-card/80 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-lg",
                              expandedMission === index && `border-l-4 ${business.borderColor}`
                            )}
                            onClick={() => setExpandedMission(expandedMission === index ? null : index)}
                          >
                            <CardContent className="p-4 md:p-6">
                              <div className="flex items-start gap-4">
                                <div className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                                  `bg-gradient-to-br ${business.color}`
                                )}>
                                  <span className="text-white font-bold text-sm">{index + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-bold text-foreground text-base md:text-lg">
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
                                    expandedMission === index ? "max-h-48 mt-3 opacity-100" : "max-h-0 opacity-0"
                                  )}>
                                    <p className="text-muted-foreground leading-relaxed">
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
                    {business.coreConcept && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            `bg-gradient-to-br ${business.color}`
                          )}>
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-foreground font-display">
                            แนวคิดหลัก (Core Concept)
                          </h3>
                        </div>

                        <Card className={cn(
                          "border-0 shadow-xl overflow-hidden",
                          `bg-gradient-to-br ${business.color}`
                        )}>
                          <CardContent className="p-8 md:p-10 text-center">
                            <p className="text-2xl md:text-3xl font-bold text-white mb-2 font-display">
                              "{business.coreConcept.title}"
                            </p>
                            <p className="text-lg md:text-xl text-white/90 mb-4">
                              {business.coreConcept.subtitle}
                            </p>
                            {business.coreConcept.description && (
                              <p className="text-white/80">
                                {business.coreConcept.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              JW Group Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ค่านิยมหลักที่ทุกธุรกิจในเครือ JW Group ยึดถือร่วมกัน
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: CheckCircle,
                title: 'คุณภาพ',
                subtitle: 'Quality',
                description: 'มุ่งมั่นรักษามาตรฐานคุณภาพสูงสุดในทุกผลิตภัณฑ์และบริการ'
              },
              {
                icon: Heart,
                title: 'ความใส่ใจ',
                subtitle: 'Care',
                description: 'ดูแลลูกค้าและสังคมด้วยความจริงใจเสมือนคนในครอบครัว'
              },
              {
                icon: Target,
                title: 'ความยั่งยืน',
                subtitle: 'Sustainability',
                description: 'ดำเนินธุรกิจโดยคำนึงถึงความยั่งยืนในระยะยาว'
              },
              {
                icon: Sparkles,
                title: 'นวัตกรรม',
                subtitle: 'Innovation',
                description: 'พัฒนาและปรับปรุงอย่างต่อเนื่องเพื่อตอบสนองความต้องการ'
              }
            ].map((value, index) => (
              <Card key={index} className="border-0 shadow-lg bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1 font-display">{value.title}</h3>
                  <p className="text-sm text-primary mb-3">{value.subtitle}</p>
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
