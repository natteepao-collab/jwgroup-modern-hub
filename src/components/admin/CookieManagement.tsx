import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Cookie, Save, RefreshCw } from "lucide-react";

interface CookieSetting {
  id: string;
  setting_key: string;
  title_th: string | null;
  title_en: string | null;
  description_th: string | null;
  description_en: string | null;
  is_required: boolean;
  position_order: number;
  is_active: boolean;
}

const CookieManagement = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CookieSetting>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ["cookie-settings-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cookie_settings")
        .select("*")
        .order("position_order", { ascending: true });

      if (error) throw error;
      return data as CookieSetting[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (setting: Partial<CookieSetting> & { id: string }) => {
      const { error } = await supabase
        .from("cookie_settings")
        .update({
          title_th: setting.title_th,
          title_en: setting.title_en,
          description_th: setting.description_th,
          description_en: setting.description_en,
          is_active: setting.is_active,
        })
        .eq("id", setting.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cookie-settings-admin"] });
      queryClient.invalidateQueries({ queryKey: ["cookie-settings"] });
      toast.success("บันทึกการตั้งค่าสำเร็จ");
      setEditingId(null);
      setFormData({});
    },
    onError: (error) => {
      toast.error("เกิดข้อผิดพลาด: " + error.message);
    },
  });

  const handleEdit = (setting: CookieSetting) => {
    setEditingId(setting.id);
    setFormData(setting);
  };

  const handleSave = () => {
    if (editingId && formData) {
      updateMutation.mutate({ ...formData, id: editingId });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const getSettingLabel = (key: string) => {
    const labels: Record<string, string> = {
      popup_title: "🍪 หัวข้อ Popup",
      necessary: "คุกกี้ที่จำเป็น",
      analytics: "คุกกี้วิเคราะห์",
      marketing: "คุกกี้การตลาด",
    };
    return labels[key] || key;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Cookie className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">จัดการ Cookie Consent</h2>
          <p className="text-sm text-muted-foreground">
            ปรับแต่งข้อความและการตั้งค่าสำหรับ Cookie Popup
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {settings?.map((setting) => (
          <Card key={setting.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  {getSettingLabel(setting.setting_key)}
                  {setting.is_required && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      จำเป็น
                    </span>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {editingId !== setting.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(setting)}
                    >
                      แก้ไข
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingId === setting.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>หัวข้อ (ไทย)</Label>
                      <Input
                        value={formData.title_th || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, title_th: e.target.value })
                        }
                        placeholder="หัวข้อภาษาไทย"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>หัวข้อ (English)</Label>
                      <Input
                        value={formData.title_en || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, title_en: e.target.value })
                        }
                        placeholder="English title"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>คำอธิบาย (ไทย)</Label>
                      <Textarea
                        value={formData.description_th || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description_th: e.target.value,
                          })
                        }
                        placeholder="คำอธิบายภาษาไทย"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>คำอธิบาย (English)</Label>
                      <Textarea
                        value={formData.description_en || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description_en: e.target.value,
                          })
                        }
                        placeholder="English description"
                        rows={3}
                      />
                    </div>
                  </div>

                  {!setting.is_required && (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_active ?? true}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_active: checked })
                        }
                      />
                      <Label>เปิดใช้งาน</Label>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSave} disabled={updateMutation.isPending}>
                      <Save className="w-4 h-4 mr-2" />
                      บันทึก
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      ยกเลิก
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">ไทย: </span>
                      <span className="font-medium">{setting.title_th}</span>
                      <p className="text-muted-foreground text-xs mt-1">
                        {setting.description_th}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">EN: </span>
                      <span className="font-medium">{setting.title_en}</span>
                      <p className="text-muted-foreground text-xs mt-1">
                        {setting.description_en}
                      </p>
                    </div>
                  </div>
                  {!setting.is_required && (
                    <div className="pt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          setting.is_active
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {setting.is_active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CookieManagement;
