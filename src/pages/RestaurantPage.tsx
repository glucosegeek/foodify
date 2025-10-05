import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Star, MapPin, DollarSign, Loader2, Search } from 'lucide-react';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

export function RestaurantPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState<string>('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;

      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

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
              i < priceRange.length ? 'opacity-100' : 'opacity-30'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Restaurants</h1>
          <p className="text-gray-600 mt-2">
            Discover amazing restaurants in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
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

        {/* Restaurant Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No restaurants found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.slug}`}
                className="block"
              >
                <Card hover className="h-full">
                  <div className="relative">
                    <img
                      src={
                        restaurant.cover_photo_url ||
                        restaurant.logo_url ||
                        'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=600'
                      }
                      alt={restaurant.name}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg px-2 py-1">
                      {renderStars(restaurant.rating)}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                        {restaurant.name}
                      </h3>
                      <div className="flex flex-col items-end space-y-1">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {restaurant.cuisine_type}
                        </span>
                        {renderPriceRange(restaurant.price_range)}
                      </div>
                    </div>

                    {restaurant.description && (
                      <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                        {restaurant.description}
                      </p>
                    )}

                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{restaurant.location}</span>
                    </div>

                    {restaurant.dietary_options &&
                      restaurant.dietary_options.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex flex-wrap gap-1">
                            {restaurant.dietary_options.slice(0, 3).map((option) => (
                              <span
                                key={option}
                                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                              >
                                {option.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}