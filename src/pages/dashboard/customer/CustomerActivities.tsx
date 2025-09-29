import React, { useState } from 'react';
import { Star, Camera, Heart, UserPlus, Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { mockCustomerActivities, CustomerActivity } from '../../../data/mockCustomerData';

export function CustomerActivities() {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [activities] = useState<CustomerActivity[]>(mockCustomerActivities);

  const filters = [
    { id: 'ALL', label: 'All Activities', count: activities.length },
    { id: 'REVIEW', label: 'Reviews', count: activities.filter(a => a.type === 'REVIEW').length },
    { id: 'PHOTO', label: 'Photos', count: activities.filter(a => a.type === 'PHOTO').length },
    { id: 'FAVORITE', label: 'Favorites', count: activities.filter(a => a.type === 'FAVORITE').length },
    { id: 'FOLLOW', label: 'Follows', count: activities.filter(a => a.type === 'FOLLOW').length },
  ];

  const filteredActivities = selectedFilter === 'ALL' 
    ? activities 
    : activities.filter(activity => activity.type === selectedFilter);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'REVIEW':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'PHOTO':
        return <Camera className="h-5 w-5 text-blue-500" />;
      case 'FAVORITE':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'FOLLOW':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityTitle = (activity: CustomerActivity) => {
    switch (activity.type) {
      case 'REVIEW':
        return `Reviewed ${activity.restaurant_name}`;
      case 'PHOTO':
        return `Added photo to ${activity.restaurant_name}`;
      case 'FAVORITE':
        return `Added ${activity.restaurant_name} to favorites`;
      case 'FOLLOW':
        return `Started following ${activity.restaurant_name}`;
      default:
        return 'Activity';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Activities</h1>
        <p className="text-gray-600 mt-2">Track your restaurant reviews, photos, and interactions</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedFilter === filter.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {filter.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {filter.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Restaurant Logo */}
                  <div className="flex-shrink-0">
                    {activity.restaurant_logo ? (
                      <img
                        src={activity.restaurant_logo}
                        alt={activity.restaurant_name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                    )}
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getActivityIcon(activity.type)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getActivityTitle(activity)}
                        </h3>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(activity.created_at)}
                      </span>
                    </div>

                    {/* Rating for reviews */}
                    {activity.type === 'REVIEW' && activity.rating && (
                      <div className="flex items-center space-x-2 mb-2">
                        {renderStars(activity.rating)}
                        <span className="text-sm font-medium text-gray-700">
                          {activity.rating}/5 stars
                        </span>
                      </div>
                    )}

                    {/* Comment for reviews */}
                    {activity.comment && (
                      <p className="text-gray-700 mb-3">{activity.comment}</p>
                    )}

                    {/* Photos */}
                    {activity.photos && activity.photos.length > 0 && (
                      <div className="flex space-x-2 mb-3">
                        {activity.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </div>
                    )}

                    {/* Restaurant Link */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>at</span>
                        <button className="text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1">
                          <span>{activity.restaurant_name}</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>

                      {activity.type === 'REVIEW' && (
                        <Button variant="ghost" size="sm">
                          Edit Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                {getActivityIcon(selectedFilter === 'ALL' ? 'REVIEW' : selectedFilter)}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {selectedFilter.toLowerCase()} activities yet
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedFilter === 'ALL'
                  ? "Start exploring restaurants to see your activities here."
                  : `You haven't ${selectedFilter.toLowerCase()} any restaurants yet.`}
              </p>
              <Button>
                Explore Restaurants
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Load More Button */}
      {filteredActivities.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline">
            Load More Activities
          </Button>
        </div>
      )}
    </div>
  );
}