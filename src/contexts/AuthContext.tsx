import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string, role?: 'CUSTOMER' | 'RESTAURANT') => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        // Fetch profile if user exists
        if (initialSession?.user) {
          const profileData = await fetchProfile(initialSession.user.id);
          setProfile(profileData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        (async () => {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          // Fetch profile when user signs in
          if (currentSession?.user) {
            const profileData = await fetchProfile(currentSession.user.id);
            setProfile(profileData);
          } else {
            setProfile(null);
          }

          setLoading(false);
        })();
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Profile will be fetched by onAuthStateChange listener
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unexpected error occurred during sign in');
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    fullName?: string,
    role: 'CUSTOMER' | 'RESTAURANT' = 'CUSTOMER'
  ) => {
    try {
      // Create auth user with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
            role: role,
          },
        },
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('User creation failed');
      }

      // Profile is automatically created by database trigger (handle_new_user)
      // But we need to update the role if it's a restaurant
      if (role === 'RESTAURANT') {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'RESTAURANT' })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Error updating profile role:', profileError);
        }
      }

      // For customers, create customer_profile
      if (role === 'CUSTOMER') {
        const baseUsername = data.user.email?.split('@')[0] || 'user';
        const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const username = `${baseUsername}${randomSuffix}`;

        const { error: customerProfileError } = await supabase
          .from('customer_profiles')
          .insert({
            id: data.user.id,
            username: username,
            favorite_cuisines: [],
            dietary_restrictions: [],
          });

        if (customerProfileError) {
          console.error('Error creating customer profile:', customerProfileError);
          throw new Error('Failed to create customer profile. Please try again.');
        }
      }

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unexpected error occurred during sign up');
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear local state
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unexpected error occurred during sign out');
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}