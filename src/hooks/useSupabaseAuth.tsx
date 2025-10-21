
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: any | null;
  loading: boolean;
  signUp: (phone: string, password: string, userData: { name: string; phone?: string }) => Promise<void>;
  signIn: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile when user changes
  const loadUserProfile = async (userId: string) => {
    try {
      // Load profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        setUserProfile(null);
        return;
      }

      // Load user role from user_roles table
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setUserProfile({
        ...profile,
        role: roleData?.role || 'user'
      });
    } catch (error) {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Load profile after setting user
            setTimeout(() => {
              loadUserProfile(session.user.id);
            }, 0);
          } else {
            setUserProfile(null);
          }
          
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user && event === 'SIGNED_IN') {
            // Load profile after sign in
            setTimeout(() => {
              loadUserProfile(session.user.id);
            }, 0);
          } else {
            setUserProfile(null);
          }
          
          setLoading(false);
        }
      }
    );

    // Get initial session
    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (phone: string, password: string, userData: { name: string; phone?: string }) => {
    try {
      setLoading(true);
      
      // Use phone as email with a dummy domain for Supabase auth
      const dummyEmail = `${phone}@iroliashop.local`;
      
      // SECURITY: Never pass role from client - server determines role via admin_config
      const { data, error } = await supabase.auth.signUp({
        email: dummyEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: userData.name,
            phone: userData.phone || phone,
            // Role is determined server-side by handle_new_user trigger
          }
        }
      });

      if (error) throw error;

      toast.success(`خوش آمدید ${userData.name}`);
    } catch (error: any) {
      // Let the error handler in Auth.tsx handle the toast
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (phone: string, password: string) => {
    try {
      setLoading(true);
      
      // Use phone as email with dummy domain for Supabase auth
      const dummyEmail = `${phone}@iroliashop.local`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: dummyEmail,
        password,
      });

      if (error) throw error;
      
      // Get user profile to show name
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', data.user.id)
        .single();

      toast.success(`خوش آمدید ${profile?.name || phone}`);
    } catch (error: any) {
      // Let the error handler in Auth.tsx handle the toast
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('با موفقیت خارج شدید');
    } catch (error: any) {
      toast.error('خطا در خروج');
    }
  };

  const isAdmin = () => {
    if (!user || !userProfile) return false;
    // Check profile role from database
    return userProfile.role === 'admin';
  };

  const value: AuthContextType = {
    user,
    session,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within an AuthProvider');
  }
  return context;
};
