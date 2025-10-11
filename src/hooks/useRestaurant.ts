import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getRestaurantByUserId,
  getMenuCategories,
  getMenuItems,
  getRestaurantStats,
  getRestaurantReviews,
  getRestaurantFollowers,
} from '../services/restaurantService';
import { Database } from '../types/database';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];
type MenuItem = Database['public']['Tables']['menu_items']['Row'];

export function useRestaurant() {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [stats, setStats] = useState({
    followerCount: 0,
    reviewCount: 0,
    menuItemCount: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadRestaurantData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadRestaurantData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const restaurantData = await getRestaurantByUserId(user.id);

      if (!restaurantData) {
        setRestaurant(null);
        setLoading(false);
        return;
      }

      setRestaurant(restaurantData);

      const [categoriesData, menuItemsData, statsData] = await Promise.all([
        getMenuCategories(restaurantData.id),
        getMenuItems(restaurantData.id),
        getRestaurantStats(restaurantData.id),
      ]);

      setCategories(categoriesData);
      setMenuItems(menuItemsData as any);
      setStats(statsData);
    } catch (err: any) {
      console.error('Error loading restaurant data:', err);
      setError(err.message || 'Failed to load restaurant data');
    } finally {
      setLoading(false);
    }
  };

  const refreshRestaurant = async () => {
    if (user) {
      const restaurantData = await getRestaurantByUserId(user.id);
      setRestaurant(restaurantData);
    }
  };

  const refreshCategories = async () => {
    if (restaurant) {
      const categoriesData = await getMenuCategories(restaurant.id);
      setCategories(categoriesData);
    }
  };

  const refreshMenuItems = async () => {
    if (restaurant) {
      const menuItemsData = await getMenuItems(restaurant.id);
      setMenuItems(menuItemsData as any);
    }
  };

  const refreshStats = async () => {
    if (restaurant) {
      const statsData = await getRestaurantStats(restaurant.id);
      setStats(statsData);
    }
  };

  return {
    restaurant,
    categories,
    menuItems,
    stats,
    loading,
    error,
    refreshRestaurant,
    refreshCategories,
    refreshMenuItems,
    refreshStats,
    reload: loadRestaurantData,
  };
}
