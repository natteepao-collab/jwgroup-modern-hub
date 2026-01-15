import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, X, Save, Building, Hotel, Heart, Leaf, HardHat, Building2 } from 'lucide-react';

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
  { value: 'board', label: 'คณะกรรมการบริษัท' },
  { value: 'committee', label: 'คณะกรรมการชุดย่อย' },
  { value: 'chairman', label: 'ประธาน' },
  { value: 'md', label: 'กรรมการผู้จัดการ' },
  { value: 'deputy', label: 'รองกรรมการผู้จัดการ' },
  { value: 'department', label: 'ฝ่ายงาน' },
];

const businessOptions = [
  { value: 'jw_group', label: 'JW Group (บริษัทแม่)', icon: Building2 },
  { value: 'realestate', label: 'อสังหาริมทรัพย์', icon: Building },
  { value: 'hotel', label: 'โรงแรม', icon: Hotel },
  { value: 'pet', label: 'สัตว์เลี้ยง', icon: Heart },
  { value: 'wellness', label: 'สุขภาพ', icon: Leaf },
  { value: 'construction', label: 'ก่อสร้าง', icon: HardHat },
];

const OrgDepartmentManagement = () => {
  const [departments, setDepartments] = useState<OrgDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterBusiness, setFilterBusiness] = useState<string>('all');
  
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
    business_type: 'jw_group',
  });

  useEffect(() => {
    fetchDepartments();
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
        business_type: d.business_type || 'jw_group'
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
      business_type: filterBusiness === 'all' ? 'jw_group' : filterBusiness,
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
      business_type: dept.business_type || 'jw_group',
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
        business_type: formData.business_type,
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

  // Filter departments by selected business
  const filteredDepartments = filterBusiness === 'all' 
    ? departments 
    : departments.filter(d => d.business_type === filterBusiness);

  const groupByLevel = (depts: OrgDepartment[]) => {
    const groups: Record<string, OrgDepartment[]> = {};
    depts.forEach(d => {
      if (!groups[d.level]) groups[d.level] = [];
      groups[d.level].push(d);
    });
    return groups;
  };

  const getBusinessLabel = (businessType: string) => {
    return businessOptions.find(b => b.value === businessType)?.label || businessType;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const grouped = groupByLevel(filteredDepartments);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">จัดการโครงสร้างองค์กร</h2>
        <div className="flex items-center gap-3">
          {/* Business Filter */}
          <Select value={filterBusiness} onValueChange={setFilterBusiness}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="กรองตามธุรกิจ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              {businessOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{opt.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มตำแหน่ง/ฝ่ายงาน
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingId ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูลใหม่'}</span>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Business Type Selector */}
            <div className="space-y-2">
              <Label>ธุรกิจ *</Label>
              <Select
                value={formData.business_type}
                onValueChange={(val) => setFormData({ ...formData, business_type: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {businessOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{opt.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ชื่อ (ไทย) *</Label>
                <Input
                  value={formData.name_th}
                  onChange={(e) => setFormData({ ...formData, name_th: e.target.value })}
                  placeholder="ชื่อภาษาไทย"
                />
              </div>
              <div className="space-y-2">
                <Label>ชื่อ (English)</Label>
                <Input
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  placeholder="Name in English"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>คำอธิบาย (ไทย)</Label>
                <Textarea
                  value={formData.description_th}
                  onChange={(e) => setFormData({ ...formData, description_th: e.target.value })}
                  placeholder="คำอธิบายภาษาไทย"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>คำอธิบาย (English)</Label>
                <Textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder="Description in English"
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>ระดับ</Label>
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
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>สี</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#4a7c9b"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>ลำดับ</Label>
                <Input
                  type="number"
                  value={formData.position_order}
                  onChange={(e) => setFormData({ ...formData, position_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>หน่วยงานย่อย (แต่ละบรรทัด = 1 หน่วยงาน)</Label>
              <Textarea
                value={formData.sub_items}
                onChange={(e) => setFormData({ ...formData, sub_items: e.target.value })}
                placeholder="ฝ่ายโครงการ 1&#10;ฝ่ายโครงการ 2&#10;ฝ่ายโครงการ 3"
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label>เผยแพร่</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
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

      {/* List by Level */}
      {levelOptions.map((level) => (
        grouped[level.value] && grouped[level.value].length > 0 && (
          <Card key={level.value}>
            <CardHeader>
              <CardTitle className="text-lg">{level.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {grouped[level.value].map((dept) => (
                  <div
                    key={dept.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ borderLeftColor: dept.color || '#4a7c9b', borderLeftWidth: '4px' }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{dept.name_th}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {getBusinessLabel(dept.business_type)}
                        </span>
                      </div>
                      {dept.name_en && (
                        <div className="text-sm text-muted-foreground">{dept.name_en}</div>
                      )}
                      {dept.sub_items.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          หน่วยงานย่อย: {dept.sub_items.length} รายการ
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${dept.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {dept.is_published ? 'เผยแพร่' : 'ซ่อน'}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(dept)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(dept.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ))}

      {filteredDepartments.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {filterBusiness === 'all' 
              ? 'ยังไม่มีข้อมูลโครงสร้างองค์กร' 
              : `ยังไม่มีข้อมูลโครงสร้างองค์กรสำหรับ ${getBusinessLabel(filterBusiness)}`}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrgDepartmentManagement;