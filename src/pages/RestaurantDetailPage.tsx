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
  Utensils,
  Leaf,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import mockData from '../data/mockData';

type Restaurant = typeof mockData.restaurants[0];
type MenuItem = typeof mockData.menuItems[0];
type MenuCategory = typeof mockData.menuCategories[0];
type Review = typeof mockData.reviews[0];

export function RestaurantDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'about'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchRestaurantData(slug);
    }
  }, [slug]);

  const fetchRestaurantData = (slug: string) => {
    setTimeout(() => {
      const foundRestaurant = mockData.restaurants.find(r => r.slug === slug);
      
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        
        const restaurantMenuItems = mockData.menuItems.filter(
          item => item.restaurant_id === foundRestaurant.id
        );
        setMenuItems(restaurantMenuItems);
        
        const restaurantCategories = mockData.menuCategories.filter(
          cat => cat.restaurant_id === foundRestaurant.id
        );
        setCategories(restaurantCategories);
        
        const restaurantReviews = mockData.reviews.filter(
          review => review.restaurant_id === foundRestaurant.id
        );
        setReviews(restaurantReviews);
      }
      
      setLoading(false);
    }, 500);
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
              i < priceRange.length ? 'opacity-100' : 'opacity-20'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderDietaryTags = (tags: string[] | null) => {
    if (!tags || tags.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
          >
            <Leaf className="h-3 w-3 mr-1" />
            {tag.replace('_', ' ')}
          </span>
        ))}
      </div>
    );
  };

  const renderAllergens = (allergens: string[] | null) => {
    if (!allergens || allergens.length === 0) return null;
    return (
      <div className="flex items-start mt-2 text-sm text-red-600">
        <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
        <span>
          <strong>Allergens:</strong> {allergens.join(', ')}
        </span>
      </div>
    );
  };

  const filteredCategories = selectedCategory
    ? categories.filter((cat) => cat.id === selectedCategory)
    : categories;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant not found</h2>
          <Link to="/restaurants">
            <Button>Back to Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={restaurant.cover_photo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Link to="/restaurants">
            <Button variant="secondary" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                {restaurant.logo_url && (
                  <img
                    src={restaurant.logo_url}
                    alt={`${restaurant.name} logo`}
                    className="w-20 h-20 rounded-lg object-cover border-2 border-white shadow-lg"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
                  <div className="flex items-center space-x-4">
                    {renderStars(restaurant.rating || 0)}
                    <span className="text-gray-600">
                      ({restaurant.review_count} reviews)
                    </span>
                    {renderPriceRange(restaurant.price_range)}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-1" />
                  Follow
                </Button>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{restaurant.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {restaurant.address && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{restaurant.address}</span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <a href={`tel:${restaurant.phone}`} className="text-orange-600 hover:underline">
                    {restaurant.phone}
                  </a>
                </div>
              )}
              {restaurant.website && (
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-2" />
                   <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              {restaurant.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <a href={`mailto:${restaurant.email}`} className="text-orange-600 hover:underline">
                    {restaurant.email}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Utensils className="h-4 w-4 mr-1" />
                {restaurant.cuisine_type}
              </span>
              {restaurant.dining_style && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {restaurant.dining_style.replace('_', ' ')}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('menu')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'menu'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'about'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                About
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {activeTab === 'menu' && (
            <div className="space-y-8">
              {/* Category Filter */}
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === null
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Menu Items by Category */}
              {filteredCategories.map((category) => {
                const categoryItems = menuItems.filter(
                  (item) => item.category_id === category.id && item.is_available
                );

                if (categoryItems.length === 0) return null;

                return (
                  <div key={category.id}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h2>
                    {category.description && (
                      <p className="text-gray-600 mb-4">{category.description}</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryItems.map((item) => (
                        <Card key={item.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                {renderDietaryTags(item.dietary_tags)}
                                {renderAllergens(item.allergens)}
                              </div>
                              {item.image_url && (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-24 h-24 rounded-lg object-cover ml-4"
                                />
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-lg font-bold text-green-600">
                                {item.price.toFixed(2)} PLN
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => {
                  const reviewer = mockData.profiles.find(p => p.id === review.user_id);
                  return (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <img
                            src={reviewer?.avatar_url || 'https://via.placeholder.com/50'}
                            alt={reviewer?.full_name || 'User'}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-semibold text-gray-900">{reviewer?.full_name || 'Anonymous'}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              {renderStars(review.rating)}
                            </div>
                            {review.comment && (
                              <p className="text-gray-700">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {restaurant.name}</h2>
                <p className="text-gray-700 mb-6">{restaurant.description}</p>
                
                {restaurant.opening_hours && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Opening Hours</h3>
                    <div className="space-y-2">
                      {Object.entries(restaurant.opening_hours as Record<string, string>).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700 capitalize">{day}</span>
                          <span className="text-gray-600">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}