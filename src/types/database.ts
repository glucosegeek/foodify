export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'CUSTOMER' | 'RESTAURANT' | 'ADMIN';
export type DiningStyle = 'fine_dining' | 'casual' | 'fast_casual';
export type DietaryTag = 'vegetarian' | 'vegan' | 'gluten_free' | 'halal' | 'kosher';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      customer_profiles: {
        Row: {
          user_id: string;
          preferred_cuisines: string[] | null;
          dietary_restrictions: DietaryTag[] | null;
          favorite_restaurants: string[] | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          preferred_cuisines?: string[] | null;
          dietary_restrictions?: DietaryTag[] | null;
          favorite_restaurants?: string[] | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          preferred_cuisines?: string[] | null;
          dietary_restrictions?: DietaryTag[] | null;
          favorite_restaurants?: string[] | null;
          created_at?: string;
        };
      };
      restaurants: {
        Row: {
          id: string;
          user_id: string;
          slug: string;
          name: string;
          description: string | null;
          cuisine_type: string;
          location: string;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          logo_url: string | null;
          cover_photo_url: string | null;
          rating: number;
          review_count: number;
          price_range: string | null;
          dining_style: DiningStyle;
          dietary_options: DietaryTag[] | null;
          is_featured: boolean;
          opening_hours: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          slug: string;
          name: string;
          description?: string | null;
          cuisine_type: string;
          location: string;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          logo_url?: string | null;
          cover_photo_url?: string | null;
          rating?: number;
          review_count?: number;
          price_range?: string | null;
          dining_style?: DiningStyle;
          dietary_options?: DietaryTag[] | null;
          is_featured?: boolean;
          opening_hours?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          cuisine_type?: string;
          location?: string;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          logo_url?: string | null;
          cover_photo_url?: string | null;
          rating?: number;
          review_count?: number;
          price_range?: string | null;
          dining_style?: DiningStyle;
          dietary_options?: DietaryTag[] | null;
          is_featured?: boolean;
          opening_hours?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          category_id: string | null;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          dietary_tags: DietaryTag[] | null;
          allergens: string[] | null;
          is_available: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          category_id?: string | null;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          dietary_tags?: DietaryTag[] | null;
          allergens?: string[] | null;
          is_available?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          category_id?: string | null;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          dietary_tags?: DietaryTag[] | null;
          allergens?: string[] | null;
          is_available?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          restaurant_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          photos: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
          photos?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string | null;
          photos?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      follows: {
        Row: {
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
      restaurant_follows: {
        Row: {
          user_id: string;
          restaurant_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          restaurant_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          restaurant_id?: string;
          created_at?: string;
        };
      };
    };
  };
}