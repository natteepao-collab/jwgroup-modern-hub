import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, Save, User, Building2, Users, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Executive {
  id: string;
  name: string;
  title: string;
  description: string | null;
  image_url: string | null;
  position_order: number;
  is_chairman: boolean;
  quote: string | null;
  department: string | null;
  level: string | null;
}

const departmentOptions = [
  { value: 'none', label: 'ไม่ระบุ' },
  { value: 'real_estate', label: 'อสังหาริมทรัพย์' },
  { value: 'hotel', label: 'โรงแรม' },
  { value: 'veterinary', label: 'สัตวแพทย์' },
  { value: 'wellness', label: 'สุขภาพ' },
  { value: 'finance', label: 'การเงิน' },
  { value: 'hr', label: 'ทรัพยากรบุคคล' },
  { value: 'marketing', label: 'การตลาด' },
  { value: 'it', label: 'เทคโนโลยี' },
];

const levelOptions = [
  { value: 'executive', label: 'ผู้บริหารระดับสูง' },
  { value: 'manager', label: 'ผู้จัดการแผนก' },
];

// Sortable Executive Card Component
interface SortableExecutiveCardProps {
  executive: Executive;
  savingId: string | null;
  uploadingId: string | null;
  onSave: (executive: Executive) => void;
  onDelete: (id: string) => void;
  onChange: (id: string, field: keyof Executive, value: string | boolean | number | null) => void;
  onFileUpload: (id: string, file: File) => void;
  fileInputRef: (el: HTMLInputElement | null) => void;
  onTriggerFileInput: () => void;
}

const SortableExecutiveCard = ({
  executive,
  savingId,
  uploadingId,
  onSave,
  onDelete,
  onChange,
  onFileUpload,
  fileInputRef,
  onTriggerFileInput,
}: SortableExecutiveCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: executive.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`border-2 ${executive.is_chairman ? 'border-primary/50 bg-primary/5' : executive.level === 'manager' ? 'border-blue-500/30 bg-blue-50/30 dark:bg-blue-950/20' : ''} ${isDragging ? 'shadow-lg ring-2 ring-primary' : ''}`}>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Drag Handle */}
            <div 
              className="flex items-center justify-center lg:justify-start cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors">
                <GripVertical className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">ลาก</span>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 mx-auto lg:mx-0">
                {executive.image_url ? (
                  <img
                    src={executive.image_url}
                    alt={executive.name}
                    className="w-full h-full object-cover rounded-full border-4 border-primary/20"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-muted flex items-center justify-center border-4 border-dashed border-muted-foreground/30">
                    <User className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFileUpload(executive.id, file);
                  }}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs"
                  onClick={onTriggerFileInput}
                  disabled={uploadingId === executive.id}
                >
                  {uploadingId === executive.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                  ) : (
                    <>
                      <Upload className="w-3 h-3 mr-1" />
                      อัปโหลด
                    </>
                  )}
                </Button>
              </div>
              {/* Level Badge */}
              <div className="text-center mt-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  executive.is_chairman 
                    ? 'bg-primary/20 text-primary' 
                    : executive.level === 'manager'
                      ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {executive.is_chairman ? 'ประธาน' : executive.level === 'manager' ? 'ผู้จัดการแผนก' : 'ผู้บริหาร'}
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ชื่อ</Label>
                <Input
                  value={executive.name}
                  onChange={(e) => onChange(executive.id, 'name', e.target.value)}
                  placeholder="ชื่อ"
                />
              </div>

              <div className="space-y-2">
                <Label>ตำแหน่ง</Label>
                <Input
                  value={executive.title}
                  onChange={(e) => onChange(executive.id, 'title', e.target.value)}
                  placeholder="ตำแหน่ง"
                />
              </div>

              <div className="space-y-2">
                <Label>ระดับ</Label>
                <Select 
                  value={executive.level || 'executive'} 
                  onValueChange={(value) => onChange(executive.id, 'level', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levelOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>แผนก</Label>
                <Select 
                  value={executive.department || 'none'} 
                  onValueChange={(value) => onChange(executive.id, 'department', value === 'none' ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกแผนก" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>ลำดับการแสดง</Label>
                <Input
                  type="number"
                  value={executive.position_order}
                  onChange={(e) => onChange(executive.id, 'position_order', parseInt(e.target.value) || 0)}
                  min={1}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>ประธานบริษัท</Label>
                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    checked={executive.is_chairman}
                    onCheckedChange={(checked) => onChange(executive.id, 'is_chairman', checked)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {executive.is_chairman ? 'ใช่' : 'ไม่ใช่'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>คำอธิบาย</Label>
                <Input
                  value={executive.description || ''}
                  onChange={(e) => onChange(executive.id, 'description', e.target.value)}
                  placeholder="คำอธิบายสั้นๆ"
                />
              </div>

              {executive.is_chairman && (
                <div className="space-y-2 md:col-span-2">
                  <Label>คำกล่าวของประธาน</Label>
                  <Textarea
                    value={executive.quote || ''}
                    onChange={(e) => onChange(executive.id, 'quote', e.target.value)}
                    placeholder="คำกล่าวหรือวิสัยทัศน์ของประธาน"
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex lg:flex-col gap-2 justify-end">
              <Button
                onClick={() => onSave(executive)}
                disabled={savingId === executive.id}
                size="sm"
              >
                {savingId === executive.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    บันทึก
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(executive.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                ลบ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ExecutiveManagement = () => {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchExecutives();
  }, []);

  const fetchExecutives = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('executives')
        .select('*')
        .order('position_order', { ascending: true });

      if (error) throw error;
      setExecutives((data as Executive[]) || []);
    } catch (error) {
      console.error('Error fetching executives:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (id: string, field: keyof Executive, value: string | boolean | number | null) => {
    setExecutives(prev =>
      prev.map(exec =>
        exec.id === id ? { ...exec, [field]: value } : exec
      )
    );
  };

  const handleFileUpload = async (id: string, file: File) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('รองรับเฉพาะไฟล์ JPG, PNG, WEBP');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('ขนาดไฟล์ต้องไม่เกิน 10MB');
      return;
    }

    setUploadingId(id);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${Date.now()}.${fileExt}`;
      const filePath = `executives/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('executive-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('executive-images')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('executives')
        .update({ image_url: publicUrl })
        .eq('id', id);

      if (updateError) throw updateError;

      handleChange(id, 'image_url', publicUrl);
      toast.success('อัปโหลดรูปภาพสำเร็จ');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
    } finally {
      setUploadingId(null);
    }
  };

  const saveExecutive = async (executive: Executive) => {
    setSavingId(executive.id);
    try {
      const { error } = await supabase
        .from('executives')
        .update({
          name: executive.name,
          title: executive.title,
          description: executive.description,
          quote: executive.quote,
          is_chairman: executive.is_chairman,
          position_order: executive.position_order,
          department: executive.department,
          level: executive.level,
        })
        .eq('id', executive.id);

      if (error) throw error;
      toast.success('บันทึกข้อมูลสำเร็จ');
    } catch (error) {
      console.error('Error saving executive:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSavingId(null);
    }
  };

  const addExecutive = async (level: string = 'executive') => {
    try {
      const maxOrder = Math.max(...executives.map(e => e.position_order), 0);
      const { data, error } = await supabase
        .from('executives')
        .insert({
          name: level === 'manager' ? 'ผู้จัดการใหม่' : 'ผู้บริหารใหม่',
          title: 'ตำแหน่ง',
          description: '',
          position_order: maxOrder + 1,
          is_chairman: false,
          level: level,
          department: level === 'manager' ? 'real_estate' : null,
        })
        .select()
        .single();

      if (error) throw error;
      setExecutives(prev => [...prev, data as Executive]);
      toast.success(level === 'manager' ? 'เพิ่มผู้จัดการใหม่สำเร็จ' : 'เพิ่มผู้บริหารใหม่สำเร็จ');
    } catch (error) {
      console.error('Error adding executive:', error);
      toast.error('เกิดข้อผิดพลาดในการเพิ่ม');
    }
  };

  const deleteExecutive = async (id: string) => {
    if (!confirm('คุณต้องการลบรายการนี้หรือไม่?')) return;

    try {
      const { error } = await supabase
        .from('executives')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setExecutives(prev => prev.filter(exec => exec.id !== id));
      toast.success('ลบสำเร็จ');
    } catch (error) {
      console.error('Error deleting executive:', error);
      toast.error('เกิดข้อผิดพลาดในการลบ');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = executives.findIndex((exec) => exec.id === active.id);
      const newIndex = executives.findIndex((exec) => exec.id === over.id);

      const newExecutives = arrayMove(executives, oldIndex, newIndex).map((exec, index) => ({
        ...exec,
        position_order: index + 1,
      }));

      setExecutives(newExecutives);

      // Save new order to database
      setIsSavingOrder(true);
      try {
        const updates = newExecutives.map((exec) => ({
          id: exec.id,
          position_order: exec.position_order,
        }));

        for (const update of updates) {
          await supabase
            .from('executives')
            .update({ position_order: update.position_order })
            .eq('id', update.id);
        }

        toast.success('บันทึกลำดับใหม่เรียบร้อย');
      } catch (error) {
        console.error('Error saving order:', error);
        toast.error('เกิดข้อผิดพลาดในการบันทึกลำดับ');
        fetchExecutives(); // Revert to original order
      } finally {
        setIsSavingOrder(false);
      }
    }
  };

  const filteredExecutives = executives.filter(exec => {
    if (filterLevel === 'all') return true;
    if (filterLevel === 'chairman') return exec.is_chairman;
    if (filterLevel === 'executive') return !exec.is_chairman && exec.level !== 'manager';
    if (filterLevel === 'manager') return exec.level === 'manager';
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              จัดการทีมผู้บริหาร
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              ลากเพื่อจัดลำดับการแสดง {isSavingOrder && <span className="text-primary">(กำลังบันทึก...)</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="กรองตามระดับ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="chairman">ประธาน</SelectItem>
                <SelectItem value="executive">ผู้บริหาร</SelectItem>
                <SelectItem value="manager">ผู้จัดการแผนก</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => addExecutive('executive')} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มผู้บริหาร
            </Button>
            <Button onClick={() => addExecutive('manager')} size="sm" variant="secondary">
              <Building2 className="w-4 h-4 mr-2" />
              เพิ่มผู้จัดการแผนก
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {filteredExecutives.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            ยังไม่มีข้อมูล
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredExecutives.map(e => e.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6">
                {filteredExecutives.map((executive) => (
                  <SortableExecutiveCard
                    key={executive.id}
                    executive={executive}
                    savingId={savingId}
                    uploadingId={uploadingId}
                    onSave={saveExecutive}
                    onDelete={deleteExecutive}
                    onChange={handleChange}
                    onFileUpload={handleFileUpload}
                    fileInputRef={(el) => { fileInputRefs.current[executive.id] = el; }}
                    onTriggerFileInput={() => fileInputRefs.current[executive.id]?.click()}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
};

export default ExecutiveManagement;
