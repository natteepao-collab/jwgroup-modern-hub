import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2, MessageCircle, TrendingUp, Users, Clock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Conversation {
  id: string;
  session_id: string;
  language: string | null;
  page_url: string | null;
  topics: string[] | null;
  message_count: number;
  last_user_message: string | null;
  started_at: string;
  last_activity_at: string;
}

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

const ChatAnalytics = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .order('last_activity_at', { ascending: false })
      .limit(200);
    if (error) toast.error('โหลดข้อมูลล้มเหลว: ' + error.message);
    else setConversations((data as Conversation[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const loadMessages = async (c: Conversation) => {
    setSelected(c);
    setLoadingMessages(true);
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', c.id)
      .order('created_at');
    setMessages((data as ChatMessage[]) || []);
    setLoadingMessages(false);
  };

  const deleteConversation = async (id: string) => {
    if (!confirm('ลบบทสนทนานี้?')) return;
    const { error } = await supabase.from('chat_conversations').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('ลบแล้ว'); setSelected(null); load(); }
  };

  // Aggregate analytics
  const totalConversations = conversations.length;
  const totalMessages = conversations.reduce((s, c) => s + (c.message_count || 0), 0);
  const topicCount: Record<string, number> = {};
  conversations.forEach(c => (c.topics || []).forEach(t => { topicCount[t] = (topicCount[t] || 0) + 1; }));
  const topTopics = Object.entries(topicCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayCount = conversations.filter(c => new Date(c.started_at) >= today).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><MessageCircle className="h-8 w-8 text-primary" /><div><div className="text-2xl font-bold">{totalConversations}</div><div className="text-xs text-muted-foreground">บทสนทนาทั้งหมด</div></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><TrendingUp className="h-8 w-8 text-primary" /><div><div className="text-2xl font-bold">{totalMessages}</div><div className="text-xs text-muted-foreground">ข้อความรวม</div></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><Users className="h-8 w-8 text-primary" /><div><div className="text-2xl font-bold">{todayCount}</div><div className="text-xs text-muted-foreground">บทสนทนาวันนี้</div></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><Clock className="h-8 w-8 text-primary" /><div><div className="text-2xl font-bold">{topTopics.length}</div><div className="text-xs text-muted-foreground">หัวข้อที่สนใจ</div></div></div></CardContent></Card>
      </div>

      {topTopics.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">🔥 หัวข้อที่ลูกค้าสนใจที่สุด</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topTopics.map(([topic, count]) => (
                <Badge key={topic} variant="secondary" className="text-sm">{topic} <span className="ml-1 opacity-60">×{count}</span></Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">บทสนทนาล่าสุด</CardTitle>
            <Button size="sm" variant="outline" onClick={load}>รีเฟรช</Button>
          </CardHeader>
          <CardContent>
            {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-2">
                  {conversations.map(c => (
                    <button key={c.id} onClick={() => loadMessages(c)} className={`w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition ${selected?.id === c.id ? 'bg-muted border-primary' : ''}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{new Date(c.started_at).toLocaleString('th-TH')}</span>
                        <Badge variant="outline" className="text-xs">{c.message_count} ข้อความ</Badge>
                      </div>
                      <div className="text-sm font-medium truncate">{c.last_user_message || '(ไม่มีข้อความ)'}</div>
                      {c.topics && c.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {c.topics.slice(0, 4).map(t => <Badge key={t} variant="secondary" className="text-[10px] py-0">{t}</Badge>)}
                        </div>
                      )}
                    </button>
                  ))}
                  {conversations.length === 0 && <p className="text-center text-muted-foreground py-8">ยังไม่มีบทสนทนา</p>}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">รายละเอียดบทสนทนา</CardTitle>
            {selected && <Button size="sm" variant="ghost" onClick={() => deleteConversation(selected.id)}><Trash2 className="h-4 w-4" /></Button>}
          </CardHeader>
          <CardContent>
            {!selected ? <p className="text-center text-muted-foreground py-8">เลือกบทสนทนาเพื่อดูรายละเอียด</p> : loadingMessages ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {messages.map(m => (
                    <div key={m.id} className={`p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-primary/10 ml-8' : 'bg-muted mr-8'}`}>
                      <div className="text-xs font-semibold mb-1 opacity-70">{m.role === 'user' ? '👤 ลูกค้า' : '🤖 AI'} · {new Date(m.created_at).toLocaleTimeString('th-TH')}</div>
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatAnalytics;
