import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Shield, 
  LogOut, 
  Save, 
  FileText, 
  Image as ImageIcon,
  Home,
  Users,
  Settings,
  RefreshCw
} from 'lucide-react';
import jwLogo from '@/assets/jw-group-logo-full.png';

interface SiteContent {
  id: string;
  section_key: string;
  title_th: string | null;
  title_en: string | null;
  title_cn: string | null;
  content_th: string | null;
  content_en: string | null;
  content_cn: string | null;
}

interface SiteImage {
  id: string;
  section_key: string;
  image_url: string;
  alt_text: string | null;
}

const Admin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const [contentRes, imageRes] = await Promise.all([
        supabase.from('site_content').select('*'),
        supabase.from('site_images').select('*')
      ]);
      
      if (contentRes.data) setContents(contentRes.data);
      if (imageRes.data) setImages(imageRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
    setIsLoadingData(false);
  };

  const handleContentChange = (id: string, field: string, value: string) => {
    setContents(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleImageChange = (id: string, field: string, value: string) => {
    setImages(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const saveContent = async (content: SiteContent) => {
    if (!isAdmin) {
      toast.error('คุณไม่มีสิทธิ์แก้ไขเนื้อหา กรุณาติดต่อผู้ดูแลระบบ');
      return;
    }
    
    setIsSaving(true);
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
    } catch (error: any) {
      console.error('Error saving content:', error);
      toast.error(error.message || 'เกิดข้อผิดพลาดในการบันทึก');
    }
    setIsSaving(false);
  };

  const saveImage = async (image: SiteImage) => {
    if (!isAdmin) {
      toast.error('คุณไม่มีสิทธิ์แก้ไขรูปภาพ กรุณาติดต่อผู้ดูแลระบบ');
      return;
    }
    
    setIsSaving(true);
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
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.success('ออกจากระบบสำเร็จ');
  };

  const getSectionLabel = (key: string) => {
    const labels: Record<string, string> = {
      'hero_headline': 'Hero Section - หัวข้อหลัก',
      'about_section': 'เกี่ยวกับเรา',
      'business_section': 'ธุรกิจของเรา',
      'news_section': 'ข่าวสาร',
      'careers_section': 'ร่วมงานกับเรา',
      'hero_video': 'วิดีโอ Hero Section'
    };
    return labels[key] || key;
  };

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={jwLogo} alt="JW Group" className="h-10" />
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {user?.email}
                {isAdmin && (
                  <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-2" />
                กลับหน้าหลัก
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isAdmin && (
          <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="py-4">
              <p className="text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                คุณยังไม่ได้รับสิทธิ์ Admin กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์การแก้ไขเนื้อหา
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">จัดการเนื้อหาเว็บไซต์</h1>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            รีเฟรชข้อมูล
          </Button>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              เนื้อหาข้อความ
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              รูปภาพ/วิดีโอ
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              ผู้ใช้งาน
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              ตั้งค่า
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {contents.map(content => (
              <Card key={content.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {getSectionLabel(content.section_key)}
                  </CardTitle>
                  <CardDescription>แก้ไขเนื้อหาสำหรับส่วน {content.section_key}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Thai */}
                  <div className="space-y-4 p-4 bg-accent/20 rounded-lg">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      🇹🇭 ภาษาไทย
                    </h4>
                    <div className="grid gap-4">
                      <div>
                        <Label>หัวข้อ</Label>
                        <Input
                          value={content.title_th || ''}
                          onChange={(e) => handleContentChange(content.id, 'title_th', e.target.value)}
                          disabled={!isAdmin}
                        />
                      </div>
                      <div>
                        <Label>เนื้อหา</Label>
                        <Textarea
                          value={content.content_th || ''}
                          onChange={(e) => handleContentChange(content.id, 'content_th', e.target.value)}
                          rows={3}
                          disabled={!isAdmin}
                        />
                      </div>
                    </div>
                  </div>

                  {/* English */}
                  <div className="space-y-4 p-4 bg-accent/20 rounded-lg">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      🇬🇧 English
                    </h4>
                    <div className="grid gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={content.title_en || ''}
                          onChange={(e) => handleContentChange(content.id, 'title_en', e.target.value)}
                          disabled={!isAdmin}
                        />
                      </div>
                      <div>
                        <Label>Content</Label>
                        <Textarea
                          value={content.content_en || ''}
                          onChange={(e) => handleContentChange(content.id, 'content_en', e.target.value)}
                          rows={3}
                          disabled={!isAdmin}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Chinese */}
                  <div className="space-y-4 p-4 bg-accent/20 rounded-lg">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      🇨🇳 中文
                    </h4>
                    <div className="grid gap-4">
                      <div>
                        <Label>标题</Label>
                        <Input
                          value={content.title_cn || ''}
                          onChange={(e) => handleContentChange(content.id, 'title_cn', e.target.value)}
                          disabled={!isAdmin}
                        />
                      </div>
                      <div>
                        <Label>内容</Label>
                        <Textarea
                          value={content.content_cn || ''}
                          onChange={(e) => handleContentChange(content.id, 'content_cn', e.target.value)}
                          rows={3}
                          disabled={!isAdmin}
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => saveContent(content)} 
                    disabled={isSaving || !isAdmin}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    บันทึกการเปลี่ยนแปลง
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            {images.map(image => (
              <Card key={image.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    {getSectionLabel(image.section_key)}
                  </CardTitle>
                  <CardDescription>แก้ไข URL รูปภาพ/วิดีโอ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>URL รูปภาพ/วิดีโอ</Label>
                    <Input
                      value={image.image_url}
                      onChange={(e) => handleImageChange(image.id, 'image_url', e.target.value)}
                      placeholder="https://..."
                      disabled={!isAdmin}
                    />
                  </div>
                  <div>
                    <Label>Alt Text</Label>
                    <Input
                      value={image.alt_text || ''}
                      onChange={(e) => handleImageChange(image.id, 'alt_text', e.target.value)}
                      placeholder="คำอธิบายรูปภาพ"
                      disabled={!isAdmin}
                    />
                  </div>
                  
                  {/* Preview */}
                  <div className="mt-4">
                    <Label className="mb-2 block">ตัวอย่าง</Label>
                    {image.image_url.includes('.mp4') || image.image_url.includes('video') ? (
                      <video 
                        src={image.image_url} 
                        className="w-full max-h-64 object-cover rounded-lg"
                        controls
                        muted
                      />
                    ) : (
                      <img 
                        src={image.image_url} 
                        alt={image.alt_text || ''} 
                        className="w-full max-h-64 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  <Button 
                    onClick={() => saveImage(image)} 
                    disabled={isSaving || !isAdmin}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    บันทึกการเปลี่ยนแปลง
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>การจัดการผู้ใช้งาน</CardTitle>
                <CardDescription>ดูและจัดการผู้ใช้งานในระบบ</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">ฟีเจอร์นี้กำลังพัฒนา...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>ตั้งค่าระบบ</CardTitle>
                <CardDescription>ตั้งค่าทั่วไปของเว็บไซต์</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">ฟีเจอร์นี้กำลังพัฒนา...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
