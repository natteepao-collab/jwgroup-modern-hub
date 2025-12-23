import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RefreshCw, TreePine } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ChristmasThemeControl = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [contentId, setContentId] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const fetchChristmasSetting = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('id, content_th')
        .eq('section_key', 'christmas_theme')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setContentId(data.id);
        setIsEnabled(data.content_th === 'true');
      } else {
        // Create the record if it doesn't exist
        const { data: newData, error: insertError } = await supabase
          .from('site_content')
          .insert({
            section_key: 'christmas_theme',
            content_th: 'false',
            content_en: 'false',
            content_cn: 'false',
            title_th: 'ธีมคริสต์มาส',
            title_en: 'Christmas Theme',
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('Error creating christmas theme setting:', insertError);
        } else if (newData) {
          setContentId(newData.id);
          setIsEnabled(false);
        }
      }
    } catch (error) {
      console.error('Error fetching christmas theme setting:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดการตั้งค่าธีมคริสต์มาสได้',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChristmasSetting();
  }, []);

  const handleToggle = async (checked: boolean) => {
    if (!isAdmin || !contentId) {
      toast({
        title: 'ไม่มีสิทธิ์',
        description: 'คุณไม่มีสิทธิ์ในการเปลี่ยนการตั้งค่านี้',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .update({
          content_th: checked ? 'true' : 'false',
          content_en: checked ? 'true' : 'false',
          content_cn: checked ? 'true' : 'false',
          updated_at: new Date().toISOString(),
        })
        .eq('id', contentId);

      if (error) throw error;

      setIsEnabled(checked);
      toast({
        title: checked ? 'เปิดธีมคริสต์มาสแล้ว 🎄' : 'ปิดธีมคริสต์มาสแล้ว',
        description: checked
          ? 'เว็บไซต์จะแสดงธีมคริสต์มาสให้ผู้เข้าชม'
          : 'เว็บไซต์กลับสู่ธีมปกติแล้ว',
      });
    } catch (error) {
      console.error('Error updating christmas theme setting:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถบันทึกการตั้งค่าได้',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-600" />
            ธีมคริสต์มาส
          </CardTitle>
          <CardDescription>
            เปิด/ปิดธีมเทศกาลคริสต์มาสบนเว็บไซต์
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchChristmasSetting}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            กำลังโหลด...
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="christmas-toggle" className="text-base">
                  {isEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isEnabled
                    ? 'กำลังแสดงธีมคริสต์มาสบนเว็บไซต์'
                    : 'เว็บไซต์แสดงธีมปกติ'}
                </p>
              </div>
              <Switch
                id="christmas-toggle"
                checked={isEnabled}
                onCheckedChange={handleToggle}
                disabled={isSaving}
              />
            </div>

            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg space-y-2">
              <p className="font-medium">ธีมคริสต์มาสประกอบด้วย:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>ใบฮอลลี่และลูกเบอร์รี่ที่มุมหน้าจอ</li>
                <li>ลูกบอลคริสต์มาสแขวนด้านบน</li>
                <li>ไฟระยิบระยับสีสันสดใส</li>
                <li>สีหลักเปลี่ยนเป็นโทนสีแดง-เขียว</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ChristmasThemeControl;
