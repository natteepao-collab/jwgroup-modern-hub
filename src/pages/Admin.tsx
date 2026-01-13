import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Shield, 
  LogOut, 
  FileText, 
  Image as ImageIcon,
  Home,
  Users,
  Settings,
  Newspaper,
  UserCircle,
  Star,
  Trophy,
  Calendar,
  Building,
  Mail,
  GitBranch,
  Cookie
} from 'lucide-react';
import jwLogo from '@/assets/jw-group-logo-full.png';
import { UserManagement } from '@/components/admin/UserManagement';
import { ContentManagement } from '@/components/admin/ContentManagement';
import { ImageManagement } from '@/components/admin/ImageManagement';
import { ChairmanImageUpload } from '@/components/admin/ChairmanImageUpload';
import { NewsManagement } from '@/components/admin/NewsManagement';
import { ExecutiveManagement } from '@/components/admin/ExecutiveManagement';
import TestimonialsManagement from '@/components/admin/TestimonialsManagement';
import AwardsManagement from '@/components/admin/AwardsManagement';
import TimelineManagement from '@/components/admin/TimelineManagement';
import ProjectsManagement from '@/components/admin/ProjectsManagement';
import NewsletterManagement from '@/components/admin/NewsletterManagement';
import { SnowfallControl } from '@/components/admin/SnowfallControl';
import ChristmasThemeControl from '@/components/admin/ChristmasThemeControl';
import OrgDepartmentManagement from '@/components/admin/OrgDepartmentManagement';
import SocialMediaManagement from '@/components/admin/SocialMediaManagement';
import CookieManagement from '@/components/admin/CookieManagement';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Redirect non-admin users away from admin panel
  useEffect(() => {
    if (!loading && user && !isAdmin) {
      toast.error('คุณไม่มีสิทธิ์เข้าถึงหน้า Admin');
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.success('ออกจากระบบสำเร็จ');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // Block rendering for non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={jwLogo} alt="JW Group" className="h-10" />
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {user?.email}
                {isAdmin && (
                  <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-2" />
                กลับหน้าหลัก
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Admin panel - only accessible by admin users */}

        <div className="mb-6">
          <h1 className="text-3xl font-bold">จัดการเนื้อหาเว็บไซต์</h1>
          <p className="text-muted-foreground mt-1">แก้ไขเนื้อหา รูปภาพ และจัดการผู้ใช้งาน</p>
        </div>

        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1">
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              <span className="hidden sm:inline">ข่าวสาร</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">โครงการ</span>
            </TabsTrigger>
            <TabsTrigger value="executives" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span className="hidden sm:inline">ผู้บริหาร</span>
            </TabsTrigger>
            <TabsTrigger value="orgchart" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              <span className="hidden sm:inline">โครงสร้าง</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">รีวิว</span>
            </TabsTrigger>
            <TabsTrigger value="awards" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">รางวัล</span>
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Newsletter</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">เนื้อหา</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">รูปภาพ</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">ผู้ใช้</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">ตั้งค่า</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <NewsManagement />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsManagement />
          </TabsContent>

          <TabsContent value="executives">
            <ExecutiveManagement />
          </TabsContent>

          <TabsContent value="orgchart">
            <OrgDepartmentManagement />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelineManagement />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsManagement />
          </TabsContent>

          <TabsContent value="awards">
            <AwardsManagement />
          </TabsContent>

          <TabsContent value="newsletter">
            <NewsletterManagement />
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <ChairmanImageUpload />
            <ImageManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <CookieManagement />
            <SocialMediaManagement />
            <div className="grid gap-6 md:grid-cols-2">
              <SnowfallControl />
              <ChristmasThemeControl />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
