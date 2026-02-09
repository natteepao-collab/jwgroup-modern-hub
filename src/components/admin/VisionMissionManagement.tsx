import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinessTypes } from '@/hooks/useBusinessTypes';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import {
  Target,
  ListChecks,
  Sparkles,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Building2,
  Hotel,
  Heart,
  Leaf,
  Loader2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ImageIcon,
  Upload,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Mission {
  title_th: string;
  title_en?: string;
  title_cn?: string;
  description_th: string;
  description_en?: string;
  description_cn?: string;
}

interface CoreConcept {
  title_th: string;
  title_en?: string;
  title_cn?: string;
  subtitle_th: string;
  subtitle_en?: string;
  subtitle_cn?: string;
  description_th: string;
  description_en?: string;
  description_cn?: string;
}

interface VisionMission {
  id: string;
  business_type: string;
  vision_th: string;
  vision_en: string | null;
  vision_cn: string | null;
  vision_sub_th: string | null;
  vision_sub_en: string | null;
  vision_sub_cn: string | null;
  missions: Mission[];
  core_concept: CoreConcept | null;
  position_order: number;
  is_published: boolean;
  image_url: string | null;
}

const businessIcons: Record<string, React.ElementType> = {
  realestate: Building2,
  hotel: Hotel,
  pet: Heart,
  herbal: Leaf
};

const businessColors: Record<string, string> = {
  realestate: 'bg-amber-500',
  hotel: 'bg-gray-700',
  pet: 'bg-teal-500',
  herbal: 'bg-blue-800'
};

const VisionMissionManagement = () => {
  const { isAdmin } = useAuth();
  const businessTypesQuery = useBusinessTypes();
  const businessTypes = businessTypesQuery.data || [];
  const [visionMissions, setVisionMissions] = useState<VisionMission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('realestate');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<VisionMission | null>(null);
  const [missionDialogOpen, setMissionDialogOpen] = useState(false);
  const [currentMissionIndex, setCurrentMissionIndex] = useState<number | null>(null);
  const [currentMission, setCurrentMission] = useState<Mission>({
    title_th: '',
    description_th: ''
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vision_missions')
        .select('*')
        .order('position_order');

      if (error) throw error;

      // Parse missions from JSON with proper typing
      const parsed: VisionMission[] = (data || []).map(item => ({
        id: item.id,
        business_type: item.business_type,
        vision_th: item.vision_th,
        vision_en: item.vision_en,
        vision_cn: item.vision_cn,
        vision_sub_th: item.vision_sub_th,
        vision_sub_en: item.vision_sub_en,
        vision_sub_cn: item.vision_sub_cn,
        missions: Array.isArray(item.missions) ? (item.missions as unknown as Mission[]) : [],
        core_concept: item.core_concept ? (item.core_concept as unknown as CoreConcept) : null,
        position_order: item.position_order || 0,
        is_published: item.is_published ?? true,
        image_url: (item as { image_url?: string | null }).image_url || null
      }));

      setVisionMissions(parsed);

      // Set first available tab
      if (parsed.length > 0) {
        // We can't easily check 'activeTab' here without adding it to dependencies which might cause loops.
        // Instead we rely on initial state or user interaction
        // checking if activeTab triggers update might be tricky inside fetchData
      }
    } catch (error) {
      console.error('Error fetching vision missions:', error);
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (vm: VisionMission) => {
    if (!isAdmin) {
      toast.error('คุณไม่มีสิทธิ์แก้ไขข้อมูล');
      return;
    }

    setIsSaving(vm.id);
    try {
      // Convert to JSON-compatible format
      const missionsJson = JSON.parse(JSON.stringify(vm.missions));
      const coreConceptJson = vm.core_concept ? JSON.parse(JSON.stringify(vm.core_concept)) : null;

      const { error } = await supabase
        .from('vision_missions')
        .update({
          vision_th: vm.vision_th,
          vision_en: vm.vision_en,
          vision_cn: vm.vision_cn,
          vision_sub_th: vm.vision_sub_th,
          vision_sub_en: vm.vision_sub_en,
          vision_sub_cn: vm.vision_sub_cn,
          missions: missionsJson,
          core_concept: coreConceptJson,
          is_published: vm.is_published,
          image_url: vm.image_url
        })
        .eq('id', vm.id);

      if (error) throw error;
      toast.success('บันทึกข้อมูลสำเร็จ');
      fetchData();
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('ไม่สามารถบันทึกข้อมูลได้');
    }
    setIsSaving(null);
  };

  const handleFieldChange = (id: string, field: string, value: string | boolean) => {
    setVisionMissions(prev =>
      prev.map(vm =>
        vm.id === id ? { ...vm, [field]: value } : vm
      )
    );
  };

  const handleMissionChange = (vmId: string, missionIndex: number, field: string, value: string) => {
    setVisionMissions(prev =>
      prev.map(vm => {
        if (vm.id !== vmId) return vm;
        const newMissions = [...vm.missions];
        newMissions[missionIndex] = { ...newMissions[missionIndex], [field]: value };
        return { ...vm, missions: newMissions };
      })
    );
  };

  const handleAddMission = (vmId: string) => {
    setVisionMissions(prev =>
      prev.map(vm => {
        if (vm.id !== vmId) return vm;
        return {
          ...vm,
          missions: [...vm.missions, { title_th: '', description_th: '' }]
        };
      })
    );
  };

  const handleRemoveMission = (vmId: string, missionIndex: number) => {
    setVisionMissions(prev =>
      prev.map(vm => {
        if (vm.id !== vmId) return vm;
        const newMissions = vm.missions.filter((_, i) => i !== missionIndex);
        return { ...vm, missions: newMissions };
      })
    );
  };

  const handleMoveMission = (vmId: string, fromIndex: number, direction: 'up' | 'down') => {
    setVisionMissions(prev =>
      prev.map(vm => {
        if (vm.id !== vmId) return vm;
        const newMissions = [...vm.missions];
        const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
        if (toIndex < 0 || toIndex >= newMissions.length) return vm;
        [newMissions[fromIndex], newMissions[toIndex]] = [newMissions[toIndex], newMissions[fromIndex]];
        return { ...vm, missions: newMissions };
      })
    );
  };

  const handleCoreConceptChange = (vmId: string, field: string, value: string) => {
    setVisionMissions(prev =>
      prev.map(vm => {
        if (vm.id !== vmId) return vm;
        return {
          ...vm,
          core_concept: {
            ...(vm.core_concept || { title_th: '', subtitle_th: '', description_th: '' }),
            [field]: value
          }
        };
      })
    );
  };

  const toggleCoreConcept = (vmId: string) => {
    setVisionMissions(prev =>
      prev.map(vm => {
        if (vm.id !== vmId) return vm;
        return {
          ...vm,
          core_concept: vm.core_concept ? null : { title_th: '', subtitle_th: '', description_th: '' }
        };
      })
    );
  };

  const getBusinessName = (key: string) => {
    const bt = businessTypes.find(b => b.business_key === key);
    return bt?.name_th || key;
  };

  // Image upload handling
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleImageUpload = async (vmId: string, file: File) => {
    if (!isAdmin) {
      toast.error('คุณไม่มีสิทธิ์อัปโหลดรูปภาพ');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('กรุณาเลือกไฟล์รูปภาพ');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('ขนาดไฟล์ต้องไม่เกิน 5MB');
      return;
    }

    setIsUploading(vmId);
    try {
      const vm = visionMissions.find(v => v.id === vmId);
      if (!vm) return;

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${vm.business_type}-${Date.now()}.${fileExt}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vision-mission-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('vision-mission-images')
        .getPublicUrl(fileName);

      // Delete old image if exists
      if (vm.image_url) {
        const oldFileName = vm.image_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('vision-mission-images')
            .remove([oldFileName]);
        }
      }

      // Update local state
      setVisionMissions(prev =>
        prev.map(v =>
          v.id === vmId ? { ...v, image_url: urlData.publicUrl } : v
        )
      );

      toast.success('อัปโหลดรูปภาพสำเร็จ');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('ไม่สามารถอัปโหลดรูปภาพได้');
    }
    setIsUploading(null);
  };

  const handleImageDelete = async (vmId: string) => {
    if (!isAdmin) {
      toast.error('คุณไม่มีสิทธิ์ลบรูปภาพ');
      return;
    }

    const vm = visionMissions.find(v => v.id === vmId);
    if (!vm || !vm.image_url) return;

    setIsUploading(vmId);
    try {
      // Extract filename from URL
      const fileName = vm.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('vision-mission-images')
          .remove([fileName]);
      }

      // Update local state
      setVisionMissions(prev =>
        prev.map(v =>
          v.id === vmId ? { ...v, image_url: null } : v
        )
      );

      toast.success('ลบรูปภาพสำเร็จ');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('ไม่สามารถลบรูปภาพได้');
    }
    setIsUploading(null);
  };

  const currentVM = visionMissions.find(vm => vm.business_type === activeTab);
  const Icon = businessIcons[activeTab] || Building2;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              จัดการวิสัยทัศน์และพันธกิจ
            </CardTitle>
            <CardDescription>
              แก้ไขวิสัยทัศน์ พันธกิจ และแนวคิดหลักของแต่ละธุรกิจ
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            รีเฟรช
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Business Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {visionMissions.map(vm => {
              const VmIcon = businessIcons[vm.business_type] || Building2;
              return (
                <TabsTrigger key={vm.business_type} value={vm.business_type} className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", businessColors[vm.business_type])} />
                  <VmIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{getBusinessName(vm.business_type)}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {visionMissions.map(vm => (
            <TabsContent key={vm.business_type} value={vm.business_type}>
              <div className="space-y-6">
                {/* Header with status */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", businessColors[vm.business_type])}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{getBusinessName(vm.business_type)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {vm.missions.length} พันธกิจ • {vm.core_concept ? 'มีแนวคิดหลัก' : 'ไม่มีแนวคิดหลัก'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {vm.is_published ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Switch
                        checked={vm.is_published}
                        onCheckedChange={(checked) => handleFieldChange(vm.id, 'is_published', checked)}
                      />
                      <span className="text-sm">{vm.is_published ? 'เผยแพร่' : 'ซ่อน'}</span>
                    </div>
                  </div>
                </div>

                <Accordion type="multiple" defaultValue={['vision', 'missions', 'image']} className="space-y-4">
                  {/* Image Upload Section */}
                  <AccordionItem value="image" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        <span className="font-medium">รูปภาพธุรกิจ (Business Image)</span>
                        {vm.image_url && <span className="text-xs text-green-600">(มีรูป)</span>}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="grid gap-4">
                        {/* Current Image Preview */}
                        {vm.image_url ? (
                          <div className="relative group">
                            <img
                              src={vm.image_url}
                              alt={`รูปภาพ ${getBusinessName(vm.business_type)}`}
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => fileInputRefs.current[vm.id]?.click()}
                                disabled={isUploading === vm.id}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                เปลี่ยนรูป
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleImageDelete(vm.id)}
                                disabled={isUploading === vm.id}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                ลบรูป
                              </Button>
                            </div>
                            {isUploading === vm.id && (
                              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-white" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                              "hover:border-primary hover:bg-primary/5",
                              isUploading === vm.id && "pointer-events-none opacity-50"
                            )}
                            onClick={() => fileInputRefs.current[vm.id]?.click()}
                          >
                            {isUploading === vm.id ? (
                              <Loader2 className="h-12 w-12 mx-auto mb-3 animate-spin text-primary" />
                            ) : (
                              <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                            )}
                            <p className="text-sm font-medium text-muted-foreground">
                              {isUploading === vm.id ? 'กำลังอัปโหลด...' : 'คลิกเพื่ออัปโหลดรูปภาพ'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              รองรับ JPG, PNG, WebP (ขนาดไม่เกิน 5MB)
                            </p>
                          </div>
                        )}

                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={(el) => { fileInputRefs.current[vm.id] = el; }}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(vm.id, file);
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Vision Section */}
                  <AccordionItem value="vision" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="font-medium">วิสัยทัศน์ (Vision)</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <Tabs defaultValue="th" className="w-full">
                        <TabsList className="mb-4">
                          <TabsTrigger value="th">🇹🇭 ไทย</TabsTrigger>
                          <TabsTrigger value="en">🇺🇸 English</TabsTrigger>
                          <TabsTrigger value="cn">🇨🇳 中文</TabsTrigger>
                        </TabsList>

                        <TabsContent value="th" className="space-y-4">
                          <div>
                            <Label>วิสัยทัศน์หลัก (Thai)</Label>
                            <Textarea
                              value={vm.vision_th}
                              onChange={(e) => handleFieldChange(vm.id, 'vision_th', e.target.value)}
                              rows={4}
                              placeholder="ระบุวิสัยทัศน์..."
                            />
                          </div>
                          <div>
                            <Label>วิสัยทัศน์รอง (Thai)</Label>
                            <Textarea
                              value={vm.vision_sub_th || ''}
                              onChange={(e) => handleFieldChange(vm.id, 'vision_sub_th', e.target.value)}
                              rows={2}
                              placeholder="ระบุวิสัยทัศน์รอง (ถ้ามี)..."
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="en" className="space-y-4">
                          <div>
                            <Label>Vision (English)</Label>
                            <Textarea
                              value={vm.vision_en || ''}
                              onChange={(e) => handleFieldChange(vm.id, 'vision_en', e.target.value)}
                              rows={4}
                              placeholder="Enter vision..."
                            />
                          </div>
                          <div>
                            <Label>Sub Vision (English)</Label>
                            <Textarea
                              value={vm.vision_sub_en || ''}
                              onChange={(e) => handleFieldChange(vm.id, 'vision_sub_en', e.target.value)}
                              rows={2}
                              placeholder="Enter sub vision (optional)..."
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="cn" className="space-y-4">
                          <div>
                            <Label>愿景 (中文)</Label>
                            <Textarea
                              value={vm.vision_cn || ''}
                              onChange={(e) => handleFieldChange(vm.id, 'vision_cn', e.target.value)}
                              rows={4}
                              placeholder="输入愿景..."
                            />
                          </div>
                          <div>
                            <Label>副愿景 (中文)</Label>
                            <Textarea
                              value={vm.vision_sub_cn || ''}
                              onChange={(e) => handleFieldChange(vm.id, 'vision_sub_cn', e.target.value)}
                              rows={2}
                              placeholder="输入副愿景（可选）..."
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Missions Section */}
                  <AccordionItem value="missions" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-primary" />
                        <span className="font-medium">พันธกิจ (Mission)</span>
                        <span className="text-sm text-muted-foreground">({vm.missions.length} รายการ)</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {vm.missions.map((mission, idx) => (
                        <Card key={idx} className="border-l-4" style={{ borderLeftColor: `var(--primary)` }}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                                  {idx + 1}
                                </span>
                                <span className="font-medium text-sm">พันธกิจที่ {idx + 1}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveMission(vm.id, idx, 'up')}
                                  disabled={idx === 0}
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveMission(vm.id, idx, 'down')}
                                  disabled={idx === vm.missions.length - 1}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleRemoveMission(vm.id, idx)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <Tabs defaultValue="th" className="w-full">
                              <TabsList className="mb-3">
                                <TabsTrigger value="th" className="text-xs">🇹🇭 TH</TabsTrigger>
                                <TabsTrigger value="en" className="text-xs">🇺🇸 EN</TabsTrigger>
                                <TabsTrigger value="cn" className="text-xs">🇨🇳 CN</TabsTrigger>
                              </TabsList>

                              <TabsContent value="th" className="space-y-3">
                                <div>
                                  <Label className="text-xs">หัวข้อ (Thai)</Label>
                                  <Input
                                    value={mission.title_th}
                                    onChange={(e) => handleMissionChange(vm.id, idx, 'title_th', e.target.value)}
                                    placeholder="หัวข้อพันธกิจ..."
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">รายละเอียด (Thai)</Label>
                                  <Textarea
                                    value={mission.description_th}
                                    onChange={(e) => handleMissionChange(vm.id, idx, 'description_th', e.target.value)}
                                    rows={3}
                                    placeholder="รายละเอียดพันธกิจ..."
                                  />
                                </div>
                              </TabsContent>

                              <TabsContent value="en" className="space-y-3">
                                <div>
                                  <Label className="text-xs">Title (English)</Label>
                                  <Input
                                    value={mission.title_en || ''}
                                    onChange={(e) => handleMissionChange(vm.id, idx, 'title_en', e.target.value)}
                                    placeholder="Mission title..."
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Description (English)</Label>
                                  <Textarea
                                    value={mission.description_en || ''}
                                    onChange={(e) => handleMissionChange(vm.id, idx, 'description_en', e.target.value)}
                                    rows={3}
                                    placeholder="Mission description..."
                                  />
                                </div>
                              </TabsContent>

                              <TabsContent value="cn" className="space-y-3">
                                <div>
                                  <Label className="text-xs">标题 (中文)</Label>
                                  <Input
                                    value={mission.title_cn || ''}
                                    onChange={(e) => handleMissionChange(vm.id, idx, 'title_cn', e.target.value)}
                                    placeholder="使命标题..."
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">描述 (中文)</Label>
                                  <Textarea
                                    value={mission.description_cn || ''}
                                    onChange={(e) => handleMissionChange(vm.id, idx, 'description_cn', e.target.value)}
                                    rows={3}
                                    placeholder="使命描述..."
                                  />
                                </div>
                              </TabsContent>
                            </Tabs>
                          </CardContent>
                        </Card>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleAddMission(vm.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        เพิ่มพันธกิจใหม่
                      </Button>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Core Concept Section */}
                  <AccordionItem value="concept" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="font-medium">แนวคิดหลัก (Core Concept)</span>
                        {!vm.core_concept && <span className="text-xs text-muted-foreground">(ไม่มี)</span>}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Switch
                          checked={!!vm.core_concept}
                          onCheckedChange={() => toggleCoreConcept(vm.id)}
                        />
                        <Label>เปิดใช้งานแนวคิดหลัก</Label>
                      </div>

                      {vm.core_concept && (
                        <Tabs defaultValue="th" className="w-full">
                          <TabsList className="mb-4">
                            <TabsTrigger value="th">🇹🇭 ไทย</TabsTrigger>
                            <TabsTrigger value="en">🇺🇸 English</TabsTrigger>
                            <TabsTrigger value="cn">🇨🇳 中文</TabsTrigger>
                          </TabsList>

                          <TabsContent value="th" className="space-y-4">
                            <div>
                              <Label>หัวข้อหลัก (Thai)</Label>
                              <Input
                                value={vm.core_concept.title_th}
                                onChange={(e) => handleCoreConceptChange(vm.id, 'title_th', e.target.value)}
                                placeholder="เช่น Good Living for Your Life"
                              />
                            </div>
                            <div>
                              <Label>หัวข้อรอง (Thai)</Label>
                              <Input
                                value={vm.core_concept.subtitle_th}
                                onChange={(e) => handleCoreConceptChange(vm.id, 'subtitle_th', e.target.value)}
                                placeholder="เช่น การอยู่อาศัยที่ดีกว่า สำหรับคุณ…ในระยะยาว"
                              />
                            </div>
                            <div>
                              <Label>คำอธิบาย (Thai)</Label>
                              <Textarea
                                value={vm.core_concept.description_th}
                                onChange={(e) => handleCoreConceptChange(vm.id, 'description_th', e.target.value)}
                                rows={2}
                                placeholder="คำอธิบายเพิ่มเติม..."
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="en" className="space-y-4">
                            <div>
                              <Label>Title (English)</Label>
                              <Input
                                value={vm.core_concept.title_en || ''}
                                onChange={(e) => handleCoreConceptChange(vm.id, 'title_en', e.target.value)}
                                placeholder="e.g. Good Living for Your Life"
                              />
                            </div>
                            <div>
                              <Label>Subtitle (English)</Label>
                              <Input
                                value={vm.core_concept.subtitle_en || ''}
                                onChange={(e) => handleCoreConceptChange(vm.id, 'subtitle_en', e.target.value)}
                                placeholder="e.g. Better living for you...in the long run"
                              />
                            </div>
                            <div>
                              <Label>Description (English)</Label>
                              <Textarea
                                value={vm.core_concept.description_en || ''}
                                onChange={(e) => handleCoreConceptChange(vm.id, 'description_en', e.target.value)}
                                rows={2}
                                placeholder="Additional description..."
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="cn" className="space-y-4">
                            <div>
                              <Label>标题 (中文)</Label>
                              <Input
                                value={vm.core_concept.title_cn || ''}
                                onChange={(e) => handleCoreConceptChange(vm.id, 'title_cn', e.target.value)}
                                placeholder="例如：美好生活"
                              />
                            </div>
                            <div>
                              <Label>副标题 (中文)</Label>
                              <Input
                                value={vm.core_concept.subtitle_cn || ''}
                                onChange={(e) => handleCoreConceptChange(vm.id, 'subtitle_cn', e.target.value)}
                                placeholder="例如：为您打造长期美好生活"
                              />
                            </div>
                            <div>
                              <Label>描述 (中文)</Label>
                              <Textarea
                                value={vm.core_concept.description_cn || ''}
                                onChange={(e) => handleCoreConceptChange(vm.id, 'description_cn', e.target.value)}
                                rows={2}
                                placeholder="附加说明..."
                              />
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => handleSave(vm)}
                    disabled={isSaving === vm.id}
                    className="min-w-32"
                  >
                    {isSaving === vm.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    บันทึกการเปลี่ยนแปลง
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VisionMissionManagement;
