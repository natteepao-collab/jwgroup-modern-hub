import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Star, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Testimonial {
  id: string;
  client_name: string;
  client_title: string | null;
  client_company: string | null;
  client_image_url: string | null;
  content_th: string;
  content_en: string | null;
  content_cn: string | null;
  rating: number;
  is_featured: boolean;
  is_published: boolean;
  position_order: number;
}

const emptyTestimonial: Omit<Testimonial, 'id'> = {
  client_name: '',
  client_title: '',
  client_company: '',
  client_image_url: '',
  content_th: '',
  content_en: '',
  content_cn: '',
  rating: 5,
  is_featured: false,
  is_published: true,
  position_order: 0,
};

const SortableItem = ({ testimonial, onEdit, onDelete }: {
  testimonial: Testimonial;
  onEdit: (t: Testimonial) => void;
  onDelete: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: testimonial.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 p-4 bg-card rounded-lg border">
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{testimonial.client_name}</span>
          <div className="flex gap-0.5">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          {!testimonial.is_published && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Draft</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">{testimonial.content_th}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onEdit(testimonial)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={() => onDelete(testimonial.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Omit<Testimonial, 'id'>>(emptyTestimonial);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('position_order', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setTestimonials(data || []);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = testimonials.findIndex((t) => t.id === active.id);
    const newIndex = testimonials.findIndex((t) => t.id === over.id);
    const newOrder = arrayMove(testimonials, oldIndex, newIndex);
    setTestimonials(newOrder);

    // Update position_order in database
    for (let i = 0; i < newOrder.length; i++) {
      await supabase
        .from('testimonials')
        .update({ position_order: i })
        .eq('id', newOrder[i].id);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(formData)
          .eq('id', editingTestimonial.id);

        if (error) throw error;
        toast({ title: 'สำเร็จ', description: 'อัปเดตรีวิวเรียบร้อยแล้ว' });
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert({ ...formData, position_order: testimonials.length });

        if (error) throw error;
        toast({ title: 'สำเร็จ', description: 'เพิ่มรีวิวใหม่เรียบร้อยแล้ว' });
      }

      setIsDialogOpen(false);
      setEditingTestimonial(null);
      setFormData(emptyTestimonial);
      fetchTestimonials();
      fetchTestimonials();
    } catch (error: unknown) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      client_name: testimonial.client_name,
      client_title: testimonial.client_title || '',
      client_company: testimonial.client_company || '',
      client_image_url: testimonial.client_image_url || '',
      content_th: testimonial.content_th,
      content_en: testimonial.content_en || '',
      content_cn: testimonial.content_cn || '',
      rating: testimonial.rating,
      is_featured: testimonial.is_featured,
      is_published: testimonial.is_published,
      position_order: testimonial.position_order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณต้องการลบรีวิวนี้หรือไม่?')) return;

    const { error } = await supabase.from('testimonials').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'สำเร็จ', description: 'ลบรีวิวเรียบร้อยแล้ว' });
      fetchTestimonials();
    }
  };

  const openNewDialog = () => {
    setEditingTestimonial(null);
    setFormData(emptyTestimonial);
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>จัดการรีวิวลูกค้า</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" /> เพิ่มรีวิว
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? 'แก้ไขรีวิว' : 'เพิ่มรีวิวใหม่'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ชื่อลูกค้า *</Label>
                  <Input
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="คุณสมชาย ใจดี"
                  />
                </div>
                <div>
                  <Label>ตำแหน่ง</Label>
                  <Input
                    value={formData.client_title || ''}
                    onChange={(e) => setFormData({ ...formData, client_title: e.target.value })}
                    placeholder="ผู้จัดการ"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>บริษัท</Label>
                  <Input
                    value={formData.client_company || ''}
                    onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                    placeholder="บริษัท ABC จำกัด"
                  />
                </div>
                <div>
                  <Label>URL รูปภาพลูกค้า</Label>
                  <Input
                    value={formData.client_image_url || ''}
                    onChange={(e) => setFormData({ ...formData, client_image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label>รีวิว (ไทย) *</Label>
                <Textarea
                  value={formData.content_th}
                  onChange={(e) => setFormData({ ...formData, content_th: e.target.value })}
                  rows={3}
                  placeholder="ข้อความรีวิวภาษาไทย"
                />
              </div>

              <div>
                <Label>รีวิว (English)</Label>
                <Textarea
                  value={formData.content_en || ''}
                  onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                  rows={3}
                  placeholder="Review content in English"
                />
              </div>

              <div>
                <Label>คะแนน (1-5)</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: num })}
                      className={`p-2 rounded ${formData.rating >= num ? 'text-yellow-400' : 'text-muted-foreground'}`}
                    >
                      <Star className={`w-6 h-6 ${formData.rating >= num ? 'fill-yellow-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label>เผยแพร่</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label>แนะนำ</Label>
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={isLoading || !formData.client_name || !formData.content_th} className="w-full">
                {isLoading ? 'กำลังบันทึก...' : editingTestimonial ? 'อัปเดต' : 'เพิ่มรีวิว'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {testimonials.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">ยังไม่มีรีวิว</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={testimonials.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {testimonials.map((testimonial) => (
                  <SortableItem
                    key={testimonial.id}
                    testimonial={testimonial}
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

export default TestimonialsManagement;
