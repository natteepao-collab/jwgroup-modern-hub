import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Snowflake, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export const SnowfallControl = () => {
  const { isAdmin } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [contentId, setContentId] = useState<string | null>(null);

  useEffect(() => {
    fetchSnowfallSetting();
  }, []);

  const fetchSnowfallSetting = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_key', 'snowfall_animation')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setContentId(data.id);
        setIsEnabled(data.content_th === 'true');
      }
    } catch (error) {
      console.error('Error fetching snowfall setting:', error);
    }
    setIsLoading(false);
  };

  const handleToggle = async (checked: boolean) => {
    if (!isAdmin || !contentId) {
      toast.error('คุณไม่มีสิทธิ์เปลี่ยนการตั้งค่านี้');
      return;
    }

    setIsSaving(true);
    try {
      const value = checked ? 'true' : 'false';
      const { error } = await supabase
        .from('site_content')
        .update({
          content_th: value,
          content_en: value,
          content_cn: value,
        })
        .eq('id', contentId);

      if (error) throw error;
      
      setIsEnabled(checked);
      toast.success(checked ? 'เปิด Animation หิมะตกแล้ว' : 'ปิด Animation หิมะตกแล้ว');
    } catch (error: any) {
      console.error('Error saving snowfall setting:', error);
      toast.error(error.message || 'เกิดข้อผิดพลาดในการบันทึก');
    }
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-primary" />
              Animation หิมะตก (Christmas)
            </CardTitle>
            <CardDescription>เปิด/ปิด Animation หิมะตกบนหน้าเว็บไซต์</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchSnowfallSetting} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            รีเฟรช
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Snowflake className="h-6 w-6 text-primary" />
              </div>
              <div>
                <Label htmlFor="snowfall-toggle" className="text-base font-semibold cursor-pointer">
                  แสดง Animation หิมะตก
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isEnabled ? 'กำลังแสดงหิมะตกบนทุกหน้า' : 'ปิดอยู่ - ไม่แสดงหิมะ'}
                </p>
              </div>
            </div>
            <Switch
              id="snowfall-toggle"
              checked={isEnabled}
              onCheckedChange={handleToggle}
              disabled={isSaving || !isAdmin}
            />
          </div>
        )}
        
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">รายละเอียด Animation:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• หิมะตกแบบธรรมชาติพร้อมการเคลื่อนไหวหลากหลาย</li>
            <li>• มีทั้งเกล็ดหิมะขนาดใหญ่และหยดหิมะขนาดเล็ก</li>
            <li>• แสดงบนทุกหน้าของเว็บไซต์</li>
            <li>• ไม่กระทบการใช้งานเว็บไซต์ (pointer-events: none)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
