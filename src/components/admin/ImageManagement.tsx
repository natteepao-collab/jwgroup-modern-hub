import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { Save, Image as ImageIcon, RefreshCw, Video, FileImage, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SiteImage {
  id: string;
  section_key: string;
  image_url: string;
  alt_text: string | null;
}

const sectionLabels: Record<string, string> = {
  'hero_video': 'วิดีโอ Hero Section',
  'modal_welcome': 'รูปภาพ Popup Modal',
  'business_realestate_image': 'รูปภาพ JW Real Estate',
  'business_hotel_image': 'รูปภาพ 12 The Residence Hotel',
  'business_pet_image': 'รูปภาพ 3D Pet Hospital',
  'business_wellness_image': 'รูปภาพ JW Herbal',
  'chairman_portrait': 'รูปภาพประธานกรรมการ',
};

export const ImageManagement = () => {
  const { isAdmin, user } = useAuth();
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .order('section_key');

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดรูปภาพ');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleChange = (id: string, field: string, value: string) => {
    setImages(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleFileUpload = async (imageId: string, sectionKey: string, file: File) => {
    if (!isAdmin) {
      toast.error('คุณไม่มีสิทธิ์อัปโหลดรูปภาพ');
      return;
    }

    // Validate file type
    const isVideoFile = file.type.startsWith('video/');
    const isImageFile = file.type.startsWith('image/');

    if (!isVideoFile && !isImageFile) {
      toast.error('กรุณาเลือกไฟล์รูปภาพหรือวิดีโอเท่านั้น');
      return;
    }

    // Validate file size (10MB for images, 50MB for videos)
    const maxSize = isVideoFile ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`ขนาดไฟล์ต้องไม่เกิน ${isVideoFile ? '50MB' : '10MB'}`);
      return;
    }

    setUploadingId(imageId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${sectionKey}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(fileName);

      // Update site_images table
      const { error: updateError } = await supabase
        .from('site_images')
        .update({
          image_url: publicUrl,
          updated_by: user?.id
        })
        .eq('id', imageId);

      if (updateError) throw updateError;

      // Update local state
      setImages(prev =>
        prev.map(item =>
          item.id === imageId ? { ...item, image_url: publicUrl } : item
        )
      );

      toast.success('อัปโหลดสำเร็จ');
    } catch (error: unknown) {
      console.error('Error uploading file:', error);
      toast.error((error as Error).message || 'เกิดข้อผิดพลาดในการอัปโหลด');
    }
    setUploadingId(null);
  };

  const saveImage = async (image: SiteImage) => {
    if (!isAdmin) {
      toast.error('คุณไม่มีสิทธิ์แก้ไขรูปภาพ');
      return;
    }

    setIsSaving(image.id);
    try {
      const { error } = await supabase
        .from('site_images')
        .update({
          image_url: image.image_url,
          alt_text: image.alt_text,
          updated_by: user?.id
        })
        .eq('id', image.id);

      if (error) throw error;
      toast.success('บันทึกรูปภาพสำเร็จ');
    } catch (error: unknown) {
      console.error('Error saving image:', error);
      toast.error((error as Error).message || 'เกิดข้อผิดพลาดในการบันทึก');
    }
    setIsSaving(null);
  };

  const isVideo = (url: string) => {
    return url.includes('.mp4') || url.includes('video');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            จัดการรูปภาพ/วิดีโอ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
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
              <ImageIcon className="h-5 w-5 text-primary" />
              จัดการรูปภาพ/วิดีโอ
            </CardTitle>
            <CardDescription>แก้ไข URL รูปภาพและวิดีโอบนเว็บไซต์</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchImages}>
            <RefreshCw className="h-4 w-4 mr-2" />
            รีเฟรช
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-2">
          {images.filter(img => img.section_key !== 'chairman_portrait').map(image => (
            <AccordionItem key={image.id} value={image.id} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="font-medium flex items-center gap-2">
                  {isVideo(image.image_url) ? (
                    <Video className="h-4 w-4 text-primary" />
                  ) : (
                    <FileImage className="h-4 w-4 text-primary" />
                  )}
                  {sectionLabels[image.section_key] || image.section_key}
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {/* Upload Section */}
                <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 text-center sm:text-left">
                      <p className="font-medium text-sm">อัปโหลดไฟล์ใหม่</p>
                      <p className="text-xs text-muted-foreground">
                        รองรับ JPG, PNG, WebP, MP4 (สูงสุด {isVideo(image.image_url) ? '50MB' : '10MB'})
                      </p>
                    </div>
                    <input
                      ref={(el) => { fileInputRefs.current[image.id] = el; }}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(image.id, image.section_key, file);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRefs.current[image.id]?.click()}
                      disabled={!isAdmin || uploadingId === image.id}
                    >
                      {uploadingId === image.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          กำลังอัปโหลด...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          เลือกไฟล์
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">หรือใส่ URL</span>
                  </div>
                </div>

                <div>
                  <Label>URL รูปภาพ/วิดีโอ</Label>
                  <Input
                    value={image.image_url}
                    onChange={(e) => handleChange(image.id, 'image_url', e.target.value)}
                    placeholder="https://..."
                    disabled={!isAdmin}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Alt Text (คำอธิบาย)</Label>
                  <Input
                    value={image.alt_text || ''}
                    onChange={(e) => handleChange(image.id, 'alt_text', e.target.value)}
                    placeholder="คำอธิบายรูปภาพ"
                    disabled={!isAdmin}
                    className="mt-1"
                  />
                </div>

                {/* Preview */}
                <div>
                  <Label className="mb-2 block">ตัวอย่าง</Label>
                  <div className="border rounded-lg overflow-hidden bg-muted/20">
                    {isVideo(image.image_url) ? (
                      <video
                        src={image.image_url}
                        className="w-full max-h-64 object-cover"
                        controls
                        muted
                      />
                    ) : image.image_url ? (
                      <img
                        src={image.image_url}
                        alt={image.alt_text || ''}
                        className="w-full max-h-64 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        <ImageIcon className="h-8 w-8 opacity-50" />
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => saveImage(image)}
                  disabled={isSaving === image.id || !isAdmin}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving === image.id ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}

          {images.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              ยังไม่มีรูปภาพในระบบ
            </div>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};
