import React, { useState } from 'react';
import { Users, TrendingUp, Mail, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface Follower {
  id: string;
  name: string;
  avatar_url?: string;
  followed_at: string;
  reviews_count: number;
  photos_count: number;
  last_visit?: string;
}

export function RestaurantFollowers() {
  const [followers] = useState<Follower[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b932c5af?w=100&h=100&fit=crop',
      followed_at: '2024-01-01',
      reviews_count: 5,
      photos_count: 12,
      last_visit: '2024-01-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      followed_at: '2024-01-05',
      reviews_count: 3,
      photos_count: 8,
      last_visit: '2024-01-14'
    },
    {
      id: '3',
      name: 'Emma Davis',
      followed_at: '2024-01-10',
      reviews_count: 2,
      photos_count: 5
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'recent' | 'active'>('all');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const stats = {
    total: followers.length,
    newThisMonth: followers.filter(f =>
      new Date(f.followed_at).getMonth() === new Date().getMonth()
    ).length,
    avgEngagement: Math.round(
      followers.reduce((sum, f) => sum + f.reviews_count + f.photos_count, 0) / followers.length
    )
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Followers</h1>
        <p className="text-gray-600 mt-2">Track and engage with your restaurant followers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-1">Total Followers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-1 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              New This Month
            </p>
            <p className="text-2xl font-bold text-green-600">+{stats.newThisMonth}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-1">Avg Engagement</p>
            <p className="text-2xl font-bold text-orange-600">{stats.avgEngagement}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All Followers
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'recent'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Most Active
          </button>
        </div>

        <Button variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Send Update
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {followers.map((follower) => (
          <Card key={follower.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                {follower.avatar_url ? (
                  <img
                    src={follower.avatar_url}
                    alt={follower.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-xl">
                      {follower.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{follower.name}</h3>
                  <p className="text-sm text-gray-600">
                    Following since {formatDate(follower.followed_at)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{follower.reviews_count}</p>
                  <p className="text-xs text-gray-600">Reviews</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{follower.photos_count}</p>
                  <p className="text-xs text-gray-600">Photos</p>
                </div>
              </div>

              {follower.last_visit && (
                <p className="text-xs text-gray-500 mb-3">
                  Last visit: {formatDate(follower.last_visit)}
                </p>
              )}

              <Button variant="outline" size="sm" className="w-full">
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
