import { useState, useRef } from 'react';
import { useNewsAdmin } from '@/hooks/useNews';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface NewsFormData {
  title_th: string;
  title_en: string;
  title_cn: string;
  excerpt_th: string;
  excerpt_en: string;
  excerpt_cn: string;
  content_th: string;
  content_en: string;
  content_cn: string;
  category: string;
  image_url: string;
  video_url: string;
  is_featured: boolean;
  is_published: boolean;
}

const initialFormData: NewsFormData = {
  title_th: '',
  title_en: '',
  title_cn: '',
  excerpt_th: '',
  excerpt_en: '',
  excerpt_cn: '',
  content_th: '',
  content_en: '',
  content_cn: '',
  category: 'company',
  image_url: '',
  video_url: '',
  is_featured: false,
  is_published: true,
};

// Placeholder image component
const PlaceholderImage = () => (
  <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex flex-col items-center justify-center text-muted-foreground">
    <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
    <span className="text-xs">ยังไม่มีรูปภาพ</span>
  </div>
);

export const NewsManagement = () => {
  const { news, isLoading, createNews, updateNews, deleteNews } = useNewsAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState<'th' | 'en' | 'cn'>('th');
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('ขนาดไฟล์ต้องไม่เกิน 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `news/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      setImagePreview(publicUrl);
      toast.success('อัพโหลดรูปภาพสำเร็จ');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('อัพโหลดไม่สำเร็จ: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.image_url) {
      // Extract file path from URL
      const urlParts = formData.image_url.split('/news-images/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        try {
          await supabase.storage
            .from('news-images')
            .remove([filePath]);
        } catch (error) {
          console.error('Delete error:', error);
        }
      }
    }
    
    setFormData({ ...formData, image_url: '' });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('ลบรูปภาพสำเร็จ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await updateNews.mutateAsync({ id: editingId, ...formData });
    } else {
      await createNews.mutateAsync(formData);
    }
    
    setIsDialogOpen(false);
    setEditingId(null);
    setFormData(initialFormData);
    setImagePreview(null);
  };

  const handleEdit = (newsItem: any) => {
    setEditingId(newsItem.id);
    setFormData({
      title_th: newsItem.title_th || '',
      title_en: newsItem.title_en || '',
      title_cn: newsItem.title_cn || '',
      excerpt_th: newsItem.excerpt_th || '',
      excerpt_en: newsItem.excerpt_en || '',
      excerpt_cn: newsItem.excerpt_cn || '',
      content_th: newsItem.content_th || '',
      content_en: newsItem.content_en || '',
      content_cn: newsItem.content_cn || '',
      category: newsItem.category || 'company',
      image_url: newsItem.image_url || '',
      video_url: newsItem.video_url || '',
      is_featured: newsItem.is_featured || false,
      is_published: newsItem.is_published ?? true,
    });
    setImagePreview(newsItem.image_url || null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('คุณต้องการลบข่าวนี้หรือไม่?')) {
      // Find the news item to get its image URL
      const newsItem = news.find((n: any) => n.id === id);
      if (newsItem?.image_url) {
        // Delete image from storage
        const urlParts = newsItem.image_url.split('/news-images/');
        if (urlParts.length > 1) {
          try {
            await supabase.storage
              .from('news-images')
              .remove([urlParts[1]]);
          } catch (error) {
            console.error('Failed to delete image:', error);
          }
        }
      }
      await deleteNews.mutateAsync(id);
    }
  };

  const handleOpenDialog = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const togglePublished = async (id: string, currentState: boolean) => {
    await updateNews.mutateAsync({ id, is_published: !currentState });
  };

  const toggleFeatured = async (id: string, currentState: boolean) => {
    await updateNews.mutateAsync({ id, is_featured: !currentState });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>จัดการข่าวสาร</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog}>
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มข่าวใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'แก้ไขข่าว' : 'เพิ่มข่าวใหม่'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div className="space-y-3">
                <Label>รูปภาพข่าว</Label>
                <div className="flex gap-4">
                  {/* Image Preview */}
                  <div className="w-48 h-32 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
                    {imagePreview || formData.image_url ? (
                      <img 
                        src={imagePreview || formData.image_url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PlaceholderImage />
                    )}
                  </div>
                  
                  {/* Upload Controls */}
                  <div className="flex flex-col gap-2 justify-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          กำลังอัพโหลด...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          อัพโหลดรูปภาพ
                        </>
                      )}
                    </Button>
                    {(imagePreview || formData.image_url) && (
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4 mr-2" />
                        ลบรูปภาพ
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground">
                      รองรับ JPG, PNG, WebP (สูงสุด 10MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="flex gap-2 border-b">
                {(['th', 'en', 'cn'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveTab(lang)}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === lang 
                        ? 'border-b-2 border-primary text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {lang === 'th' ? 'ภาษาไทย' : lang === 'en' ? 'English' : '中文'}
                  </button>
                ))}
              </div>

              {/* Thai Content */}
              {activeTab === 'th' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title_th">หัวข้อข่าว (ไทย) *</Label>
                    <Input
                      id="title_th"
                      value={formData.title_th}
                      onChange={(e) => setFormData({ ...formData, title_th: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt_th">เนื้อหาย่อ (ไทย)</Label>
                    <Textarea
                      id="excerpt_th"
                      value={formData.excerpt_th}
                      onChange={(e) => setFormData({ ...formData, excerpt_th: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content_th">เนื้อหาเต็ม (ไทย)</Label>
                    <Textarea
                      id="content_th"
                      value={formData.content_th}
                      onChange={(e) => setFormData({ ...formData, content_th: e.target.value })}
                      rows={6}
                    />
                  </div>
                </div>
              )}

              {/* English Content */}
              {activeTab === 'en' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title_en">Title (English)</Label>
                    <Input
                      id="title_en"
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt_en">Excerpt (English)</Label>
                    <Textarea
                      id="excerpt_en"
                      value={formData.excerpt_en}
                      onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content_en">Content (English)</Label>
                    <Textarea
                      id="content_en"
                      value={formData.content_en}
                      onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                      rows={6}
                    />
                  </div>
                </div>
              )}

              {/* Chinese Content */}
              {activeTab === 'cn' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title_cn">标题 (中文)</Label>
                    <Input
                      id="title_cn"
                      value={formData.title_cn}
                      onChange={(e) => setFormData({ ...formData, title_cn: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt_cn">摘要 (中文)</Label>
                    <Textarea
                      id="excerpt_cn"
                      value={formData.excerpt_cn}
                      onChange={(e) => setFormData({ ...formData, excerpt_cn: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content_cn">内容 (中文)</Label>
                    <Textarea
                      id="content_cn"
                      value={formData.content_cn}
                      onChange={(e) => setFormData({ ...formData, content_cn: e.target.value })}
                      rows={6}
                    />
                  </div>
                </div>
              )}

              {/* Common Fields */}
              <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">หมวดหมู่</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company">ข่าวบริษัท</SelectItem>
                        <SelectItem value="press">ข่าวประชาสัมพันธ์</SelectItem>
                        <SelectItem value="csr">CSR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="video_url">URL วิดีโอ (ถ้ามี)</Label>
                    <Input
                      id="video_url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                    />
                    <Label htmlFor="is_published">เผยแพร่</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label htmlFor="is_featured">ข่าวเด่น</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button type="submit" disabled={createNews.isPending || updateNews.isPending}>
                  {editingId ? 'บันทึก' : 'เพิ่มข่าว'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">รูปภาพ</TableHead>
              <TableHead className="w-[280px]">หัวข้อ</TableHead>
              <TableHead>หมวดหมู่</TableHead>
              <TableHead>วันที่</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="w-16 h-12 rounded overflow-hidden bg-muted">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.title_th} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PlaceholderImage />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {item.is_featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                    <span className="line-clamp-1">{item.title_th}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {item.category === 'company' ? 'ข่าวบริษัท' : 
                     item.category === 'press' ? 'ข่าวประชาสัมพันธ์' : 'CSR'}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(item.published_at)}</TableCell>
                <TableCell>
                  <Badge 
                    variant={item.is_published ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => togglePublished(item.id, item.is_published)}
                  >
                    {item.is_published ? (
                      <><Eye className="h-3 w-3 mr-1" /> เผยแพร่</>
                    ) : (
                      <><EyeOff className="h-3 w-3 mr-1" /> ซ่อน</>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFeatured(item.id, item.is_featured)}
                      title={item.is_featured ? 'ยกเลิกข่าวเด่น' : 'ตั้งเป็นข่าวเด่น'}
                    >
                      <Star className={`h-4 w-4 ${item.is_featured ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {news.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  ยังไม่มีข่าวสาร
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};