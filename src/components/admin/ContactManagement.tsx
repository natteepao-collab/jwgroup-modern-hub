import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Eye, Trash2, RefreshCw, Mail, Phone, MessageSquare } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string | null;
  created_at: string;
}

const ContactManagement = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('ไม่สามารถโหลดข้อมูลได้');
      console.error(error);
    } else {
      setSubmissions((data as unknown as ContactSubmission[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ status } as never)
      .eq('id', id);

    if (error) {
      toast.error('ไม่สามารถอัพเดทสถานะได้');
    } else {
      toast.success('อัพเดทสถานะสำเร็จ');
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(prev => prev ? { ...prev, status } : null);
      }
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('ต้องการลบข้อความนี้หรือไม่?')) return;
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('ไม่สามารถลบได้');
    } else {
      toast.success('ลบสำเร็จ');
      setSubmissions(prev => prev.filter(s => s.id !== id));
      if (selectedSubmission?.id === id) setIsDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'new': return <Badge variant="destructive">ใหม่</Badge>;
      case 'read': return <Badge variant="secondary">อ่านแล้ว</Badge>;
      case 'replied': return <Badge className="bg-green-600 text-white">ตอบแล้ว</Badge>;
      default: return <Badge variant="outline">{status || 'ใหม่'}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const newCount = submissions.filter(s => s.status === 'new' || !s.status).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              จัดการข้อความติดต่อ
              {newCount > 0 && (
                <Badge variant="destructive" className="ml-2">{newCount} ใหม่</Badge>
              )}
            </CardTitle>
            <CardDescription>ข้อความที่ส่งเข้ามาจากฟอร์มติดต่อ ({submissions.length} รายการ)</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchSubmissions} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            รีเฟรช
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">กำลังโหลด...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">ยังไม่มีข้อความติดต่อ</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>วันที่</TableHead>
                  <TableHead>ชื่อ</TableHead>
                  <TableHead>อีเมล</TableHead>
                  <TableHead>เรื่อง</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((item) => (
                  <TableRow key={item.id} className={(!item.status || item.status === 'new') ? 'bg-primary/5' : ''}>
                    <TableCell className="text-sm whitespace-nowrap">{formatDate(item.created_at)}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-sm">{item.email}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{item.subject || '-'}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSubmission(item);
                          setIsDialogOpen(true);
                          if (!item.status || item.status === 'new') {
                            updateStatus(item.id, 'read');
                          }
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteSubmission(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>รายละเอียดข้อความติดต่อ</DialogTitle>
            </DialogHeader>
            {selectedSubmission && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ชื่อ</p>
                    <p className="font-medium">{selectedSubmission.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">วันที่</p>
                    <p className="font-medium">{formatDate(selectedSubmission.created_at)}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <a href={`mailto:${selectedSubmission.email}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                    <Mail className="h-4 w-4" /> {selectedSubmission.email}
                  </a>
                  {selectedSubmission.phone && (
                    <a href={`tel:${selectedSubmission.phone}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                      <Phone className="h-4 w-4" /> {selectedSubmission.phone}
                    </a>
                  )}
                </div>
                {selectedSubmission.subject && (
                  <div>
                    <p className="text-sm text-muted-foreground">เรื่อง</p>
                    <p>{selectedSubmission.subject}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">ข้อความ</p>
                  <p className="whitespace-pre-wrap bg-muted p-3 rounded-lg">{selectedSubmission.message}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">สถานะ:</p>
                  <Select
                    value={selectedSubmission.status || 'new'}
                    onValueChange={(value) => updateStatus(selectedSubmission.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">ใหม่</SelectItem>
                      <SelectItem value="read">อ่านแล้ว</SelectItem>
                      <SelectItem value="replied">ตอบแล้ว</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ContactManagement;
