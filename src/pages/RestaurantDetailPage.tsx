import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Mail, 
  Star, 
  DollarSign, 
  Clock,
  ChevronLeft,
  Users,
  Heart,
  Loader2,
  Utensils
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  getRestaurantBySlug,
  getRestaurantMenu,
  getMenuCategories,
  getRestaurantReviews,
  Restaurant,
  MenuItem,
  MenuCategory,
  Review
} from '../services/restaurantService';

export function RestaurantDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'about'>('menu');

  useEffect(() => {
    if (slug) {
      fetchRestaurantData(slug);
    }
  }, [slug]);

  const fetchRestaurantData = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: restaurantData, error: restaurantError } = await getRestaurantBySlug(slug);
      
      if (restaurantError || !restaurantData) {
        setError('Restaurant not found');
        setLoading(false);
        return;
      }

      setRestaurant(restaurantData);
      
      // Fetch related data in parallel
      const [menuData, categoriesData, reviewsData] = await Promise.all([
        getRestaurantMenu(restaurantData.id),
        getMenuCategories(restaurantData.id),
        getRestaurantReviews(restaurantData.id)
      ]);

      if (menuData.data) setMenuItems(menuData.data);
      if (categoriesData.data) setCategories(categoriesData.data);
      if (reviewsData.data) setReviews(reviewsData.data);
    } catch (err: any) {
      console.error('Error fetching restaurant data:', err);
      setError(err.message || 'Failed to load restaurant');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : i < rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-semibold text-gray-700">{rating.toFixed(1)}</span>
        <span className="ml-2 text-gray-500">({restaurant?.review_count || 0} reviews)</span>
      </div>
    );
  };

  const renderPriceRange = (priceRange: string | null) => {
    if (!priceRange) return null;
    return (
      <div className="flex items-center text-green-600">
        {[...Array(4)].map((_, i) => (
          <DollarSign
            key={i}
            className={`h-5 w-5 ${
              i < priceRange.length ? 'opacity-100' : 'opacity-30'
            }`}
          />
        ))}
      </div>
    );
  };

  const groupMenuByCategory = () => {
    const grouped: Record<string, MenuItem[]> = {};
    
    categories.forEach(category => {
      grouped[category.name] = menuItems.filter(
        item => item.category_id === category.id
      );
    });

    return grouped;
  };

  const renderSmallStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-xl mb-8"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-300 rounded-xl"></div>
              </div>
              <div className="h-64 bg-gray-300 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <div className="mb-4">
              <Utensils className="h-16 w-16 text-gray-400 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Restaurant not found'}
            </h2>
            <p className="text-gray-600 mb-6">
              The restaurant you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/">
              <Button>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const menuByCategory = groupMenuByCategory();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Restaurants
          </Link>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="relative h-96 bg-gradient-to-r from-orange-400 to-orange-600">
        {restaurant.cover_photo_url ? (
          <img
            src={restaurant.cover_photo_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Utensils className="h-32 w-32 text-white opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Restaurant Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="relative -mt-20 mb-8 shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-xl shadow-lg overflow-hidden border-4 border-white">
                  {restaurant.logo_url ? (
                    <img
                      src={restaurant.logo_url}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Utensils className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      {restaurant.name}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        {restaurant.cuisine_type}
                      </span>
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        {restaurant.dining_style}
                      </span>
                      {restaurant.price_range && (
                        <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                          {restaurant.price_range}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>

                {renderStars(restaurant.rating)}

                {restaurant.description && (
                  <p className="text-gray-600 mt-4 text-lg leading-relaxed">
                    {restaurant.description}
                  </p>
                )}

                {/* Dietary Options */}
                {restaurant.dietary_options && restaurant.dietary_options.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {restaurant.dietary_options.map(option => (
                      <span
                        key={option}
                        className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium"
                      >
                        {option.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Menu & Reviews */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'menu'
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'about'
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                About
              </button>
            </div>

            {/* Menu Tab */}
            {activeTab === 'menu' && (
              <div className="space-y-8">
                {menuItems.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Utensils className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No menu items available yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  Object.entries(menuByCategory).map(([categoryName, items]) => (
                    items.length > 0 && (
                      <div key={categoryName}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{categoryName}</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {items.map(item => (
                            <Card key={item.id} className="hover:shadow-lg transition-shadow">
                              <CardContent className="p-6">
                                <div className="flex gap-4">
                                  {item.image_url && (
                                    <img
                                      src={item.image_url}
                                      alt={item.name}
                                      className="w-28 h-28 object-cover rounded-lg flex-shrink-0"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                                      <span className="text-xl font-bold text-orange-600 ml-4">
                                        ${item.price.toFixed(2)}
                                      </span>
                                    </div>
                                    {item.description && (
                                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                                    )}
                                    
                                    {/* Dietary Tags */}
                                    {item.dietary_tags && item.dietary_tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mb-2">
                                        {item.dietary_tags.map(tag => (
                                          <span
                                            key={tag}
                                            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium"
                                          >
                                            {tag.replace('_', ' ')}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    
                                    {/* Allergens */}
                                    {item.allergens && item.allergens.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {item.allergens.map(allergen => (
                                          <span
                                            key={allergen}
                                            className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
                                          >
                                            Contains: {allergen}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  ))
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-2">No reviews yet</p>
                      <p className="text-gray-400">Be the first to review this restaurant!</p>
                    </CardContent>
                  </Card>
                ) : (
                  reviews.map(review => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={review.user?.avatar_url || `https://ui-avatars.com/api/?name=${review.user?.username || 'User'}&background=f97316&color=fff`}
                            alt={review.user?.username || 'User'}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {review.user?.username || 'Anonymous'}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            {renderSmallStars(review.rating)}
                            {review.comment && (
                              <p className="text-gray-700 mt-3 leading-relaxed">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">About {restaurant.name}</h3>
                  {restaurant.description && (
                    <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                      {restaurant.description}
                    </p>
                  )}
                  
                  {restaurant.opening_hours && Object.keys(restaurant.opening_hours).length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-lg">
                        <Clock className="h-5 w-5 mr-2 text-orange-500" />
                        Opening Hours
                      </h4>
                      <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                        {Object.entries(restaurant.opening_hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between text-gray-700">
                            <span className="capitalize font-medium">{day}:</span>
                            <span>{hours as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Contact Info & Map */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{restaurant.location}</p>
                    {restaurant.address && (
                      <p className="text-sm text-gray-600">{restaurant.address}</p>
                    )}
                  </div>
                </div>

                {restaurant.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <a 
                      href={`tel:${restaurant.phone}`} 
                      className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      {restaurant.phone}
                    </a>
                  </div>
                )}

                {restaurant.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <a 
                      href={`mailto:${restaurant.email}`} 
                      className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      {restaurant.email}
                    </a>
                  </div>
                )}

                {restaurant.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            {restaurant.latitude && restaurant.longitude && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex flex-col items-center justify-center p-4">
                    <MapPin className="h-12 w-12 text-orange-500 mb-3" />
                    <p className="text-gray-700 font-medium text-center mb-2">
                      {restaurant.location}
                    </p>
                    <p className="text-sm text-gray-600 text-center">
                      Coordinates: {restaurant.latitude.toFixed(6)}, {restaurant.longitude.toFixed(6)}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-orange-600 hover:text-orange-700 font-medium hover:underline"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </CardContent>        
      </Card>
            )}

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Restaurant Stats</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Star className="h-6 w-6 text-yellow-500" />
                    <span className="text-gray-700 font-medium">Average Rating</span>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">
                    {restaurant.rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-blue-500" />
                    <span className="text-gray-700 font-medium">Total Reviews</span>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">
                    {restaurant.review_count}
                  </span>
                </div>
                {menuItems.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Utensils className="h-6 w-6 text-green-500" />
                      <span className="text-gray-700 font-medium">Menu Items</span>
                    </div>
                    <span className="font-bold text-gray-900 text-lg">
                      {menuItems.length}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}