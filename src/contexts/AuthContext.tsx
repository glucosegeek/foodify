import React, { createContext, useContext, useEffect, useState } from 'react';

// Types
export type UserRole = 'CUSTOMER' | 'RESTAURANT' | 'ADMIN';

export interface CustomerProfile {
  username: string;
  avatar_url?: string;
  bio?: string;
  favorite_cuisines: string[];
  followers_count: number;
  following_count: number;
  reviews_count: number;
  photos_count: number;
  location?: string;
  preferences: {
    dietary_restrictions: string[];
    price_range_preference: string;
    notifications_enabled: boolean;
    profile_public: boolean;
  };
}

export interface RestaurantProfile {
  name: string;
  logo_url?: string;
  description: string;
  cuisine_types: string[];
  address: string;
  phone: string;
  website?: string;
  hours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  tags: string[]; // ['vege-friendly', 'verified', 'delivery']
  verification_status: 'pending' | 'verified' | 'rejected';
  followers_count: number;
  reviews_count: number;
  average_rating: number;
  team_members: string[]; // IDs of team members
}

type User = {
  id: string;
  email?: string;
  role: UserRole;
  profile?: CustomerProfile | RestaurantProfile;
} | null;

type Session = {
  user: User;
} | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<CustomerProfile | RestaurantProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock profiles
const mockCustomerProfile: CustomerProfile = {
  username: "foodlover123",
  avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
  bio: "Passionate foodie exploring local cuisine. Love trying new flavors and discovering hidden gems!",
  favorite_cuisines: ["Italian", "Japanese", "Mexican", "Thai"],
  followers_count: 45,
  following_count: 23,
  reviews_count: 12,
  photos_count: 28,
  location: "Warsaw, Poland",
  preferences: {
    dietary_restrictions: ["Vegetarian"],
    price_range_preference: "$$",
    notifications_enabled: true,
    profile_public: true
  }
};

const mockRestaurantProfile: RestaurantProfile = {
  name: "Bella Vista Italian",
  logo_url: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  description: "Authentic Italian cuisine with fresh ingredients sourced directly from Italy. Family-owned restaurant serving traditional recipes passed down through generations.",
  cuisine_types: ["Italian", "Mediterranean"],
  address: "123 Main Street, Warsaw",
  phone: "+48 22 123 4567",
  website: "https://bellavista-italian.com",
  hours: {
    monday: { open: "12:00", close: "22:00" },
    tuesday: { open: "12:00", close: "22:00" },
    wednesday: { open: "12:00", close: "22:00" },
    thursday: { open: "12:00", close: "22:00" },
    friday: { open: "12:00", close: "23:00" },
    saturday: { open: "12:00", close: "23:00" },
    sunday: { open: "14:00", close: "21:00" }
  },
  tags: ["vege-friendly", "verified", "delivery", "romantic"],
  verification_status: "verified",
  followers_count: 234,
  reviews_count: 89,
  average_rating: 4.8,
  team_members: ["manager1", "chef1"]
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TEMPORARY: Mock auth state for development
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock login - determine role based on email
    const role: UserRole = email.includes('restaurant') ? 'RESTAURANT' : 
                          email.includes('admin') ? 'ADMIN' : 'CUSTOMER';
    
    const profile = role === 'RESTAURANT' ? mockRestaurantProfile : mockCustomerProfile;
    
    const mockUser = { 
      id: '1', 
      email, 
      role,
      profile
    };
    const mockSession = { user: mockUser };
    setUser(mockUser);
    setSession(mockSession);
  };

  const signUp = async (email: string, password: string, role: UserRole) => {
    const profile = role === 'RESTAURANT' ? mockRestaurantProfile : mockCustomerProfile;
    
    const mockUser = { 
      id: '1', 
      email, 
      role,
      profile
    };
    const mockSession = { user: mockUser };
    setUser(mockUser);
    setSession(mockSession);
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (profileUpdate: Partial<CustomerProfile | RestaurantProfile>) => {
    if (user && user.profile) {
      const updatedUser = {
        ...user,
        profile: { ...user.profile, ...profileUpdate }
      };
      setUser(updatedUser);
      setSession({ user: updatedUser });
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}