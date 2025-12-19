import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Facebook, Instagram, Youtube, Save, Loader2, ExternalLink } from 'lucide-react';

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface SocialLink {
  key: string;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  color: string;
}

const socialLinks: SocialLink[] = [
  {
    key: 'social_facebook',
    label: 'Facebook',
    icon: <Facebook className="h-5 w-5" />,
    placeholder: 'https://facebook.com/jwgroup',
    color: '#1877F2'
  },
  {
    key: 'social_instagram',
    label: 'Instagram',
    icon: <Instagram className="h-5 w-5" />,
    placeholder: 'https://instagram.com/jwgroup',
    color: '#E4405F'
  },
  {
    key: 'social_tiktok',
    label: 'TikTok',
    icon: <TikTokIcon className="h-5 w-5" />,
    placeholder: 'https://tiktok.com/@jwgroup',
    color: '#000000'
  },
  {
    key: 'social_youtube',
    label: 'YouTube',
    icon: <Youtube className="h-5 w-5" />,
    placeholder: 'https://youtube.com/@jwgroup',
    color: '#FF0000'
  }
];

export const SocialMediaManagement = () => {
  const [links, setLinks] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('section_key, content_th')
        .in('section_key', socialLinks.map(s => s.key));

      if (error) throw error;

      const linksMap: Record<string, string> = {};
      data?.forEach(item => {
        linksMap[item.section_key] = item.content_th || '';
      });
      setLinks(linksMap);
    } catch (error) {
      console.error('Error fetching social links:', error);
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setLinks(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const social of socialLinks) {
        const url = links[social.key] || '';
        
        // Check if record exists
        const { data: existing } = await supabase
          .from('site_content')
          .select('id')
          .eq('section_key', social.key)
          .single();

        if (existing) {
          // Update existing record
          const { error } = await supabase
            .from('site_content')
            .update({ 
              content_th: url,
              content_en: url,
              content_cn: url,
              title_th: social.label,
              title_en: social.label,
              updated_at: new Date().toISOString()
            })
            .eq('section_key', social.key);

          if (error) throw error;
        } else {
          // Insert new record
          const { error } = await supabase
            .from('site_content')
            .insert({
              section_key: social.key,
              content_th: url,
              content_en: url,
              content_cn: url,
              title_th: social.label,
              title_en: social.label
            });

          if (error) throw error;
        }
      }

      toast.success('บันทึกลิงก์ Social Media สำเร็จ');
    } catch (error) {
      console.error('Error saving social links:', error);
      toast.error('ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">กำลังโหลด...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex -space-x-1">
            <div className="w-8 h-8 rounded-full bg-[#1877F2]/10 flex items-center justify-center">
              <Facebook className="h-4 w-4 text-[#1877F2]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#E4405F]/10 flex items-center justify-center">
              <Instagram className="h-4 w-4 text-[#E4405F]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
              <TikTokIcon className="h-4 w-4" />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#FF0000]/10 flex items-center justify-center">
              <Youtube className="h-4 w-4 text-[#FF0000]" />
            </div>
          </div>
          จัดการลิงก์ Social Media
        </CardTitle>
        <CardDescription>
          กรอก URL ของแต่ละช่องทาง Social Media เพื่อแสดงบน Navbar ของเว็บไซต์
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {socialLinks.map((social) => (
          <div key={social.key} className="space-y-2">
            <Label className="flex items-center gap-2">
              <span 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${social.color}15`, color: social.color }}
              >
                {social.icon}
              </span>
              {social.label}
            </Label>
            <div className="flex gap-2">
              <Input
                type="url"
                value={links[social.key] || ''}
                onChange={(e) => handleChange(social.key, e.target.value)}
                placeholder={social.placeholder}
                className="flex-1"
              />
              {links[social.key] && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(links[social.key], '_blank')}
                  title="เปิดลิงก์"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                บันทึกลิงก์ทั้งหมด
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaManagement;
