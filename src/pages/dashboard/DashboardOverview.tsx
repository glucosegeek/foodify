import React from 'react';
import { Link } from 'react-router-dom';
import { ListRestart as Restaurant, Menu, Users, TrendingUp, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useRestaurant } from '../../hooks/useRestaurant';
import { Loader2 } from 'lucide-react';

export function DashboardOverview() {
  const { restaurant, stats, loading } = useRestaurant();

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          {restaurant
            ? `Welcome back! Here's what's happening with ${restaurant.name}.`
            : 'Welcome! Set up your restaurant to get started.'}
        </p>
      </div>

      {!restaurant ? (
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
            <Link to="/dashboard/profile">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Restaurant Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Restaurant className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Rating</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
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
                    <p className="text-2xl font-bold text-gray-900">{stats.menuItemCount}</p>
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
                    <p className="text-sm font-medium text-gray-600">Followers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.followerCount}</p>
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
                    <p className="text-sm font-medium text-gray-600">Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.reviewCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/dashboard/menu/add"
                  className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <Menu className="h-8 w-8 text-blue-500 mb-2" />
                  <h4 className="font-semibold text-gray-900">Add Menu Item</h4>
                  <p className="text-sm text-gray-600">Add a new dish to your menu</p>
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <Restaurant className="h-8 w-8 text-green-500 mb-2" />
                  <h4 className="font-semibold text-gray-900">Edit Profile</h4>
                  <p className="text-sm text-gray-600">Update restaurant information</p>
                </Link>
                <Link
                  to="/dashboard/menu"
                  className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
                  <h4 className="font-semibold text-gray-900">Manage Menu</h4>
                  <p className="text-sm text-gray-600">View and organize your menu</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}