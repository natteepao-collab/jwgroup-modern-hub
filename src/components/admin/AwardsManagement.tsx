import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Trophy, Medal, GripVertical, Upload, X } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Award {
  id: string;
  title_th: string;
  title_en: string | null;
  title_cn: string | null;
  description_th: string | null;
  description_en: string | null;
  description_cn: string | null;
  image_url: string | null;
  award_year: number | null;
  awarding_organization: string | null;
  category: string;
  is_published: boolean;
  position_order: number;
}

const emptyAward: Omit<Award, 'id'> = {
  title_th: '',
  title_en: '',
  title_cn: '',
  description_th: '',
  description_en: '',
  description_cn: '',
  image_url: '',
  award_year: new Date().getFullYear(),
  awarding_organization: '',
  category: 'award',
  is_published: true,
  position_order: 0,
};

// Helper to parse image_url (can be JSON array or single URL string)
const parseImages = (imageUrl: string | null): string[] => {
  if (!imageUrl) return [];
  try {
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed)) return parsed;
    return [imageUrl];
  } catch {
    return imageUrl ? [imageUrl] : [];
  }
};

const SortableItem = ({ award, onEdit, onDelete }: {
  award: Award;
  onEdit: (a: Award) => void;
  onDelete: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: award.id });
  const images = parseImages(award.image_url);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 p-4 bg-card rounded-lg border">
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
      {/* Image Preview */}
      <div className="flex items-center gap-2">
        {images.length > 0 ? (
          <div className="flex -space-x-2">
            {images.slice(0, 3).map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`Award ${idx + 1}`} 
                className="w-12 h-12 object-cover rounded-lg border-2 border-background shadow-sm"
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {award.category === 'certification' ? (
              <Medal className="h-8 w-8 text-primary" />
            ) : (
              <Trophy className="h-8 w-8 text-primary" />
            )}
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{award.title_th}</span>
          {award.award_year && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{award.award_year}</span>
          )}
          {!award.is_published && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Draft</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{award.awarding_organization}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onEdit(award)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={() => onDelete(award.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const AwardsManagement = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [formData, setFormData] = useState<Omit<Award, 'id'>>(emptyAward);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchAwards = useCallback(async () => {
    const { data, error } = await supabase
      .from('awards')
      .select('*')
      .order('position_order', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setAwards(data || []);
    }
  }, [toast]);

  useEffect(() => {
    fetchAwards();
  }, [fetchAwards]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = awards.findIndex((a) => a.id === active.id);
    const newIndex = awards.findIndex((a) => a.id === over.id);
    const newOrder = arrayMove(awards, oldIndex, newIndex);
    setAwards(newOrder);

    // Update position_order in database
    for (let i = 0; i < newOrder.length; i++) {
      await supabase
        .from('awards')
        .update({ position_order: i })
        .eq('id', newOrder[i].id);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (currentImages.length >= 3) {
      toast({ title: 'ข้อผิดพลาด', description: 'สามารถอัปโหลดได้สูงสุด 3 รูปภาพ', variant: 'destructive' });
      return;
    }

    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'ข้อผิดพลาด', description: 'ไฟล์ต้องมีขนาดไม่เกิน 10MB', variant: 'destructive' });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: 'ข้อผิดพลาด', description: 'กรุณาเข้าสู่ระบบก่อนอัปโหลดรูปภาพ', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('award-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast({ title: 'ข้อผิดพลาด', description: `อัปโหลดรูปภาพไม่สำเร็จ: ${uploadError.message}`, variant: 'destructive' });
      setIsUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('award-images')
      .getPublicUrl(fileName);

    const newImages = [...currentImages, urlData.publicUrl];
    setCurrentImages(newImages);
    setFormData(prev => ({ ...prev, image_url: JSON.stringify(newImages) }));
    setIsUploading(false);
    toast({ title: 'สำเร็จ', description: `อัปโหลดรูปภาพสำเร็จ (${newImages.length}/3)` });
    
    // Reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    setCurrentImages(newImages);
    setFormData(prev => ({ ...prev, image_url: newImages.length > 0 ? JSON.stringify(newImages) : '' }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (editingAward) {
        const { error } = await supabase
          .from('awards')
          .update(formData)
          .eq('id', editingAward.id);

        if (error) throw error;
        toast({ title: 'สำเร็จ', description: 'อัปเดตรางวัลเรียบร้อยแล้ว' });
      } else {
        const { error } = await supabase
          .from('awards')
          .insert({ ...formData, position_order: awards.length });

        if (error) throw error;
        toast({ title: 'สำเร็จ', description: 'เพิ่มรางวัลใหม่เรียบร้อยแล้ว' });
      }

      setIsDialogOpen(false);
      setEditingAward(null);
      setFormData(emptyAward);
      fetchAwards();
    } catch (error: unknown) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (award: Award) => {
    setEditingAward(award);
    const images = parseImages(award.image_url);
    setCurrentImages(images);
    setFormData({
      title_th: award.title_th,
      title_en: award.title_en || '',
      title_cn: award.title_cn || '',
      description_th: award.description_th || '',
      description_en: award.description_en || '',
      description_cn: award.description_cn || '',
      image_url: award.image_url || '',
      award_year: award.award_year,
      awarding_organization: award.awarding_organization || '',
      category: award.category,
      is_published: award.is_published,
      position_order: award.position_order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณต้องการลบรางวัลนี้หรือไม่?')) return;

    const { error } = await supabase.from('awards').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'สำเร็จ', description: 'ลบรางวัลเรียบร้อยแล้ว' });
      fetchAwards();
    }
  };

  const openNewDialog = () => {
    setEditingAward(null);
    setFormData(emptyAward);
    setCurrentImages([]);
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>จัดการรางวัลและการรับรอง</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" /> เพิ่มรางวัล
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAward ? 'แก้ไขรางวัล' : 'เพิ่มรางวัลใหม่'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ชื่อรางวัล (ไทย) *</Label>
                  <Input
                    value={formData.title_th}
                    onChange={(e) => setFormData({ ...formData, title_th: e.target.value })}
                    placeholder="รางวัลอสังหาริมทรัพย์ดีเด่น"
                  />
                </div>
                <div>
                  <Label>ชื่อรางวัล (English)</Label>
                  <Input
                    value={formData.title_en || ''}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder="Outstanding Real Estate Award"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ปีที่ได้รับ</Label>
                  <Input
                    type="number"
                    value={formData.award_year || ''}
                    onChange={(e) => setFormData({ ...formData, award_year: parseInt(e.target.value) || null })}
                    placeholder="2023"
                  />
                </div>
                <div>
                  <Label>ประเภท</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="award">รางวัล (Award)</SelectItem>
                      <SelectItem value="certification">การรับรอง (Certification)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>องค์กรที่มอบรางวัล</Label>
                <Input
                  value={formData.awarding_organization || ''}
                  onChange={(e) => setFormData({ ...formData, awarding_organization: e.target.value })}
                  placeholder="สมาคมอสังหาริมทรัพย์ไทย"
                />
              </div>

              <div>
                <Label>คำอธิบาย (ไทย)</Label>
                <Textarea
                  value={formData.description_th || ''}
                  onChange={(e) => setFormData({ ...formData, description_th: e.target.value })}
                  rows={3}
                  placeholder="รายละเอียดรางวัล"
                />
              </div>

              <div>
                <Label>คำอธิบาย (English)</Label>
                <Textarea
                  value={formData.description_en || ''}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  rows={3}
                  placeholder="Award description"
                />
              </div>

              <div>
                <Label>รูปภาพรางวัล (สูงสุด 3 รูป)</Label>
                <div className="mt-2 space-y-3">
                  {currentImages.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {currentImages.map((img, index) => (
                        <div key={index} className="relative inline-block">
                          <img 
                            src={img} 
                            alt={`Preview ${index + 1}`} 
                            className="w-32 h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {currentImages.length < 3 && (
                    <label className="cursor-pointer inline-block">
                      <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>{isUploading ? 'กำลังอัปโหลด...' : `อัปโหลดรูปภาพ (${currentImages.length}/3)`}</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        disabled={isUploading} 
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label>เผยแพร่</Label>
              </div>

              <Button onClick={handleSubmit} disabled={isLoading || !formData.title_th} className="w-full">
                {isLoading ? 'กำลังบันทึก...' : editingAward ? 'อัปเดต' : 'เพิ่มรางวัล'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {awards.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">ยังไม่มีรางวัล</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={awards.map((a) => a.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {awards.map((award) => (
                  <SortableItem
                    key={award.id}
                    award={award}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
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

export default AwardsManagement;
