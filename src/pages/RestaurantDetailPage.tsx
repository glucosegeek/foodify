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
  Heart
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
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'about'>('menu');

  useEffect(() => {
    if (slug) {
      fetchRestaurantData(slug);
    }
  }, [slug]);

  const fetchRestaurantData = async (slug: string) => {
    try {
      setLoading(true);
      
      const { data: restaurantData } = await getRestaurantBySlug(slug);
      if (restaurantData) {
        setRestaurant(restaurantData);
        
        // Fetch related data
        const [menuData, categoriesData, reviewsData] = await Promise.all([
          getRestaurantMenu(restaurantData.id),
          getMenuCategories(restaurantData.id),
          getRestaurantReviews(restaurantData.id)
        ]);

        if (menuData.data) setMenuItems(menuData.data);
        if (categoriesData.data) setCategories(categoriesData.data);
        if (reviewsData.data) setReviews(reviewsData.data);
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
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

  const renderPriceRange = (priceRange: string) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-xl mb-8"></div>
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

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Restaurant not found</h2>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const menuByCategory = groupMenuByCategory();

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-6xl font-bold text-white opacity-20">{restaurant.name}</h1>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <Link to="/">
            <Button variant="secondary" className="flex items-center space-x-2">
              <ChevronLeft className="h-5 w-5" />
              <span>Back</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Restaurant Header Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  src={restaurant.logo_url || 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={restaurant.name}
                  className="w-32 h-32 rounded-xl object-cover shadow-lg border-4 border-white"
                />
              </div>

              {/* Restaurant Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {restaurant.cuisine_type}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {restaurant.dining_style}
                      </span>
                      {renderPriceRange(restaurant.price_range)}
                    </div>
                  </div>
                  
                  <Button className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Follow</span>
                  </Button>
                </div>

                {renderStars(restaurant.rating)}

                <p className="text-gray-600 mt-4 text-lg">{restaurant.description}</p>

                {/* Dietary Options */}
                {restaurant.dietary_options && restaurant.dietary_options.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {restaurant.dietary_options.map(option => (
                      <span
                        key={option}
                        className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full"
                      >
                        {option}
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
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'menu'
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-6 py-3 font-semibold ${
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
                {Object.entries(menuByCategory).map(([categoryName, items]) => (
                  <div key={categoryName}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{categoryName}</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {items.map(item => (
                        <Card key={item.id} hover>
                          <CardContent className="p-6">
                            <div className="flex gap-4">
                              {item.image_url && (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                                  <span className="text-lg font-bold text-orange-600">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                                
                                {/* Dietary Tags */}
                                {item.dietary_tags && item.dietary_tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {item.dietary_tags.map(tag => (
                                      <span
                                        key={tag}
                                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Allergens */}
                                {item.allergens && item.allergens.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
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
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={review.user?.avatar_url || 'https://via.placeholder.com/48'}
                            alt={review.user?.username}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {review.user?.username || 'Anonymous'}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
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
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About {restaurant.name}</h3>
                  <p className="text-gray-700 mb-6">{restaurant.description}</p>
                  
                  {restaurant.opening_hours && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Opening Hours
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(restaurant.opening_hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between text-gray-600">
                            <span className="capitalize font-medium">{day}:</span>
                            <span>{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{restaurant.location}</p>
                    <p className="text-sm text-gray-600">{restaurant.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <a href={`tel:${restaurant.phone}`} className="text-blue-600 hover:underline">
                    {restaurant.phone}
                  </a>
                </div>

                {restaurant.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${restaurant.email}`} className="text-blue-600 hover:underline">
                      {restaurant.email}
                    </a>
                  </div>
                )}

                {restaurant.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Map placeholder */}
            {restaurant.latitude && restaurant.longitude && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">
                      Map: {restaurant.latitude}, {restaurant.longitude}
                    </p>
                    {/* You can integrate Google Maps or Mapbox here */}
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-gray-600">Rating</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {restaurant.rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600">Reviews</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {restaurant.review_count}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}