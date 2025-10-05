import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getCustomerProfile,
  getCustomerStats,
  getCustomerReviews,
  getFollowing,
  getFavoriteRestaurants,
  CustomerProfileData,
  CustomerStats,
} from '../services/customerService';
import { Database } from '../types/database.types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export function useCustomerProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [stats, setStats] = useState<CustomerStats>({
    reviewCount: 0,
    followingCount: 0,
    restaurantFollowsCount: 0,
  });
  const [reviews, setReviews] = useState<Array<Review & { restaurant: Restaurant }>>([]);
  const [following, setFollowing] = useState<Profile[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadCustomerData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadCustomerData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const [profileData, statsData, reviewsData, followingData, favoritesData] = await Promise.all([
        getCustomerProfile(user.id),
        getCustomerStats(user.id),
        getCustomerReviews(user.id),
        getFollowing(user.id),
        getFavoriteRestaurants(user.id),
      ]);

      setProfile(profileData);
      setStats(statsData);
      setReviews(reviewsData);
      setFollowing(followingData);
      setFavoriteRestaurants(favoritesData);
    } catch (err: any) {
      console.error('Error loading customer data:', err);
      setError(err.message || 'Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await getCustomerProfile(user.id);
      setProfile(profileData);
    }
  };

  const refreshStats = async () => {
    if (user) {
      const statsData = await getCustomerStats(user.id);
      setStats(statsData);
    }
  };

  const refreshReviews = async () => {
    if (user) {
      const reviewsData = await getCustomerReviews(user.id);
      setReviews(reviewsData);
    }
  };

  const refreshFollowing = async () => {
    if (user) {
      const followingData = await getFollowing(user.id);
      setFollowing(followingData);
    }
  };

  const refreshFavorites = async () => {
    if (user) {
      const favoritesData = await getFavoriteRestaurants(user.id);
      setFavoriteRestaurants(favoritesData);
    }
  };

  return {
    profile,
    stats,
    reviews,
    following,
    favoriteRestaurants,
    loading,
    error,
    refreshProfile,
    refreshStats,
    refreshReviews,
    refreshFollowing,
    refreshFavorites,
    reload: loadCustomerData,
  };
}