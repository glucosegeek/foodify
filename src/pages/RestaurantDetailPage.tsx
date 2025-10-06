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
        
        <div className="