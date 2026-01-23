import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, X, Save, Building, Hotel, Heart, Leaf, HardHat, LucideIcon, Users, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { useAllBusinessTypes } from '@/hooks/useBusinessTypes';

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
  is_published: boolean;
  business_type: string;
}

const levelOptions = [
  { value: 'board', label: 'คณะกรรมการบริษัท', order: 1 },
  { value: 'committee', label: 'คณะกรรมการชุดย่อย', order: 2 },
  { value: 'chairman', label: 'ประธาน', order: 3 },
  { value: 'md', label: 'กรรมการผู้จัดการ', order: 4 },
  { value: 'deputy', label: 'รองกรรมการผู้จัดการ', order: 5 },
  { value: 'department', label: 'ฝ่ายงาน', order: 6 },
];

// Icon mapping helper
const iconMap: Record<string, LucideIcon> = {
  building: Building,
  hotel: Hotel,
  heart: Heart,
  leaf: Leaf,
  hardhat: HardHat,
};

const getIconComponent = (iconName: string | null): LucideIcon => {
  if (!iconName) return Building;
  return iconMap[iconName.toLowerCase()] || Building;
};

const getLevelLabel = (level: string) => {
  return levelOptions.find(l => l.value === level)?.label || level;
};

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    board: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    committee: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    chairman: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    md: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    deputy: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    department: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
  };
  return colors[level] || 'bg-muted text-muted-foreground';
};

const OrgDepartmentManagement = () => {
  const { data: businessTypesData = [], isLoading: businessTypesLoading } = useAllBusinessTypes();
  const [departments, setDepartments] = useState<OrgDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState({
    name_th: '',
    name_en: '',
    description_th: '',
    description_en: '',
    level: 'department',
    color: '#4a7c9b',
    sub_items: '',
    position_order: 0,
    is_published: true,
    business_type: '',
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    // Set default tab when business types are loaded
    if (businessTypesData.length > 0 && !activeTab) {
      setActiveTab(businessTypesData[0].business_key);
    }
  }, [businessTypesData, activeTab]);

  useEffect(() => {
    // Initialize all levels as expanded
    const initialExpanded: Record<string, boolean> = {};
    levelOptions.forEach(level => {
      initialExpanded[level.value] = true;
    });
    setExpandedLevels(initialExpanded);
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('org_departments')
        .select('*')
        .order('business_type')
        .order('level')
        .order('position_order');
      
      if (error) throw error;
      
      const parsed: OrgDepartment[] = (data || []).map(d => ({
        ...d,
        sub_items: Array.isArray(d.sub_items) ? (d.sub_items as string[]) : [],
        business_type: d.business_type || 'realestate'
      }));
      
      setDepartments(parsed);
    } catch (error) {
      console.error('Error:', error);
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name_th: '',
      name_en: '',
      description_th: '',
      description_en: '',
      level: 'department',
      color: '#4a7c9b',
      sub_items: '',
      position_order: 0,
      is_published: true,
      business_type: activeTab,
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (dept: OrgDepartment) => {
    setFormData({
      name_th: dept.name_th,
      name_en: dept.name_en || '',
      description_th: dept.description_th || '',
      description_en: dept.description_en || '',
      level: dept.level,
      color: dept.color || '#4a7c9b',
      sub_items: dept.sub_items.join('\n'),
      position_order: dept.position_order,
      is_published: dept.is_published,
      business_type: dept.business_type || 'realestate',
    });
    setEditingId(dept.id);
    setShowAddForm(true);
  };

  const handleSave = async () => {
    if (!formData.name_th) {
      toast.error('กรุณากรอกชื่อภาษาไทย');
      return;
    }

    try {
      const subItemsArray = formData.sub_items
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const payload = {
        name_th: formData.name_th,
        name_en: formData.name_en || null,
        description_th: formData.description_th || null,
        description_en: formData.description_en || null,
        level: formData.level,
        color: formData.color,
        sub_items: subItemsArray,
        position_order: formData.position_order,
        is_published: formData.is_published,
        business_type: formData.business_type || activeTab,
      };

      if (editingId) {
        const { error } = await supabase
          .from('org_departments')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('อัปเดตข้อมูลสำเร็จ');
      } else {
        const { error } = await supabase
          .from('org_departments')
          .insert(payload);
        if (error) throw error;
        toast.success('เพิ่มข้อมูลสำเร็จ');
      }

      resetForm();
      fetchDepartments();
    } catch (error) {
      console.error('Error:', error);
      toast.error('เกิดข้อผิดพลาด');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันการลบข้อมูลนี้?')) return;

    try {
      const { error } = await supabase
        .from('org_departments')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('ลบข้อมูลสำเร็จ');
      fetchDepartments();
    } catch (error) {
      console.error('Error:', error);
      toast.error('เกิดข้อผิดพลาด');
    }
  };

  const toggleLevel = (level: string) => {
    setExpandedLevels(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  // Get departments for a specific business type
  const getDepartmentsByBusiness = (businessKey: string) => {
    return departments.filter(d => d.business_type === businessKey);
  };

  // Group departments by level
  const groupByLevel = (depts: OrgDepartment[]) => {
    const groups: Record<string, OrgDepartment[]> = {};
    levelOptions.forEach(level => {
      groups[level.value] = [];
    });
    depts.forEach(d => {
      if (groups[d.level]) {
        groups[d.level].push(d);
      }
    });
    return groups;
  };

  const getBusinessStats = (businessKey: string) => {
    const depts = getDepartmentsByBusiness(businessKey);
    return {
      total: depts.length,
      published: depts.filter(d => d.is_published).length,
    };
  };

  if (loading || businessTypesLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">จัดการโครงสร้างองค์กร</h2>
          <p className="text-muted-foreground text-sm mt-1">
            จัดการตำแหน่งและฝ่ายงานแยกตามแต่ละธุรกิจ
          </p>
        </div>
      </div>

      {/* Business Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-2 bg-muted/50 p-2">
          {businessTypesData.map((business) => {
            const Icon = getIconComponent(business.icon_name);
            const stats = getBusinessStats(business.business_key);
            return (
              <TabsTrigger
                key={business.business_key}
                value={business.business_key}
                className="flex-1 min-w-[150px] data-[state=active]:shadow-md transition-all py-3"
                style={{
                  '--tab-active-color': business.color || '#D97706',
                } as React.CSSProperties}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: business.color || undefined }} />
                    <span className="font-medium">{business.name_th}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {stats.total} ตำแหน่ง
                  </span>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {businessTypesData.map((business) => {
          const businessDepts = getDepartmentsByBusiness(business.business_key);
          const grouped = groupByLevel(businessDepts);
          const Icon = getIconComponent(business.icon_name);

          return (
            <TabsContent key={business.business_key} value={business.business_key} className="mt-6">
              {/* Business Header with Add Button */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${business.color}20` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: business.color || undefined }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{business.name_th}</h3>
                    <p className="text-sm text-muted-foreground">{business.name_en}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, business_type: business.business_key }));
                    setShowAddForm(true);
                  }}
                  style={{ backgroundColor: business.color || undefined }}
                  className="hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มตำแหน่ง
                </Button>
              </div>

              {/* Add/Edit Form */}
              {showAddForm && formData.business_type === business.business_key && (
                <Card className="mb-6 border-2" style={{ borderColor: `${business.color}40` }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" style={{ color: business.color || undefined }} />
                          {editingId ? 'แก้ไขข้อมูล' : 'เพิ่มตำแหน่ง/ฝ่ายงานใหม่'}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          สำหรับ {business.name_th}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={resetForm}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Level and Names Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">ระดับ *</Label>
                        <Select
                          value={formData.level}
                          onValueChange={(val) => setFormData({ ...formData, level: val })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {levelOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={getLevelColor(opt.value)}>
                                    {opt.label}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">ชื่อ (ไทย) *</Label>
                        <Input
                          value={formData.name_th}
                          onChange={(e) => setFormData({ ...formData, name_th: e.target.value })}
                          placeholder="เช่น ฝ่ายการตลาด"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">ชื่อ (English)</Label>
                        <Input
                          value={formData.name_en}
                          onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                          placeholder="e.g. Marketing Department"
                        />
                      </div>
                    </div>

                    {/* Description Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">คำอธิบาย (ไทย)</Label>
                        <Textarea
                          value={formData.description_th}
                          onChange={(e) => setFormData({ ...formData, description_th: e.target.value })}
                          placeholder="รายละเอียดเพิ่มเติม..."
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">คำอธิบาย (English)</Label>
                        <Textarea
                          value={formData.description_en}
                          onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                          placeholder="Additional details..."
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Settings Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">สี</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-12 h-10 p-1 cursor-pointer"
                          />
                          <Input
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            placeholder="#4a7c9b"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">ลำดับการแสดง</Label>
                        <Input
                          type="number"
                          value={formData.position_order}
                          onChange={(e) => setFormData({ ...formData, position_order: parseInt(e.target.value) || 0 })}
                          min={0}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">สถานะ</Label>
                        <div className="flex items-center gap-3 h-10">
                          <Switch
                            checked={formData.is_published}
                            onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                          />
                          <span className={formData.is_published ? 'text-green-600' : 'text-muted-foreground'}>
                            {formData.is_published ? 'เผยแพร่' : 'ซ่อน'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sub Items */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">หน่วยงานย่อย</Label>
                      <Textarea
                        value={formData.sub_items}
                        onChange={(e) => setFormData({ ...formData, sub_items: e.target.value })}
                        placeholder="ใส่ชื่อหน่วยงานย่อย แต่ละบรรทัด = 1 หน่วยงาน&#10;เช่น:&#10;ทีมขาย&#10;ทีมการตลาดออนไลน์&#10;ทีมประชาสัมพันธ์"
                        rows={4}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">แต่ละบรรทัด = 1 หน่วยงานย่อย</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSave} style={{ backgroundColor: business.color || undefined }}>
                        <Save className="h-4 w-4 mr-2" />
                        {editingId ? 'อัปเดต' : 'บันทึก'}
                      </Button>
                      <Button variant="outline" onClick={resetForm}>
                        ยกเลิก
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Departments List by Level */}
              <div className="space-y-4">
                {levelOptions.map((level) => {
                  const levelDepts = grouped[level.value];
                  if (!levelDepts || levelDepts.length === 0) return null;

                  const isExpanded = expandedLevels[level.value];

                  return (
                    <Card key={level.value} className="overflow-hidden">
                      <CardHeader 
                        className="py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleLevel(level.value)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className={getLevelColor(level.value)}>
                              {level.label}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {levelDepts.length} รายการ
                            </span>
                          </div>
                          <Button variant="ghost" size="sm">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      {isExpanded && (
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {levelDepts.map((dept) => (
                              <div
                                key={dept.id}
                                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors group"
                              >
                                <div 
                                  className="w-1 h-12 rounded-full"
                                  style={{ backgroundColor: dept.color || '#4a7c9b' }}
                                />
                                <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium truncate">{dept.name_th}</span>
                                    {!dept.is_published && (
                                      <Badge variant="outline" className="text-xs">ซ่อน</Badge>
                                    )}
                                  </div>
                                  {dept.name_en && (
                                    <div className="text-sm text-muted-foreground truncate">{dept.name_en}</div>
                                  )}
                                  {dept.sub_items.length > 0 && (
                                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {dept.sub_items.length} หน่วยงานย่อย
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleEdit(dept)}
                                    className="h-8 w-8"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDelete(dept.id)}
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>

              {/* Empty State */}
              {businessDepts.length === 0 && (
                <Card>
                  <CardContent className="py-16 text-center">
                    <div 
                      className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${business.color}20` }}
                    >
                      <Icon className="h-8 w-8" style={{ color: business.color || undefined }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">ยังไม่มีข้อมูลโครงสร้างองค์กร</h3>
                    <p className="text-muted-foreground mb-4">
                      เริ่มต้นเพิ่มตำแหน่งและฝ่ายงานสำหรับ {business.name_th}
                    </p>
                    <Button 
                      onClick={() => {
                        setFormData(prev => ({ ...prev, business_type: business.business_key }));
                        setShowAddForm(true);
                      }}
                      style={{ backgroundColor: business.color || undefined }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      เพิ่มตำแหน่งแรก
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default OrgDepartmentManagement;
