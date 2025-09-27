import React, { useEffect, useState } from 'react';
import { ListRestart as Restaurant, Menu, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
// SUPABASE: Temporarily commented out
// import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    menuItems: 0,
    restaurant: null,
    views: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      /* SUPABASE BLOCK START - Temporarily commented out
      const [restaurantData, menuData] = await Promise.all([
        supabase
          .from('restaurants')
          .select('*')
          .eq('user_id', user?.id)
          .single(),
        supabase
          .from('menu_items')
          .select('id')
          .eq('restaurant_id', (await supabase
            .from('restaurants')
            .select('id')
            .eq('user_id', user?.id)
            .single()).data?.id),
      ]);

      setStats({
        menuItems: menuData.data?.length || 0,
        restaurant: restaurantData.data,
        views: Math.floor(Math.random() * 1000) + 100,
        orders: Math.floor(Math.random() * 50) + 10,
      });
      SUPABASE BLOCK END */
      
      // TEMPORARY: Mock dashboard data
      setStats({
        menuItems: 12,
        restaurant: null, // Simulate no restaurant setup
        views: Math.floor(Math.random() * 1000) + 100,
        orders: Math.floor(Math.random() * 50) + 10,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your restaurant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Restaurant className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Restaurant Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.restaurant ? 'Active' : 'Setup Required'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Menu className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Menu Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.menuItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.views}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!stats.restaurant && (
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <h3 className="text-lg font-semibold text-orange-800">
              Complete Your Restaurant Setup
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-4">
              Get started by setting up your restaurant profile and adding your first menu items.
            </p>
            <div className="flex space-x-4">
              <a
                href="/dashboard/profile"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Setup Restaurant Profile
              </a>
              <a
                href="/dashboard/menu/add"
                className="bg-white text-orange-500 border border-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Add Menu Items
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/dashboard/menu/add"
              className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <Menu className="h-8 w-8 text-blue-500 mb-2" />
              <h4 className="font-semibold text-gray-900">Add Menu Item</h4>
              <p className="text-sm text-gray-600">Add a new dish to your menu</p>
            </a>
            <a
              href="/dashboard/profile"
              className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <Restaurant className="h-8 w-8 text-green-500 mb-2" />
              <h4 className="font-semibold text-gray-900">Edit Profile</h4>
              <p className="text-sm text-gray-600">Update restaurant information</p>
            </a>
            <a
              href="/dashboard/analytics"
              className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
              <h4 className="font-semibold text-gray-900">View Analytics</h4>
              <p className="text-sm text-gray-600">Check performance metrics</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}