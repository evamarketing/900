import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  makeUserAdmin: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id, session.user.email);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id, session.user.email);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string, email?: string) => {
    try {
      // Check if user is the main admin by email
      if (email === 'evamarketingsolutions@gmail.com') {
        setIsAdmin(true);
        return;
      }

      // Check admin role in database
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(data && data.length > 0);
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    }
  };

  const makeUserAdmin = async (email: string) => {
    try {
      // Special handling for main admin
      if (email === 'evamarketingsolutions@gmail.com') {
        // Call the database function to ensure admin user exists
        const { error } = await supabase.rpc('create_admin_user');
        
        if (error) {
          throw error;
        }

        toast({
          title: "Main Admin Setup Complete",
          description: `Admin user ${email} has been configured with universal access.`,
        });

        // Refresh admin status if it's the current user
        if (user?.email === email) {
          setIsAdmin(true);
        }
        return;
      }

      // For other users, use the assign_admin_role function
      const { error } = await supabase.rpc('assign_admin_role', {
        user_email: email
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Admin Role Assigned",
        description: `User ${email} has been granted admin access.`,
      });

      // Refresh admin status if it's the current user
      if (user?.email === email) {
        await checkAdminRole(user.id, user.email);
      }
    } catch (error: any) {
      console.error('Error assigning admin role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign admin role",
        variant: "destructive",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Account Created",
      description: "Please check your email to verify your account.",
    });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Reset Email Sent",
      description: "Check your email for password reset instructions.",
    });
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword,
    makeUserAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};