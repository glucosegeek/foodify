import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];
type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface RestaurantWithStats extends Restaurant {
  follower_count?: number;
}

export interface MenuItemWithCategory extends MenuItem {
  category?: MenuCategory;
}

// =============================================
// RESTAURANT MANAGEMENT
// =============================================

/**
 * Get restaurant by ID or slug
 */
export async function getRestaurant(idOrSlug: string): Promise<Restaurant | null> {
  try {
    // Try by ID first
    let query = supabase.from('restaurants').select('*');

    // Check if it's a UUID (ID) or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    if (isUUID) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }

    const { data, error } = await query.single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return null;
  }
}

/**
 * Create a new restaurant
 */
export async function createRestaurant(
  userId: string,
  restaurantData: {
    name: string;
    slug: string;
    description?: string;
    cuisine_type: string;
    location: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    email?: string;
    website?: string;
    price_range?: string;
    dining_style?: Database['public']['Tables']['restaurants']['Row']['dining_style'];
  }
): Promise<{ success: boolean; restaurant?: Restaurant; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .insert({
        user_id: userId,
        ...restaurantData,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, restaurant: data };
  } catch (error: any) {
    console.error('Error creating restaurant:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update restaurant
 */
export async function updateRestaurant(
  restaurantId: string,
  updates: Partial<Omit<Restaurant, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('restaurants')
      .update(updates)
      .eq('id', restaurantId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating restaurant:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload restaurant logo
 */
export async function uploadRestaurantLogo(
  restaurantId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${restaurantId}-logo-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('restaurants')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('restaurants')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('restaurants')
      .update({ logo_url: publicUrl })
      .eq('id', restaurantId);

    if (updateError) throw updateError;

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('Error uploading logo:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload restaurant cover photo
 */
export async function uploadRestaurantCover(
  restaurantId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${restaurantId}-cover-${Date.now()}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('restaurants')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('restaurants')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('restaurants')
      .update({ cover_photo_url: publicUrl })
      .eq('id', restaurantId);

    if (updateError) throw updateError;

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('Error uploading cover:', error);
    return { success: false, error: error.message };
  }
}

// =============================================
// MENU CATEGORIES
// =============================================

/**
 * Get all categories for a restaurant
 */
export async function getMenuCategories(restaurantId: string): Promise<MenuCategory[]> {
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    return [];
  }
}

/**
 * Create menu category
 */
export async function createMenuCategory(
  restaurantId: string,
  categoryData: {
    name: string;
    description?: string;
    display_order?: number;
  }
): Promise<{ success: boolean; category?: MenuCategory; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .insert({
        restaurant_id: restaurantId,
        ...categoryData,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, category: data };
  } catch (error: any) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update menu category
 */
export async function updateMenuCategory(
  categoryId: string,
  updates: Partial<Omit<MenuCategory, 'id' | 'restaurant_id' | 'created_at'>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('menu_categories')
      .update(updates)
      .eq('id', categoryId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete menu category
 */
export async function deleteMenuCategory(
  categoryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', categoryId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }
}

// =============================================
// MENU ITEMS
// =============================================

/**
 * Get all menu items for a restaurant
 */
export async function getMenuItems(restaurantId: string): Promise<MenuItemWithCategory[]> {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        category:menu_categories(*)
      `)
      .eq('restaurant_id', restaurantId)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return (data as any) || [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}

/**
 * Get menu items by category
 */
export async function getMenuItemsByCategory(
  restaurantId: string,
  categoryId: string
): Promise<MenuItem[]> {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('category_id', categoryId)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    return [];
  }
}

/**
 * Create menu item
 */
export async function createMenuItem(
  restaurantId: string,
  itemData: {
    category_id?: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    dietary_tags?: string[];
    allergens?: string[];
    is_available?: boolean;
    display_order?: number;
  }
): Promise<{ success: boolean; item?: MenuItem; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        restaurant_id: restaurantId,
        ...itemData,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, item: data };
  } catch (error: any) {
    console.error('Error creating menu item:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update menu item
 */
export async function updateMenuItem(
  itemId: string,
  updates: Partial<Omit<MenuItem, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', itemId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating menu item:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete menu item
 */
export async function deleteMenuItem(
  itemId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting menu item:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload menu item image
 */
export async function uploadMenuItemImage(
  itemId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${itemId}-${Date.now()}.${fileExt}`;
    const filePath = `menu-items/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('restaurants')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('restaurants')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('menu_items')
      .update({ image_url: publicUrl })
      .eq('id', itemId);

    if (updateError) throw updateError;

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('Error uploading menu item image:', error);
    return { success: false, error: error.message };
  }
}

// =============================================
// RESTAURANT STATS & REVIEWS
// =============================================

/**
 * Get restaurant reviews
 */
export async function getRestaurantReviews(restaurantId: string): Promise<Array<Review & { user: Profile }>> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as any) || [];
  } catch (error) {
    console.error('Error fetching restaurant reviews:', error);
    return [];
  }
}

/**
 * Get restaurant followers
 */
export async function getRestaurantFollowers(restaurantId: string): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('restaurant_follows')
      .select(`
        user:profiles(*)
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data?.map((item: any) => item.user) || []) as Profile[];
  } catch (error) {
    console.error('Error fetching restaurant followers:', error);
    return [];
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
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data: data as MenuItem[], error: null };
  } catch (error) {
    console.error('Error fetching menu:', error);
    return { data: null, error };
  }
}

/**
 * Get restaurant stats
 */
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

/**
 * Get restaurant stats
 */
export async function getRestaurantStats(restaurantId: string): Promise<{
  followerCount: number;
  reviewCount: number;
  menuItemCount: number;
  averageRating: number;
}> {
  try {
    const [followersResult, reviewsResult, menuItemsResult] = await Promise.all([
      supabase
        .from('restaurant_follows')
        .select('user_id', { count: 'exact', head: true })
        .eq('restaurant_id', restaurantId),
      supabase
        .from('reviews')
        .select('rating')
        .eq('restaurant_id', restaurantId),
      supabase
        .from('menu_items')
        .select('id', { count: 'exact', head: true })
        .eq('restaurant_id', restaurantId),
    ]);

    const ratings = reviewsResult.data?.map(r => r.rating) || [];
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

    return {
      followerCount: followersResult.count || 0,
      reviewCount: reviewsResult.data?.length || 0,
      menuItemCount: menuItemsResult.count || 0,
      averageRating: Number(averageRating.toFixed(1)),
    };
  } catch (error) {
    console.error('Error fetching restaurant stats:', error);
    return {
      followerCount: 0,
      reviewCount: 0,
      menuItemCount: 0,
      averageRating: 0,
    };
  }
}

// Fetch restaurant by user ID
export async function getRestaurantByUserId(userId: string) {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - user doesn't have a restaurant yet
        return null;
      }
      throw error;
    }
    return data as Restaurant;
  } catch (error) {
    console.error('Error fetching restaurant by user ID:', error);
    return null;
  }
}

// Get unique filter options
export async function getFilterOptions() {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('cuisine_type, location, price_range, dining_style, dietary_options');

    if (error) throw error;

    const cuisines = [...new Set(data?.map(r => r.cuisine_type).filter(Boolean))];
    const locations = [...new Set(data?.map(r => r.location).filter(Boolean))];
    const priceRanges = [...new Set(data?.map(r => r.price_range).filter(Boolean))];
    const diningStyles = [...new Set(data?.map(r => r.dining_style).filter(Boolean))];
    const dietaryOptions = [...new Set(data?.flatMap(r => r.dietary_options || []).filter(Boolean))];

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