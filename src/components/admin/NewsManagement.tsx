import { useState, useRef, useCallback } from 'react';
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
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Upload, X, Image as ImageIcon, Loader2, FileImage } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

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
  gallery_images: string[];
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
  gallery_images: [],
  is_featured: false,
  is_published: true,
};

// Mockup placeholder image for news
const NewsMockupImage = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizeClasses = {
    small: 'h-12',
    default: 'h-32',
    large: 'h-48',
  };

  return (
    <div className={cn(
      "w-full bg-gradient-to-br from-primary/30 via-primary/20 to-accent/30 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/30",
      sizeClasses[size]
    )}>
      <div className="relative">
        <FileImage className={cn(
          "text-primary/50",
          size === 'small' ? 'h-5 w-5' : size === 'large' ? 'h-12 w-12' : 'h-8 w-8'
        )} />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/60 rounded-full animate-pulse" />
      </div>
      {size !== 'small' && (
        <span className={cn(
          "text-primary/60 mt-2 font-medium",
          size === 'large' ? 'text-sm' : 'text-xs'
        )}>
          รอการอัพโหลดรูปภาพ
        </span>
      )}
    </div>
  );
};

// Drag & Drop Upload Component
interface DragDropUploadProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  currentImage: string | null;
  onRemove: () => void;
  className?: string;
}

const DragDropUpload = ({ onUpload, isUploading, currentImage, onRemove, className }: DragDropUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onUpload(file);
      } else {
        toast.error('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      }
    }
  }, [onUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  if (currentImage) {
    return (
      <div className={cn("relative group", className)}>
        <div className={cn("w-full h-48 rounded-lg overflow-hidden border bg-muted", className ? "h-full rounded-none border-none" : "")}>
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            เปลี่ยนรูป
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            ลบ
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isUploading && fileInputRef.current?.click()}
      className={cn(
        "w-full h-48 rounded-lg border-2 border-dashed transition-all cursor-pointer",
        "flex flex-col items-center justify-center gap-3",
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02]"
          : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50",
        isUploading && "pointer-events-none opacity-70",
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {isUploading ? (
        <>
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">กำลังอัพโหลด...</span>
        </>
      ) : (
        <>
          <div className={cn(
            "p-4 rounded-full transition-colors",
            isDragging ? "bg-primary/20" : "bg-muted"
          )}>
            <Upload className={cn(
              "h-8 w-8 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {isDragging ? 'วางไฟล์ที่นี่' : 'ลากไฟล์มาวางที่นี่'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              หรือ คลิกเพื่อเลือกไฟล์ (JPG, PNG, WebP สูงสุด 10MB)
            </p>
          </div>
        </>
      )}
    </div>
  );
};

import { MultiDragDropUpload } from './MultiDragDropUpload';

export const NewsManagement = () => {
  const { news, isLoading, createNews, updateNews, deleteNews } = useNewsAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState<'th' | 'en' | 'cn'>('th');
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
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
    toast.success('ลบรูปภาพสำเร็จ');
  };

  const handleGalleryUpload = async (files: File[]) => {
    setIsUploading(true);
    const newImages: string[] = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('news-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('news-images')
          .getPublicUrl(fileName);

        newImages.push(publicUrl);
      }

      setFormData(prev => ({
        ...prev,
        gallery_images: [...prev.gallery_images, ...newImages]
      }));
      toast.success(`อัพโหลดเพิ่ม ${newImages.length} รูปสำเร็จ`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('อัพโหลดไม่สำเร็จ: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveGalleryImage = async (index: number) => {
    const imageUrl = formData.gallery_images[index];
    if (imageUrl) {
      const urlParts = imageUrl.split('/news-images/');
      if (urlParts.length > 1) {
        try {
          await supabase.storage
            .from('news-images')
            .remove([urlParts[1]]);
        } catch (error) {
          console.error('Delete error:', error);
        }
      }
    }

    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert gallery_images to JSON string for video_url field
    const submitData = {
      ...formData,
      video_url: formData.gallery_images.length > 0 ? JSON.stringify(formData.gallery_images) : null
    };

    // Remove gallery_images from the object passed to Supabase
    // We cast to any to bypass the mismatch between NewsFormData (local) and NewsItem (remote)
    const { gallery_images, ...rest } = submitData;
    const finalData = rest as any; // Cast to any to satisfy mutation type which expects Partial<NewsItem>

    try {
      if (editingId) {
        await updateNews.mutateAsync({ id: editingId, ...finalData });
      } else {
        await createNews.mutateAsync(finalData);
      }

      setIsDialogOpen(false);
      setEditingId(null);
      setFormData(initialFormData);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Toast is handled by mutation onError
    }
  };

  const handleEdit = (newsItem: any) => {
    setEditingId(newsItem.id);

    let gallery: string[] = [];
    if (newsItem.video_url && newsItem.video_url.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(newsItem.video_url);
        if (Array.isArray(parsed)) gallery = parsed;
      } catch (e) { console.error('Error parsing gallery', e); }
    }

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
      gallery_images: gallery,
      is_featured: newsItem.is_featured || false,
      is_published: newsItem.is_published ?? true,
    });
    setImagePreview(newsItem.image_url || null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('คุณต้องการลบข่าวนี้หรือไม่?')) {
      const newsItem = news.find((n: any) => n.id === id);
      if (newsItem?.image_url) {
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
        <div>
          <CardTitle>จัดการข่าวสาร</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            ข่าวจะอัพเดทอัตโนมัติแบบ Realtime
          </p>
        </div>
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

            {/* Header Image - Shown if image exists */}
            {(imagePreview || formData.image_url) && (
              <DragDropUpload
                onUpload={handleImageUpload}
                isUploading={isUploading}
                currentImage={imagePreview || formData.image_url || null}
                onRemove={handleRemoveImage}
                className="w-[calc(100%+3rem)] -ml-6 -mr-6 -mt-6 mb-6 h-64 border-b rounded-t-lg overflow-hidden"
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Drag & Drop Image Upload Section - Only shown if NO image */}
              {!(imagePreview || formData.image_url) && (
                <div className="space-y-3">
                  <Label>รูปภาพข่าว</Label>
                  <DragDropUpload
                    onUpload={handleImageUpload}
                    isUploading={isUploading}
                    currentImage={null}
                    onRemove={handleRemoveImage}
                  />
                </div>
              )}

              {/* Language Tabs */}
              <div className="flex gap-2 border-b">
                {(['th', 'en', 'cn'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveTab(lang)}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === lang
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
                    <RichTextEditor
                      value={formData.content_th}
                      onChange={(value) => setFormData({ ...formData, content_th: value })}
                      placeholder="เขียนเนื้อหาข่าวที่นี่..."
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
                    <RichTextEditor
                      value={formData.content_en}
                      onChange={(value) => setFormData({ ...formData, content_en: value })}
                      placeholder="Write news content here..."
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
                    <RichTextEditor
                      value={formData.content_cn}
                      onChange={(value) => setFormData({ ...formData, content_cn: value })}
                      placeholder="在此处撰写新闻内容..."
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
                  <div className="col-span-2">
                    <Label className="mb-2 block">รูปภาพเพิ่มเติม (สูงสุด 3 รูป)</Label>
                    <MultiDragDropUpload
                      onUpload={handleGalleryUpload}
                      isUploading={isUploading}
                      currentImages={formData.gallery_images}
                      onRemove={handleRemoveGalleryImage}
                      maxFiles={3}
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
      </CardHeader >
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
                  <div className="w-16 h-12 rounded overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title_th}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <NewsMockupImage size="small" />
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
    </Card >
  );
};