import { useState } from 'react';
import { useAllBusinessTypes, useUpdateBusinessType } from '@/hooks/useBusinessTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, Hotel, Heart, Leaf, HardHat, Save, Loader2 } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  building: Building,
  hotel: Hotel,
  heart: Heart,
  leaf: Leaf,
  'hard-hat': HardHat,
};

const BusinessTypesManagement = () => {
  const { data: businessTypes, isLoading } = useAllBusinessTypes();
  const updateMutation = useUpdateBusinessType();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    name_th: string;
    name_en: string;
    color: string;
  }>({ name_th: '', name_en: '', color: '' });

  const handleEdit = (type: typeof businessTypes[0]) => {
    setEditingId(type.id);
    setEditData({
      name_th: type.name_th,
      name_en: type.name_en || '',
      color: type.color || '#d97706',
    });
  };

  const handleSave = (id: string) => {
    updateMutation.mutate(
      { id, updates: editData },
      {
        onSuccess: () => {
          setEditingId(null);
        },
      }
    );
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateMutation.mutate({ id, updates: { is_active: isActive } });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">จัดการชื่อประเภทธุรกิจ</h2>
        <p className="text-muted-foreground">
          แก้ไขชื่อที่แสดงในปุ่มกรองข่าวและโครงสร้างองค์กร
        </p>
      </div>

      <div className="grid gap-4">
        {businessTypes?.map((type) => {
          const IconComponent = iconMap[type.icon_name || 'building'] || Building;
          const isEditing = editingId === type.id;

          return (
            <Card key={type.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: type.color || '#d97706' }}
                    >
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{type.business_key}</CardTitle>
                      <CardDescription>Key: {type.business_key}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${type.id}`} className="text-sm">
                        เปิดใช้งาน
                      </Label>
                      <Switch
                        id={`active-${type.id}`}
                        checked={type.is_active ?? true}
                        onCheckedChange={(checked) => handleToggleActive(type.id, checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`name_th-${type.id}`}>ชื่อภาษาไทย</Label>
                        <Input
                          id={`name_th-${type.id}`}
                          value={editData.name_th}
                          onChange={(e) =>
                            setEditData({ ...editData, name_th: e.target.value })
                          }
                          placeholder="ชื่อภาษาไทย"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`name_en-${type.id}`}>ชื่อภาษาอังกฤษ</Label>
                        <Input
                          id={`name_en-${type.id}`}
                          value={editData.name_en}
                          onChange={(e) =>
                            setEditData({ ...editData, name_en: e.target.value })
                          }
                          placeholder="English Name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`color-${type.id}`}>สี</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`color-${type.id}`}
                          type="color"
                          value={editData.color}
                          onChange={(e) =>
                            setEditData({ ...editData, color: e.target.value })
                          }
                          className="w-20 h-10 p-1"
                        />
                        <Input
                          value={editData.color}
                          onChange={(e) =>
                            setEditData({ ...editData, color: e.target.value })
                          }
                          placeholder="#d97706"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSave(type.id)}
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        บันทึก
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        ยกเลิก
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{type.name_th}</p>
                      <p className="text-sm text-muted-foreground">{type.name_en}</p>
                    </div>
                    <Button variant="outline" onClick={() => handleEdit(type)}>
                      แก้ไข
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessTypesManagement;
