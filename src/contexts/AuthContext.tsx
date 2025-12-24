import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);

  const checkAdminRole = async (userId: string, retries = 3, delay = 1000): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
          return checkAdminRole(userId, retries - 1, delay * 1.5);
        }
        return false;
      }
      return !!data;
    } catch (error) {
      console.error('Error checking admin role:', error);
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return checkAdminRole(userId, retries - 1, delay * 1.5);
      }
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Timeout safeguard: Force loading to false after 10 seconds to prevent infinite hang
    const timeoutTimer = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth check timed out, forcing loading false');
        setLoading(false);
        setAdminCheckComplete(true);
      }
    }, 10000);

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Wait for admin check to complete before setting loading to false
          setAdminCheckComplete(false);

          // Robust check with retries, no arbitrary race timeout
          const isUserAdmin = await checkAdminRole(session.user.id);

          if (mounted) {
            setIsAdmin(isUserAdmin);
            setAdminCheckComplete(true);
            setLoading(false);
          }
        } else {
          setIsAdmin(false);
          setAdminCheckComplete(true);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!mounted) return;
        if (error) throw error;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const isUserAdmin = await checkAdminRole(session.user.id);
          if (mounted) {
            setIsAdmin(isUserAdmin);
            setAdminCheckComplete(true);
            setLoading(false);
          }
        } else {
          setAdminCheckComplete(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Session init error:', error);
        if (mounted) {
          setAdminCheckComplete(true);
          setLoading(false);
        }
      }
    };

    initSession();

    return () => {
      mounted = false;
      clearTimeout(timeoutTimer);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName }
      }
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
