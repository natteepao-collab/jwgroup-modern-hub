import { useState, useEffect, useRef, useCallback } from 'react';
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
import { Plus, Pencil, Trash2, GripVertical, Upload, X, Building, Hotel, Heart, Leaf, Star, Rocket, Calendar } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TimelineEvent {
  id: string;
  year: string;
  title_th: string;
  title_en: string | null;
  title_cn: string | null;
  description_th: string | null;
  description_en: string | null;
  description_cn: string | null;
  image_url: string | null;
  icon_name: string;
  is_highlight: boolean;
  is_published: boolean;
  position_order: number;
}

const emptyEvent: Omit<TimelineEvent, 'id'> = {
  year: new Date().getFullYear().toString(),
  title_th: '',
  title_en: '',
  title_cn: '',
  description_th: '',
  description_en: '',
  description_cn: '',
  image_url: '',
  icon_name: 'building',
  is_highlight: false,
  is_published: true,
  position_order: 0,
};

const iconOptions = [
  { value: 'building', label: 'อาคาร', icon: Building },
  { value: 'hotel', label: 'โรงแรม', icon: Hotel },
  { value: 'heart', label: 'หัวใจ', icon: Heart },
  { value: 'leaf', label: 'ใบไม้', icon: Leaf },
  { value: 'star', label: 'ดาว', icon: Star },
  { value: 'rocket', label: 'จรวด', icon: Rocket },
  { value: 'calendar', label: 'ปฏิทิน', icon: Calendar },
];

const SortableItem = ({ event, onEdit, onDelete }: {
  event: TimelineEvent;
  onEdit: (e: TimelineEvent) => void;
  onDelete: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: event.id });
  const IconComponent = iconOptions.find(i => i.value === event.icon_name)?.icon || Calendar;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 p-4 bg-card rounded-lg border">
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${event.is_highlight ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">{event.year}</span>
          <span className="font-medium">{event.title_th}</span>
          {!event.is_published && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Draft</span>
          )}
          {event.is_highlight && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Highlight</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">{event.description_th}</p>
      </div>
      {event.image_url && (
        <img src={event.image_url} alt="" className="w-12 h-12 rounded object-cover" />
      )}
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onEdit(event)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={() => onDelete(event.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const TimelineManagement = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [formData, setFormData] = useState<Omit<TimelineEvent, 'id'>>(emptyEvent);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .order('position_order', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setEvents(data || []);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = events.findIndex((e) => e.id === active.id);
    const newIndex = events.findIndex((e) => e.id === over.id);
    const newOrder = arrayMove(events, oldIndex, newIndex);
    setEvents(newOrder);

    for (let i = 0; i < newOrder.length; i++) {
      await supabase
        .from('timeline_events')
        .update({ position_order: i })
        .eq('id', newOrder[i].id);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น', variant: 'destructive' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'Error', description: 'ไฟล์ต้องมีขนาดไม่เกิน 10MB', variant: 'destructive' });
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('timeline-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('timeline-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicUrl });
      toast({ title: 'สำเร็จ', description: 'อัปโหลดรูปภาพเรียบร้อยแล้ว' });
    } catch (error: unknown) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('timeline_events')
          .update(formData)
          .eq('id', editingEvent.id);

        if (error) throw error;
        toast({ title: 'สำเร็จ', description: 'อัปเดตเหตุการณ์เรียบร้อยแล้ว' });
      } else {
        const { error } = await supabase
          .from('timeline_events')
          .insert({ ...formData, position_order: events.length });

        if (error) throw error;
        toast({ title: 'สำเร็จ', description: 'เพิ่มเหตุการณ์ใหม่เรียบร้อยแล้ว' });
      }

      setIsDialogOpen(false);
      setEditingEvent(null);
      setFormData(emptyEvent);
      fetchEvents();
    } catch (error: unknown) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (event: TimelineEvent) => {
    setEditingEvent(event);
    setFormData({
      year: event.year,
      title_th: event.title_th,
      title_en: event.title_en || '',
      title_cn: event.title_cn || '',
      description_th: event.description_th || '',
      description_en: event.description_en || '',
      description_cn: event.description_cn || '',
      image_url: event.image_url || '',
      icon_name: event.icon_name,
      is_highlight: event.is_highlight,
      is_published: event.is_published,
      position_order: event.position_order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณต้องการลบเหตุการณ์นี้หรือไม่?')) return;

    const { error } = await supabase.from('timeline_events').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'สำเร็จ', description: 'ลบเหตุการณ์เรียบร้อยแล้ว' });
      fetchEvents();
    }
  };

  const openNewDialog = () => {
    setEditingEvent(null);
    setFormData(emptyEvent);
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>จัดการ Timeline</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" /> เพิ่มเหตุการณ์
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'แก้ไขเหตุการณ์' : 'เพิ่มเหตุการณ์ใหม่'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ปี *</Label>
                  <Input
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2024"
                  />
                </div>
                <div>
                  <Label>ไอคอน</Label>
                  <Select value={formData.icon_name} onValueChange={(value) => setFormData({ ...formData, icon_name: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <opt.icon className="h-4 w-4" />
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>หัวข้อ (ไทย) *</Label>
                <Input
                  value={formData.title_th}
                  onChange={(e) => setFormData({ ...formData, title_th: e.target.value })}
                  placeholder="ก่อตั้งบริษัท"
                />
              </div>

              <div>
                <Label>หัวข้อ (English)</Label>
                <Input
                  value={formData.title_en || ''}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="Company Founded"
                />
              </div>

              <div>
                <Label>รายละเอียด (ไทย)</Label>
                <Textarea
                  value={formData.description_th || ''}
                  onChange={(e) => setFormData({ ...formData, description_th: e.target.value })}
                  rows={3}
                  placeholder="รายละเอียดเหตุการณ์"
                />
              </div>

              <div>
                <Label>รายละเอียด (English)</Label>
                <Textarea
                  value={formData.description_en || ''}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  rows={3}
                  placeholder="Event description"
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label>รูปภาพประกอบ</Label>
                <div className="mt-2">
                  {formData.image_url ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-40 h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {uploadingImage ? 'กำลังอัปโหลด...' : 'คลิกเพื่ออัปโหลดรูปภาพ'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP (สูงสุด 10MB)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
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
                    checked={formData.is_highlight}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_highlight: checked })}
                  />
                  <Label>ไฮไลท์</Label>
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={isLoading || !formData.year || !formData.title_th} className="w-full">
                {isLoading ? 'กำลังบันทึก...' : editingEvent ? 'อัปเดต' : 'เพิ่มเหตุการณ์'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">ยังไม่มีเหตุการณ์</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={events.map((e) => e.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {events.map((event) => (
                  <SortableItem
                    key={event.id}
                    event={event}
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

export default TimelineManagement;
