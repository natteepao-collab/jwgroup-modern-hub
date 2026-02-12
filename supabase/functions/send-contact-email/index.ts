import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message } = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'กรุณากรอกชื่อ อีเมล และข้อความ' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'รูปแบบอีเมลไม่ถูกต้อง' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('contact_submissions').insert({
      name, email, phone, subject, message,
    });

    // Send email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'JW Group Contact <onboarding@resend.dev>',
        to: ['admin@jwgroupthailand.com'],
        subject: `[ติดต่อเรา] ${subject || 'ข้อความใหม่จากเว็บไซต์'}`,
        html: `
          <h2>ข้อความใหม่จากฟอร์มติดต่อ</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">ชื่อ</td><td style="padding:8px;border:1px solid #ddd;">${name}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">อีเมล</td><td style="padding:8px;border:1px solid #ddd;">${email}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">โทรศัพท์</td><td style="padding:8px;border:1px solid #ddd;">${phone || '-'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">เรื่อง</td><td style="padding:8px;border:1px solid #ddd;">${subject || '-'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">ข้อความ</td><td style="padding:8px;border:1px solid #ddd;">${message}</td></tr>
          </table>
          <p style="color:#888;margin-top:16px;">ส่งจากเว็บไซต์ JW Group</p>
        `,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('Resend error:', emailResult);
      // Still return success since data is saved to DB
      return new Response(
        JSON.stringify({ success: true, emailSent: false, note: 'ข้อมูลถูกบันทึกแล้ว แต่ไม่สามารถส่งอีเมลได้' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, emailSent: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
