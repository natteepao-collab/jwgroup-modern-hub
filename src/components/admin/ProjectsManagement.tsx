import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Upload, GripVertical, Building, Hotel, Heart, Leaf } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Project {
  id: string;
  business_type: string;
  name_th: string;
  name_en: string | null;
  name_cn: string | null;
  description_th: string | null;
  description_en: string | null;
  description_cn: string | null;
  location_th: string | null;
  location_en: string | null;
  year_completed: string | null;
  image_url: string | null;
  gallery_images: string[];
  is_featured: boolean;
  is_published: boolean;
  position_order: number;
}

const emptyProject: Omit<Project, 'id'> = {
  business_type: 'realestate',
  name_th: '',
  name_en: null,
  name_cn: null,
  description_th: null,
  description_en: null,
  description_cn: null,
  location_th: null,
  location_en: null,
  year_completed: null,
  image_url: null,
  gallery_images: [],
  is_featured: false,
  is_published: true,
  position_order: 0,
};

const businessTypes = [
  { value: 'realestate', label: 'อสังหาริมทรัพย์', icon: Building },
  { value: 'hotel', label: 'โรงแรม', icon: Hotel },
  { value: 'pet', label: 'สัตว์เลี้ยง', icon: Heart },
  { value: 'wellness', label: 'สุขภาพ', icon: Leaf },
];

const SortableItem = ({ project, onEdit, onDelete }: { project: Project; onEdit: () => void; onDelete: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const businessType = businessTypes.find(b => b.value === project.business_type);
  const Icon = businessType?.icon || Building;

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 bg-card rounded-lg border">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </button>
      <div className="w-16 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
        {project.image_url ? (
          <img src={project.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{project.name_th}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="px-2 py-0.5 bg-muted rounded text-xs">{businessType?.label}</span>
          {project.year_completed && <span>{project.year_completed}</span>}
          {!project.is_published && (
            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs">
              Draft
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

const ProjectsManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Project, 'id'>>(emptyProject);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);
      const newProjects = arrayMove(projects, oldIndex, newIndex);
      setProjects(newProjects);

      // Update position_order in database
      for (let i = 0; i < newProjects.length; i++) {
        await supabase
          .from('projects')
          .update({ position_order: i })
          .eq('id', newProjects[i].id);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('ไฟล์ต้องมีขนาดไม่เกิน 10MB');
      return;
    }

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('กรุณาเข้าสู่ระบบก่อนอัปโหลดรูปภาพ');
      return;
    }

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error(`อัปโหลดรูปภาพไม่สำเร็จ: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName);

    if (isGallery) {
      setFormData(prev => ({
        ...prev,
        gallery_images: [...(prev.gallery_images || []), urlData.publicUrl]
      }));
    } else {
      setFormData(prev => ({ ...prev, image_url: urlData.publicUrl }));
    }

    setUploading(false);
    toast.success('อัปโหลดรูปภาพสำเร็จ');
  };

  const handleSubmit = async () => {
    if (!formData.name_th) {
      toast.error('กรุณากรอกชื่อโครงการ');
      return;
    }

    setLoading(true);

    if (editingId) {
      const { error } = await supabase
        .from('projects')
        .update(formData)
        .eq('id', editingId);

      if (error) {
        toast.error('อัปเดตไม่สำเร็จ');
      } else {
        toast.success('อัปเดตโครงการเรียบร้อย');
      }
    } else {
      const { error } = await supabase
        .from('projects')
        .insert({ ...formData, position_order: projects.length });

      if (error) {
        toast.error('เพิ่มโครงการไม่สำเร็จ');
      } else {
        toast.success('เพิ่มโครงการเรียบร้อย');
      }
    }

    setLoading(false);
    setDialogOpen(false);
    setFormData(emptyProject);
    setEditingId(null);
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setFormData({
      business_type: project.business_type,
      name_th: project.name_th,
      name_en: project.name_en,
      name_cn: project.name_cn,
      description_th: project.description_th,
      description_en: project.description_en,
      description_cn: project.description_cn,
      location_th: project.location_th,
      location_en: project.location_en,
      year_completed: project.year_completed,
      image_url: project.image_url,
      gallery_images: project.gallery_images || [],
      is_featured: project.is_featured,
      is_published: project.is_published,
      position_order: project.position_order,
    });
    setEditingId(project.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบโครงการนี้?')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      toast.error('ลบไม่สำเร็จ');
    } else {
      toast.success('ลบโครงการเรียบร้อย');
      fetchProjects();
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  const filteredProjects = filterType === 'all'
    ? projects
    : projects.filter(p => p.business_type === filterType);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>จัดการโครงการ</CardTitle>
        <div className="flex items-center gap-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="ทั้งหมด" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              {businessTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setFormData(emptyProject); setEditingId(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มโครงการ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'แก้ไขโครงการ' : 'เพิ่มโครงการใหม่'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ประเภทธุรกิจ *</Label>
                    <Select value={formData.business_type} onValueChange={(v) => setFormData(prev => ({ ...prev, business_type: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>ปีที่สร้างเสร็จ</Label>
                    <Input
                      value={formData.year_completed || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, year_completed: e.target.value }))}
                      placeholder="เช่น 2567"
                    />
                  </div>
                </div>

                <div>
                  <Label>ชื่อโครงการ (TH) *</Label>
                  <Input
                    value={formData.name_th}
                    onChange={(e) => setFormData(prev => ({ ...prev, name_th: e.target.value }))}
                    placeholder="ชื่อโครงการภาษาไทย"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ชื่อโครงการ (EN)</Label>
                    <Input
                      value={formData.name_en || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>ชื่อโครงการ (CN)</Label>
                    <Input
                      value={formData.name_cn || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name_cn: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>รายละเอียด (TH)</Label>
                  <RichTextEditor
                    value={formData.description_th || ''}
                    onChange={(value) => setFormData(prev => ({ ...prev, description_th: value }))}
                    placeholder="รายละเอียดโครงการภาษาไทย"
                  />
                </div>

                <div>
                  <Label>รายละเอียด (EN)</Label>
                  <RichTextEditor
                    value={formData.description_en || ''}
                    onChange={(value) => setFormData(prev => ({ ...prev, description_en: value }))}
                    placeholder="Project description in English"
                  />
                </div>

                <div>
                  <Label>รายละเอียด (CN)</Label>
                  <RichTextEditor
                    value={formData.description_cn || ''}
                    onChange={(value) => setFormData(prev => ({ ...prev, description_cn: value }))}
                    placeholder="Project description in Chinese"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ที่ตั้ง (TH)</Label>
                    <Input
                      value={formData.location_th || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_th: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>ที่ตั้ง (EN)</Label>
                    <Input
                      value={formData.location_en || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_en: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>รูปภาพหลัก</Label>
                  <div className="flex items-center gap-3 mt-2">
                    {formData.image_url && (
                      <img src={formData.image_url} alt="" className="w-24 h-16 object-cover rounded" />
                    )}
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80">
                        <Upload className="w-4 h-4" />
                        <span>{uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูป'}</span>
                      </div>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden" disabled={uploading} />
                    </label>
                  </div>
                </div>

                <div>
                  <Label>แกลเลอรี่รูปภาพ</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.gallery_images?.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt="" className="w-20 h-16 object-cover rounded" />
                        <button
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <label className="cursor-pointer">
                      <div className="w-20 h-16 border-2 border-dashed rounded flex items-center justify-center hover:bg-muted/50">
                        <Plus className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" disabled={uploading} />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                    />
                    <Label>Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                    />
                    <Label>เผยแพร่</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'กำลังบันทึก...' : editingId ? 'อัปเดต' : 'เพิ่มโครงการ'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {filteredProjects.map((project) => (
                <SortableItem
                  key={project.id}
                  project={project}
                  onEdit={() => handleEdit(project)}
                  onDelete={() => handleDelete(project.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        {filteredProjects.length === 0 && (
          <p className="text-center text-muted-foreground py-8">ยังไม่มีโครงการ</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectsManagement;
