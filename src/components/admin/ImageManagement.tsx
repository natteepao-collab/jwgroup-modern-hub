import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { Save, Image as ImageIcon, RefreshCw, Video, FileImage } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SiteImage {
  id: string;
  section_key: string;
  image_url: string;
  alt_text: string | null;
}

const sectionLabels: Record<string, string> = {
  'hero_video': 'วิดีโอ Hero Section',
  'business_realestate_image': 'รูปภาพ JW Real Estate',
  'business_hotel_image': 'รูปภาพ 12 The Residence Hotel',
  'business_pet_image': 'รูปภาพ 3D Pet Hospital',
  'business_wellness_image': 'รูปภาพ JW Herbal & Wellness',
};

export const ImageManagement = () => {
  const { isAdmin, user } = useAuth();
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

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

  const handleChange = (id: string, field: string, value: string) => {
    setImages(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
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
    } catch (error: any) {
      console.error('Error saving image:', error);
      toast.error(error.message || 'เกิดข้อผิดพลาดในการบันทึก');
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
          {images.map(image => (
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
                    ) : (
                      <img
                        src={image.image_url}
                        alt={image.alt_text || ''}
                        className="w-full max-h-64 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
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
