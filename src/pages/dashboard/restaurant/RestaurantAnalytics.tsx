import React from 'react';
import { TrendingUp, Users, Eye, Star, MessageCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';

export function RestaurantAnalytics() {
  const stats = {
    totalViews: 12450,
    viewsGrowth: 15.3,
    totalFollowers: 234,
    followersGrowth: 8.2,
    avgRating: 4.8,
    ratingChange: 0.2,
    totalReviews: 89,
    reviewsGrowth: 12.5
  };

  const recentActivity = [
    { date: '2024-01-20', views: 450, followers: 12, reviews: 5 },
    { date: '2024-01-19', views: 420, followers: 8, reviews: 3 },
    { date: '2024-01-18', views: 380, followers: 15, reviews: 7 },
    { date: '2024-01-17', views: 410, followers: 6, reviews: 4 },
    { date: '2024-01-16', views: 390, followers: 10, reviews: 6 }
  ];

  const topMenuItems = [
    { name: 'Truffle Risotto', views: 850, orders: 145 },
    { name: 'Margherita Pizza', views: 720, orders: 128 },
    { name: 'Tiramisu', views: 680, orders: 112 }
  ];

  const peakHours = [
    { hour: '18:00', visits: 45 },
    { hour: '19:00', visits: 62 },
    { hour: '20:00', visits: 58 },
    { hour: '21:00', visits: 38 }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your restaurant's performance and growth</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{stats.viewsGrowth}% this month
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Followers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalFollowers}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{stats.followersGrowth}% this month
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900">{stats.avgRating}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{stats.ratingChange} this month
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-full">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReviews}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{stats.reviewsGrowth}% this month
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-full">
                <MessageCircle className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <span className="text-gray-600">{day.views} views</span>
                    <span className="text-green-600">+{day.followers} followers</span>
                    <span className="text-blue-600">{day.reviews} reviews</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Peak Hours</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {peakHours.map((hour, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 w-16">{hour.hour}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-8">
                    <div
                      className="bg-orange-500 h-8 rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${(hour.visits / 62) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-white">{hour.visits}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Top Menu Items</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topMenuItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.views} views • {item.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Conversion</p>
                  <p className="text-lg font-bold text-orange-600">
                    {((item.orders / item.views) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
