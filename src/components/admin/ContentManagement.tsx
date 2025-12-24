import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { Save, FileText, Home, Building2, Newspaper, Briefcase, Info, RefreshCw, MessageSquare, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SiteContent {
  id: string;
  section_key: string;
  title_th: string | null;
  title_en: string | null;
  title_cn: string | null;
  content_th: string | null;
  content_en: string | null;
  content_cn: string | null;
  metadata: unknown;
}

interface ContentCategory {
  key: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const categories: ContentCategory[] = [
  { key: 'hero', label: 'Hero Section', icon: <Home className="h-4 w-4" />, description: 'ส่วนหัวหน้าแรก' },
  { key: 'about', label: 'เกี่ยวกับเรา', icon: <Info className="h-4 w-4" />, description: 'ข้อมูลบริษัท' },
  { key: 'business', label: 'ธุรกิจของเรา', icon: <Building2 className="h-4 w-4" />, description: 'ข้อมูลธุรกิจ 4 หมวด' },
  { key: 'news', label: 'ข่าวสาร', icon: <Newspaper className="h-4 w-4" />, description: 'ข่าวและบทความ' },
  { key: 'careers', label: 'ร่วมงานกับเรา', icon: <Briefcase className="h-4 w-4" />, description: 'ข้อมูลสมัครงาน' },
  { key: 'contact', label: 'ติดต่อเรา', icon: <MapPin className="h-4 w-4" />, description: 'ข้อมูลติดต่อและแผนที่' },
  { key: 'modal', label: 'Popup Modal', icon: <MessageSquare className="h-4 w-4" />, description: 'ป๊อปอัพต้อนรับ' },
];

const sectionLabels: Record<string, string> = {
  'hero_headline': 'หัวข้อหลัก Hero',
  'hero_tagline': 'คำโปรย Hero',
  'hero_subheadline': 'คำอธิบายเพิ่มเติม Hero',
  'about_section': 'ข้อมูลเกี่ยวกับบริษัท',
  'about_stats': 'สถิติบริษัท',
  'business_section': 'หมวดธุรกิจหลัก',
  'business_realestate': 'JW Real Estate',
  'business_hotel': '12 The Residence Hotel',
  'business_pet': '3D Pet Hospital',
  'business_wellness': 'JW Herbal',
  'news_section': 'หมวดข่าวสาร',
  'careers_section': 'หมวดร่วมงานกับเรา',
  'contact_address': 'ที่อยู่สำนักงาน',
  'contact_phone': 'หมายเลขโทรศัพท์',
  'contact_email': 'อีเมล',
  'contact_hours': 'เวลาทำการ',
  'contact_map': 'Google Map URL',
  'modal_welcome': 'ป๊อปอัพต้อนรับ',
  'chairman_quote': 'คำกล่าวประธานกรรมการ',
};

export const ContentManagement = () => {
  const { isAdmin, user } = useAuth();
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section_key');

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
    setIsLoading(false);
  };

  const handleChange = (id: string, field: string, value: string) => {
    setContents(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const saveContent = async (content: SiteContent) => {
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

  const getContentsByCategory = (category: string) => {
    // Map old section keys to categories
    const categoryMapping: Record<string, string[]> = {
      'hero': ['hero_headline', 'hero_tagline', 'hero_subheadline'],
      'about': ['about_section', 'about_stats', 'chairman_quote'],
      'business': ['business_section', 'business_realestate', 'business_hotel', 'business_pet', 'business_wellness'],
      'news': ['news_section'],
      'careers': ['careers_section'],
      'contact': ['contact_address', 'contact_phone', 'contact_email', 'contact_hours', 'contact_map'],
      'modal': ['modal_welcome'],
    };

    const sectionKeys = categoryMapping[category] || [];
    return contents.filter(c => {
      // Check by metadata category first
      const metadata = c.metadata as Record<string, unknown> | null;
      if (metadata?.category === category) return true;
      // Then check by section key mapping
      return sectionKeys.includes(c.section_key);
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            จัดการเนื้อหา
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
              <FileText className="h-5 w-5 text-primary" />
              จัดการเนื้อหาเว็บไซต์
            </CardTitle>
            <CardDescription>แก้ไขเนื้อหาแยกตามหมวดหมู่</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchContents}>
            <RefreshCw className="h-4 w-4 mr-2" />
            รีเฟรช
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hero" className="space-y-4">
          <TabsList className="grid grid-cols-7 w-full">
            {categories.map(cat => (
              <TabsTrigger key={cat.key} value={cat.key} className="flex items-center gap-2">
                {cat.icon}
                <span className="hidden sm:inline">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.key} value={category.key} className="space-y-4">
              <div className="p-4 bg-accent/20 rounded-lg mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  {category.icon}
                  {category.label}
                </h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>

              <Accordion type="multiple" className="space-y-2">
                {getContentsByCategory(category.key).map(content => (
                  <AccordionItem key={content.id} value={content.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-medium">
                        {sectionLabels[content.section_key] || content.section_key}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
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
                              onChange={(e) => handleChange(content.id, 'title_th', e.target.value)}
                              disabled={!isAdmin}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">เนื้อหา</Label>
                            <Textarea
                              value={content.content_th || ''}
                              onChange={(e) => handleChange(content.id, 'content_th', e.target.value)}
                              rows={3}
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
                              onChange={(e) => handleChange(content.id, 'title_en', e.target.value)}
                              disabled={!isAdmin}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Content</Label>
                            <Textarea
                              value={content.content_en || ''}
                              onChange={(e) => handleChange(content.id, 'content_en', e.target.value)}
                              rows={3}
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
                              onChange={(e) => handleChange(content.id, 'title_cn', e.target.value)}
                              disabled={!isAdmin}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">内容</Label>
                            <Textarea
                              value={content.content_cn || ''}
                              onChange={(e) => handleChange(content.id, 'content_cn', e.target.value)}
                              rows={3}
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
                    </AccordionContent>
                  </AccordionItem>
                ))}

                {getContentsByCategory(category.key).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    ยังไม่มีเนื้อหาในหมวดนี้
                  </div>
                )}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
