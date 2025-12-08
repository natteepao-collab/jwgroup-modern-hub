import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Users, Shield, UserCheck, UserX, RefreshCw, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

interface UserWithRole extends UserProfile {
  roles: AppRole[];
}

export const UserManagement = () => {
  const { isAdmin, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => ({
        ...profile,
        roles: (roles || [])
          .filter(role => role.user_id === profile.user_id)
          .map(role => role.role)
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้');
    }
    setIsLoading(false);
  };

  const addRole = async (userId: string, role: AppRole) => {
    if (!isAdmin) {
      toast.error('คุณไม่มีสิทธิ์เปลี่ยนแปลง Role');
      return;
    }

    setIsSaving(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) {
        if (error.code === '23505') {
          toast.error('ผู้ใช้มี Role นี้อยู่แล้ว');
        } else {
          throw error;
        }
      } else {
        toast.success(`เพิ่ม Role ${role} สำเร็จ`);
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error adding role:', error);
      toast.error(error.message || 'เกิดข้อผิดพลาดในการเพิ่ม Role');
    }
    setIsSaving(null);
  };

  const removeRole = async (userId: string, role: AppRole) => {
    if (!isAdmin) {
      toast.error('คุณไม่มีสิทธิ์เปลี่ยนแปลง Role');
      return;
    }

    // Prevent removing own admin role
    if (userId === currentUser?.id && role === 'admin') {
      toast.error('ไม่สามารถลบ Role Admin ของตัวเองได้');
      return;
    }

    setIsSaving(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;
      
      toast.success(`ลบ Role ${role} สำเร็จ`);
      fetchUsers();
    } catch (error: any) {
      console.error('Error removing role:', error);
      toast.error(error.message || 'เกิดข้อผิดพลาดในการลบ Role');
    }
    setIsSaving(null);
  };

  const getRoleBadgeColor = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'moderator':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'user':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            การจัดการผู้ใช้งาน
          </CardTitle>
          <CardDescription>ดูและจัดการผู้ใช้งานในระบบ</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground flex items-center gap-2">
            <Shield className="h-5 w-5" />
            คุณไม่มีสิทธิ์เข้าถึงส่วนนี้
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            การจัดการผู้ใช้งาน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              การจัดการผู้ใช้งาน
            </CardTitle>
            <CardDescription>ดูและจัดการ Role ของผู้ใช้งานในระบบ ({users.length} คน)</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            รีเฟรช
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ผู้ใช้งาน</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>Role ปัจจุบัน</TableHead>
                <TableHead>สมัครเมื่อ</TableHead>
                <TableHead className="text-right">จัดการ Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    ยังไม่มีผู้ใช้งานในระบบ
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {user.roles.includes('admin') ? (
                            <Shield className="h-4 w-4 text-primary" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className="font-medium">
                          {user.full_name || 'ไม่ระบุชื่อ'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <Badge 
                              key={role} 
                              variant="outline" 
                              className={`${getRoleBadgeColor(role)} flex items-center gap-1`}
                            >
                              {role}
                              <button
                                onClick={() => removeRole(user.user_id, role)}
                                disabled={isSaving === user.user_id}
                                className="ml-1 hover:text-destructive"
                                title={`ลบ Role ${role}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="bg-muted text-muted-foreground">
                            <UserX className="h-3 w-3 mr-1" />
                            ไม่มี Role
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        disabled={isSaving === user.user_id}
                        onValueChange={(value) => addRole(user.user_id, value as AppRole)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="เพิ่ม Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <span className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-red-500" />
                              Admin
                            </span>
                          </SelectItem>
                          <SelectItem value="moderator">
                            <span className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-yellow-500" />
                              Moderator
                            </span>
                          </SelectItem>
                          <SelectItem value="user">
                            <span className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-blue-500" />
                              User
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Role Description */}
        <div className="mt-6 p-4 bg-accent/20 rounded-lg">
          <h4 className="font-semibold mb-3">คำอธิบาย Role</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getRoleBadgeColor('admin')}>admin</Badge>
              <span className="text-muted-foreground">- สิทธิ์สูงสุด สามารถจัดการเนื้อหา, รูปภาพ และผู้ใช้งานได้ทั้งหมด</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getRoleBadgeColor('moderator')}>moderator</Badge>
              <span className="text-muted-foreground">- สามารถจัดการเนื้อหาและรูปภาพได้</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getRoleBadgeColor('user')}>user</Badge>
              <span className="text-muted-foreground">- ผู้ใช้ทั่วไป ดูเนื้อหาได้อย่างเดียว</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
