import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Globe, Star, DollarSign, Clock, ArrowLeft, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

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

interface Review {
  id: string;
  user_name: string;
  user_email: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count: number;
}

export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);

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

  // Mock reviews
  const mockReviews: Review[] = [
    {
      id: '1',
      user_name: 'John Doe',
      user_email: 'john@example.com',
      rating: 5,
      comment: 'Absolutely amazing experience! The food was delicious and the service was impeccable. Highly recommend the truffle risotto!',
      created_at: '2024-01-15',
      helpful_count: 12,
    },
    {
      id: '2',
      user_name: 'Jane Smith',
      user_email: 'jane@example.com',
      rating: 4,
      comment: 'Great atmosphere and authentic Italian cuisine. The pasta was perfectly cooked. Only minor issue was the wait time, but it was worth it!',
      created_at: '2024-01-10',
      helpful_count: 8,
    },
    {
      id: '3',
      user_name: 'Mike Johnson',
      user_email: 'mike@example.com',
      rating: 5,
      comment: 'Best Italian restaurant in town! Been coming here for years and they never disappoint. The staff is friendly and knows the menu inside out.',
      created_at: '2024-01-05',
      helpful_count: 15,
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
      setReviews(mockReviews);
      setLoading(false);
    };

    fetchRestaurant();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please sign in to leave a review');
      return;
    }

    if (newReview.comment.trim().length < 10) {
      alert('Review must be at least 10 characters long');
      return;
    }

    setSubmittingReview(true);

    try {
      // TODO: Implement Supabase integration
      const review: Review = {
        id: Date.now().toString(),
        user_name: user.email?.split('@')[0] || 'Anonymous',
        user_email: user.email || '',
        rating: newReview.rating,
        comment: newReview.comment,
        created_at: new Date().toISOString().split('T')[0],
        helpful_count: 0,
      };

      // Add review to list
      setReviews([review, ...reviews]);
      
      // Reset form
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      
      // Update restaurant rating (simple average)
      if (restaurant) {
        const allRatings = [...reviews.map(r => r.rating), review.rating];
        const avgRating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
        setRestaurant({ ...restaurant, rating: Math.round(avgRating * 10) / 10 });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful_count: review.helpful_count + 1 }
        : review
    ));
  };

  const renderStars = (rating: number, interactive = false, size = 'default') => {
    const sizeClass = size === 'large' ? 'h-8 w-8' : 'h-5 w-5';
    
    if (interactive) {
      return (
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setNewReview({ ...newReview, rating: star })}
              className="focus:outline-none"
            >
              <Star
                className={`${sizeClass} transition-colors ${
                  star <= newReview.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClass} ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : i < rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        {rating && <span className="ml-2 text-lg font-medium text-gray-700">{rating}</span>}
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

  const userHasReviewed = user && reviews.some(review => review.user_email === user.email);

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
                    <span className="text-gray-600">({reviews.length} reviews)</span>
                    <span className="text-gray-400">•</span>
                    {renderPriceRange(restaurant.price_range)}
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{restaurant.cuisine_type}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-lg mb-6">
                {restaurant.description}
              </p>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                  <span>{restaurant.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2 text-orange-500" />
                  <span>{restaurant.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="h-5 w-5 mr-2 text-orange-500" />
                  <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
                    Visit Website
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2 text-orange-500" />
                  <span>{restaurant.dining_style}</span>
                </div>
              </div>

              {/* Dietary Options */}
              {restaurant.dietary_options.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Dietary Options:</h3>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.dietary_options.map(option => (
                      <span
                        key={option}
                        className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Standout Dish */}
              <div className="mt-6 bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h3 className="text-sm font-semibold text-orange-800 mb-1">Signature Dish</h3>
                <p className="text-orange-900 font-medium">{restaurant.standout_dish}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Menu</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredMenuItems.map(item => (
            <Card key={item.id} hover>
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              )}
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                  <span className="text-xl font-bold text-orange-600">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
              <p className="text-gray-600 mt-2">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''} • Average rating: {restaurant.rating}
              </p>
            </div>
            {user && !userHasReviewed && !showReviewForm && (
              <Button onClick={() => setShowReviewForm(true)}>
                Write a Review
              </Button>
            )}
          </div>

          {/* Login prompt for non-authenticated users */}
          {!user && (
            <Card className="mb-8 border-orange-200 bg-orange-50">
              <CardContent className="p-6 text-center">
                <p className="text-gray-700 mb-4">
                  Want to share your experience? Sign in to leave a review!
                </p>
                <Link to="/auth">
                  <Button>Sign In to Review</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Already reviewed message */}
          {user && userHasReviewed && !showReviewForm && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <p className="text-green-800">
                  ✓ Thank you for your review! You can see it below.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Review Form */}
          {showReviewForm && user && (
            <Card className="mb-8">
              <CardHeader>
                <h3 className="text-xl font-semibold">Write Your Review</h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating
                    </label>
                    {renderStars(newReview.rating, true, 'large')}
                    <p className="text-sm text-gray-500 mt-2">
                      Click on the stars to rate (1-5)
                    </p>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Share your experience with others..."
                      required
                      minLength={10}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Minimum 10 characters ({newReview.comment.length}/10)
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowReviewForm(false);
                        setNewReview({ rating: 5, comment: '' });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={submittingReview}
                      disabled={newReview.comment.trim().length < 10}
                    >
                      Submit Review
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500 text-lg mb-4">No reviews yet</p>
                  <p className="text-gray-400">Be the first to share your experience!</p>
                </CardContent>
              </Card>
            ) : (
              reviews.map(review => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                            {review.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.user_name}</p>
                            <p className="text-sm text-gray-500">{review.created_at}</p>
                          </div>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {review.comment}
                    </p>

                    <div className="flex items-center space-x-4 text-sm">
                      <button
                        onClick={() => handleHelpful(review.id)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-orange-500 transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Helpful ({review.helpful_count})</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}