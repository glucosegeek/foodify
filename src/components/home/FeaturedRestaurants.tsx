import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin, DollarSign, Filter, X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
// SUPABASE: Temporarily commented out
// import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine_type: string;
  location: string;
  logo_url: string;
  rating: number;
  price_range: string;
  standout_dish: string;
  phone: string;
  website: string;
  dietary_options: string[];
  dining_style: string;
}

interface FilterState {
  cuisine: string;
  priceRange: string;
  rating: string;
  location: string;
  dietary: string;
  diningStyle: string;
  searchTerm: string;
}

export function FeaturedRestaurants() {
  const [topRestaurants, setTopRestaurants] = useState<Restaurant[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    cuisine: '',
    priceRange: '',
    rating: '',
    location: '',
    dietary: '',
    diningStyle: '',
    searchTerm: ''
  });

  // Top 10 Featured Restaurants
  const featuredRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Bella Vista Italian',
      description: 'Authentic Italian cuisine with fresh ingredients sourced directly from Italy. Family-owned restaurant serving traditional recipes passed down through generations.',
      cuisine_type: 'Italian',
      location: 'Downtown',
      logo_url: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      price_range: '$$$',
      standout_dish: 'Truffle Risotto with Wild Mushrooms',
      phone: '(555) 123-4567',
      website: 'https://bellavista-italian.com',
      dietary_options: ['Vegetarian', 'Gluten-free'],
      dining_style: 'Fine dining'
    },
    {
      id: '2',
      name: 'Sakura Sushi Bar',
      description: 'Fresh sushi and Japanese delicacies prepared by master chef Takeshi. Experience authentic Edo-style sushi in an intimate setting.',
      cuisine_type: 'Japanese',
      location: 'Midtown',
      logo_url: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      price_range: '$$$$',
      standout_dish: 'Omakase Tasting Menu',
      phone: '(555) 234-5678',
      website: 'https://sakura-sushi.com',
      dietary_options: ['Gluten-free'],
      dining_style: 'Fine dining'
    },
    {
      id: '3',
      name: 'The Grill House',
      description: 'Premium steaks and grilled specialties featuring locally-sourced beef. Classic American steakhouse with modern flair and extensive wine selection.',
      cuisine_type: 'American',
      location: 'Uptown',
      logo_url: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      price_range: '$$$$',
      standout_dish: 'Dry-Aged Ribeye with Truffle Butter',
      phone: '(555) 345-6789',
      website: 'https://thegrillhouse.com',
      dietary_options: ['Gluten-free'],
      dining_style: 'Fine dining'
    },
    {
      id: '4',
      name: 'Spice Route',
      description: 'Exotic Indian flavors and aromatic spices in a vibrant atmosphere. Traditional tandoor cooking meets contemporary presentation.',
      cuisine_type: 'Indian',
      location: 'City Center',
      logo_url: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      price_range: '$$',
      standout_dish: 'Butter Chicken with Garlic Naan',
      phone: '(555) 456-7890',
      website: 'https://spiceroute-indian.com',
      dietary_options: ['Vegetarian', 'Vegan'],
      dining_style: 'Casual'
    },
    {
      id: '5',
      name: 'Le Petit Bistro',
      description: 'Classic French cuisine in an intimate setting with candlelit tables. Chef-driven menu featuring seasonal ingredients and traditional techniques.',
      cuisine_type: 'French',
      location: 'Old Town',
      logo_url: 'https://images.pexels.com/photos/1833336/pexels-photo-1833336.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      price_range: '$$$',
      standout_dish: 'Coq au Vin with Herb Potatoes',
      phone: '(555) 567-8901',
      website: 'https://lepetitbistro.com',
      dietary_options: ['Vegetarian'],
      dining_style: 'Fine dining'
    },
    {
      id: '6',
      name: 'Dragon Palace',
      description: 'Authentic Chinese cuisine with dim sum service and Peking duck carved tableside. Family recipes from Guangzhou province.',
      cuisine_type: 'Chinese',
      location: 'Chinatown',
      logo_url: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      price_range: '$$',
      standout_dish: 'Peking Duck with Pancakes',
      phone: '(555) 678-9012',
      website: 'https://dragonpalace-chinese.com',
      dietary_options: ['Vegetarian', 'Vegan'],
      dining_style: 'Casual'
    },
    {
      id: '7',
      name: 'Mediterranean Breeze',
      description: 'Fresh Mediterranean flavors with an emphasis on olive oil, herbs, and grilled seafood. Coastal dining experience in the heart of the city.',
      cuisine_type: 'Mediterranean',
      location: 'Harbor District',
      logo_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      price_range: '$$$',
      standout_dish: 'Grilled Branzino with Lemon Herbs',
      phone: '(555) 789-0123',
      website: 'https://mediterranean-breeze.com',
      dietary_options: ['Vegetarian', 'Vegan', 'Gluten-free'],
      dining_style: 'Casual'
    },
    {
      id: '8',
      name: 'Taco Libre',
      description: 'Vibrant Mexican street food with house-made tortillas and fresh salsas. Craft cocktails and extensive tequila selection.',
      cuisine_type: 'Mexican',
      location: 'Arts District',
      logo_url: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.4,
      price_range: '$',
      standout_dish: 'Carnitas Tacos with Pickled Onions',
      phone: '(555) 890-1234',
      website: 'https://tacolibre-mexican.com',
      dietary_options: ['Vegetarian', 'Vegan', 'Gluten-free'],
      dining_style: 'Fast-casual'
    },
    {
      id: '9',
      name: 'Bangkok Street',
      description: 'Authentic Thai street food with bold flavors and fresh herbs. Family-owned restaurant serving recipes from Bangkok\'s famous street vendors.',
      cuisine_type: 'Thai',
      location: 'University District',
      logo_url: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      price_range: '$$',
      standout_dish: 'Pad Thai with Jumbo Shrimp',
      phone: '(555) 901-2345',
      website: 'https://bangkokstreet-thai.com',
      dietary_options: ['Vegetarian', 'Vegan', 'Gluten-free'],
      dining_style: 'Casual'
    },
    {
      id: '10',
      name: 'The Burger Joint',
      description: 'Gourmet burgers made with grass-fed beef and artisanal buns. Creative toppings and hand-cut fries in a retro diner atmosphere.',
      cuisine_type: 'American',
      location: 'Westside',
      logo_url: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.3,
      price_range: '$$',
      standout_dish: 'Truffle Mushroom Burger',
      phone: '(555) 012-3456',
      website: 'https://burgerjoint.com',
      dietary_options: ['Vegetarian'],
      dining_style: 'Fast-casual'
    }
  ];

  // Extended restaurant database for search (includes featured + additional restaurants)
  const extendedRestaurantDatabase: Restaurant[] = [
    ...featuredRestaurants,
    // Additional restaurants for search functionality
    {
      id: '11',
      name: 'Nonna\'s Kitchen',
      description: 'Homestyle Italian comfort food in a cozy trattoria setting. Handmade pasta and wood-fired pizzas using traditional family recipes.',
      cuisine_type: 'Italian',
      location: 'Little Italy',
      logo_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      price_range: '$$',
      standout_dish: 'Homemade Lasagna with Meat Sauce',
      phone: '(555) 123-4567',
      website: 'https://nonnas-kitchen.com',
      dietary_options: ['Vegetarian'],
      dining_style: 'Casual'
    },
    {
      id: '12',
      name: 'Seoul Garden',
      description: 'Modern Korean BBQ with premium cuts of meat and traditional banchan. Interactive grilling experience with authentic Korean flavors.',
      cuisine_type: 'Korean',
      location: 'Koreatown',
      logo_url: 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      price_range: '$$$',
      standout_dish: 'Galbi Short Ribs with Kimchi',
      phone: '(555) 234-5678',
      website: 'https://seoul-garden.com',
      dietary_options: ['Vegetarian'],
      dining_style: 'Casual'
    },
    {
      id: '13',
      name: 'Green Leaf Café',
      description: 'Plant-based cuisine with locally-sourced organic ingredients. Creative vegan dishes that satisfy both vegans and omnivores alike.',
      cuisine_type: 'Vegan',
      location: 'Green District',
      logo_url: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.4,
      price_range: '$$',
      standout_dish: 'Jackfruit Carnitas Bowl',
      phone: '(555) 345-6789',
      website: 'https://greenleaf-cafe.com',
      dietary_options: ['Vegetarian', 'Vegan', 'Gluten-free'],
      dining_style: 'Fast-casual'
    },
    {
      id: '14',
      name: 'Ocean\'s Bounty',
      description: 'Fresh seafood restaurant with daily catches and raw bar. Sustainable fishing practices and expert preparation of coastal favorites.',
      cuisine_type: 'Seafood',
      location: 'Waterfront',
      logo_url: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      price_range: '$$$$',
      standout_dish: 'Lobster Thermidor with Champagne Sauce',
      phone: '(555) 456-7890',
      website: 'https://oceans-bounty.com',
      dietary_options: ['Gluten-free'],
      dining_style: 'Fine dining'
    },
    {
      id: '15',
      name: 'Café Parisien',
      description: 'Charming French café with fresh pastries, artisanal coffee, and light lunch fare. Perfect for breakfast meetings or afternoon treats.',
      cuisine_type: 'French',
      location: 'Financial District',
      logo_url: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.2,
      price_range: '$',
      standout_dish: 'Croissant Benedict with Hollandaise',
      phone: '(555) 567-8901',
      website: 'https://cafe-parisien.com',
      dietary_options: ['Vegetarian'],
      dining_style: 'Fast-casual'
    },
    {
      id: '16',
      name: 'Pizza Corner',
      description: 'New York-style pizza with thin crust and fresh toppings. Family-friendly atmosphere with quick service.',
      cuisine_type: 'Italian',
      location: 'Downtown',
      logo_url: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.1,
      price_range: '$',
      standout_dish: 'Margherita Pizza',
      phone: '(555) 111-2222',
      website: 'https://pizzacorner.com',
      dietary_options: ['Vegetarian'],
      dining_style: 'Fast-casual'
    },
    {
      id: '17',
      name: 'Ramen House',
      description: 'Authentic Japanese ramen with rich broths and handmade noodles. Cozy atmosphere perfect for a quick, satisfying meal.',
      cuisine_type: 'Japanese',
      location: 'University District',
      logo_url: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.3,
      price_range: '$$',
      standout_dish: 'Tonkotsu Ramen',
      phone: '(555) 222-3333',
      website: 'https://ramenhouse.com',
      dietary_options: ['Vegetarian'],
      dining_style: 'Casual'
    },
    {
      id: '18',
      name: 'Steakhouse Prime',
      description: 'Premium steakhouse with aged beef and classic sides. Elegant dining room with professional service.',
      cuisine_type: 'American',
      location: 'Financial District',
      logo_url: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      price_range: '$$$$',
      standout_dish: 'Prime Ribeye Steak',
      phone: '(555) 333-4444',
      website: 'https://steakhouseprime.com',
      dietary_options: ['Gluten-free'],
      dining_style: 'Fine dining'
    }
  ];

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allRestaurants, filters]);

  const fetchRestaurants = async () => {
    try {
      /* SUPABASE: Temporarily commented out
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_featured', true)
        .limit(10);

      if (error) throw error;
      setTopRestaurants(data || []);
      */
      
      // TEMPORARY: Using sample data instead of Supabase
      setTopRestaurants(featuredRestaurants);
      setAllRestaurants(extendedRestaurantDatabase);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = allRestaurants;

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchLower) ||
        r.cuisine_type.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower) ||
        r.location.toLowerCase().includes(searchLower)
      );
    }

    if (filters.cuisine) {
      filtered = filtered.filter(r => r.cuisine_type === filters.cuisine);
    }
    if (filters.priceRange) {
      filtered = filtered.filter(r => r.price_range === filters.priceRange);
    }
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(r => r.rating >= minRating);
    }
    if (filters.location) {
      filtered = filtered.filter(r => r.location === filters.location);
    }
    if (filters.dietary) {
      filtered = filtered.filter(r => r.dietary_options.includes(filters.dietary));
    }
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
        : scrollPosition + scrollAmount;

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
        <span className="ml-1 text-sm font-medium text-gray-600">{rating}</span>
      </div>
    );
  };

  const renderPriceRange = (priceRange: string) => {
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
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="flex space-x-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-80 h-64 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get unique values for filter options
  const cuisineTypes = [...new Set(allRestaurants.map(r => r.cuisine_type))];
  const priceRanges = [...new Set(allRestaurants.map(r => r.price_range))];
  const locations = [...new Set(allRestaurants.map(r => r.location))];
  const dietaryOptions = [...new Set(allRestaurants.flatMap(r => r.dietary_options))];
  const diningStyles = [...new Set(allRestaurants.map(r => r.dining_style))];

  return (
    <div className="bg-gray-50">
      {/* TOP 10 RESTAURANTS SECTION */}
      <section id="top-restaurants" className="py-16 bg-white border-b-4 border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Top 10 Restaurants of the Month
              </h2>
              <p className="text-lg text-gray-600">
                Discover the most popular restaurants chosen by our community
              </p>
            </div>
            <div className="hidden md:flex space-x-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200 hover:bg-gray-50"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200 hover:bg-gray-50"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              id="featured-restaurants-scroll"
              className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
             {topRestaurants.map((restaurant, index) => (
  <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
    <Card className="flex-none w-80 cursor-pointer group" hover>
      <div className="relative">
        <img
          src={restaurant.logo_url}
          alt={restaurant.name}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            #{index + 1}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg px-2 py-1">
          {renderStars(restaurant.rating)}
        </div>
      </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3
                          className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors hover:underline"
                        >
                          {restaurant.name}
                        </h3>
                        <div className="flex flex-col items-end space-y-1">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            {restaurant.cuisine_type}
                          </span>
                          {renderPriceRange(restaurant.price_range)}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3 text-sm line-clamp-3">
                        {restaurant.description}
                      </p>
                      
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-900 mb-1">Signature Dish:</p>
                        <p className="text-sm text-orange-600 font-medium">{restaurant.standout_dish}</p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{restaurant.location}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">{restaurant.phone}</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {restaurant.dining_style}
                          </span>
                        </div>
                      </div>

                      {restaurant.dietary_options.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex flex-wrap gap-1">
                            {restaurant.dietary_options.map(option => (
                              <span
                                key={option}
                                className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                              >
                                {option}
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
                          placeholder="Restaurant name, cuisine, location..."
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
                        {cuisineTypes.map(cuisine => (
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
                        {priceRanges.map(price => (
                          <option key={price} value={price}>{price}</option>
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
                        <option value="4.0">4.0+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                        <option value="4.8">4.8+ Stars</option>
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
                        {locations.map(location => (
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
                        {dietaryOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
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
                        {diningStyles.map(style => (
                          <option key={style} value={style}>{style}</option>
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
                  Showing {filteredRestaurants.length} of {allRestaurants.length} restaurants
                </p>
              </div>

              {filteredRestaurants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <p className="text-gray-500 text-lg mb-4">No restaurants match your current filters.</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                      <Card className="cursor-pointer group" hover>
                        <Link to={`/restaurant/${restaurant.id}`}>
                        <div className="relative">
                          <img
                            src={restaurant.logo_url}
                            alt={restaurant.name}
                            className="w-full h-48 object-cover rounded-t-xl"
                          />
                          <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg px-2 py-1">
                            {renderStars(restaurant.rating)}
                          </div>
                        </div>
                        </Link>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3
                              className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors hover:underline"
                            >
                              {restaurant.name}
                            </h3>
                            <div className="flex flex-col items-end space-y-1">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                {restaurant.cuisine_type}
                              </span>
                              {renderPriceRange(restaurant.price_range)}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                            {restaurant.description}
                          </p>
                          
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-900 mb-1">Signature Dish:</p>
                            <p className="text-sm text-orange-600 font-medium">{restaurant.standout_dish}</p>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{restaurant.location}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">{restaurant.phone}</span>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                {restaurant.dining_style}
                              </span>
                            </div>
                          </div>

                          {restaurant.dietary_options.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex flex-wrap gap-1">
                                {restaurant.dietary_options.map(option => (
                                  <span
                                    key={option}
                                    className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    {option}
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
        </div>
      </section>
    </div>
  );
}