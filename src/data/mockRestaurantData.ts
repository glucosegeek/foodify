// Types for restaurant data
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'special';
  image_url?: string;
  tags: string[];
  dietary_info: string[];
  is_available: boolean;
  preparation_time?: number; // minutes
  allergens: string[];
  popularity_rank?: number;
  views_count: number;
  orders_count: number;
}

export interface RestaurantReview {
  id: string;
  user_id: string;
  username: string;
  user_avatar?: string;
  rating: number;
  comment?: string;
  photos?: string[];
  created_at: string;
  restaurant_reply?: {
    message: string;
    replied_at: string;
    replied_by: string;
  };
  helpful_count: number;
  reported: boolean;
}

export interface RestaurantFollower {
  id: string;
  username: string;
  avatar_url?: string;
  followed_at: string;
  reviews_count: number;
  photos_count: number;
  location?: string;
}

export interface RestaurantPost {
  id: string;
  type: 'PROMOTION' | 'EVENT' | 'MENU_UPDATE' | 'NEWS';
  title: string;
  content: string;
  image_url?: string;
  active_until?: string;
  created_at: string;
  views_count: number;
  engagement_count: number; // likes, shares, etc.
}

export interface RestaurantStats {
  period: 'today' | 'week' | 'month' | 'year';
  profile_views: number;
  menu_views: number;
  followers_gained: number;
  reviews_received: number;
  average_rating: number;
  popular_dishes: {
    dish_name: string;
    views: number;
    orders?: number;
  }[];
  peak_hours: {
    hour: number;
    views: number;
  }[];
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'manager' | 'staff';
  permissions: string[];
  added_at: string;
  last_active?: string;
}

// Mock data
export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Truffle Risotto',
    description: 'Creamy Arborio rice with wild mushrooms, black truffle shavings, and aged Parmesan cheese',
    price: 48.00,
    category: 'main',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03246963d51f?w=400',
    tags: ['signature', 'premium', 'vegetarian'],
    dietary_info: ['Vegetarian', 'Gluten-free available'],
    is_available: true,
    preparation_time: 25,
    allergens: ['dairy', 'eggs'],
    popularity_rank: 1,
    views_count: 245,
    orders_count: 89
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Traditional Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil',
    price: 32.00,
    category: 'main',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    tags: ['classic', 'vegetarian'],
    dietary_info: ['Vegetarian'],
    is_available: true,
    preparation_time: 15,
    allergens: ['gluten', 'dairy'],
    popularity_rank: 2,
    views_count: 189,
    orders_count: 156
  },
  {
    id: '3',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with mascarpone, ladyfingers, coffee, and cocoa',
    price: 18.00,
    category: 'dessert',
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    tags: ['signature', 'classic'],
    dietary_info: ['Contains alcohol'],
    is_available: true,
    preparation_time: 5,
    allergens: ['dairy', 'eggs', 'gluten'],
    popularity_rank: 3,
    views_count: 134,
    orders_count: 67
  },
  {
    id: '4',
    name: 'Bruschetta Trio',
    description: 'Three varieties: classic tomato basil, mushroom truffle, and ricotta honey',
    price: 24.00,
    category: 'appetizer',
    image_url: 'https://images.unsplash.com/photo-1572441219551-5e2b8b0c9904?w=400',
    tags: ['sharing', 'vegetarian'],
    dietary_info: ['Vegetarian'],
    is_available: true,
    preparation_time: 10,
    allergens: ['gluten', 'dairy'],
    views_count: 98,
    orders_count: 43
  },
  {
    id: '5',
    name: 'Chianti Classico',
    description: '2019 vintage from Tuscany, perfect with our pasta dishes',
    price: 65.00,
    category: 'beverage',
    tags: ['wine', 'imported'],
    dietary_info: ['Contains sulfites'],
    is_available: false, // Out of stock
    allergens: [],
    views_count: 67,
    orders_count: 23
  }
];

export const mockRestaurantReviews: RestaurantReview[] = [
  {
    id: '1',
    user_id: 'user1',
    username: 'foodlover123',
    user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
    rating: 5,
    comment: 'Amazing truffle risotto! The atmosphere was perfect for a romantic dinner. Service was impeccable and the wine selection is outstanding.',
    photos: [
      'https://images.unsplash.com/photo-1563379091339-03246963d51f?w=400',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400'
    ],
    created_at: '2024-01-15T19:30:00Z',
    restaurant_reply: {
      message: 'Dziękujemy za wspaniałą recenzję! Cieszymy się, że spodobał Ci się nasz truffle risotto. Zapraszamy ponownie!',
      replied_at: '2024-01-16T09:15:00Z',
      replied_by: 'Restaurant Manager'
    },
    helpful_count: 12,
    reported: false
  },
  {
    id: '2',
    user_id: 'user2',
    username: 'mario_chef',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    rating: 4,
    comment: 'Great authentic Italian food! The pizza was perfect, crispy crust and fresh ingredients. Only minor complaint - service was a bit slow during peak hours.',
    created_at: '2024-01-12T20:15:00Z',
    helpful_count: 8,
    reported: false
  },
  {
    id: '3',
    user_id: 'user3',
    username: 'anna_food',
    user_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b932c5af?w=50&h=50&fit=crop&crop=face',
    rating: 5,
    comment: 'Best tiramisu in the city! Every bite was perfect. The ambiance is cozy and romantic.',
    photos: ['https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400'],
    created_at: '2024-01-10T18:45:00Z',
    restaurant_reply: {
      message: 'Thank you Anna! Our tiramisu is made fresh daily with our grandmother\'s recipe. We\'re so glad you enjoyed it!',
      replied_at: '2024-01-11T10:30:00Z',
      replied_by: 'Head Chef'
    },
    helpful_count: 15,
    reported: false
  },
  {
    id: '4',
    user_id: 'user4',
    username: 'difficult_customer',
    user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    rating: 2,
    comment: 'Overpriced and portions were small. The truffle risotto was bland and not worth the money. Service was okay but nothing special.',
    created_at: '2024-01-08T19:20:00Z',
    helpful_count: 3,
    reported: true // This review was reported by restaurant
  }
];

export const mockRestaurantFollowers: RestaurantFollower[] = [
  {
    id: 'user1',
    username: 'foodlover123',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
    followed_at: '2024-01-01T00:00:00Z',
    reviews_count: 12,
    photos_count: 28,
    location: 'Warsaw'
  },
  {
    id: 'user2',
    username: 'mario_chef',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    followed_at: '2024-01-05T14:30:00Z',
    reviews_count: 45,
    photos_count: 89,
    location: 'Krakow'
  },
  {
    id: 'user3',
    username: 'anna_food',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b932c5af?w=50&h=50&fit=crop&crop=face',
    followed_at: '2024-01-08T16:45:00Z',
    reviews_count: 23,
    photos_count: 34,
    location: 'Warsaw'
  },
  {
    id: 'user5',
    username: 'vegan_explorer',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    followed_at: '2024-01-12T10:20:00Z',
    reviews_count: 67,
    photos_count: 156,
    location: 'Gdansk'
  }
];

export const mockRestaurantPosts: RestaurantPost[] = [
  {
    id: '1',
    type: 'PROMOTION',
    title: 'Happy Hour Special! 🍷',
    content: 'Join us for our new happy hour menu! 20% off all appetizers and wine selection from 5-7 PM, Monday through Thursday. Perfect for after-work gatherings!',
    image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
    active_until: '2024-02-15T23:59:59Z',
    created_at: '2024-01-20T15:00:00Z',
    views_count: 456,
    engagement_count: 89
  },
  {
    id: '2',
    type: 'MENU_UPDATE',
    title: 'New Winter Menu Available! ❄️',
    content: 'We\'re excited to introduce our seasonal winter dishes featuring truffle specialties, hearty soups, and warming desserts. Try our new Wild Mushroom Soup with truffle oil!',
    image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
    created_at: '2024-01-18T12:00:00Z',
    views_count: 234,
    engagement_count: 45
  },
  {
    id: '3',
    type: 'EVENT',
    title: 'Wine Tasting Evening - February 10th 🍾',
    content: 'Join us for an exclusive wine tasting evening featuring Italian wines paired with our signature dishes. Limited seats available - reserve now!',
    image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400',
    active_until: '2024-02-10T20:00:00Z',
    created_at: '2024-01-15T10:30:00Z',
    views_count: 678,
    engagement_count: 123
  },
  {
    id: '4',
    type: 'NEWS',
    title: 'Award Recognition! 🏆',
    content: 'We\'re thrilled to announce that Bella Vista has been awarded "Best Italian Restaurant" by Warsaw Food Guide 2024! Thank you to all our loyal customers.',
    created_at: '2024-01-10T16:00:00Z',
    views_count: 892,
    engagement_count: 234
  }
];

export const mockRestaurantStats: RestaurantStats = {
  period: 'month',
  profile_views: 3456,
  menu_views: 2890,
  followers_gained: 45,
  reviews_received: 12,
  average_rating: 4.8,
  popular_dishes: [
    { dish_name: 'Truffle Risotto', views: 245, orders: 89 },
    { dish_name: 'Margherita Pizza', views: 189, orders: 156 },
    { dish_name: 'Tiramisu', views: 134, orders: 67 },
    { dish_name: 'Bruschetta Trio', views: 98, orders: 43 }
  ],
  peak_hours: [
    { hour: 12, views: 234 }, // Lunch
    { hour: 13, views: 456 },
    { hour: 19, views: 567 }, // Dinner
    { hour: 20, views: 789 },
    { hour: 21, views: 345 }
  ]
};

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'team1',
    email: 'owner@bellavista.com',
    name: 'Giuseppe Romano',
    role: 'owner',
    permissions: ['all'],
    added_at: '2023-01-01T00:00:00Z',
    last_active: '2024-01-20T15:30:00Z'
  },
  {
    id: 'team2',
    email: 'manager@bellavista.com',
    name: 'Maria Rossi',
    role: 'manager',
    permissions: ['menu_edit', 'reviews_reply', 'posts_create', 'analytics_view'],
    added_at: '2023-06-15T00:00:00Z',
    last_active: '2024-01-20T14:45:00Z'
  },
  {
    id: 'team3',
    email: 'social@bellavista.com',
    name: 'Antonio Verde',
    role: 'staff',
    permissions: ['posts_create', 'reviews_reply'],
    added_at: '2024-01-01T00:00:00Z',
    last_active: '2024-01-19T18:20:00Z'
  }
];

export const mockRestaurantNotifications = [
  {
    id: '1',
    type: 'NEW_REVIEW',
    title: 'Nowa recenzja',
    message: 'foodlover123 dodał 5-gwiazdkową recenzję',
    read: false,
    created_at: '2024-01-20T10:30:00Z',
    related_id: '1'
  },
  {
    id: '2',
    type: 'NEW_FOLLOWER',
    title: 'Nowy obserwujący',
    message: 'vegan_explorer zaczął obserwować Twoją restaurację',
    read: false,
    created_at: '2024-01-19T16:45:00Z'
  },
  {
    id: '3',
    type: 'REVIEW_REPORTED',
    title: 'Zgłoszenie recenzji',
    message: 'Recenzja została zgłoszona jako nieodpowiednia',
    read: true,
    created_at: '2024-01-18T09:15:00Z',
    related_id: '4'
  }
];