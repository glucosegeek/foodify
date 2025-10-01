export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'CUSTOMER' | 'RESTAURANT' | 'ADMIN'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'CUSTOMER' | 'RESTAURANT' | 'ADMIN'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'CUSTOMER' | 'RESTAURANT' | 'ADMIN'
          created_at?: string
          updated_at?: string
        }
      }
      customer_profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          bio: string | null
          location: string | null
          favorite_cuisines: string[]
          dietary_restrictions: string[]
          price_range_preference: string
          notifications_enabled: boolean
          profile_public: boolean
          followers_count: number
          following_count: number
          reviews_count: number
          photos_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          favorite_cuisines?: string[]
          dietary_restrictions?: string[]
          price_range_preference?: string
          notifications_enabled?: boolean
          profile_public?: boolean
          followers_count?: number
          following_count?: number
          reviews_count?: number
          photos_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          favorite_cuisines?: string[]
          dietary_restrictions?: string[]
          price_range_preference?: string
          notifications_enabled?: boolean
          profile_public?: boolean
          followers_count?: number
          following_count?: number
          reviews_count?: number
          photos_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      restaurant_profiles: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          cover_photo_url: string | null
          description: string | null
          cuisine_types: string[]
          address: string | null
          city: string | null
          postal_code: string | null
          country: string
          phone: string | null
          website: string | null
          email: string | null
          business_hours: Json
          price_level: number
          tags: string[]
          verification_status: 'pending' | 'verified' | 'rejected'
          verified_at: string | null
          followers_count: number
          reviews_count: number
          average_rating: number
          team_member_emails: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          slug: string
          logo_url?: string | null
          cover_photo_url?: string | null
          description?: string | null
          cuisine_types?: string[]
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          phone?: string | null
          website?: string | null
          email?: string | null
          business_hours?: Json
          price_level?: number
          tags?: string[]
          verification_status?: 'pending' | 'verified' | 'rejected'
          verified_at?: string | null
          followers_count?: number
          reviews_count?: number
          average_rating?: number
          team_member_emails?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          cover_photo_url?: string | null
          description?: string | null
          cuisine_types?: string[]
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          phone?: string | null
          website?: string | null
          email?: string | null
          business_hours?: Json
          price_level?: number
          tags?: string[]
          verification_status?: 'pending' | 'verified' | 'rejected'
          verified_at?: string | null
          followers_count?: number
          reviews_count?: number
          average_rating?: number
          team_member_emails?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          profile_id: string
          location: unknown
          latitude: number | null
          longitude: number | null
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          location?: unknown
          latitude?: number | null
          longitude?: number | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          location?: unknown
          latitude?: number | null
          longitude?: number | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          restaurant_id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          preparation_time: number | null
          is_available: boolean
          is_seasonal: boolean
          is_signature: boolean
          spice_level: number
          popularity_rank: number
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          category_id?: string | null
          name: string
          description?: string | null
          price: number
          preparation_time?: number | null
          is_available?: boolean
          is_seasonal?: boolean
          is_signature?: boolean
          spice_level?: number
          popularity_rank?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number
          preparation_time?: number | null
          is_available?: boolean
          is_seasonal?: boolean
          is_signature?: boolean
          spice_level?: number
          popularity_rank?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          rating: number
          comment: string | null
          verification_level: 'unverified' | 'verified_visit' | 'verified_purchase'
          verification_data: Json
          visit_date: string | null
          helpful_count: number
          reported_count: number
          moderation_status: 'active' | 'flagged' | 'hidden' | 'removed'
          moderation_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          rating: number
          comment?: string | null
          verification_level?: 'unverified' | 'verified_visit' | 'verified_purchase'
          verification_data?: Json
          visit_date?: string | null
          helpful_count?: number
          reported_count?: number
          moderation_status?: 'active' | 'flagged' | 'hidden' | 'removed'
          moderation_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          rating?: number
          comment?: string | null
          verification_level?: 'unverified' | 'verified_visit' | 'verified_purchase'
          verification_data?: Json
          visit_date?: string | null
          helpful_count?: number
          reported_count?: number
          moderation_status?: 'active' | 'flagged' | 'hidden' | 'removed'
          moderation_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      restaurant_follows: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          notes?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          recipient_id: string
          sender_id: string | null
          notification_type: string
          title: string
          message: string
          action_url: string | null
          related_entity_type: string | null
          related_entity_id: string | null
          metadata: Json
          is_read: boolean
          read_at: string | null
          is_archived: boolean
          created_at: string
        }
        Insert: {
          id?: string
          recipient_id: string
          sender_id?: string | null
          notification_type: string
          title: string
          message: string
          action_url?: string | null
          related_entity_type?: string | null
          related_entity_id?: string | null
          metadata?: Json
          is_read?: boolean
          read_at?: string | null
          is_archived?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          recipient_id?: string
          sender_id?: string | null
          notification_type?: string
          title?: string
          message?: string
          action_url?: string | null
          related_entity_type?: string | null
          related_entity_id?: string | null
          metadata?: Json
          is_read?: boolean
          read_at?: string | null
          is_archived?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'CUSTOMER' | 'RESTAURANT' | 'ADMIN'
      verification_status: 'pending' | 'verified' | 'rejected'
      verification_level: 'unverified' | 'verified_visit' | 'verified_purchase'
    }
  }
}
