import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { RestaurantHeader } from '../components/restaurant/RestaurantHeader';
import { RestaurantMenu } from '../components/restaurant/RestaurantMenu';
import { RestaurantReviews } from '../components/restaurant/RestaurantReviews';
import type { Restaurant, MenuCategory, Review } from '../types/restaurant';
import { Button } from '../components/ui/Button';

export function RestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  const mockRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Bella Vista Italian',
      description: 'Authentic Italian cuisine with fresh ingredients sourced directly from Italy. Family-owned restaurant serving traditional recipes passed down through generations. Experience the true taste of Italy in our warm, welcoming atmosphere.',
      cuisine_type: 'Italian',
      location: 'Downtown',
      logo_url: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      price_range: '$$$',
      standout_dish: 'Truffle Risotto with Wild Mushrooms',
      phone: '(555) 123-4567',
      website: 'https://bellavista-italian.com',
      dietary_options: ['Vegetarian', 'Gluten-free'],
      dining_style: 'Fine dining',
      review_count: 127,
      hours: {
        'Poniedziałek': '17:00 - 22:00',
        'Wtorek': '17:00 - 22:00',
        'Środa': '17:00 - 22:00',
        'Czwartek': '17:00 - 22:00',
        'Piątek': '17:00 - 23:00',
        'Sobota': '12:00 - 23:00',
        'Niedziela': '12:00 - 21:00'
      }
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
      dining_style: 'Fine dining',
      review_count: 89
    }
  ];

  const mockMenuCategories: { [key: string]: MenuCategory[] } = {
    '1': [
      {
        id: 'appetizers',
        name: 'Przystawki',
        items: [
          {
            id: 'bruschetta',
            name: 'Bruschetta Classica',
            description: 'Grillowane pieczywo z pomidorami, bazylią i czosnkiem',
            price: 24,
            category: 'appetizers',
            is_vegetarian: true,
            image_url: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=200'
          },
          {
            id: 'antipasto',
            name: 'Antipasto della Casa',
            description: 'Wybór włoskich wędlin, serów i marynowanych warzyw',
            price: 45,
            category: 'appetizers'
          }
        ]
      },
      {
        id: 'pasta',
        name: 'Pasta',
        items: [
          {
            id: 'carbonara',
            name: 'Spaghetti Carbonara',
            description: 'Klasyczna carbonara z guanciale, pecorino romano i żółtkami',
            price: 38,
            category: 'pasta'
          },
          {
            id: 'truffle-risotto',
            name: 'Risotto ai Tartufi',
            description: 'Kremowe risotto z dzikimi grzybami i białymi truflami',
            price: 52,
            category: 'pasta',
            is_vegetarian: true
          }
        ]
      },
      {
        id: 'main',
        name: 'Dania główne',
        items: [
          {
            id: 'osso-buco',
            name: 'Osso Buco alla Milanese',
            description: 'Duszona golonka cielęca z gremolata i risotto szafranowym',
            price: 78,
            category: 'main'
          }
        ]
      }
    ],
    '2': [
      {
        id: 'sushi',
        name: 'Sushi',
        items: [
          {
            id: 'omakase',
            name: 'Omakase',
            description: 'Menu degustacyjne przygotowane przez szefa kuchni (12 kawałków)',
            price: 180,
            category: 'sushi'
          },
          {
            id: 'salmon-roll',
            name: 'Salmon Avocado Roll',
            description: 'Łosoś, awokado, ogórek w nori (8 kawałków)',
            price: 32,
            category: 'sushi'
          }
        ]
      }
    ]
  };

  const mockReviews: { [key: string]: Review[] } = {
    '1': [
      {
        id: 'review1',
        user_name: 'Anna Kowalska',
        rating: 5,
        comment: 'Fantastyczne miejsce! Risotto z truflami było przepyszne, a obsługa bardzo miła. Zdecydowanie wrócę!',
        date: '2024-01-15T19:30:00Z',
        helpful_count: 12
      },
      {
        id: 'review2',
        user_name: 'Marcin Nowak',
        rating: 4,
        comment: 'Bardzo dobra kuchnia, autentyczne włoskie smaki. Jedyny minus to trochę długie oczekiwanie na dania, ale warto było czekać.',
        date: '2024-01-10T20:15:00Z',
        helpful_count: 8
      },
      {
        id: 'review3',
        user_name: 'Katarzyna Wiśniewska',
        rating: 5,
        comment: 'Najlepsza włoska restauracja w mieście! Atmosfera jak w prawdziwej trattori we Włoszech. Polecam carbonarę!',
        date: '2024-01-08T18:45:00Z',
        helpful_count: 15
      }
    ],
    '2': [
      {
        id: 'review4',
        user_name: 'Tomasz Jankowski',
        rating: 5,
        comment: 'Omakase było niesamowite! Szef Takeshi to prawdziwy artysta. Każdy kawałek sushi to dzieło sztuki.',
        date: '2024-01-12T19:00:00Z',
        helpful_count: 9
      },
      {
        id: 'review5',
        user_name: 'Magdalena Zielińska',
        rating: 4,
        comment: 'Świeże ryby, doskonała prezentacja. Ceny wysokie, ale jakość tego warta.',
        date: '2024-01-05T20:30:00Z',
        helpful_count: 6
      }
    ]
  };

  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!id) {
        setError('Nie znaleziono restauracji');
        setLoading(false);
        return;
      }

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const foundRestaurant = mockRestaurants.find(r => r.id === id);
        if (!foundRestaurant) {
          setError('Restauracja nie została znaleziona');
          setLoading(false);
          return;
        }

        setRestaurant(foundRestaurant);
        setMenuCategories(mockMenuCategories[id] || []);
        setReviews(mockReviews[id] || []);
        setLoading(false);
      } catch (err) {
        setError('Błąd podczas ładowania danych restauracji');
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  const handleAddReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReview,
      id: `review_${Date.now()}`,
      date: new Date().toISOString()
    };
    setReviews(prev => [review, ...prev]);
    
    // Update restaurant rating (mock calculation)
    if (restaurant) {
      const allRatings = [...reviews, review].map(r => r.rating);
      const newRating = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
      setRestaurant(prev => prev ? {
        ...prev,
        rating: Math.round(newRating * 10) / 10,
        review_count: (prev.review_count || 0) + 1
      } : null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-32 mb-6"></div>
            <div className="h-64 bg-gray-300 rounded-xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Restauracja nie została znaleziona'}
          </h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Powrót do strony głównej
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Powrót do listy restauracji
        </Link>

        {/* Restaurant Header */}
        <RestaurantHeader restaurant={restaurant} />

        {/* Menu Section */}
        <div className="mb-8">
          <RestaurantMenu categories={menuCategories} />
        </div>

        {/* Reviews Section */}
        <RestaurantReviews 
          reviews={reviews} 
          restaurantId={restaurant.id}
          onAddReview={handleAddReview}
        />
      </div>
    </div>
  );
}