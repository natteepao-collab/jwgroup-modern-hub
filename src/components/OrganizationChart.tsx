import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Building, Hotel, Heart, Leaf, HardHat, Building2 } from 'lucide-react';

interface OrgDepartment {
  id: string;
  name_th: string;
  name_en: string | null;
  description_th: string | null;
  description_en: string | null;
  level: string;
  color: string | null;
  sub_items: string[];
  position_order: number;
  business_type: string;
}

const businessOptions = [
  { 
    value: 'jw_group', 
    label_th: 'JW Group (บริษัทแม่)', 
    label_en: 'JW Group (Holding)',
    icon: Building2,
    color: 'text-primary'
  },
  { 
    value: 'realestate', 
    label_th: 'อสังหาริมทรัพย์', 
    label_en: 'Real Estate',
    icon: Building,
    color: 'text-amber-600'
  },
  { 
    value: 'hotel', 
    label_th: 'โรงแรม', 
    label_en: 'Hotel',
    icon: Hotel,
    color: 'text-neutral-700'
  },
  { 
    value: 'pet', 
    label_th: 'สัตว์เลี้ยง', 
    label_en: 'Pet Care',
    icon: Heart,
    color: 'text-teal-500'
  },
  { 
    value: 'wellness', 
    label_th: 'สุขภาพ', 
    label_en: 'Wellness',
    icon: Leaf,
    color: 'text-green-500'
  },
  { 
    value: 'construction', 
    label_th: 'ก่อสร้าง', 
    label_en: 'Construction',
    icon: HardHat,
    color: 'text-blue-500'
  },
];

const OrganizationChart = () => {
  const { i18n } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const isEnglish = i18n.language === 'en';
  
  const [allDepartments, setAllDepartments] = useState<OrgDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<OrgDepartment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState('jw_group');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('org_departments')
        .select('*')
        .eq('is_published', true)
        .order('position_order');
      
      if (error) throw error;
      
      // Parse sub_items from JSONB
      const parsed: OrgDepartment[] = (data || []).map(d => ({
        ...d,
        sub_items: Array.isArray(d.sub_items) ? (d.sub_items as string[]) : [],
        business_type: d.business_type || 'jw_group'
      }));
      
      setAllDepartments(parsed);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter departments by selected business
  const departments = allDepartments.filter(d => d.business_type === selectedBusiness);

  const getByLevel = (level: string) => 
    departments.filter(d => d.level === level).sort((a, b) => a.position_order - b.position_order);

  const handleDeptClick = (dept: OrgDepartment) => {
    setSelectedDept(dept);
    setModalOpen(true);
  };

  const getName = (dept: OrgDepartment) => isEnglish && dept.name_en ? dept.name_en : dept.name_th;
  const getDesc = (dept: OrgDepartment) => isEnglish && dept.description_en ? dept.description_en : dept.description_th;

  const currentBusinessOption = businessOptions.find(b => b.value === selectedBusiness);
  const CurrentIcon = currentBusinessOption?.icon || Building2;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const board = getByLevel('board')[0];
  const committees = getByLevel('committee');
  const chairman = getByLevel('chairman')[0];
  const mds = getByLevel('md');
  const deputies = getByLevel('deputy');
  const depts = getByLevel('department');

  const hasData = board || committees.length > 0 || chairman || mds.length > 0 || deputies.length > 0 || depts.length > 0;

  return (
    <>
      <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display text-foreground">
            {isEnglish ? 'Organizational Structure' : 'โครงสร้างองค์กร'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {isEnglish 
              ? 'Select a business unit to view its organizational structure'
              : 'เลือกหน่วยธุรกิจเพื่อดูโครงสร้างองค์กร'}
          </p>

          {/* Business Selector Dropdown */}
          <div className="flex justify-center mb-8">
            <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
              <SelectTrigger className="w-[320px] h-14 text-lg font-medium border-2 border-primary/20 bg-card shadow-lg hover:border-primary/40 transition-all">
                <div className="flex items-center gap-3">
                  <CurrentIcon className={`h-5 w-5 ${currentBusinessOption?.color}`} />
                  <SelectValue>
                    {isEnglish ? currentBusinessOption?.label_en : currentBusinessOption?.label_th}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent className="w-[320px]">
                {businessOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${option.color}`} />
                        <span className="font-medium">
                          {isEnglish ? option.label_en : option.label_th}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Organization Chart or Empty State */}
        {hasData ? (
          <div className="max-w-6xl mx-auto overflow-x-auto">
            <div className="min-w-[900px] p-4">
              {/* Level 1: Board of Directors */}
              {board && (
                <>
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={() => handleDeptClick(board)}
                      className="text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      style={{ backgroundColor: board.color || '#2c5282' }}
                    >
                      {getName(board)}
                    </button>
                  </div>
                  <div className="flex justify-center mb-2">
                    <div className="w-0.5 h-6 bg-muted-foreground/40"></div>
                  </div>
                </>
              )}

              {/* Level 2: Four Committees */}
              {committees.length > 0 && (
                <>
                  <div className="flex justify-center gap-4 mb-2 relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[85%] h-0.5 bg-muted-foreground/40"></div>
                    <div className="flex gap-4 pt-0">
                      {committees.map((comm) => (
                        <div key={comm.id} className="flex flex-col items-center">
                          <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
                          <button
                            onClick={() => handleDeptClick(comm)}
                            className="text-foreground px-4 py-3 rounded-lg text-center text-sm font-medium shadow-md min-w-[140px] hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            style={{ backgroundColor: comm.color || '#d4a574' }}
                          >
                            <div className="whitespace-pre-line">{getName(comm)}</div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center mb-2">
                    <div className="w-0.5 h-6 bg-muted-foreground/40"></div>
                  </div>
                </>
              )}

              {/* Level 3: Chairman & CEO */}
              {chairman && (
                <>
                  <div className="flex justify-center mb-2">
                    <button
                      onClick={() => handleDeptClick(chairman)}
                      className="text-white px-6 py-3 rounded-lg text-center font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      style={{ backgroundColor: chairman.color || '#4a7c9b' }}
                    >
                      <div className="whitespace-pre-line">{getName(chairman)}</div>
                    </button>
                  </div>
                  <div className="flex justify-center mb-2">
                    <div className="w-0.5 h-6 bg-muted-foreground/40"></div>
                  </div>
                </>
              )}

              {/* Level 4: Three Managing Directors */}
              {mds.length > 0 && (
                <>
                  <div className="flex justify-center gap-8 mb-2 relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[60%] h-0.5 bg-muted-foreground/40"></div>
                    <div className="flex gap-8 pt-0">
                      {mds.map((md) => (
                        <div key={md.id} className="flex flex-col items-center">
                          <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
                          <button
                            onClick={() => handleDeptClick(md)}
                            className="text-foreground px-4 py-3 rounded-lg text-center text-sm font-medium shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            style={{ backgroundColor: md.color || '#c4d4d8' }}
                          >
                            <div className="whitespace-pre-line">{getName(md)}</div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center gap-32 mb-2">
                    <div className="w-0.5 h-6 bg-muted-foreground/40"></div>
                    <div className="w-0.5 h-6 bg-muted-foreground/40"></div>
                  </div>
                </>
              )}

              {/* Level 5: Deputy Managing Directors */}
              {deputies.length > 0 && (
                <>
                  <div className="flex justify-center gap-16 mb-2 relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[40%] h-0.5 bg-muted-foreground/40"></div>
                    <div className="flex gap-16 pt-0">
                      {deputies.map((dep) => (
                        <div key={dep.id} className="flex flex-col items-center">
                          <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
                          <button
                            onClick={() => handleDeptClick(dep)}
                            className="text-foreground px-4 py-2 rounded-lg text-center text-sm font-medium shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            style={{ backgroundColor: dep.color || '#d4a574' }}
                          >
                            <div className="whitespace-pre-line">{getName(dep)}</div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className="w-[90%] h-0.5 bg-muted-foreground/40"></div>
                  </div>
                </>
              )}

              {/* Level 6: Departments */}
              {depts.length > 0 && (
                <div className="grid grid-cols-5 gap-3">
                  {depts.map((dept) => (
                    <div key={dept.id} className="flex flex-col items-center">
                      <div className="w-0.5 h-4 bg-muted-foreground/40"></div>
                      <button
                        onClick={() => handleDeptClick(dept)}
                        className="text-white px-3 py-2 rounded-t-lg text-center text-sm font-semibold w-full hover:brightness-110 transition-all duration-300 cursor-pointer"
                        style={{ backgroundColor: dept.color || '#4a7c9b' }}
                      >
                        {getName(dept)}
                      </button>
                      <div className="bg-card border border-border rounded-b-lg p-3 w-full min-h-[120px]">
                        {dept.sub_items && dept.sub_items.length > 0 && (
                          <ul className="text-xs text-muted-foreground space-y-1.5">
                            {dept.sub_items.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer Date */}
              <div className="mt-8 text-center text-sm text-muted-foreground">
                {isEnglish 
                  ? 'Organization Structure as of January 1, 2568' 
                  : 'โครงสร้างองค์กร ณ วันที่ 1 มกราคม 2568'}
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <CurrentIcon className={`h-10 w-10 ${currentBusinessOption?.color}`} />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              {isEnglish 
                ? `No organizational data for ${currentBusinessOption?.label_en}` 
                : `ยังไม่มีข้อมูลโครงสร้างองค์กรสำหรับ${currentBusinessOption?.label_th}`}
            </h3>
            <p className="text-muted-foreground">
              {isEnglish 
                ? 'The organizational structure for this business unit has not been set up yet.' 
                : 'โครงสร้างองค์กรของหน่วยธุรกิจนี้ยังไม่ได้ถูกตั้งค่า'}
            </p>
          </div>
        )}
      </div>

      {/* Department Detail Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedDept && getName(selectedDept)}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              {selectedDept && getDesc(selectedDept)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDept && selectedDept.sub_items && selectedDept.sub_items.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-foreground">
                {isEnglish ? 'Sub-departments / Units:' : 'หน่วยงานย่อย:'}
              </h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {selectedDept.sub_items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: selectedDept?.color || '#4a7c9b' }}
              />
              <span className="text-sm text-muted-foreground">
                {isEnglish ? 'Level: ' : 'ระดับ: '}
                {selectedDept?.level === 'board' && (isEnglish ? 'Board' : 'คณะกรรมการ')}
                {selectedDept?.level === 'committee' && (isEnglish ? 'Committee' : 'คณะกรรมการชุดย่อย')}
                {selectedDept?.level === 'chairman' && (isEnglish ? 'Chairman' : 'ประธาน')}
                {selectedDept?.level === 'md' && (isEnglish ? 'Managing Director' : 'กรรมการผู้จัดการ')}
                {selectedDept?.level === 'deputy' && (isEnglish ? 'Deputy' : 'รองกรรมการผู้จัดการ')}
                {selectedDept?.level === 'department' && (isEnglish ? 'Department' : 'ฝ่ายงาน')}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrganizationChart;