import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Star, MapPin, DollarSign, Search } from 'lucide-react';
import mockData from '../data/mockData';

type Restaurant = typeof mockData.restaurants[0];

export function RestaurantPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState<string>('');

  useEffect(() => {
    // Symulacja ładowania z API
    setTimeout(() => {
      setRestaurants(mockData.restaurants);
      setLoading(false);
    }, 500);
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      searchTerm === '' ||
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (restaurant.location &&
        restaurant.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCuisine =
      cuisineFilter === '' || restaurant.cuisine_type === cuisineFilter;

    return matchesSearch && matchesCuisine;
  });

  const cuisineTypes = Array.from(
    new Set(restaurants.map((r) => r.cuisine_type))
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : i < rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-600">{rating}</span>
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
            className={`h-4 w-4 ${
              i < priceRange.length ? 'opacity-100' : 'opacity-20'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Restaurants</h1>
          <p className="text-gray-600">Find your next favorite dining spot</p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Cuisine Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCuisineFilter('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                cuisineFilter === ''
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Cuisines
            </button>
            {cuisineTypes.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setCuisineFilter(cuisine)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  cuisineFilter === cuisine
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'} found
          </p>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Link key={restaurant.id} to={`/restaurant/${restaurant.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={restaurant.cover_photo_url || restaurant.logo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                    {restaurant.is_featured && (
                      <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {restaurant.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {renderStars(restaurant.rating || 0)}
                      <span className="text-xs text-gray-500">
                        ({restaurant.review_count} reviews)
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {restaurant.location}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {restaurant.cuisine_type}
                      </span>
                      {renderPriceRange(restaurant.price_range)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No restaurants found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setCuisineFilter('');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}