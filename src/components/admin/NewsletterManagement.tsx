import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Trash2, Download, RefreshCw, Mail, Users } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  subscribed_at: string;
  is_active: boolean;
  source: string | null;
}

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (!error && data) {
      setSubscribers(data);
    }
    setLoading(false);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('อัปเดตสถานะไม่สำเร็จ');
    } else {
      toast.success('อัปเดตสถานะเรียบร้อย');
      fetchSubscribers();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบ subscriber นี้?')) return;

    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('ลบไม่สำเร็จ');
    } else {
      toast.success('ลบ subscriber เรียบร้อย');
      fetchSubscribers();
    }
  };

  const exportCSV = () => {
    const activeSubscribers = subscribers.filter(s => s.is_active);
    const csv = [
      ['Email', 'Name', 'Subscribed At', 'Source'].join(','),
      ...activeSubscribers.map(s => [
        s.email,
        s.name || '',
        s.subscribed_at,
        s.source || 'website'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export CSV สำเร็จ');
  };

  const activeCount = subscribers.filter(s => s.is_active).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            จัดการ Newsletter Subscribers
          </CardTitle>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              ทั้งหมด: {subscribers.length}
            </span>
            <span className="text-primary">Active: {activeCount}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchSubscribers}>
            <RefreshCw className="w-4 h-4 mr-2" />
            รีเฟรช
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV} disabled={subscribers.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">ยังไม่มี subscribers</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>วันที่ลงทะเบียน</TableHead>
                  <TableHead>แหล่งที่มา</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>
                      {format(new Date(subscriber.subscribed_at), 'd MMM yyyy HH:mm', { locale: th })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{subscriber.source || 'website'}</Badge>
                    </TableCell>
                    <TableCell>
                      <button onClick={() => toggleActive(subscriber.id, subscriber.is_active)}>
                        <Badge variant={subscriber.is_active ? 'default' : 'outline'}>
                          {subscriber.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(subscriber.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsletterManagement;
