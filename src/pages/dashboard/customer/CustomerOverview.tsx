import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  MessageSquare, 
  Camera, 
  Star,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';

export function CustomerOverview() {
  const { user } = useAuth();

  // Mock data - will be replaced with API calls
  const stats = {
    reviews: 12,
    following: 8,
    favorites: 15,
    photos: 24
  };

  const recentActivity = [
    {
      id: '1',
      type: 'review',
      restaurant: 'Bella Vista Italian',
      restaurantId: '1',
      action: 'Added a review',
      rating: 5,
      time: '2 hours ago',
      icon: MessageSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: '2',
      type: 'favorite',
      restaurant: 'Sakura Sushi Bar',
      restaurantId: '2',
      action: 'Added to favorites',
      time: '5 hours ago',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      id: '3',
      type: 'follow',
      restaurant: 'The Grill House',
      restaurantId: '3',
      action: 'Started following',
      time: '1 day ago',
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: '4',
      type: 'photo',
      restaurant: 'Spice Route',
      restaurantId: '4',
      action: 'Added a photo',
      time: '2 days ago',
      icon: Camera,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const followedRestaurantsFeed = [
    {
      id: '1',
      restaurant: 'Bella Vista Italian',
      restaurantId: '1',
      type: 'promotion',
      title: 'New Weekend Promotion!',
      description: '20% off all pasta dishes this weekend',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '3 hours ago'
    },
    {
      id: '2',
      restaurant: 'Sakura Sushi Bar',
      restaurantId: '2',
      type: 'menu',
      title: 'New Menu Items',
      description: 'Check out our new spring-inspired sushi rolls',
      image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '1 day ago'
    },
    {
      id: '3',
      restaurant: 'The Grill House',
      restaurantId: '3',
      type: 'event',
      title: 'Special Event',
      description: 'Wine and steak evening - reservations now open',
      image: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '2 days ago'
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {user?.name || user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-gray-600">
          Here's an overview of your culinary journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Your Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{stats.reviews}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3 this month
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Link to="/dashboard/customer/following">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Following</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.following}</p>
                  <p className="text-xs text-green-600 mt-2 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2 this week
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-full">
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/customer/favorites">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Favorites</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.favorites}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    5 themed lists
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded-full">
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Your Photos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.photos}</p>
                <p className="text-xs text-gray-500 mt-2">
                  At 8 restaurants
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-full">
                <Camera className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <Link
                  to="/dashboard/customer/activities"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`${activity.bgColor} p-2 rounded-full`}>
                        <Icon className={`h-5 w-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          {activity.rating && (
                            <div className="flex items-center">
                              {[...Array(activity.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          )}
                        </div>
                        <Link 
                          to={`/restaurant/${activity.restaurantId}`}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {activity.restaurant}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Followed Restaurants Feed */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">News</h2>
              <p className="text-sm text-gray-600">From restaurants you follow</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {followedRestaurantsFeed.map((item) => (
                  <Link 
                    key={item.id} 
                    to={`/restaurant/${item.restaurantId}`}
                    className="block"
                  >
                    <div className="group rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <p className="text-xs text-gray-600 font-medium">
                            {item.restaurant}
                          </p>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center group"
              >
                <MapPin className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900 group-hover:text-blue-600">
                  Discover Restaurants
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Find new places
                </p>
              </Link>

              <Link 
                to="/dashboard/customer/favorites"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all text-center group"
              >
                <Heart className="h-8 w-8 text-gray-400 group-hover:text-red-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900 group-hover:text-red-600">
                  Manage Favorites
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Your restaurant lists
                </p>
              </Link>

              <Link 
                to="/dashboard/customer/profile"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center group"
              >
                <Users className="h-8 w-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900 group-hover:text-green-600">
                  Edit Profile
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Your preferences
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}