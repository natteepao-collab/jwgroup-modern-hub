import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Loader2, TrendingUp, MousePointerClick, Send, Briefcase, MessageCircle, Eye,
  Users, Smartphone, Monitor, Globe, Newspaper, Target,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';

interface EventRow {
  event_type: string;
  event_label: string | null;
  business_key: string | null;
  page_path: string | null;
  referrer: string | null;
  session_id: string | null;
  user_agent: string | null;
  created_at: string;
}

const LABELS: Record<string, string> = {
  page_view: 'การเข้าชมหน้า',
  cta_click: 'คลิกปุ่ม CTA',
  contact_submit: 'ส่งฟอร์มติดต่อ',
  contact_form_open: 'เปิดฟอร์มติดต่อ',
  job_view: 'ดูตำแหน่งงาน',
  job_apply: 'สมัครงาน',
  line_click: 'คลิก LINE',
  phone_click: 'คลิกโทรศัพท์',
  email_click: 'คลิกอีเมล',
  business_view: 'ดูธุรกิจ',
  business_card_click: 'คลิกการ์ดธุรกิจ',
  newsletter_subscribe: 'สมัครรับข่าว',
  news_view: 'อ่านข่าว',
};

const PAGE_LABELS: Record<string, string> = {
  '/': 'หน้าแรก',
  '/index': 'หน้าแรก',
  '/about': 'เกี่ยวกับเรา',
  '/business': 'ธุรกิจ',
  '/news': 'ข่าวสาร',
  '/careers': 'ร่วมงานกับเรา',
  '/contact': 'ติดต่อเรา',
  '/awards': 'รางวัล',
  '/vision-mission': 'วิสัยทัศน์',
  '/sustainability': 'ความยั่งยืน',
};

const COLORS = ['#0F172A', '#D4812A', '#4a7c9b', '#87a878', '#c44569', '#9b72cf', '#e88aab', '#5cbdb9'];
const CONVERSION_EVENTS = new Set(['contact_submit', 'job_apply', 'newsletter_subscribe']);

const detectDevice = (ua: string | null): 'mobile' | 'tablet' | 'desktop' => {
  if (!ua) return 'desktop';
  if (/iPad|Tablet/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone/i.test(ua)) return 'mobile';
  return 'desktop';
};

const cleanReferrer = (r: string | null): string => {
  if (!r) return 'ตรง (Direct)';
  try {
    const url = new URL(r);
    if (url.hostname.includes(window.location.hostname)) return 'ภายในเว็บไซต์';
    return url.hostname.replace(/^www\./, '');
  } catch {
    return 'ตรง (Direct)';
  }
};

const AnalyticsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [range, setRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const since = new Date(Date.now() - range * 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from('analytics_events')
        .select('event_type,event_label,business_key,page_path,referrer,session_id,user_agent,created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(10000);
      setEvents((data as EventRow[]) || []);
      setLoading(false);
    };
    load();
  }, [range]);

  const stats = useMemo(() => {
    const sessions = new Set<string>();
    const byType: Record<string, number> = {};
    const byBusiness: Record<string, number> = {};
    const byPage: Record<string, number> = {};
    const byRef: Record<string, number> = {};
    const byDevice: Record<string, number> = { mobile: 0, tablet: 0, desktop: 0 };
    const byNews: Record<string, number> = {};
    const dayMap: Record<string, { date: string; views: number; sessions: Set<string>; conversions: number }> = {};
    let conversions = 0;

    for (const e of events) {
      if (e.session_id) sessions.add(e.session_id);
      byType[e.event_type] = (byType[e.event_type] || 0) + 1;
      if (e.business_key) byBusiness[e.business_key] = (byBusiness[e.business_key] || 0) + 1;
      if (e.event_type === 'page_view' && e.page_path)
        byPage[e.page_path] = (byPage[e.page_path] || 0) + 1;
      byRef[cleanReferrer(e.referrer)] = (byRef[cleanReferrer(e.referrer)] || 0) + 1;
      byDevice[detectDevice(e.user_agent)]++;
      if (e.event_type === 'news_view' && e.event_label)
        byNews[e.event_label] = (byNews[e.event_label] || 0) + 1;
      if (CONVERSION_EVENTS.has(e.event_type)) conversions++;

      const day = e.created_at.slice(0, 10);
      if (!dayMap[day]) dayMap[day] = { date: day, views: 0, sessions: new Set(), conversions: 0 };
      if (e.event_type === 'page_view') dayMap[day].views++;
      if (e.session_id) dayMap[day].sessions.add(e.session_id);
      if (CONVERSION_EVENTS.has(e.event_type)) dayMap[day].conversions++;
    }

    const trend = Array.from({ length: range }, (_, i) => {
      const d = new Date(Date.now() - (range - 1 - i) * 86400000).toISOString().slice(0, 10);
      const row = dayMap[d];
      return {
        date: d.slice(5),
        views: row?.views || 0,
        sessions: row?.sessions.size || 0,
        conversions: row?.conversions || 0,
      };
    });

    return {
      totalEvents: events.length,
      uniqueSessions: sessions.size,
      pageViews: byType.page_view || 0,
      conversions,
      conversionRate: sessions.size > 0 ? ((conversions / sessions.size) * 100).toFixed(1) : '0',
      byType, byBusiness, byPage, byRef, byDevice, byNews, trend,
    };
  }, [events, range]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  const topPages = Object.entries(stats.byPage).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([p, c]) => ({ name: PAGE_LABELS[p] || p, value: c }));
  const topBusiness = Object.entries(stats.byBusiness).sort((a, b) => b[1] - a[1])
    .map(([b, c]) => ({ name: b, value: c }));
  const topRefs = Object.entries(stats.byRef).sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([r, c]) => ({ name: r, value: c }));
  const topNews = Object.entries(stats.byNews).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const deviceData = Object.entries(stats.byDevice)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: k === 'mobile' ? 'มือถือ' : k === 'tablet' ? 'แท็บเล็ต' : 'เดสก์ท็อป', value: v }));
  const eventBreakdown = Object.entries(stats.byType).sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([t, c]) => ({ name: LABELS[t] || t, value: c }));

  const kpis = [
    { icon: Users, label: 'ผู้เข้าชม (Sessions)', value: stats.uniqueSessions, color: 'text-primary' },
    { icon: Eye, label: 'การเข้าชมหน้า', value: stats.pageViews, color: 'text-accent' },
    { icon: Target, label: 'Conversion', value: stats.conversions, color: 'text-green-600' },
    { icon: TrendingUp, label: 'อัตรา Conversion', value: `${stats.conversionRate}%`, color: 'text-orange-600' },
    { icon: MousePointerClick, label: 'กิจกรรมทั้งหมด', value: stats.totalEvents, color: 'text-blue-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-sm text-muted-foreground">ภาพรวม Traffic และพฤติกรรมผู้ใช้</p>
        </div>
        <div className="flex gap-2">
          {([7, 30, 90] as const).map((d) => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                range === d ? 'bg-primary text-primary-foreground shadow' : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              {d} วันล่าสุด
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="hover:shadow-md transition">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <k.icon className={`h-4 w-4 ${k.color}`} />
                <span className="text-xs font-medium">{k.label}</span>
              </div>
              <div className="text-3xl font-bold tracking-tight">{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Traffic Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            แนวโน้ม Traffic รายวัน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="views" name="Page Views" stroke="#D4812A" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#0F172A" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="conversions" name="Conversions" stroke="#16a34a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-accent" /> หน้าที่เข้าชมมากที่สุด
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topPages.length === 0 ? <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูล</p> : (
              <ResponsiveContainer width="100%" height={Math.max(200, topPages.length * 35)}>
                <BarChart data={topPages} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={110} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#D4812A" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Event Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MousePointerClick className="h-5 w-5 text-accent" /> ประเภทกิจกรรม
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventBreakdown.length === 0 ? <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูล</p> : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={eventBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e) => `${e.value}`}>
                    {eventBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-accent" /> อุปกรณ์ที่ใช้
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deviceData.length === 0 ? <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูล</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} label>
                    {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" /> แหล่งที่มาของผู้เข้าชม
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topRefs.length === 0 && <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูล</p>}
              {topRefs.map((r) => {
                const pct = ((r.value / stats.totalEvents) * 100).toFixed(0);
                return (
                  <li key={r.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold truncate mr-2">{r.name}</span>
                      <span className="text-muted-foreground">{r.value} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Top Business */}
        {topBusiness.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-accent" /> ธุรกิจที่ได้รับความสนใจ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topBusiness}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#0F172A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Top News */}
        {topNews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-accent" /> ข่าวยอดนิยม
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {topNews.map(([title, count], i) => (
                  <li key={title} className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/15 text-accent font-bold text-xs flex items-center justify-center">{i + 1}</span>
                    <span className="flex-1 text-sm font-medium line-clamp-2">{title}</span>
                    <span className="text-sm font-bold text-accent">{count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader><CardTitle className="text-lg">กิจกรรมล่าสุด</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b">
                <tr>
                  <th className="text-left py-2">เวลา</th>
                  <th className="text-left">กิจกรรม</th>
                  <th className="text-left">รายละเอียด</th>
                  <th className="text-left">หน้า</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 25).map((e, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-muted/30">
                    <td className="py-2 text-muted-foreground whitespace-nowrap">{new Date(e.created_at).toLocaleString('th-TH')}</td>
                    <td className="font-semibold">{LABELS[e.event_type] || e.event_type}</td>
                    <td className="text-muted-foreground max-w-xs truncate">{e.event_label || '-'}</td>
                    <td className="font-mono text-xs text-muted-foreground">{e.page_path || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
        💡 ข้อมูลรวบรวมเฉพาะผู้ใช้ที่ยอมรับ Cookies (PDPA). สำหรับ SEO/Traffic เชิงลึกแบบเรียลไทม์ ตั้งค่า Google Analytics 4 ที่ <code className="bg-background px-1.5 py-0.5 rounded">ga4_measurement_id</code> ในแท็บเนื้อหา
      </p>
    </div>
  );
};

export default AnalyticsManagement;
