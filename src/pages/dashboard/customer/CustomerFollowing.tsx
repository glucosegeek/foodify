import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Star, Bell, BellOff, ExternalLink, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { mockFollowedRestaurants, FollowedRestaurant } from '../../../data/mockCustomerData';

export function CustomerFollowing() {
  const [followedRestaurants, setFollowedRestaurants] = useState<FollowedRestaurant[]>(mockFollowedRestaurants);
  const [filter, setFilter] = useState<'all' | 'new_posts'>('all');

  const handleUnfollow = (restaurantId: string) => {
    if (window.confirm('Are you sure you want to unfollow this restaurant?')) {
      setFollowedRestaurants(prev => prev.filter(r => r.id !== restaurantId));
    }
  };

  const filteredRestaurants = filter === 'new_posts'
    ? followedRestaurants.filter(r => r.new_posts_count > 0)
    : followedRestaurants;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'PROMOTION': return '🎉 Promotion';
      case 'EVENT': return '📅 Event';
      case 'MENU_UPDATE': return '🍽️ Menu Update';
      default: return 'Update';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Following</h1>
        <p className="text-gray-600 mt-2">Stay updated with your favorite restaurants</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All ({followedRestaurants.length})
          </button>
          <button
            onClick={() => setFilter('new_posts')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'new_posts'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            New Posts ({followedRestaurants.filter(r => r.new_posts_count > 0).length})
          </button>
        </div>

        <Link to="/">
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Discover More
          </Button>
        </Link>
      </div>

      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Link to={`/restaurant/${restaurant.id}`}>
                    {restaurant.logo_url ? (
                      <img
                        src={restaurant.logo_url}
                        alt={restaurant.name}
                        className="w-16 h-16 rounded-lg object-cover hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link to={`/restaurant/${restaurant.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                            {restaurant.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600">{restaurant.cuisine_type}</p>
                      </div>
                      {restaurant.new_posts_count > 0 && (
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                          {restaurant.new_posts_count} new
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mb-3">
                      Following since {formatDate(restaurant.followed_at)}
                    </p>

                    {restaurant.latest_post && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="flex items-start space-x-2">
                          {restaurant.latest_post.image_url && (
                            <img
                              src={restaurant.latest_post.image_url}
                              alt={restaurant.latest_post.title}
                              className="w-16 h-16 rounded object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-gray-600">
                                {getPostTypeLabel(restaurant.latest_post.type)}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {formatDate(restaurant.latest_post.created_at)}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              {restaurant.latest_post.title}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {restaurant.latest_post.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Link to={`/restaurant/${restaurant.id}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Profile
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnfollow(restaurant.id)}
                      >
                        Unfollow
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'new_posts' ? 'No New Posts' : 'No Restaurants Yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'new_posts'
                ? 'Check back later for updates from restaurants you follow.'
                : 'Start following restaurants to see their latest updates and promotions here.'}
            </p>
            <Link to="/">
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Discover Restaurants
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
