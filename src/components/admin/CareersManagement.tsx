import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Briefcase, Gift, FileText } from 'lucide-react';
import ApplicationsManagement from './ApplicationsManagement';

interface Job {
  id: string;
  title_th: string;
  title_en: string | null;
  department_th: string | null;
  department_en: string | null;
  location_th: string | null;
  location_en: string | null;
  job_type: string | null;
  description_th: string | null;
  description_en: string | null;
  requirements_th: string | null;
  requirements_en: string | null;
  is_published: boolean | null;
  position_order: number | null;
}

interface Benefit {
  id: string;
  title_th: string;
  title_en: string | null;
  description_th: string | null;
  description_en: string | null;
  icon_name: string | null;
  is_published: boolean | null;
  position_order: number | null;
}

const CareersManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, benefitsRes] = await Promise.all([
        supabase.from('jobs').select('*').order('position_order'),
        supabase.from('career_benefits').select('*').order('position_order')
      ]);

      if (jobsRes.error) throw jobsRes.error;
      if (benefitsRes.error) throw benefitsRes.error;

      setJobs(jobsRes.data || []);
      setBenefits(benefitsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  // Job handlers
  const handleAddJob = async () => {
    try {
      const newOrder = jobs.length > 0 ? Math.max(...jobs.map(j => j.position_order || 0)) + 1 : 1;
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          title_th: 'ตำแหน่งงานใหม่',
          title_en: 'New Position',
          position_order: newOrder
        })
        .select()
        .single();

      if (error) throw error;
      setJobs([...jobs, data]);
      toast.success('เพิ่มตำแหน่งงานสำเร็จ');
    } catch (error) {
      console.error('Error adding job:', error);
      toast.error('เกิดข้อผิดพลาดในการเพิ่มตำแหน่งงาน');
    }
  };

  const handleUpdateJob = async (job: Job) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          title_th: job.title_th,
          title_en: job.title_en,
          department_th: job.department_th,
          department_en: job.department_en,
          location_th: job.location_th,
          location_en: job.location_en,
          job_type: job.job_type,
          description_th: job.description_th,
          description_en: job.description_en,
          requirements_th: job.requirements_th,
          requirements_en: job.requirements_en,
          is_published: job.is_published,
          position_order: job.position_order
        })
        .eq('id', job.id);

      if (error) throw error;
      toast.success('บันทึกข้อมูลสำเร็จ');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('ยืนยันการลบตำแหน่งงานนี้?')) return;

    try {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) throw error;
      setJobs(jobs.filter(j => j.id !== id));
      toast.success('ลบตำแหน่งงานสำเร็จ');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('เกิดข้อผิดพลาดในการลบ');
    }
  };

  const handleJobChange = (id: string, field: keyof Job, value: Job[keyof Job]) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, [field]: value } : j));
  };

  // Benefit handlers
  const handleAddBenefit = async () => {
    try {
      const newOrder = benefits.length > 0 ? Math.max(...benefits.map(b => b.position_order || 0)) + 1 : 1;
      const { data, error } = await supabase
        .from('career_benefits')
        .insert({
          title_th: 'สวัสดิการใหม่',
          title_en: 'New Benefit',
          position_order: newOrder
        })
        .select()
        .single();

      if (error) throw error;
      setBenefits([...benefits, data]);
      toast.success('เพิ่มสวัสดิการสำเร็จ');
    } catch (error) {
      console.error('Error adding benefit:', error);
      toast.error('เกิดข้อผิดพลาดในการเพิ่มสวัสดิการ');
    }
  };

  const handleUpdateBenefit = async (benefit: Benefit) => {
    try {
      const { error } = await supabase
        .from('career_benefits')
        .update({
          title_th: benefit.title_th,
          title_en: benefit.title_en,
          description_th: benefit.description_th,
          description_en: benefit.description_en,
          icon_name: benefit.icon_name,
          is_published: benefit.is_published,
          position_order: benefit.position_order
        })
        .eq('id', benefit.id);

      if (error) throw error;
      toast.success('บันทึกข้อมูลสำเร็จ');
    } catch (error) {
      console.error('Error updating benefit:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const handleDeleteBenefit = async (id: string) => {
    if (!confirm('ยืนยันการลบสวัสดิการนี้?')) return;

    try {
      const { error } = await supabase.from('career_benefits').delete().eq('id', id);
      if (error) throw error;
      setBenefits(benefits.filter(b => b.id !== id));
      toast.success('ลบสวัสดิการสำเร็จ');
    } catch (error) {
      console.error('Error deleting benefit:', error);
      toast.error('เกิดข้อผิดพลาดในการลบ');
    }
  };

  const handleBenefitChange = (id: string, field: keyof Benefit, value: Benefit[keyof Benefit]) => {
    setBenefits(benefits.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          จัดการร่วมงานกับเรา
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="jobs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              ตำแหน่งงาน ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="benefits" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              สวัสดิการ ({benefits.length})
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              ใบสมัคร
            </TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <Button onClick={handleAddJob} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มตำแหน่งงาน
            </Button>

            <Accordion type="single" collapsible className="space-y-2">
              {jobs.map((job) => (
                <AccordionItem key={job.id} value={job.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{job.title_th}</span>
                      {!job.is_published && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">ซ่อน</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ชื่อตำแหน่ง (ไทย)</Label>
                        <Input
                          value={job.title_th}
                          onChange={(e) => handleJobChange(job.id, 'title_th', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ชื่อตำแหน่ง (EN)</Label>
                        <Input
                          value={job.title_en || ''}
                          onChange={(e) => handleJobChange(job.id, 'title_en', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>แผนก (ไทย)</Label>
                        <Input
                          value={job.department_th || ''}
                          onChange={(e) => handleJobChange(job.id, 'department_th', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>แผนก (EN)</Label>
                        <Input
                          value={job.department_en || ''}
                          onChange={(e) => handleJobChange(job.id, 'department_en', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>สถานที่ (ไทย)</Label>
                        <Input
                          value={job.location_th || ''}
                          onChange={(e) => handleJobChange(job.id, 'location_th', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>สถานที่ (EN)</Label>
                        <Input
                          value={job.location_en || ''}
                          onChange={(e) => handleJobChange(job.id, 'location_en', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ประเภทงาน</Label>
                        <Select
                          value={job.job_type || 'full-time'}
                          onValueChange={(value) => handleJobChange(job.id, 'job_type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>ลำดับ</Label>
                        <Input
                          type="number"
                          value={job.position_order || 0}
                          onChange={(e) => handleJobChange(job.id, 'position_order', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>รายละเอียดงาน (ไทย)</Label>
                        <Textarea
                          value={job.description_th || ''}
                          onChange={(e) => handleJobChange(job.id, 'description_th', e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>รายละเอียดงาน (EN)</Label>
                        <Textarea
                          value={job.description_en || ''}
                          onChange={(e) => handleJobChange(job.id, 'description_en', e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>คุณสมบัติ (ไทย)</Label>
                        <Textarea
                          value={job.requirements_th || ''}
                          onChange={(e) => handleJobChange(job.id, 'requirements_th', e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>คุณสมบัติ (EN)</Label>
                        <Textarea
                          value={job.requirements_en || ''}
                          onChange={(e) => handleJobChange(job.id, 'requirements_en', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={job.is_published ?? true}
                          onCheckedChange={(checked) => handleJobChange(job.id, 'is_published', checked)}
                        />
                        <Label>เผยแพร่</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdateJob(job)} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        บันทึก
                      </Button>
                      <Button variant="destructive" onClick={() => handleDeleteJob(job.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="space-y-4">
            <Button onClick={handleAddBenefit} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มสวัสดิการ
            </Button>

            <Accordion type="single" collapsible className="space-y-2">
              {benefits.map((benefit) => (
                <AccordionItem key={benefit.id} value={benefit.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{benefit.title_th}</span>
                      {!benefit.is_published && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">ซ่อน</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ชื่อสวัสดิการ (ไทย)</Label>
                        <Input
                          value={benefit.title_th}
                          onChange={(e) => handleBenefitChange(benefit.id, 'title_th', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ชื่อสวัสดิการ (EN)</Label>
                        <Input
                          value={benefit.title_en || ''}
                          onChange={(e) => handleBenefitChange(benefit.id, 'title_en', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>รายละเอียด (ไทย)</Label>
                        <Textarea
                          value={benefit.description_th || ''}
                          onChange={(e) => handleBenefitChange(benefit.id, 'description_th', e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>รายละเอียด (EN)</Label>
                        <Textarea
                          value={benefit.description_en || ''}
                          onChange={(e) => handleBenefitChange(benefit.id, 'description_en', e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ไอคอน (Lucide icon name)</Label>
                        <Input
                          value={benefit.icon_name || ''}
                          onChange={(e) => handleBenefitChange(benefit.id, 'icon_name', e.target.value)}
                          placeholder="เช่น gift, shield, calendar"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ลำดับ</Label>
                        <Input
                          type="number"
                          value={benefit.position_order || 0}
                          onChange={(e) => handleBenefitChange(benefit.id, 'position_order', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={benefit.is_published ?? true}
                          onCheckedChange={(checked) => handleBenefitChange(benefit.id, 'is_published', checked)}
                        />
                        <Label>เผยแพร่</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdateBenefit(benefit)} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        บันทึก
                      </Button>
                      <Button variant="destructive" onClick={() => handleDeleteBenefit(benefit.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <ApplicationsManagement />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CareersManagement;
