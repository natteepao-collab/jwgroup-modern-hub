import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Mail, Send, Check, Loader2 } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email({ message: "กรุณากรอก email ที่ถูกต้อง" }).max(255);

const NewsletterForm = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === '23505') {
          toast.info('Email นี้ลงทะเบียนรับข่าวสารแล้ว');
        } else {
          throw error;
        }
      } else {
        setSubscribed(true);
        toast.success('ลงทะเบียนรับข่าวสารเรียบร้อยแล้ว!');
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">ขอบคุณที่ลงทะเบียน!</h3>
        <p className="text-muted-foreground">
          คุณจะได้รับข่าวสารและโปรโมชั่นล่าสุดจาก JW Group
        </p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => setSubscribed(false)}
        >
          ลงทะเบียน email อื่น
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">รับข่าวสารจากเรา</h3>
          <p className="text-sm text-muted-foreground">ข่าวสาร โปรโมชั่น และโครงการใหม่</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="กรอก email ของคุณ"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-12"
            required
            disabled={loading}
          />
        </div>
        <Button 
          type="submit" 
          className="h-12 px-6 gap-2"
          disabled={loading || !email}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              กำลังส่ง...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              ลงทะเบียน
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-3">
        เราจะไม่เปิดเผยข้อมูลของคุณกับบุคคลภายนอก
      </p>
    </div>
  );
};

export default NewsletterForm;
