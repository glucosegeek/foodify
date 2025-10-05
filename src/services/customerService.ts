import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type CustomerProfile = Database['public']['Tables']['customer_profiles']['Row'];
type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];

export interface CustomerProfileData extends Profile {
  customer_profile?: CustomerProfile;
}

export interface CustomerStats {
  reviewCount: number;
  followingCount: number;
  restaurantFollowsCount: number;
}

// =============================================
// PROFILE MANAGEMENT
// =============================================

/**
 * Get customer profile with related data
 */
export async function getCustomerProfile(userId: string): Promise<CustomerProfileData | null> {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    const { data: customerProfile, error: customerError } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (customerError && customerError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (profile doesn't exist yet)
      console.error('Error fetching customer profile:', customerError);
    }

    return {
      ...profile,
      customer_profile: customerProfile || undefined,
    };
  } catch (error) {
    console.error('Error in getCustomerProfile:', error);
    return null;
  }
}

/**
 * Update customer profile
 */
export async function updateCustomerProfile(
  userId: string,
  updates: {
    username?: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating customer profile:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update customer preferences
 */
export async function updateCustomerPreferences(
  userId: string,
  preferences: {
    preferred_cuisines?: string[];
    dietary_restrictions?: Database['public']['Tables']['customer_profiles']['Row']['dietary_restrictions'];
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if customer_profile exists
    const { data: existing } = await supabase
      .from('customer_profiles')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      // Update existing profile
      const { error } = await supabase
        .from('customer_profiles')
        .update(preferences)
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      // Create new customer_profile
      const { error } = await supabase
        .from('customer_profiles')
        .insert({
          user_id: userId,
          ...preferences,
        });

      if (error) throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating customer preferences:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload customer avatar
 */
export async function uploadCustomerAvatar(
  userId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    if (updateError) throw updateError;

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    return { success: false, error: error.message };
  }
}

// =============================================
// CUSTOMER STATS
// =============================================

/**
 * Get customer statistics
 */
export async function getCustomerStats(userId: string): Promise<CustomerStats> {
  try {
    const [reviewsResult, followingResult, restaurantFollowsResult] = await Promise.all([
      supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabase
        .from('follows')
        .select('follower_id', { count: 'exact', head: true })
        .eq('follower_id', userId),
      supabase
        .from('restaurant_follows')
        .select('user_id', { count: 'exact', head: true })
        .eq('user_id', userId),
    ]);

    return {
      reviewCount: reviewsResult.count || 0,
      followingCount: followingResult.count || 0,
      restaurantFollowsCount: restaurantFollowsResult.count || 0,
    };
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    return {
      reviewCount: 0,
      followingCount: 0,
      restaurantFollowsCount: 0,
    };
  }
}

// =============================================
// REVIEWS
// =============================================

/**
 * Get customer reviews with restaurant info
 */
export async function getCustomerReviews(userId: string): Promise<Array<Review & { restaurant: Restaurant }>> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        restaurant:restaurants(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as any) || [];
  } catch (error) {
    console.error('Error fetching customer reviews:', error);
    return [];
  }
}

/**
 * Create a new review
 */
export async function createReview(
  restaurantId: string,
  userId: string,
  rating: number,
  comment?: string,
  photos?: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('reviews')
      .insert({
        restaurant_id: restaurantId,
        user_id: userId,
        rating,
        comment,
        photos,
      });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error creating review:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update existing review
 */
export async function updateReview(
  reviewId: string,
  userId: string,
  updates: {
    rating?: number;
    comment?: string;
    photos?: string[];
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', reviewId)
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating review:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete review
 */
export async function deleteReview(
  reviewId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return { success: false, error: error.message };
  }
}

// =============================================
// FOLLOWING
// =============================================

/**
 * Get users that the customer is following
 */
export async function getFollowing(userId: string): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        following:profiles!follows_following_id_fkey(*)
      `)
      .eq('follower_id', userId);

    if (error) throw error;

    return (data?.map((item: any) => item.following) || []) as Profile[];
  } catch (error) {
    console.error('Error fetching following:', error);
    return [];
  }
}

/**
 * Follow a user
 */
export async function followUser(
  followerId: string,
  followingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        following_id: followingId,
      });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error following user:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Unfollow a user
 */
export async function unfollowUser(
  followerId: string,
  followingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error unfollowing user:', error);
    return { success: false, error: error.message };
  }
}

// =============================================
// FAVORITE RESTAURANTS
// =============================================

/**
 * Get customer's favorite restaurants
 */
export async function getFavoriteRestaurants(userId: string): Promise<Restaurant[]> {
  try {
    const { data, error } = await supabase
      .from('restaurant_follows')
      .select(`
        restaurant:restaurants(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data?.map((item: any) => item.restaurant) || []) as Restaurant[];
  } catch (error) {
    console.error('Error fetching favorite restaurants:', error);
    return [];
  }
}

/**
 * Add restaurant to favorites
 */
export async function addFavoriteRestaurant(
  userId: string,
  restaurantId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('restaurant_follows')
      .insert({
        user_id: userId,
        restaurant_id: restaurantId,
      });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error adding favorite restaurant:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Remove restaurant from favorites
 */
export async function removeFavoriteRestaurant(
  userId: string,
  restaurantId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('restaurant_follows')
      .delete()
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error removing favorite restaurant:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if restaurant is favorited
 */
export async function isRestaurantFavorited(
  userId: string,
  restaurantId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('restaurant_follows')
      .select('user_id')
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking favorite status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}