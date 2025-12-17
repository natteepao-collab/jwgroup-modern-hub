import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

const OrganizationChart = () => {
  const { t, i18n } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const isEnglish = i18n.language === 'en';

  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display text-foreground">
          {isEnglish ? 'Organizational Structure' : 'โครงสร้างองค์กร'}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {isEnglish 
            ? 'JW GROUP Executive Committee - Organization Chart & Management'
            : 'คณะกรรมการบริหาร JW GROUP - แผนภูมิองค์กรและการบริหาร'}
        </p>
      </div>

      {/* Organization Chart */}
      <div className="max-w-6xl mx-auto overflow-x-auto">
        <div className="min-w-[900px] p-4">
          {/* Level 1: Board of Directors */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#2c5282] text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg">
              {isEnglish ? 'Board of Directors' : 'คณะกรรมการบริษัท'}
            </div>
          </div>

          {/* Connecting Line from Board */}
          <div className="flex justify-center mb-2">
            <div className="w-0.5 h-6 bg-muted-foreground/40"></div>
          </div>

          {/* Level 2: Four Committees */}
          <div className="flex justify-center gap-4 mb-2 relative">
            {/* Horizontal line connecting committees */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[85%] h-0.5 bg-muted-foreground/40"></div>
            
            <div className="flex gap-4 pt-0">
              {/* Nomination Committee */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
                <div className="bg-[#d4a574] text-foreground px-4 py-3 rounded-lg text-center text-sm font-medium shadow-md min-w-[140px]">
                  <div>{isEnglish ? 'Nomination &' : 'คณะกรรมการสรรหา'}</div>
                  <div>{isEnglish ? 'Remuneration Committee' : 'และพิจารณาค่าตอบแทน'}</div>
                </div>
              </div>

              {/* Risk & Sustainability Committee */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
                <div className="bg-[#d4a574] text-foreground px-4 py-3 rounded-lg text-center text-sm font-medium shadow-md min-w-[140px]">
                  <div>{isEnglish ? 'Risk Management &' : 'คณะกรรมการบริหารความเสี่ยง'}</div>
                  <div>{isEnglish ? 'Sustainability Committee' : 'และการพัฒนาอย่างยั่งยืน'}</div>
                </div>
              </div>

              {/* Executive Committee */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
                <div className="bg-[#d4a574] text-foreground px-4 py-3 rounded-lg text-center text-sm font-medium shadow-md min-w-[140px]">
                  <div>{isEnglish ? 'Executive' : 'คณะกรรมการบริหาร'}</div>
                  <div>{isEnglish ? 'Committee' : ''}</div>
                </div>
              </div>

              {/* Audit Committee */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
                <div className="bg-[#d4a574] text-foreground px-4 py-3 rounded-lg text-center text-sm font-medium shadow-md min-w-[140px]">
                  <div>{isEnglish ? 'Audit' : 'คณะกรรมการตรวจสอบ'}</div>
                  <div>{isEnglish ? 'Committee' : ''}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Connecting Line */}
          <div className="flex justify-center mb-2">
            <div className="w-0.5 h-6 bg-muted-foreground/40"></div>
          </div>

          {/* Level 3: Chairman & CEO */}
          <div className="flex justify-center mb-2">
            <div className="bg-[#4a7c9b] text-white px-6 py-3 rounded-lg text-center font-semibold shadow-lg">
              <div>{isEnglish ? 'Chairman of the Board &' : 'ประธานกรรมการบริษัท'}</div>
              <div>{isEnglish ? 'Chairman of Executive Committee' : 'และประธานกรรมการบริหาร'}</div>
            </div>
          </div>

          {/* Connecting Line */}
          <div className="flex justify-center mb-2">
            <div className="w-0.5 h-6 bg-muted-foreground/40"></div>
          </div>

          {/* Level 4: Three Managing Directors */}
          <div className="flex justify-center gap-8 mb-2 relative">
            {/* Horizontal line */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[60%] h-0.5 bg-muted-foreground/40"></div>
            
            <div className="flex gap-8 pt-0">
              {/* MD - Operations A */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
                <div className="bg-[#c4d4d8] text-foreground px-4 py-3 rounded-lg text-center text-sm font-medium shadow-md">
                  <div>{isEnglish ? 'Managing Director' : 'กรรมการผู้จัดการ'}</div>
                  <div className="text-xs text-muted-foreground">{isEnglish ? '(Operations Line A)' : '(สายปฏิบัติการ A)'}</div>
                </div>
              </div>

              {/* MD - Operations B */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
                <div className="bg-[#c4d4d8] text-foreground px-4 py-3 rounded-lg text-center text-sm font-medium shadow-md">
                  <div>{isEnglish ? 'Managing Director' : 'กรรมการผู้จัดการ'}</div>
                  <div className="text-xs text-muted-foreground">{isEnglish ? '(Operations Line B)' : '(สายปฏิบัติการ B)'}</div>
                </div>
              </div>

              {/* MD - Support */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
                <div className="bg-[#c4d4d8] text-foreground px-4 py-3 rounded-lg text-center text-sm font-medium shadow-md">
                  <div>{isEnglish ? 'Managing Director' : 'กรรมการผู้จัดการ'}</div>
                  <div className="text-xs text-muted-foreground">{isEnglish ? '(Support Line)' : '(สายงานสนับสนุน)'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Connecting Lines */}
          <div className="flex justify-center gap-32 mb-2">
            <div className="w-0.5 h-6 bg-muted-foreground/40"></div>
            <div className="w-0.5 h-6 bg-muted-foreground/40"></div>
          </div>

          {/* Level 5: Deputy Managing Directors */}
          <div className="flex justify-center gap-16 mb-2 relative">
            {/* Horizontal line */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[40%] h-0.5 bg-muted-foreground/40"></div>
            
            <div className="flex gap-16 pt-0">
              {/* Deputy MD */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
                <div className="bg-[#d4a574] text-foreground px-4 py-2 rounded-lg text-center text-sm font-medium shadow-md">
                  {isEnglish ? 'Deputy Managing Director' : 'รองกรรมการผู้จัดการ'}
                </div>
              </div>

              {/* Deputy MD & CFO */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
                <div className="bg-[#d4a574] text-foreground px-4 py-2 rounded-lg text-center text-sm font-medium shadow-md">
                  <div>{isEnglish ? 'Deputy Managing Director' : 'รองกรรมการผู้จัดการ'}</div>
                  <div className="text-xs">{isEnglish ? '& Chief Financial Officer' : 'และผู้บริหารสูงสุดด้านการเงิน'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Connecting Lines to Departments */}
          <div className="flex justify-center mb-4">
            <div className="w-[90%] h-0.5 bg-muted-foreground/40"></div>
          </div>

          {/* Level 6: Departments */}
          <div className="grid grid-cols-5 gap-3">
            {/* Project Development 1 */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
              <div className="bg-[#4a7c9b] text-white px-3 py-2 rounded-t-lg text-center text-sm font-semibold w-full">
                {isEnglish ? 'Project Development' : 'พัฒนาโครงการ'}
              </div>
              <div className="bg-card border border-border rounded-b-lg p-3 w-full">
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li>{isEnglish ? 'Project Dept. 1' : 'ฝ่ายโครงการ 1'}</li>
                  <li>{isEnglish ? 'Project Dept. 7' : 'ฝ่ายโครงการ 7'}</li>
                  <li>{isEnglish ? 'Project Dept. 10' : 'ฝ่ายโครงการ 10'}</li>
                  <li>{isEnglish ? 'Project Dept. 11' : 'ฝ่ายโครงการ 11'}</li>
                  <li>{isEnglish ? 'Corporate Comm.' : 'ฝ่ายสื่อสารองค์กร'}</li>
                </ul>
              </div>
            </div>

            {/* Project Development 2 */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
              <div className="bg-[#4a7c9b] text-white px-3 py-2 rounded-t-lg text-center text-sm font-semibold w-full">
                {isEnglish ? 'Project Development' : 'พัฒนาโครงการ'}
              </div>
              <div className="bg-card border border-border rounded-b-lg p-3 w-full">
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li>{isEnglish ? 'Project Dept. 3' : 'ฝ่ายโครงการ 3'}</li>
                  <li>{isEnglish ? 'Project Dept. 5' : 'ฝ่ายโครงการ 5'}</li>
                  <li>{isEnglish ? 'Project Dept. 6' : 'ฝ่ายโครงการ 6'}</li>
                  <li>{isEnglish ? 'Project Dept. 9' : 'ฝ่ายโครงการ 9'}</li>
                  <li>{isEnglish ? 'Project Dept. 12' : 'ฝ่ายโครงการ 12'}</li>
                </ul>
              </div>
            </div>

            {/* Operations */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
              <div className="bg-[#4a7c9b] text-white px-3 py-2 rounded-t-lg text-center text-sm font-semibold w-full">
                {isEnglish ? 'Operations' : 'สายปฏิบัติการ'}
              </div>
              <div className="bg-card border border-border rounded-b-lg p-3 w-full">
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li>{isEnglish ? 'Business Dev.' : 'ฝ่ายพัฒนาธุรกิจ'}</li>
                  <li>{isEnglish ? 'Design Dept.' : 'ฝ่ายออกแบบ'}</li>
                  <li>{isEnglish ? 'Construction' : 'ฝ่ายก่อสร้าง'}</li>
                  <li>{isEnglish ? 'Management' : 'ฝ่ายอำนวยการ'}</li>
                  <li>{isEnglish ? 'Legal Dept.' : 'ฝ่ายนิติบุคคลฯ'}</li>
                  <li>{isEnglish ? 'Service Dept.' : 'ฝ่ายบริการฯ'}</li>
                  <li>{isEnglish ? 'Land Dept.' : 'ฝ่ายที่ดิน'}</li>
                  <li>{isEnglish ? 'Legal Affairs' : 'ฝ่ายกฎหมาย'}</li>
                  <li>{isEnglish ? 'Admin Office' : 'สำนักบริหาร'}</li>
                </ul>
              </div>
            </div>

            {/* Support */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
              <div className="bg-[#c4d4d8] text-foreground px-3 py-2 rounded-t-lg text-center text-sm font-semibold w-full">
                {isEnglish ? 'Support' : 'สายสนับสนุน'}
              </div>
              <div className="bg-card border border-border rounded-b-lg p-3 w-full">
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li>{isEnglish ? 'Accounting' : 'ฝ่ายบัญชี'}</li>
                  <li>{isEnglish ? 'Finance' : 'ฝ่ายการเงิน'}</li>
                  <li>{isEnglish ? 'IT Dept.' : 'ฝ่ายเทคโนโลยี'}</li>
                  <li className="text-xs">{isEnglish ? '' : 'และสารสนเทศ'}</li>
                  <li>{isEnglish ? 'Investor Relations' : 'ฝ่ายนักลงทุนสัมพันธ์'}</li>
                  <li className="text-xs">{isEnglish ? '& Sustainability' : 'และการพัฒนาอย่างยั่งยืน'}</li>
                  <li>{isEnglish ? 'HR Dept.' : 'ฝ่ายทรัพยากรบุคคล'}</li>
                  <li>{isEnglish ? 'Procurement' : 'ฝ่ายธุรการจัดซื้อ'}</li>
                </ul>
              </div>
            </div>

            {/* Internal Audit */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
              <div className="bg-[#e8e8e8] text-foreground px-3 py-2 rounded-t-lg text-center text-sm font-semibold w-full">
                <div>{isEnglish ? 'Internal Audit &' : 'ฝ่ายตรวจสอบภายใน'}</div>
                <div className="text-xs">{isEnglish ? 'System Development' : 'และพัฒนาระบบ'}</div>
              </div>
              <div className="bg-card border border-border rounded-b-lg p-3 w-full h-[180px]">
                {/* Empty space for alignment */}
              </div>
            </div>
          </div>

          {/* Footer Date */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            {isEnglish 
              ? 'Organization Structure as of January 1, 2568' 
              : 'โครงสร้างองค์กร ณ วันที่ 1 มกราคม 2568'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationChart;
