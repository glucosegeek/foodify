import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin, DollarSign, Filter, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  getRestaurants,
  getFilterOptions,
  Restaurant
} from '../../services/restaurantService';

interface FilterState {
  cuisine: string;
  priceRange: string;
  rating: string;
  location: string;
  dietary: string;
  diningStyle: string;
  searchTerm: string;
}

interface FilterOptions {
  cuisines: string[];
  locations: string[];
  priceRanges: string[];
  diningStyles: string[];
  dietaryOptions: string[];
}

export function FeaturedRestaurants() {
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    cuisines: [],
    locations: [],
    priceRanges: [],
    diningStyles: [],
    dietaryOptions: [],
  });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    cuisine: '',
    priceRange: '',
    rating: '',
    location: '',
    dietary: '',
    diningStyle: '',
    searchTerm: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allRestaurants, filters]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch featured restaurants and all restaurants in parallel
      const [featuredResult, allResult, options] = await Promise.all([
        getRestaurants({ featured: true }),
        getRestaurants(),
        getFilterOptions()
      ]);

      if (featuredResult.error) throw new Error('Failed to fetch featured restaurants');
      if (allResult.error) throw new Error('Failed to fetch restaurants');

      setFeaturedRestaurants(featuredResult.data || []);
      setAllRestaurants(allResult.data || []);
      setFilterOptions(options);
    } catch (err: any) {
      console.error('Error fetching restaurants:', err);
      setError(err.message || 'Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allRestaurants];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchLower) ||
        r.cuisine_type.toLowerCase().includes(searchLower) ||
        (r.description && r.description.toLowerCase().includes(searchLower)) ||
        r.location.toLowerCase().includes(searchLower)
      );
    }

    // Cuisine filter
    if (filters.cuisine) {
      filtered = filtered.filter(r => r.cuisine_type === filters.cuisine);
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(r => r.price_range === filters.priceRange);
    }

    // Rating filter
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(r => r.rating >= minRating);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(r => r.location === filters.location);
    }

    // Dietary options filter
    if (filters.dietary) {
      filtered = filtered.filter(r => 
        r.dietary_options?.includes(filters.dietary)
      );
    }

    // Dining style filter
    if (filters.diningStyle) {
      filtered = filtered.filter(r => r.dining_style === filters.diningStyle);
    }

    setFilteredRestaurants(filtered);
  };

  const clearFilters = () => {
    setFilters({
      cuisine: '',
      priceRange: '',
      rating: '',
      location: '',
      dietary: '',
      diningStyle: '',
      searchTerm: ''
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('featured-restaurants-scroll');
    if (!container) return;

    const scrollAmount = 320;
    const newPosition =
      direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(
            container.scrollWidth - container.clientWidth,
            scrollPosition + scrollAmount
          );

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
    setScrollPosition(newPosition);
  };

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
        <span className="ml-1 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
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
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
              <Button onClick={fetchInitialData} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* FEATURED RESTAURANTS SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Featured Restaurants
              </h2>
              <p className="text-lg text-gray-600">
                Discover our hand-picked selection of the finest dining experiences
              </p>
            </div>

            {featuredRestaurants.length > 3 && (
              <div className="hidden lg:flex space-x-2">
                <button
                  onClick={() => scroll('left')}
                  className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {featuredRestaurants.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500 text-lg">No featured restaurants available yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              <div
                id="featured-restaurants-scroll"
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {featuredRestaurants.map((restaurant) => (
                  <Link
                    key={restaurant.id}
                    to={`/restaurant/${restaurant.slug}`}
                    className="flex-none w-80 group"
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="relative h-48 overflow-hidden rounded-t-xl">
                        <img
                          src={restaurant.cover_photo_url || restaurant.logo_url || 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                          Featured
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
                          <p className="text-gray-600 mb-3 text-sm line-clamp-3">
                            {restaurant.description}
                          </p>
                        )}

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-500">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{restaurant.location}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            {renderStars(restaurant.rating)}
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {restaurant.dining_style}
                            </span>
                          </div>
                        </div>

                        {restaurant.dietary_options && restaurant.dietary_options.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex flex-wrap gap-1">
                              {restaurant.dietary_options.map(option => (
                                <span
                                  key={option}
                                  className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
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
            </div>
          )}
        </div>
      </section>

      {/* RESTAURANT SEARCH & DISCOVERY SECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Discover More Restaurants
            </h2>
            <p className="text-lg text-gray-600">
              Search and filter through our complete restaurant database
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* LEFT COLUMN - FILTERS */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Filter className="h-5 w-5 mr-2" />
                      Filters
                    </h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Search Bar */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Restaurants
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Name, cuisine, location..."
                          value={filters.searchTerm}
                          onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    {/* Cuisine Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cuisine Type
                      </label>
                      <select
                        value={filters.cuisine}
                        onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      >
                        <option value="">All Cuisines</option>
                        {filterOptions.cuisines.map(cuisine => (
                          <option key={cuisine} value={cuisine}>{cuisine}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                      </label>
                      <select
                        value={filters.priceRange}
                        onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      >
                        <option value="">All Prices</option>
                        {filterOptions.priceRanges.map(range => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Rating
                      </label>
                      <select
                        value={filters.rating}
                        onChange={(e) => setFilters({...filters, rating: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      >
                        <option value="">Any Rating</option>
                        <option value="4.5">4.5+ Stars</option>
                        <option value="4.0">4.0+ Stars</option>
                        <option value="3.5">3.5+ Stars</option>
                        <option value="3.0">3.0+ Stars</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <select
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      >
                        <option value="">All Locations</option>
                        {filterOptions.locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    {/* Dietary Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dietary Options
                      </label>
                      <select
                        value={filters.dietary}
                        onChange={(e) => setFilters({...filters, dietary: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      >
                        <option value="">All Options</option>
                        {filterOptions.dietaryOptions.map(option => (
                          <option key={option} value={option}>
                            {option.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dining Style */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dining Style
                      </label>
                      <select
                        value={filters.diningStyle}
                        onChange={(e) => setFilters({...filters, diningStyle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      >
                        <option value="">All Styles</option>
                        {filterOptions.diningStyles.map(style => (
                          <option key={style} value={style}>
                            {style.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN - SEARCH RESULTS */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{filteredRestaurants.length}</span> of <span className="font-semibold">{allRestaurants.length}</span> restaurants
                </p>
              </div>

              {filteredRestaurants.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500 text-lg mb-4">No restaurants match your filters</p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      to={`/restaurant/${restaurant.slug}`}
                      className="group"
                    >
                      <Card className="h-full hover:shadow-xl transition-all duration-300">
                        <div className="relative h-48 overflow-hidden rounded-t-xl">
                          <img
                            src={restaurant.cover_photo_url || restaurant.logo_url || 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={restaurant.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors hover:underline">
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

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-500">
                              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{restaurant.location}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              {renderStars(restaurant.rating)}
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                {restaurant.dining_style}
                              </span>
                            </div>
                          </div>

                          {restaurant.dietary_options && restaurant.dietary_options.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex flex-wrap gap-1">
                                {restaurant.dietary_options.slice(0, 3).map(option => (
                                  <span
                                    key={option}
                                    className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    {option.replace('_', ' ')}
                                  </span>
                                ))}
                                {restaurant.dietary_options.length > 3 && (
                                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                    +{restaurant.dietary_options.length - 3}
                                  </span>
                                )}
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
        </div>
      </section>
    </>
  );
}