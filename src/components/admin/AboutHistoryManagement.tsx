import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save, RefreshCw, Image, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HistoryContent {
  id: string;
  section_key: string;
  title_th: string | null;
  title_en: string | null;
  title_cn: string | null;
  content_th: string | null;
  content_en: string | null;
  content_cn: string | null;
}

interface HistoryImage {
  id: string;
  section_key: string;
  image_url: string;
  alt_text: string | null;
}

export const AboutHistoryManagement = () => {
  const { isAdmin, user } = useAuth();
  const [contents, setContents] = useState<HistoryContent[]>([]);
  const [images, setImages] = useState<HistoryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const sectionLabels: Record<string, string> = {
    'about_history_title': 'หัวข้อหลักและคำโปรย',
    'about_history_founded': 'ปีที่ก่อตั้ง',
    'about_history_growth': 'การเติบโตของบริษัท',
  };

  const imageLabels: Record<string, string> = {
    'about_history_bento_1': 'รูป Hero (รูปใหญ่หลัก)',
    'about_history_bento_2': 'รูป Gallery 2',
    'about_history_bento_3': 'รูป Gallery 3',
    'about_history_bento_4': 'รูป Gallery 4',
    'about_history_bento_5': 'รูป Gallery 5',
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [contentsRes, imagesRes] = await Promise.all([
        supabase
          .from('site_content')
          .select('*')
          .like('section_key', 'about_history%'),
        supabase
          .from('site_images')
          .select('*')
          .like('section_key', 'about_history%')
      ]);

      if (contentsRes.error) throw contentsRes.error;
      if (imagesRes.error) throw imagesRes.error;

      setContents(contentsRes.data || []);
      setImages(imagesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
    setIsLoading(false);
  };

  const handleContentChange = (id: string, field: string, value: string) => {
    setContents(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const saveContent = async (content: HistoryContent) => {
    if (!isAdmin) {
      toast.error('คุณไม่มีสิทธิ์แก้ไขเนื้อหา');
      return;
    }

    setIsSaving(content.id);
    try {
      const { error } = await supabase
        .from('site_content')
        .update({
          title_th: content.title_th,
          title_en: content.title_en,
          title_cn: content.title_cn,
          content_th: content.content_th,
          content_en: content.content_en,
          content_cn: content.content_cn,
          updated_by: user?.id
        })
        .eq('id', content.id);

      if (error) throw error;
      toast.success('บันทึกเนื้อหาสำเร็จ');
    } catch (error: unknown) {
      console.error('Error saving content:', error);
      toast.error((error as Error).message || 'เกิดข้อผิดพลาดในการบันทึก');
    }
    setIsSaving(null);
  };

  const handleImageUpload = async (sectionKey: string, file: File) => {
    if (!isAdmin) {
      toast.error('คุณไม่มีสิทธิ์อัปโหลดรูปภาพ');
      return;
    }

    setUploadingImage(sectionKey);
    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${sectionKey}-${Date.now()}.${fileExt}`;
      const filePath = `about-history/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // Update or insert image record
      const existingImage = images.find(img => img.section_key === sectionKey);
      
      if (existingImage) {
        const { error: updateError } = await supabase
          .from('site_images')
          .update({
            image_url: imageUrl,
            updated_by: user?.id
          })
          .eq('id', existingImage.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('site_images')
          .insert({
            section_key: sectionKey,
            image_url: imageUrl,
            alt_text: imageLabels[sectionKey] || sectionKey
          });

        if (insertError) throw insertError;
      }

      toast.success('อัปโหลดรูปภาพสำเร็จ');
      fetchData();
    } catch (error: unknown) {
      console.error('Error uploading image:', error);
      toast.error((error as Error).message || 'เกิดข้อผิดพลาดในการอัปโหลด');
    }
    setUploadingImage(null);
  };

  const getImageUrl = (sectionKey: string) => {
    const image = images.find(img => img.section_key === sectionKey);
    return image?.image_url || null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>จัดการประวัติ JW GROUP</CardTitle>
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
              <Image className="h-5 w-5 text-primary" />
              จัดการประวัติ JW GROUP
            </CardTitle>
            <CardDescription>แก้ไขข้อความและรูปภาพในหน้าประวัติบริษัท</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            รีเฟรช
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="images" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="images">รูปภาพ</TabsTrigger>
            <TabsTrigger value="content">ข้อความ</TabsTrigger>
          </TabsList>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <div className="grid gap-6">
              {Object.entries(imageLabels).map(([key, label]) => (
                <div key={key} className="border rounded-lg p-4">
                  <Label className="text-sm font-medium mb-3 block">{label}</Label>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Preview */}
                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-muted flex items-center justify-center border">
                      {getImageUrl(key) ? (
                        <img 
                          src={getImageUrl(key)!} 
                          alt={label}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground text-sm text-center p-4">
                          ยังไม่มีรูปภาพ
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1 flex flex-col justify-center">
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id={`upload-${key}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(key, file);
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById(`upload-${key}`)?.click()}
                        disabled={uploadingImage === key}
                        className="w-full md:w-auto"
                      >
                        {uploadingImage === key ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            กำลังอัปโหลด...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            อัปโหลดรูปภาพใหม่
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        แนะนำขนาด: {key === 'about_history_hero' ? '1920x800px' : '800x600px'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            {contents.map(content => (
              <div key={content.id} className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">
                  {sectionLabels[content.section_key] || content.section_key}
                </h3>

                {/* Thai */}
                <div className="space-y-3 p-4 bg-accent/10 rounded-lg">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    🇹🇭 ภาษาไทย
                  </h4>
                  <div className="grid gap-3">
                    <div>
                      <Label className="text-xs">หัวข้อ</Label>
                      <Input
                        value={content.title_th || ''}
                        onChange={(e) => handleContentChange(content.id, 'title_th', e.target.value)}
                        disabled={!isAdmin}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">เนื้อหา</Label>
                      <Textarea
                        value={content.content_th || ''}
                        onChange={(e) => handleContentChange(content.id, 'content_th', e.target.value)}
                        rows={4}
                        disabled={!isAdmin}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* English */}
                <div className="space-y-3 p-4 bg-accent/10 rounded-lg">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    🇬🇧 English
                  </h4>
                  <div className="grid gap-3">
                    <div>
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={content.title_en || ''}
                        onChange={(e) => handleContentChange(content.id, 'title_en', e.target.value)}
                        disabled={!isAdmin}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Content</Label>
                      <Textarea
                        value={content.content_en || ''}
                        onChange={(e) => handleContentChange(content.id, 'content_en', e.target.value)}
                        rows={4}
                        disabled={!isAdmin}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Chinese */}
                <div className="space-y-3 p-4 bg-accent/10 rounded-lg">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    🇨🇳 中文
                  </h4>
                  <div className="grid gap-3">
                    <div>
                      <Label className="text-xs">标题</Label>
                      <Input
                        value={content.title_cn || ''}
                        onChange={(e) => handleContentChange(content.id, 'title_cn', e.target.value)}
                        disabled={!isAdmin}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">内容</Label>
                      <Textarea
                        value={content.content_cn || ''}
                        onChange={(e) => handleContentChange(content.id, 'content_cn', e.target.value)}
                        rows={4}
                        disabled={!isAdmin}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => saveContent(content)}
                  disabled={isSaving === content.id || !isAdmin}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving === content.id ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                </Button>
              </div>
            ))}

            {contents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                ยังไม่มีเนื้อหา กรุณารีเฟรชหน้าจอ
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
