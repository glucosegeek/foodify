import { supabase } from '../lib/supabase';

export interface Restaurant {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string;
  cuisine_type: string;
  location: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
  cover_photo_url: string;
  rating: number;
  review_count: number;
  price_range: string;
  dietary_options: string[];
  dining_style: string;
  opening_hours: Record<string, string>;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  dietary_tags: string[];
  allergens: string[];
  category_name?: string;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  restaurant_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: {
    username: string;
    avatar_url: string;
  };
}

// Fetch all restaurants with optional filters
export async function getRestaurants(filters?: {
  cuisine?: string;
  priceRange?: string;
  rating?: number;
  location?: string;
  dietary?: string;
  diningStyle?: string;
  searchTerm?: string;
  featured?: boolean;
}) {
  try {
    let query = supabase
      .from('restaurants')
      .select('*')
      .order('rating', { ascending: false });

    if (filters?.featured !== undefined) {
      query = query.eq('is_featured', filters.featured);
    }

    if (filters?.cuisine) {
      query = query.eq('cuisine_type', filters.cuisine);
    }

    if (filters?.priceRange) {
      query = query.eq('price_range', filters.priceRange);
    }

    if (filters?.rating) {
      query = query.gte('rating', filters.rating);
    }

    if (filters?.location) {
      query = query.eq('location', filters.location);
    }

    if (filters?.diningStyle) {
      query = query.eq('dining_style', filters.diningStyle);
    }

    if (filters?.dietary) {
      query = query.contains('dietary_options', [filters.dietary]);
    }

    if (filters?.searchTerm) {
      query = query.or(
        `name.ilike.%${filters.searchTerm}%,cuisine_type.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,location.ilike.%${filters.searchTerm}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data as Restaurant[], error: null };
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return { data: null, error };
  }
}

// Fetch single restaurant by ID or slug
export async function getRestaurantBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .single();

    if (error) throw error;
    return { data: data as Restaurant, error: null };
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return { data: null, error };
  }
}

// Fetch menu items for a restaurant
export async function getRestaurantMenu(restaurantId: string) {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories (
          name,
          description,
          display_order
        )
      `)
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)
      .order('menu_categories(display_order)', { ascending: true });

    if (error) throw error;
    return { data: data as MenuItem[], error: null };
  } catch (error) {
    console.error('Error fetching menu:', error);
    return { data: null, error };
  }
}

// Fetch menu categories for a restaurant
export async function getMenuCategories(restaurantId: string) {
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data: data as MenuCategory[], error: null };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: null, error };
  }
}

// Fetch reviews for a restaurant
export async function getRestaurantReviews(restaurantId: string) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as Review[], error: null };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { data: null, error };
  }
}

// Get unique filter options
export async function getFilterOptions() {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('cuisine_type, location, price_range, dining_style, dietary_options');

    if (error) throw error;

    const cuisines = [...new Set(data?.map(r => r.cuisine_type))];
    const locations = [...new Set(data?.map(r => r.location))];
    const priceRanges = [...new Set(data?.map(r => r.price_range))];
    const diningStyles = [...new Set(data?.map(r => r.dining_style))];
    const dietaryOptions = [...new Set(data?.flatMap(r => r.dietary_options || []))];

    return {
      cuisines,
      locations,
      priceRanges,
      diningStyles,
      dietaryOptions,
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return {
      cuisines: [],
      locations: [],
      priceRanges: [],
      diningStyles: [],
      dietaryOptions: [],
    };
  }
}