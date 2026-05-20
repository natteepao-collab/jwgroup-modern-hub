import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TrendingUp, MousePointerClick, Send, Briefcase, MessageCircle, Eye } from 'lucide-react';

interface EventRow {
  event_type: string;
  event_label: string | null;
  business_key: string | null;
  page_path: string | null;
  created_at: string;
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  page_view: Eye,
  cta_click: MousePointerClick,
  contact_submit: Send,
  job_apply: Briefcase,
  line_click: MessageCircle,
  business_view: TrendingUp,
};

const LABELS: Record<string, string> = {
  page_view: 'การเข้าชมหน้า',
  cta_click: 'คลิกปุ่ม CTA',
  contact_submit: 'ส่งฟอร์มติดต่อ',
  job_apply: 'สมัครงาน',
  line_click: 'คลิก LINE',
  business_view: 'ดูธุรกิจ',
  business_card_click: 'คลิกการ์ดธุรกิจ',
  newsletter_subscribe: 'สมัครรับข่าว',
  news_view: 'อ่านข่าว',
};

const AnalyticsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [range, setRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const since = new Date(Date.now() - range * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from('analytics_events')
        .select('event_type,event_label,business_key,page_path,created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(1000);
      if (!error && data) setEvents(data as EventRow[]);
      setLoading(false);
    };
    load();
  }, [range]);

  const byType = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.event_type] = (acc[e.event_type] || 0) + 1;
    return acc;
  }, {});

  const byBusiness = events
    .filter((e) => e.business_key)
    .reduce<Record<string, number>>((acc, e) => {
      acc[e.business_key!] = (acc[e.business_key!] || 0) + 1;
      return acc;
    }, {});

  const byPage = events
    .filter((e) => e.event_type === 'page_view' && e.page_path)
    .reduce<Record<string, number>>((acc, e) => {
      acc[e.page_path!] = (acc[e.page_path!] || 0) + 1;
      return acc;
    }, {});

  const topPages = Object.entries(byPage).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const topBusiness = Object.entries(byBusiness).sort((a, b) => b[1] - a[1]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const keyEvents = ['page_view', 'cta_click', 'contact_submit', 'job_apply', 'line_click'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {([7, 30, 90] as const).map((d) => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                range === d ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              {d} วัน
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {keyEvents.map((type) => {
          const Icon = ICONS[type] || TrendingUp;
          return (
            <Card key={type}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{LABELS[type] || type}</span>
                </div>
                <div className="text-3xl font-bold">{byType[type] || 0}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">หน้าที่เข้าชมมากที่สุด</CardTitle></CardHeader>
          <CardContent>
            {topPages.length === 0 && <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูล</p>}
            <ul className="space-y-2">
              {topPages.map(([path, count]) => (
                <li key={path} className="flex justify-between text-sm border-b border-border/30 py-1.5">
                  <span className="font-mono text-muted-foreground truncate mr-2">{path}</span>
                  <span className="font-bold">{count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">การมีส่วนร่วมรายธุรกิจ</CardTitle></CardHeader>
          <CardContent>
            {topBusiness.length === 0 && <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูล</p>}
            <ul className="space-y-2">
              {topBusiness.map(([biz, count]) => (
                <li key={biz} className="flex justify-between text-sm border-b border-border/30 py-1.5">
                  <span className="font-semibold">{biz}</span>
                  <span className="font-bold">{count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">กิจกรรมล่าสุด (20 รายการ)</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b">
                <tr><th className="text-left py-2">เวลา</th><th className="text-left">Event</th><th className="text-left">Label</th><th className="text-left">Page</th></tr>
              </thead>
              <tbody>
                {events.slice(0, 20).map((e, i) => (
                  <tr key={i} className="border-b border-border/30">
                    <td className="py-2 text-muted-foreground">{new Date(e.created_at).toLocaleString('th-TH')}</td>
                    <td className="font-semibold">{LABELS[e.event_type] || e.event_type}</td>
                    <td className="text-muted-foreground">{e.event_label || '-'}</td>
                    <td className="font-mono text-xs text-muted-foreground">{e.page_path || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        💡 ตั้งค่า Google Analytics 4 Measurement ID ใน แท็บ "เนื้อหา" → ค้นหา <code>ga4_measurement_id</code> และวาง LINE OA URL ที่ <code>social_line</code>
      </p>
    </div>
  );
};

export default AnalyticsManagement;
