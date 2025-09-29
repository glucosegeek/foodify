import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Globe, Star, DollarSign, Clock, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

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

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
}

export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock data - same as in FeaturedRestaurants
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
  ];

  // Mock menu items
  const mockMenuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Classic tomato sauce, fresh mozzarella, basil',
      price: 12.99,
      category: 'Pizza',
      image_url: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Romaine lettuce, parmesan, croutons, Caesar dressing',
      price: 8.99,
      category: 'Salads',
      image_url: null,
    },
    {
      id: '3',
      name: 'Spaghetti Carbonara',
      description: 'Eggs, pecorino cheese, guanciale, black pepper',
      price: 15.99,
      category: 'Pasta',
      image_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '4',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with mascarpone and espresso',
      price: 7.99,
      category: 'Desserts',
      image_url: 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchRestaurant = async () => {
      setLoading(true);
      // Find restaurant by id
      const found = featuredRestaurants.find(r => r.id === id);
      setRestaurant(found || null);
      setMenuItems(mockMenuItems);
      setLoading(false);
    };

    fetchRestaurant();
  }, [id]);

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
        <span className="ml-2 text-lg font-medium text-gray-700">{rating}</span>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Restaurant Not Found</h1>
          <p className="text-gray-600 mb-8">Sorry, we couldn't find the restaurant you're looking for.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const filteredMenuItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Restaurants
          </Link>
        </div>
      </div>

      {/* Restaurant Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Restaurant Image */}
            <div className="flex-shrink-0">
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="w-full md:w-64 h-64 object-cover rounded-xl shadow-lg"
              />
            </div>

            {/* Restaurant Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {restaurant.name}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    {renderStars(restaurant.rating)}
                    <span className="text-gray-400">•</span>
                    {renderPriceRange(restaurant.price_range)}
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{restaurant.cuisine_type}</span>
                  </div>
                </div>
              </div>