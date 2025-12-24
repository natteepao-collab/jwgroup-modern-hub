import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, User, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import chairmanDefault from '@/assets/chairman-portrait.jpg';

export const ChairmanImageUpload = () => {
  const { isAdmin, user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentImage();
  }, []);

  const fetchCurrentImage = async () => {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('image_url')
        .eq('section_key', 'chairman_portrait')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data?.image_url) {
        setImageUrl(data.image_url);
      }
    } catch (error) {
      console.error('Error fetching chairman image:', error);
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('ขนาดไฟล์ต้องไม่เกิน 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `chairman-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chairman-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chairman-images')
        .getPublicUrl(fileName);

      // Update site_images table
      const { error: updateError } = await supabase
        .from('site_images')
        .update({
          image_url: publicUrl,
          updated_by: user?.id
        })
        .eq('section_key', 'chairman_portrait');

      if (updateError) throw updateError;

      setImageUrl(publicUrl);
      toast.success('อัปโหลดรูปภาพสำเร็จ');
    } catch (error: unknown) {
      console.error('Error uploading image:', error);
      toast.error((error as Error).message || 'เกิดข้อผิดพลาดในการอัปโหลด');
    }
    setIsUploading(false);
  };

  const handleRemoveImage = async () => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('site_images')
        .update({
          image_url: '',
          updated_by: user?.id
        })
        .eq('section_key', 'chairman_portrait');

      if (error) throw error;

      setImageUrl('');
      toast.success('ลบรูปภาพสำเร็จ');
    } catch (error: unknown) {
      console.error('Error removing image:', error);
      toast.error((error as Error).message || 'เกิดข้อผิดพลาดในการลบ');
    }
  };

  const displayImage = imageUrl || chairmanDefault;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          รูปภาพประธานกรรมการ
        </CardTitle>
        <CardDescription>
          อัปโหลดรูปภาพประธานกรรมการสำหรับแสดงใน Quote Section
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Image Preview */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
            <img
              src={displayImage}
              alt="Chairman Portrait"
              className="w-full h-full object-cover"
            />
          </div>
          {imageUrl && (
            <p className="text-xs text-muted-foreground text-center break-all max-w-md">
              {imageUrl}
            </p>
          )}
        </div>

        {/* Upload Controls */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="chairman-image" className="text-sm font-medium">
              อัปโหลดรูปภาพใหม่
            </Label>
            <div className="mt-2 flex gap-2">
              <Input
                id="chairman-image"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={!isAdmin || isUploading}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              รองรับไฟล์ JPG, PNG, WebP ขนาดไม่เกิน 5MB
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => document.getElementById('chairman-image')?.click()}
              disabled={!isAdmin || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  กำลังอัปโหลด...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  เลือกรูปภาพ
                </>
              )}
            </Button>

            {imageUrl && (
              <Button
                variant="destructive"
                onClick={handleRemoveImage}
                disabled={!isAdmin || isUploading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {!isAdmin && (
          <p className="text-sm text-destructive text-center">
            คุณไม่มีสิทธิ์ในการอัปโหลดรูปภาพ
          </p>
        )}
      </CardContent>
    </Card>
  );
};
