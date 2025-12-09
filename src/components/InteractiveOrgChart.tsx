import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Building2, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import chairmanImage from '@/assets/executives/chairman-wisit.jpg';
import directorsImage from '@/assets/executives/directors-team.jpg';

interface TeamMember {
  name: string;
  nameTh: string;
  position: string;
  positionTh: string;
  department?: string;
}

const InteractiveOrgChart = () => {
  const { t, i18n } = useTranslation();
  const [expandedSection, setExpandedSection] = useState<string | null>('chairman');
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const chairman = {
    name: 'Mr. Wisit Korworrakul',
    nameTh: 'คุณวิศิษฏ์ กอวรกุล',
    position: 'Chairman of Executive Board',
    positionTh: 'ประธานกรรมการบริหาร',
  };

  const directors: TeamMember[] = [
    {
      name: 'Khun Chalisa Korworrakul',
      nameTh: 'คุณชลิสา กอวรกุล',
      position: 'Managing Director',
      positionTh: 'กรรมการผู้จัดการ',
    },
    {
      name: 'Khun Pornnatcha Korworrakul',
      nameTh: 'คุณพรณัชชา กอวรกุล',
      position: 'Managing Director',
      positionTh: 'กรรมการผู้จัดการ',
    },
  ];

  const managementTeam: { category: string; categoryTh: string; members: TeamMember[] }[] = [
    {
      category: 'Operations',
      categoryTh: 'ฝ่ายปฏิบัติการ',
      members: [
        { name: 'Piyadech Changradom', nameTh: 'ปิยเดช จันทราดม', position: 'Project Manager', positionTh: 'ผู้จัดการโครงการ' },
        { name: 'Suchanat Muangnim', nameTh: 'สุชนาฏ เมืองนิม', position: 'Head of Arch & Design', positionTh: 'หัวหน้าฝ่ายสถาปัตย์และออกแบบ' },
        { name: 'Metika Tawethikul', nameTh: 'เมธิกา ทวีธีรกุล', position: 'Secretary', positionTh: 'เลขานุการ' },
      ],
    },
    {
      category: 'Corporate Support',
      categoryTh: 'ฝ่ายสนับสนุนองค์กร',
      members: [
        { name: 'Noranat Suphachokkasemsan', nameTh: 'นราณัฐ สุภโชติกเสมสันต์', position: 'Legal Manager', positionTh: 'ผู้จัดการฝ่ายกฎหมาย' },
        { name: 'Korn-on Ritkhamrop', nameTh: 'กรอรณ์ ริดข้ามแรบ', position: 'HR Manager', positionTh: 'ผู้จัดการฝ่ายทรัพยากรบุคคล' },
      ],
    },
    {
      category: 'Commercial',
      categoryTh: 'ฝ่ายพาณิชย์',
      members: [
        { name: 'Phansak Chantaphat', nameTh: 'พันธ์ศักดิ์ จันทผาด', position: 'Sales Manager', positionTh: 'ผู้จัดการฝ่ายขาย' },
        { name: 'Net Thongchan', nameTh: 'เนตร ทองจันทร์', position: 'Accounting & Finance Manager', positionTh: 'ผู้จัดการฝ่ายบัญชีและการเงิน' },
        { name: 'MN', nameTh: 'MN', position: 'Head of Purchasing', positionTh: 'หัวหน้าฝ่ายจัดซื้อ' },
        { name: 'Nichanun S.', nameTh: 'นิชานันท์', position: 'Head of Marketing', positionTh: 'หัวหน้าฝ่ายการตลาด' },
      ],
    },
  ];

  const isEnglish = i18n.language === 'en';

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display text-foreground">
          {isEnglish ? 'Organizational Structure' : 'โครงสร้างองค์กร'}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {isEnglish 
            ? 'JW GROUP Executive Committee - Organization Chart & Management'
            : 'คณะกรรมการบริหาร JW GROUP - แผนภูมิองค์กรและการบริหาร'}
        </p>
      </div>

      {/* Org Chart */}
      <div className="space-y-6">
        {/* Chairman */}
        <div 
          className={`cursor-pointer transition-all duration-500 ${expandedSection === 'chairman' ? 'scale-100' : 'scale-[0.98]'}`}
          onClick={() => toggleSection('chairman')}
        >
          <Card className={`overflow-hidden border-2 transition-all duration-300 ${expandedSection === 'chairman' ? 'border-primary shadow-2xl' : 'border-border hover:border-primary/50'}`}>
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {isEnglish ? 'Chairman of Executive Board' : 'ประธานกรรมการบริหาร'}
                </h2>
              </div>
              {expandedSection === 'chairman' ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </div>
            
            <div className={`transition-all duration-500 overflow-hidden ${expandedSection === 'chairman' ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-xl flex-shrink-0 ring-4 ring-primary/20">
                    <img 
                      src={chairmanImage} 
                      alt={chairman.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-3xl font-bold text-foreground mb-2">
                      {isEnglish ? chairman.name : chairman.nameTh}
                    </h3>
                    <Badge variant="secondary" className="text-lg px-4 py-1 bg-primary/10 text-primary">
                      {isEnglish ? chairman.position : chairman.positionTh}
                    </Badge>
                    <p className="mt-4 text-muted-foreground max-w-md">
                      {isEnglish 
                        ? 'Leading JW GROUP with vision and expertise in real estate, hospitality, and wellness industries.'
                        : 'นำทีม JW GROUP ด้วยวิสัยทัศน์และความเชี่ยวชาญในอุตสาหกรรมอสังหาริมทรัพย์ การโรงแรม และสุขภาพ'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Connecting Line */}
        <div className="flex justify-center">
          <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-primary/30"></div>
        </div>

        {/* Managing Directors */}
        <div 
          className={`cursor-pointer transition-all duration-500 ${expandedSection === 'directors' ? 'scale-100' : 'scale-[0.98]'}`}
          onClick={() => toggleSection('directors')}
        >
          <Card className={`overflow-hidden border-2 transition-all duration-300 ${expandedSection === 'directors' ? 'border-primary shadow-2xl' : 'border-border hover:border-primary/50'}`}>
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {isEnglish ? 'Executive Directors' : 'กรรมการบริหาร'}
                </h2>
              </div>
              {expandedSection === 'directors' ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </div>
            
            <div className={`transition-all duration-500 overflow-hidden ${expandedSection === 'directors' ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <CardContent className="p-6">
                <div className="mb-8">
                  <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-xl ring-4 ring-primary/20">
                    <img 
                      src={directorsImage} 
                      alt="Executive Directors"
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {directors.map((director, index) => (
                    <div 
                      key={index}
                      className="p-6 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {isEnglish ? director.name : director.nameTh}
                      </h3>
                      <Badge variant="outline" className="border-primary/50 text-primary">
                        {isEnglish ? director.position : director.positionTh}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Connecting Line */}
        <div className="flex justify-center">
          <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-primary/30"></div>
        </div>

        {/* Management Team */}
        <div 
          className={`cursor-pointer transition-all duration-500 ${expandedSection === 'management' ? 'scale-100' : 'scale-[0.98]'}`}
          onClick={() => toggleSection('management')}
        >
          <Card className={`overflow-hidden border-2 transition-all duration-300 ${expandedSection === 'management' ? 'border-primary shadow-2xl' : 'border-border hover:border-primary/50'}`}>
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {isEnglish ? 'Management Team' : 'ทีมผู้บริหาร'}
                </h2>
              </div>
              {expandedSection === 'management' ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </div>
            
            <div className={`transition-all duration-500 overflow-hidden ${expandedSection === 'management' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {managementTeam.map((dept, deptIndex) => (
                    <div 
                      key={deptIndex}
                      className="p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300"
                    >
                      <h3 className="text-lg font-bold text-primary mb-4 pb-2 border-b border-primary/20">
                        {isEnglish ? dept.category : dept.categoryTh}
                      </h3>
                      <div className="space-y-4">
                        {dept.members.map((member, memberIndex) => (
                          <div 
                            key={memberIndex}
                            className="p-3 rounded-lg bg-background/50 hover:bg-background transition-all duration-300 hover:shadow-md"
                          >
                            <p className="font-semibold text-foreground text-sm">
                              {isEnglish ? member.name : member.nameTh}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {isEnglish ? member.position : member.positionTh}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      {/* Expand All Hint */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {isEnglish 
            ? '💡 Click on each section to expand/collapse details'
            : '💡 คลิกที่แต่ละส่วนเพื่อแสดง/ซ่อนรายละเอียด'}
        </p>
      </div>
    </div>
  );
};

export default InteractiveOrgChart;
