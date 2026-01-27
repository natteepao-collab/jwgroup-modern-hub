import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Eye, Trash2, Download, Mail, Phone, GraduationCap, Briefcase, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface JobApplication {
  id: string;
  job_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  education: string | null;
  experience: string | null;
  cover_letter: string | null;
  resume_url: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  jobs?: { title_th: string; title_en: string | null } | null;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  interviewed: 'bg-purple-100 text-purple-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  pending: 'รอพิจารณา',
  reviewed: 'พิจารณาแล้ว',
  interviewed: 'นัดสัมภาษณ์แล้ว',
  accepted: 'รับเข้าทำงาน',
  rejected: 'ไม่ผ่านการคัดเลือก',
};

const ApplicationsManagement = () => {
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['job_applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (title_th, title_en)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as JobApplication[];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status?: string; admin_notes?: string }) => {
      const { error } = await supabase
        .from('job_applications')
        .update({ status, admin_notes })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_applications'] });
      toast.success('อัพเดทข้อมูลเรียบร้อย');
    },
    onError: () => {
      toast.error('เกิดข้อผิดพลาด');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_applications'] });
      toast.success('ลบใบสมัครเรียบร้อย');
      setSelectedApp(null);
    },
    onError: () => {
      toast.error('เกิดข้อผิดพลาด');
    }
  });

  const handleDownloadResume = async (resumeUrl: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(resumeUrl);
      
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = resumeUrl;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('ไม่สามารถดาวน์โหลดไฟล์ได้');
    }
  };

  const filteredApplications = applications.filter(app => 
    statusFilter === 'all' || app.status === statusFilter
  );

  const openDetail = (app: JobApplication) => {
    setSelectedApp(app);
    setAdminNotes(app.admin_notes || '');
  };

  if (isLoading) {
    return <div className="text-center py-8">กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">กรองตามสถานะ:</span>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด ({applications.length})</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label} ({applications.filter(a => a.status === value).length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            ไม่มีใบสมัครงาน
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{app.full_name}</h3>
                      <Badge className={statusColors[app.status]}>
                        {statusLabels[app.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ตำแหน่ง: {app.jobs?.title_th || 'ไม่ระบุ'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {app.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {app.phone}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      สมัครเมื่อ: {format(new Date(app.created_at), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.resume_url && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDownloadResume(app.resume_url!)}
                        title="ดาวน์โหลด Resume"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => openDetail(app)}
                      title="ดูรายละเอียด"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  รายละเอียดใบสมัคร
                  <Badge className={statusColors[selectedApp.status]}>
                    {statusLabels[selectedApp.status]}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Contact Info */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">ข้อมูลติดต่อ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>ชื่อ:</strong> {selectedApp.full_name}</p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${selectedApp.email}`} className="text-primary hover:underline">
                        {selectedApp.email}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${selectedApp.phone}`} className="text-primary hover:underline">
                        {selectedApp.phone}
                      </a>
                    </p>
                    <p><strong>ตำแหน่งที่สมัคร:</strong> {selectedApp.jobs?.title_th || 'ไม่ระบุ'}</p>
                  </CardContent>
                </Card>

                {/* Education */}
                {selectedApp.education && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> ประวัติการศึกษา
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{selectedApp.education}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Experience */}
                {selectedApp.experience && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> ประสบการณ์ทำงาน
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{selectedApp.experience}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Cover Letter */}
                {selectedApp.cover_letter && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-4 h-4" /> จดหมายสมัครงาน
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{selectedApp.cover_letter}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Resume Download */}
                {selectedApp.resume_url && (
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadResume(selectedApp.resume_url!)}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    ดาวน์โหลด Resume
                  </Button>
                )}

                {/* Status Update */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">จัดการใบสมัคร</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">สถานะ</label>
                      <Select
                        value={selectedApp.status}
                        onValueChange={(value) => {
                          updateMutation.mutate({ id: selectedApp.id, status: value });
                          setSelectedApp({ ...selectedApp, status: value });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">บันทึกของ Admin</label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="บันทึกข้อมูลเพิ่มเติม..."
                        rows={3}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          updateMutation.mutate({ id: selectedApp.id, admin_notes: adminNotes });
                          setSelectedApp({ ...selectedApp, admin_notes: adminNotes });
                        }}
                      >
                        บันทึก
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Delete */}
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm('ต้องการลบใบสมัครนี้?')) {
                      deleteMutation.mutate(selectedApp.id);
                    }
                  }}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  ลบใบสมัคร
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsManagement;
