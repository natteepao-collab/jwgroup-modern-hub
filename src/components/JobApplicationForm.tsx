import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Upload, CheckCircle, X } from 'lucide-react';

const applicationSchema = z.object({
  full_name: z.string().min(2, 'กรุณากรอกชื่อ-นามสกุล').max(100),
  email: z.string().email('กรุณากรอก email ที่ถูกต้อง').max(255),
  phone: z.string().min(9, 'กรุณากรอกเบอร์โทรศัพท์').max(20),
  education: z.string().max(500).optional(),
  experience: z.string().max(2000).optional(),
  cover_letter: z.string().max(3000).optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobApplicationForm = ({ jobId, jobTitle, open, onOpenChange }: JobApplicationFormProps) => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      education: '',
      experience: '',
      cover_letter: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(isEnglish ? 'Please upload PDF or Word document only' : 'กรุณาอัพโหลดไฟล์ PDF หรือ Word เท่านั้น');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(isEnglish ? 'File size must be less than 5MB' : 'ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }
      setResumeFile(file);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setLoading(true);
    try {
      let resumeUrl = null;

      // Upload resume if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, resumeFile);

        if (uploadError) throw uploadError;
        resumeUrl = fileName;
      }

      // Insert application
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          full_name: data.full_name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          education: data.education?.trim() || null,
          experience: data.experience?.trim() || null,
          cover_letter: data.cover_letter?.trim() || null,
          resume_url: resumeUrl,
        });

      if (error) throw error;

      setSubmitted(true);
      form.reset();
      setResumeFile(null);
    } catch (error) {
      console.error('Application submission error:', error);
      toast.error(isEnglish ? 'Failed to submit application. Please try again.' : 'ส่งใบสมัครไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    form.reset();
    setResumeFile(null);
    onOpenChange(false);
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-xl mb-2">
              {isEnglish ? 'Application Submitted!' : 'ส่งใบสมัครเรียบร้อยแล้ว!'}
            </DialogTitle>
            <DialogDescription>
              {isEnglish 
                ? 'Thank you for your interest. We will review your application and contact you soon.'
                : 'ขอบคุณที่สนใจร่วมงานกับเรา เราจะพิจารณาใบสมัครและติดต่อกลับโดยเร็ว'}
            </DialogDescription>
            <Button onClick={handleClose} className="mt-6">
              {isEnglish ? 'Close' : 'ปิด'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEnglish ? 'Apply for ' : 'สมัครงาน: '}{jobTitle}
          </DialogTitle>
          <DialogDescription>
            {isEnglish 
              ? 'Fill in your information below to submit your application'
              : 'กรอกข้อมูลด้านล่างเพื่อส่งใบสมัคร'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEnglish ? 'Full Name' : 'ชื่อ-นามสกุล'} *</FormLabel>
                  <FormControl>
                    <Input placeholder={isEnglish ? 'Enter your full name' : 'กรอกชื่อ-นามสกุล'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEnglish ? 'Email' : 'อีเมล'} *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={isEnglish ? 'Enter your email' : 'กรอกอีเมล'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEnglish ? 'Phone Number' : 'เบอร์โทรศัพท์'} *</FormLabel>
                  <FormControl>
                    <Input placeholder={isEnglish ? 'Enter your phone number' : 'กรอกเบอร์โทรศัพท์'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEnglish ? 'Education' : 'ประวัติการศึกษา'}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={isEnglish ? 'Enter your education background' : 'กรอกประวัติการศึกษา'} 
                      rows={2}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEnglish ? 'Work Experience' : 'ประสบการณ์ทำงาน'}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={isEnglish ? 'Enter your work experience' : 'กรอกประสบการณ์ทำงาน'} 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cover_letter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEnglish ? 'Cover Letter' : 'จดหมายสมัครงาน'}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={isEnglish ? 'Tell us why you want to join our team' : 'บอกเราว่าทำไมคุณอยากร่วมงานกับเรา'} 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resume Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isEnglish ? 'Resume/CV' : 'เรซูเม่/ประวัติย่อ'} (PDF, DOC, DOCX)
              </label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">{isEnglish ? 'Choose File' : 'เลือกไฟล์'}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {resumeFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="truncate max-w-[150px]">{resumeFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isEnglish ? 'Max file size: 5MB' : 'ขนาดไฟล์สูงสุด: 5MB'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {isEnglish ? 'Cancel' : 'ยกเลิก'}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEnglish ? 'Submitting...' : 'กำลังส่ง...'}
                  </>
                ) : (
                  isEnglish ? 'Submit Application' : 'ส่งใบสมัคร'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationForm;
