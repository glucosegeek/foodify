import { Database } from './types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];
type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];
type Follow = Database['public']['Tables']['follows']['Row'];
type RestaurantFollow = Database['public']['Tables']['restaurant_follows']['Row'];
type CustomerProfile = Database['public']['Tables']['customer_profiles']['Row'];

// =============================================
// MOCK PROFILES (Users)
// =============================================
export const mockProfiles: Profile[] = [
  // Restaurant Owners
  {
    id: 'owner-1-uuid-mario',
    role: 'restaurant',
    username: 'mario_trattoria',
    full_name: 'Mario Rossi',
    avatar_url: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=200',
    bio: 'Passionate Italian chef with 20 years of experience. Owner of La Dolce Vita.',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'owner-2-uuid-yuki',
    role: 'restaurant',
    username: 'yuki_sushi',
    full_name: 'Yuki Tanaka',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    bio: 'Traditional sushi master trained in Tokyo. Bringing authentic Japanese cuisine to your city.',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 'owner-3-uuid-carlos',
    role: 'restaurant',
    username: 'carlos_tacos',
    full_name: 'Carlos Rodriguez',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    bio: 'Mexican food enthusiast. Family recipes passed down through generations.',
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 'owner-4-uuid-pierre',
    role: 'restaurant',
    username: 'pierre_bistro',
    full_name: 'Pierre Dubois',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
    bio: 'French chef bringing classic bistro experience with modern twist.',
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z'
  },
  {
    id: 'owner-5-uuid-raj',
    role: 'restaurant',
    username: 'raj_spices',
    full_name: 'Raj Patel',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    bio: 'Bringing authentic Indian flavors and spices. Specializing in regional cuisines.',
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z'
  },

  // Customer Users
  {
    id: 'customer-1-uuid-anna',
    role: 'customer',
    username: 'anna_foodie',
    full_name: 'Anna Kowalska',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    bio: 'Food blogger and restaurant enthusiast. Always looking for the next great meal!',
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z'
  },
  {
    id: 'customer-2-uuid-john',
    role: 'customer',
    username: 'john_eats',
    full_name: 'John Smith',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    bio: 'Casual diner who loves trying new restaurants. Pizza and burgers are my weakness.',
    created_at: '2024-03-05T10:00:00Z',
    updated_at: '2024-03-05T10:00:00Z'
  },
  {
    id: 'customer-3-uuid-emma',
    role: 'customer',
    username: 'emma_vegan',
    full_name: 'Emma Green',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    bio: 'Plant-based food advocate. Looking for the best vegan and vegetarian options.',
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z'
  },
  {
    id: 'customer-4-uuid-michael',
    role: 'customer',
    username: 'michael_chef',
    full_name: 'Michael Brown',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    bio: 'Home cook exploring professional kitchens. Love fine dining experiences.',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z'
  },
  {
    id: 'customer-5-uuid-sarah',
    role: 'customer',
    username: 'sarah_reviews',
    full_name: 'Sarah Johnson',
    avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200',
    bio: 'Honest reviewer. Family-friendly restaurants are my specialty.',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z'
  }
];

// =============================================
// CUSTOMER PROFILES (Extended)
// =============================================
export const mockCustomerProfiles: CustomerProfile[] = [
  {
    user_id: 'customer-1-uuid-anna',
    preferred_cuisines: ['Italian', 'Japanese', 'French'],
    dietary_restrictions: [],
    favorite_restaurants: ['rest-1-uuid-dolce', 'rest-2-uuid-sakura'],
    created_at: '2024-03-01T10:00:00Z'
  },
  {
    user_id: 'customer-2-uuid-john',
    preferred_cuisines: ['Mexican', 'Italian', 'American'],
    dietary_restrictions: [],
    favorite_restaurants: ['rest-3-uuid-loco'],
    created_at: '2024-03-05T10:00:00Z'
  },
  {
    user_id: 'customer-3-uuid-emma',
    preferred_cuisines: ['Indian', 'Thai', 'Mediterranean'],
    dietary_restrictions: ['vegan'],
    favorite_restaurants: ['rest-5-uuid-spice'],
    created_at: '2024-03-10T10:00:00Z'
  },
  {
    user_id: 'customer-4-uuid-michael',
    preferred_cuisines: ['French', 'Italian', 'Japanese'],
    dietary_restrictions: [],
    favorite_restaurants: ['rest-4-uuid-pierre', 'rest-2-uuid-sakura'],
    created_at: '2024-03-15T10:00:00Z'
  },
  {
    user_id: 'customer-5-uuid-sarah',
    preferred_cuisines: ['Italian', 'Mexican', 'American'],
    dietary_restrictions: ['gluten_free'],
    favorite_restaurants: ['rest-1-uuid-dolce'],
    created_at: '2024-03-20T10:00:00Z'
  }
];

// =============================================
// MOCK RESTAURANTS
// =============================================
export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest-1-uuid-dolce',
    user_id: 'owner-1-uuid-mario',
    slug: 'la-dolce-vita',
    name: 'La Dolce Vita',
    description: 'Authentic Italian trattoria serving traditional recipes from Tuscany. Experience the sweet life with homemade pasta, wood-fired pizzas, and carefully selected Italian wines.',
    cuisine_type: 'Italian',
    location: 'Downtown',
    address: '123 Via Roma, City Center',
    latitude: 52.2297,
    longitude: 21.0122,
    phone: '+48 22 123 4567',
    email: 'info@ladolcevita.pl',
    website: 'https://ladolcevita.example.com',
    logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    cover_photo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
    rating: 4.8,
    review_count: 127,
    price_range: '$$$',
    dining_style: 'fine_dining',
    dietary_options: ['vegetarian', 'gluten_free'],
    is_featured: true,
    opening_hours: {
      monday: '12:00-22:00',
      tuesday: '12:00-22:00',
      wednesday: '12:00-22:00',
      thursday: '12:00-22:00',
      friday: '12:00-23:00',
      saturday: '12:00-23:00',
      sunday: '12:00-21:00'
    },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-09-15T10:00:00Z'
  },
  {
    id: 'rest-2-uuid-sakura',
    user_id: 'owner-2-uuid-yuki',
    slug: 'sakura-sushi',
    name: 'Sakura Sushi House',
    description: 'Traditional Japanese sushi bar with omakase experience. Fresh fish delivered daily, prepared by master sushi chef with 25 years of experience.',
    cuisine_type: 'Japanese',
    location: 'Uptown',
    address: '456 Sakura Street, North District',
    latitude: 52.2500,
    longitude: 21.0300,
    phone: '+48 22 234 5678',
    email: 'reservations@sakurasushi.pl',
    website: 'https://sakurasushi.example.com',
    logo_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cover_photo_url: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=1200',
    rating: 4.9,
    review_count: 203,
    price_range: '$$$$',
    dining_style: 'fine_dining',
    dietary_options: ['gluten_free'],
    is_featured: true,
    opening_hours: {
      monday: 'Closed',
      tuesday: '17:00-22:00',
      wednesday: '17:00-22:00',
      thursday: '17:00-22:00',
      friday: '17:00-23:00',
      saturday: '12:00-23:00',
      sunday: '12:00-21:00'
    },
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-09-20T10:00:00Z'
  },
  {
    id: 'rest-3-uuid-loco',
    user_id: 'owner-3-uuid-carlos',
    slug: 'taco-loco',
    name: 'Taco Loco',
    description: 'Vibrant Mexican cantina with authentic street tacos and creative cocktails. Family recipes from Oaxaca served in a lively atmosphere.',
    cuisine_type: 'Mexican',
    location: 'West Side',
    address: '789 Fiesta Avenue, West District',
    latitude: 52.2200,
    longitude: 21.0000,
    phone: '+48 22 345 6789',
    email: 'hola@tacoloco.pl',
    website: 'https://tacoloco.example.com',
    logo_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    cover_photo_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200',
    rating: 4.6,
    review_count: 89,
    price_range: '$$',
    dining_style: 'casual',
    dietary_options: ['vegetarian', 'vegan', 'gluten_free'],
    is_featured: false,
    opening_hours: {
      monday: '11:00-22:00',
      tuesday: '11:00-22:00',
      wednesday: '11:00-22:00',
      thursday: '11:00-23:00',
      friday: '11:00-00:00',
      saturday: '11:00-00:00',
      sunday: '11:00-22:00'
    },
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-09-01T10:00:00Z'
  },
  {
    id: 'rest-4-uuid-pierre',
    user_id: 'owner-4-uuid-pierre',
    slug: 'bistro-pierre',
    name: 'Bistro Pierre',
    description: 'Classic French bistro with seasonal menu. Cozy atmosphere perfect for romantic dinners and business lunches. Extensive wine list featuring French and local wines.',
    cuisine_type: 'French',
    location: 'Old Town',
    address: '321 Rue de la Paix, Historic Quarter',
    latitude: 52.2400,
    longitude: 21.0150,
    phone: '+48 22 456 7890',
    email: 'bonjour@bistropierre.pl',
    website: 'https://bistropierre.example.com',
    logo_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    cover_photo_url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200',
    rating: 4.7,
    review_count: 156,
    price_range: '$$$',
    dining_style: 'fine_dining',
    dietary_options: ['vegetarian'],
    is_featured: true,
    opening_hours: {
      monday: 'Closed',
      tuesday: '12:00-22:00',
      wednesday: '12:00-22:00',
      thursday: '12:00-22:00',
      friday: '12:00-23:00',
      saturday: '12:00-23:00',
      sunday: '12:00-21:00'
    },
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-09-10T10:00:00Z'
  },
  {
    id: 'rest-5-uuid-spice',
    user_id: 'owner-5-uuid-raj',
    slug: 'spice-garden',
    name: 'Spice Garden',
    description: 'Modern Indian restaurant showcasing regional specialties from across India. From Kerala curries to Punjabi tandoor, experience the diversity of Indian cuisine.',
    cuisine_type: 'Indian',
    location: 'East Side',
    address: '654 Curry Lane, East District',
    latitude: 52.2350,
    longitude: 21.0400,
    phone: '+48 22 567 8901',
    email: 'namaste@spicegarden.pl',
    website: 'https://spicegarden.example.com',
    logo_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    cover_photo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
    rating: 4.5,
    review_count: 94,
    price_range: '$$',
    dining_style: 'casual',
    dietary_options: ['vegetarian', 'vegan', 'gluten_free'],
    is_featured: false,
    opening_hours: {
      monday: '11:30-22:00',
      tuesday: '11:30-22:00',
      wednesday: '11:30-22:00',
      thursday: '11:30-22:00',
      friday: '11:30-23:00',
      saturday: '11:30-23:00',
      sunday: '11:30-22:00'
    },
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-09-15T10:00:00Z'
  }
];

// =============================================
// MENU CATEGORIES
// =============================================
export const mockMenuCategories: MenuCategory[] = [
  // La Dolce Vita Categories
  { id: 'cat-1-appetizers', restaurant_id: 'rest-1-uuid-dolce', name: 'Antipasti', description: 'Traditional Italian starters', display_order: 1, created_at: '2024-01-15T10:00:00Z' },
  { id: 'cat-1-pasta', restaurant_id: 'rest-1-uuid-dolce', name: 'Pasta Fresca', description: 'Handmade pasta dishes', display_order: 2, created_at: '2024-01-15T10:00:00Z' },
  { id: 'cat-1-pizza', restaurant_id: 'rest-1-uuid-dolce', name: 'Pizza Napoletana', description: 'Wood-fired pizzas', display_order: 3, created_at: '2024-01-15T10:00:00Z' },
  { id: 'cat-1-mains', restaurant_id: 'rest-1-uuid-dolce', name: 'Secondi', description: 'Main courses', display_order: 4, created_at: '2024-01-15T10:00:00Z' },
  { id: 'cat-1-desserts', restaurant_id: 'rest-1-uuid-dolce', name: 'Dolci', description: 'Italian desserts', display_order: 5, created_at: '2024-01-15T10:00:00Z' },

  // Sakura Sushi Categories
  { id: 'cat-2-appetizers', restaurant_id: 'rest-2-uuid-sakura', name: 'Zensai', description: 'Japanese appetizers', display_order: 1, created_at: '2024-01-20T10:00:00Z' },
  { id: 'cat-2-sushi', restaurant_id: 'rest-2-uuid-sakura', name: 'Nigiri & Sashimi', description: 'Fresh fish selections', display_order: 2, created_at: '2024-01-20T10:00:00Z' },
  { id: 'cat-2-rolls', restaurant_id: 'rest-2-uuid-sakura', name: 'Maki Rolls', description: 'Sushi rolls', display_order: 3, created_at: '2024-01-20T10:00:00Z' },
  { id: 'cat-2-hot', restaurant_id: 'rest-2-uuid-sakura', name: 'Hot Dishes', description: 'Cooked specialties', display_order: 4, created_at: '2024-01-20T10:00:00Z' },
  { id: 'cat-2-omakase', restaurant_id: 'rest-2-uuid-sakura', name: 'Omakase', description: "Chef's selection", display_order: 5, created_at: '2024-01-20T10:00:00Z' },

  // Taco Loco Categories
  { id: 'cat-3-tacos', restaurant_id: 'rest-3-uuid-loco', name: 'Tacos', description: 'Street-style tacos', display_order: 1, created_at: '2024-02-01T10:00:00Z' },
  { id: 'cat-3-burritos', restaurant_id: 'rest-3-uuid-loco', name: 'Burritos & Bowls', description: 'Hearty wraps and bowls', display_order: 2, created_at: '2024-02-01T10:00:00Z' },
  { id: 'cat-3-appetizers', restaurant_id: 'rest-3-uuid-loco', name: 'Antojitos', description: 'Mexican appetizers', display_order: 3, created_at: '2024-02-01T10:00:00Z' },
  { id: 'cat-3-drinks', restaurant_id: 'rest-3-uuid-loco', name: 'Bebidas', description: 'Drinks and cocktails', display_order: 4, created_at: '2024-02-01T10:00:00Z' },

  // Bistro Pierre Categories
  { id: 'cat-4-appetizers', restaurant_id: 'rest-4-uuid-pierre', name: 'Entrées', description: 'French starters', display_order: 1, created_at: '2024-02-10T10:00:00Z' },
  { id: 'cat-4-mains', restaurant_id: 'rest-4-uuid-pierre', name: 'Plats Principaux', description: 'Main courses', display_order: 2, created_at: '2024-02-10T10:00:00Z' },
  { id: 'cat-4-desserts', restaurant_id: 'rest-4-uuid-pierre', name: 'Desserts', description: 'French desserts', display_order: 3, created_at: '2024-02-10T10:00:00Z' },

  // Spice Garden Categories
  { id: 'cat-5-appetizers', restaurant_id: 'rest-5-uuid-spice', name: 'Starters', description: 'Indian appetizers', display_order: 1, created_at: '2024-02-15T10:00:00Z' },
  { id: 'cat-5-curries', restaurant_id: 'rest-5-uuid-spice', name: 'Curries', description: 'Traditional curries', display_order: 2, created_at: '2024-02-15T10:00:00Z' },
  { id: 'cat-5-tandoor', restaurant_id: 'rest-5-uuid-spice', name: 'Tandoor', description: 'Clay oven specialties', display_order: 3, created_at: '2024-02-15T10:00:00Z' },
  { id: 'cat-5-breads', restaurant_id: 'rest-5-uuid-spice', name: 'Breads', description: 'Indian breads', display_order: 4, created_at: '2024-02-15T10:00:00Z' },
];

// =============================================
// MENU ITEMS
// =============================================
export const mockMenuItems: MenuItem[] = [
  // LA DOLCE VITA - Antipasti
  {
    id: 'item-1-1',
    restaurant_id: 'rest-1-uuid-dolce',
    category_id: 'cat-1-appetizers',
    name: 'Bruschetta Classica',
    description: 'Grilled bread topped with fresh tomatoes, garlic, basil, and extra virgin olive oil',
    price: 38.00,
    image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600',
    dietary_tags: ['vegetarian'],
    allergens: ['gluten', 'garlic'],
    is_available: true,
    display_order: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'item-1-2',
    restaurant_id: 'rest-1-uuid-dolce',
    category_id: 'cat-1-appetizers',
    name: 'Caprese Salad',
    description: 'Fresh mozzarella, tomatoes, and basil with balsamic glaze',
    price: 42.00,
    image_url: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600',
    dietary_tags: ['vegetarian', 'gluten_free'],
    allergens: ['dairy'],
    is_available: true,
    display_order: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'item-1-3',
    restaurant_id: 'rest-1-uuid-dolce',
    category_id: 'cat-1-appetizers',
    name: 'Prosciutto e Melone',
    description: 'Italian cured ham with fresh cantaloupe',
    price: 48.00,
    image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600',
    dietary_tags: ['gluten_free'],
    allergens: [],
    is_available: true,
    display_order: 3,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },

  // LA DOLCE VITA - Pasta
  {
    id: 'item-1-4',
    restaurant_id: 'rest-1-uuid-dolce',
    category_id: 'cat-1-pasta',
    name: 'Spaghetti Carbonara',
    description: 'Classic Roman pasta with guanciale, eggs, pecorino cheese, and black pepper',
    price: 58.00,
    image_url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600',
    dietary_tags: [],
    allergens: ['gluten', 'eggs', 'dairy'],
    is_available: true,
    display_order: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'item-1-5',
    restaurant_id: 'rest-1-uuid-dolce',
    category_id: 'cat-1-pasta',
    name: 'Fettuccine Alfredo',
    description: 'Homemade fettuccine in creamy parmesan sauce',
    price: 54.00,
    image_url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600',
    dietary_tags: ['vegetarian'],
    allergens: ['gluten', 'dairy'],
    is_available: true,
    display_order: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'item-1-6',
    restaurant_id: 'rest-1-uuid-dolce',
    category_id: 'cat-1-pasta',
    name: 'Lasagne alla Bolognese',
    description: 'Traditional layered pasta with meat sauce and béchamel',
    price: 62.00,
    image_url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600',
    dietary_tags: [],
    allergens: ['gluten', 'dairy', 'eggs'],
    is_available: true,
    display_order: 3,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },

  // LA DOLCE VITA - Pizza
  {
    id: 'item-1-7',
    restaurant_id: 'rest-1-uuid-dolce',
    category_id: 'cat-1-pizza',
    name: 'Pizza Margherita',
    description: 'San Marzano tomatoes, fresh mozzarella, basil, olive oil',
    price: 52.00,
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600',
    dietary_tags: ['vegetarian'],
    allergens: ['gluten', 'dairy'],
    is_available: true,
    display_order: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'item-1-8',
    restaurant_id: 'rest-1-uuid-dolce',
    category_id: 'cat-1-pizza',
    name: 'Pizza Quattro Formaggi',
    description: 'Four cheese pizza with mozzarella, gorgonzola, parmesan, and fontina',
    price: 58.00,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
    dietary_tags: ['vegetarian'],
    allergens: ['gluten', 'dairy'],
    is_available: true,
    display_order: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },

  // LA DOLCE VITA - Desserts
  {
    id: 'item-1-9',
    restaurant_id: 'rest-1-uuid-dolce',
    category_id: 'cat-1-desserts',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    price: 32.00,
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600',
    dietary_tags: ['vegetarian'],
    allergens: ['gluten', 'dairy', 'eggs'],
    is_available: true,
    display_order: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'item-1-10',
    restaurant_id: 'rest-1-uuid-dolce',
    category_id: 'cat-1-desserts',
    name: 'Panna Cotta',
    description: 'Vanilla cream with berry compote',
    price: 28.00,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600',
    dietary_tags: ['vegetarian', 'gluten_free'],
    allergens: ['dairy'],
    is_available: true,
    display_order: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },

  // SAKURA SUSHI - Appetizers
  {
    id: 'item-2-1',
    restaurant_id: 'rest-2-uuid-sakura',
    category_id: 'cat-2-appetizers',
    name: 'Edamame',
    description: 'Steamed soybeans with sea salt',
    price: 22.00,
    image_url: 'https://images.unsplash.com/photo-1583399577620-8e82b7b8a6c1?w=600',
    dietary_tags: ['vegetarian', 'vegan', 'gluten_free'],
    allergens: ['soy'],
    is_available: true,
    display_order: 1,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 'item-2-2',
    restaurant_id: 'rest-2-uuid-sakura',
    category_id: 'cat-2-appetizers',
    name: 'Gyoza',
    description: 'Pan-fried pork and vegetable dumplings',
    price: 32.00,
    image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600',
    dietary_tags: [],
    allergens: ['gluten', 'soy'],
    is_available: true,
    display_order: 2,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },

  // SAKURA SUSHI - Nigiri
  {
    id: 'item-2-3',
    restaurant_id: 'rest-2-uuid-sakura',
    category_id: 'cat-2-sushi',
    name: 'Salmon Nigiri (2 pcs)',
    description: 'Fresh Norwegian salmon over pressed rice',
    price: 38.00,
    image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600',
    dietary_tags: ['gluten_free'],
    allergens: ['fish'],
    is_available: true,
    display_order: 1,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 'item-2-4',
    restaurant_id: 'rest-2-uuid-sakura',
    category_id: 'cat-2-sushi',
    name: 'Tuna Nigiri (2 pcs)',
    description: 'Bluefin tuna over pressed rice',
    price: 48.00,
    image_url: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600',
    dietary_tags: ['gluten_free'],
    allergens: ['fish'],
    is_available: true,
    display_order: 2,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 'item-2-5',
    restaurant_id: 'rest-2-uuid-sakura',
    category_id: 'cat-2-sushi',
    name: 'Sashimi Platter',
    description: 'Assorted fresh fish (chef selection, 12 pieces)',
    price: 95.00,
    image_url: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=600',
    dietary_tags: ['gluten_free'],
    allergens: ['fish'],
    is_available: true,
    display_order: 3,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },

  // SAKURA SUSHI - Rolls
  {
    id: 'item-2-6',
    restaurant_id: 'rest-2-uuid-sakura',
    category_id: 'cat-2-rolls',
    name: 'California Roll',
    description: 'Crab, avocado, cucumber, masago',
    price: 42.00,
    image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600',
    dietary_tags: [],
    allergens: ['fish', 'shellfish'],
    is_available: true,
    display_order: 1,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 'item-2-7',
    restaurant_id: 'rest-2-uuid-sakura',
    category_id: 'cat-2-rolls',
    name: 'Spicy Tuna Roll',
    description: 'Tuna, spicy mayo, scallions, sesame seeds',
    price: 46.00,
    image_url: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=600',
    dietary_tags: [],
    allergens: ['fish', 'eggs'],
    is_available: true,
    display_order: 2,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },

  // TACO LOCO - Tacos
  {
    id: 'item-3-1',
    restaurant_id: 'rest-3-uuid-loco',
    category_id: 'cat-3-tacos',
    name: 'Carne Asada Taco',
    description: 'Grilled beef, onions, cilantro, salsa verde (3 tacos)',
    price: 38.00,
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600',
    dietary_tags: ['gluten_free'],
    allergens: [],
    is_available: true,
    display_order: 1,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 'item-3-2',
    restaurant_id: 'rest-3-uuid-loco',
    category_id: 'cat-3-tacos',
    name: 'Al Pastor Taco',
    description: 'Marinated pork, pineapple, cilantro, onions (3 tacos)',
    price: 38.00,
    image_url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600',
    dietary_tags: ['gluten_free'],
    allergens: [],
    is_available: true,
    display_order: 2,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 'item-3-3',
    restaurant_id: 'rest-3-uuid-loco',
    category_id: 'cat-3-tacos',
    name: 'Fish Taco',
    description: 'Beer-battered fish, cabbage slaw, chipotle mayo (3 tacos)',
    price: 42.00,
    image_url: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=600',
    dietary_tags: [],
    allergens: ['fish', 'eggs', 'gluten'],
    is_available: true,
    display_order: 3,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 'item-3-4',
    restaurant_id: 'rest-3-uuid-loco',
    category_id: 'cat-3-tacos',
    name: 'Vegetarian Taco',
    description: 'Grilled vegetables, black beans, guacamole (3 tacos)',
    price: 34.00,
    image_url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600',
    dietary_tags: ['vegetarian', 'vegan', 'gluten_free'],
    allergens: [],
    is_available: true,
    display_order: 4,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  },

  // TACO LOCO - Burritos
  {
    id: 'item-3-5',
    restaurant_id: 'rest-3-uuid-loco',
    category_id: 'cat-3-burritos',
    name: 'California Burrito',
    description: 'Carne asada, fries, cheese, sour cream, guacamole',
    price: 48.00,
    image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600',
    dietary_tags: [],
    allergens: ['gluten', 'dairy'],
    is_available: true,
    display_order: 1,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 'item-3-6',
    restaurant_id: 'rest-3-uuid-loco',
    category_id: 'cat-3-burritos',
    name: 'Burrito Bowl',
    description: 'Your choice of protein, rice, beans, vegetables, toppings',
    price: 42.00,
    image_url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600',
    dietary_tags: ['gluten_free'],
    allergens: [],
    is_available: true,
    display_order: 2,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  },

  // TACO LOCO - Appetizers
  {
    id: 'item-3-7',
    restaurant_id: 'rest-3-uuid-loco',
    category_id: 'cat-3-appetizers',
    name: 'Guacamole & Chips',
    description: 'Fresh guacamole with crispy tortilla chips',
    price: 28.00,
    image_url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600',
    dietary_tags: ['vegetarian', 'vegan', 'gluten_free'],
    allergens: [],
    is_available: true,
    display_order: 1,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 'item-3-8',
    restaurant_id: 'rest-3-uuid-loco',
    category_id: 'cat-3-appetizers',
    name: 'Queso Fundido',
    description: 'Melted cheese with chorizo and peppers',
    price: 32.00,
    image_url: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=600',
    dietary_tags: ['gluten_free'],
    allergens: ['dairy'],
    is_available: true,
    display_order: 2,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  },

  // BISTRO PIERRE - Appetizers
  {
    id: 'item-4-1',
    restaurant_id: 'rest-4-uuid-pierre',
    category_id: 'cat-4-appetizers',
    name: 'French Onion Soup',
    description: 'Caramelized onions, beef broth, gruyère cheese, croutons',
    price: 36.00,
    image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600',
    dietary_tags: ['vegetarian'],
    allergens: ['gluten', 'dairy'],
    is_available: true,
    display_order: 1,
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z'
  },
  {
    id: 'item-4-2',
    restaurant_id: 'rest-4-uuid-pierre',
    category_id: 'cat-4-appetizers',
    name: 'Escargots de Bourgogne',
    description: 'Snails in garlic-herb butter (6 pieces)',
    price: 42.00,
    image_url: 'https://images.unsplash.com/photo-1583937443569-f14a57e2a7ec?w=600',
    dietary_tags: ['gluten_free'],
    allergens: ['shellfish', 'dairy', 'garlic'],
    is_available: true,
    display_order: 2,
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z'
  },

  // BISTRO PIERRE - Mains
  {
    id: 'item-4-3',
    restaurant_id: 'rest-4-uuid-pierre',
    category_id: 'cat-4-mains',
    name: 'Coq au Vin',
    description: 'Chicken braised in red wine with mushrooms and pearl onions',
    price: 78.00,
    image_url: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=600',
    dietary_tags: ['gluten_free'],
    allergens: [],
    is_available: true,
    display_order: 1,
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z'
  },
  {
    id: 'item-4-4',
    restaurant_id: 'rest-4-uuid-pierre',
    category_id: 'cat-4-mains',
    name: 'Boeuf Bourguignon',
    description: 'Slow-cooked beef in burgundy wine sauce with vegetables',
    price: 85.00,
    image_url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600',
    dietary_tags: ['gluten_free'],
    allergens: [],
    is_available: true,
    display_order: 2,
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z'
  },
  {
    id: 'item-4-5',
    restaurant_id: 'rest-4-uuid-pierre',
    category_id: 'cat-4-mains',
    name: 'Duck Confit',
    description: 'Crispy duck leg with roasted potatoes and green beans',
    price: 92.00,
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
    dietary_tags: ['gluten_free'],
    allergens: [],
    is_available: true,
    display_order: 3,
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z'
  },

  // BISTRO PIERRE - Desserts
  {
    id: 'item-4-6',
    restaurant_id: 'rest-4-uuid-pierre',
    category_id: 'cat-4-desserts',
    name: 'Crème Brûlée',
    description: 'Vanilla custard with caramelized sugar crust',
    price: 34.00,
    image_url: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600',
    dietary_tags: ['vegetarian', 'gluten_free'],
    allergens: ['dairy', 'eggs'],
    is_available: true,
    display_order: 1,
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z'
  },
  {
    id: 'item-4-7',
    restaurant_id: 'rest-4-uuid-pierre',
    category_id: 'cat-4-desserts',
    name: 'Tarte Tatin',
    description: 'Upside-down caramelized apple tart with vanilla ice cream',
    price: 36.00,
    image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600',
    dietary_tags: ['vegetarian'],
    allergens: ['gluten', 'dairy', 'eggs'],
    is_available: true,
    display_order: 2,
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z'
  },

  // SPICE GARDEN - Starters
  {
    id: 'item-5-1',
    restaurant_id: 'rest-5-uuid-spice',
    category_id: 'cat-5-appetizers',
    name: 'Samosa (2 pcs)',
    description: 'Crispy pastry filled with spiced potatoes and peas',
    price: 18.00,
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600',
    dietary_tags: ['vegetarian', 'vegan'],
    allergens: ['gluten'],
    is_available: true,
    display_order: 1,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z'
  },
  {
    id: 'item-5-2',
    restaurant_id: 'rest-5-uuid-spice',
    category_id: 'cat-5-appetizers',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese marinated in spices',
    price: 32.00,
    image_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600',
    dietary_tags: ['vegetarian', 'gluten_free'],
    allergens: ['dairy'],
    is_available: true,
    display_order: 2,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z'
  },

  // SPICE GARDEN - Curries
  {
    id: 'item-5-3',
    restaurant_id: 'rest-5-uuid-spice',
    category_id: 'cat-5-curries',
    name: 'Butter Chicken',
    description: 'Tender chicken in creamy tomato sauce with spices',
    price: 54.00,
    image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600',
    dietary_tags: ['gluten_free'],
    allergens: ['dairy'],
    is_available: true,
    display_order: 1,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z'
  },
  {
    id: 'item-5-4',
    restaurant_id: 'rest-5-uuid-spice',
    category_id: 'cat-5-curries',
    name: 'Lamb Rogan Josh',
    description: 'Aromatic lamb curry with yogurt and Kashmiri spices',
    price: 62.00,
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600',
    dietary_tags: ['gluten_free'],
    allergens: ['dairy'],
    is_available: true,
    display_order: 2,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z'
  },
  {
    id: 'item-5-5',
    restaurant_id: 'rest-5-uuid-spice',
    category_id: 'cat-5-curries',
    name: 'Chana Masala',
    description: 'Chickpea curry with tomatoes and aromatic spices',
    price: 42.00,
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600',
    dietary_tags: ['vegetarian', 'vegan', 'gluten_free'],
    allergens: [],
    is_available: true,
    display_order: 3,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z'
  },

  // SPICE GARDEN - Tandoor
  {
    id: 'item-5-6',
    restaurant_id: 'rest-5-uuid-spice',
    category_id: 'cat-5-tandoor',
    name: 'Tandoori Chicken',
    description: 'Half chicken marinated in yogurt and spices, clay oven roasted',
    price: 58.00,
    image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600',
    dietary_tags: ['gluten_free'],
    allergens: ['dairy'],
    is_available: true,
    display_order: 1,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z'
  },
  {
    id: 'item-5-7',
    restaurant_id: 'rest-5-uuid-spice',
    category_id: 'cat-5-tandoor',
    name: 'Seekh Kebab',
    description: 'Minced lamb skewers with herbs and spices',
    price: 52.00,
    image_url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600',
    dietary_tags: ['gluten_free'],
    allergens: [],
    is_available: true,
    display_order: 2,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z'
  },

  // SPICE GARDEN - Breads
  {
    id: 'item-5-8',
    restaurant_id: 'rest-5-uuid-spice',
    category_id: 'cat-5-breads',
    name: 'Garlic Naan',
    description: 'Traditional flatbread with garlic and butter',
    price: 12.00,
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600',
    dietary_tags: ['vegetarian'],
    allergens: ['gluten', 'dairy', 'garlic'],
    is_available: true,
    display_order: 1,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z'
  },
  {
    id: 'item-5-9',
    restaurant_id: 'rest-5-uuid-spice',
    category_id: 'cat-5-breads',
    name: 'Roti',
    description: 'Whole wheat flatbread',
    price: 8.00,
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600',
    dietary_tags: ['vegetarian', 'vegan'],
    allergens: ['gluten'],
    is_available: true,
    display_order: 2,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z'
  }
];

// =============================================
// REVIEWS
// =============================================
export const mockReviews: Review[] = [
  // Reviews for La Dolce Vita
  {
    id: 'review-1-1',
    restaurant_id: 'rest-1-uuid-dolce',
    user_id: 'customer-1-uuid-anna',
    rating: 5,
    comment: 'Absolutely amazing! The pasta was cooked to perfection and the atmosphere is so authentic. Mario himself came to our table to check on us. Best Italian food outside of Italy!',
    photos: null,
    created_at: '2024-08-15T19:30:00Z',
    updated_at: '2024-08-15T19:30:00Z'
  },
  {
    id: 'review-1-2',
    restaurant_id: 'rest-1-uuid-dolce',
    user_id: 'customer-2-uuid-john',
    rating: 5,
    comment: 'The pizza is incredible! Crust is perfectly crispy, and the ingredients are clearly fresh and high quality. Will definitely come back.',
    photos: null,
    created_at: '2024-08-20T20:15:00Z',
    updated_at: '2024-08-20T20:15:00Z'
  },
  {
    id: 'review-1-3',
    restaurant_id: 'rest-1-uuid-dolce',
    user_id: 'customer-4-uuid-michael',
    rating: 4,
    comment: 'Great food and service! The carbonara was creamy and delicious. Slightly pricey but worth it for the quality.',
    photos: null,
    created_at: '2024-09-01T18:45:00Z',
    updated_at: '2024-09-01T18:45:00Z'
  },

  // Reviews for Sakura Sushi
  {
    id: 'review-2-1',
    restaurant_id: 'rest-2-uuid-sakura',
    user_id: 'customer-1-uuid-anna',
    rating: 5,
    comment: 'The omakase was an incredible experience! Yuki-san is a true master. Every piece was perfect. This is authentic Japanese sushi at its finest.',
    photos: null,
    created_at: '2024-07-10T20:00:00Z',
    updated_at: '2024-07-10T20:00:00Z'
  },
  {
    id: 'review-2-2',
    restaurant_id: 'rest-2-uuid-sakura',
    user_id: 'customer-4-uuid-michael',
    rating: 5,
    comment: 'Best sushi I have had in this city. Fish is incredibly fresh, rice is perfectly seasoned. The attention to detail is impressive.',
    photos: null,
    created_at: '2024-08-05T19:15:00Z',
    updated_at: '2024-08-05T19:15:00Z'
  },
  {
    id: 'review-2-3',
    restaurant_id: 'rest-2-uuid-sakura',
    user_id: 'customer-5-uuid-sarah',
    rating: 5,
    comment: 'Amazing quality! A bit expensive but you get what you pay for. The sashimi platter was outstanding.',
    photos: null,
    created_at: '2024-09-12T19:45:00Z',
    updated_at: '2024-09-12T19:45:00Z'
  },

  // Reviews for Taco Loco
  {
    id: 'review-3-1',
    restaurant_id: 'rest-3-uuid-loco',
    user_id: 'customer-2-uuid-john',
    rating: 5,
    comment: 'These are the best tacos in town! The al pastor is my favorite. Great portions, reasonable prices, fun atmosphere.',
    photos: null,
    created_at: '2024-06-20T20:30:00Z',
    updated_at: '2024-06-20T20:30:00Z'
  },
  {
    id: 'review-3-2',
    restaurant_id: 'rest-3-uuid-loco',
    user_id: 'customer-3-uuid-emma',
    rating: 4,
    comment: 'Good Mexican food with nice vegan options! The vegetarian tacos were delicious and the guacamole is top-notch.',
    photos: null,
    created_at: '2024-07-15T19:00:00Z',
    updated_at: '2024-07-15T19:00:00Z'
  },
  {
    id: 'review-3-3',
    restaurant_id: 'rest-3-uuid-loco',
    user_id: 'customer-5-uuid-sarah',
    rating: 5,
    comment: 'Family-friendly and delicious! Kids loved it, and the margaritas were excellent. Great value for money.',
    photos: null,
    created_at: '2024-08-25T18:30:00Z',
    updated_at: '2024-08-25T18:30:00Z'
  },

  // Reviews for Bistro Pierre
  {
    id: 'review-4-1',
    restaurant_id: 'rest-4-uuid-pierre',
    user_id: 'customer-1-uuid-anna',
    rating: 5,
    comment: 'Exceptional French cuisine! The coq au vin was divine. Perfect for a romantic dinner. Pierre creates magic in the kitchen.',
    photos: null,
    created_at: '2024-05-10T21:00:00Z',
    updated_at: '2024-05-10T21:00:00Z'
  },
  {
    id: 'review-4-2',
    restaurant_id: 'rest-4-uuid-pierre',
    user_id: 'customer-4-uuid-michael',
    rating: 4,
    comment: 'Wonderful bistro experience. The duck confit was perfectly crispy. Wine selection is impressive. A bit formal but excellent quality.',
    photos: null,
    created_at: '2024-06-18T20:30:00Z',
    updated_at: '2024-06-18T20:30:00Z'
  },

  // Reviews for Spice Garden
  {
    id: 'review-5-1',
    restaurant_id: 'rest-5-uuid-spice',
    user_id: 'customer-3-uuid-emma',
    rating: 5,
    comment: 'Best Indian food in the area! So many vegan options and everything is clearly labeled. The chana masala is to die for!',
    photos: null,
    created_at: '2024-07-25T19:45:00Z',
    updated_at: '2024-07-25T19:45:00Z'
  },
  {
    id: 'review-5-2',
    restaurant_id: 'rest-5-uuid-spice',
    user_id: 'customer-2-uuid-john',
    rating: 4,
    comment: 'Great flavors and spice levels are perfect. The butter chicken is rich and creamy. Good value with generous portions.',
    photos: null,
    created_at: '2024-08-10T20:00:00Z',
    updated_at: '2024-08-10T20:00:00Z'
  },
  {
    id: 'review-5-3',
    restaurant_id: 'rest-5-uuid-spice',
    user_id: 'customer-5-uuid-sarah',
    rating: 5,
    comment: 'Family loves this place! Staff is very accommodating with dietary restrictions. The tandoori chicken is amazing!',
    photos: null,
    created_at: '2024-09-05T19:15:00Z',
    updated_at: '2024-09-05T19:15:00Z'
  }
];

// =============================================
// FOLLOWS (User following User)
// =============================================
export const mockFollows: Follow[] = [
  {
    follower_id: 'customer-1-uuid-anna',
    following_id: 'customer-4-uuid-michael',
    created_at: '2024-03-25T10:00:00Z'
  },
  {
    follower_id: 'customer-1-uuid-anna',
    following_id: 'customer-3-uuid-emma',
    created_at: '2024-04-01T10:00:00Z'
  },
  {
    follower_id: 'customer-2-uuid-john',
    following_id: 'customer-1-uuid-anna',
    created_at: '2024-04-10T10:00:00Z'
  },
  {
    follower_id: 'customer-3-uuid-emma',
    following_id: 'customer-1-uuid-anna',
    created_at: '2024-04-15T10:00:00Z'
  },
  {
    follower_id: 'customer-4-uuid-michael',
    following_id: 'customer-1-uuid-anna',
    created_at: '2024-04-20T10:00:00Z'
  },
  {
    follower_id: 'customer-5-uuid-sarah',
    following_id: 'customer-1-uuid-anna',
    created_at: '2024-05-01T10:00:00Z'
  }
];

// =============================================
// RESTAURANT FOLLOWS (User following Restaurant)
// =============================================
export const mockRestaurantFollows: RestaurantFollow[] = [
  // Anna follows multiple restaurants
  {
    user_id: 'customer-1-uuid-anna',
    restaurant_id: 'rest-1-uuid-dolce',
    created_at: '2024-03-05T10:00:00Z'
  },
  {
    user_id: 'customer-1-uuid-anna',
    restaurant_id: 'rest-2-uuid-sakura',
    created_at: '2024-03-10T10:00:00Z'
  },
  {
    user_id: 'customer-1-uuid-anna',
    restaurant_id: 'rest-4-uuid-pierre',
    created_at: '2024-03-15T10:00:00Z'
  },

  // John follows tacos and pizza
  {
    user_id: 'customer-2-uuid-john',
    restaurant_id: 'rest-1-uuid-dolce',
    created_at: '2024-03-20T10:00:00Z'
  },
  {
    user_id: 'customer-2-uuid-john',
    restaurant_id: 'rest-3-uuid-loco',
    created_at: '2024-04-01T10:00:00Z'
  },

  // Emma follows vegan-friendly places
  {
    user_id: 'customer-3-uuid-emma',
    restaurant_id: 'rest-3-uuid-loco',
    created_at: '2024-04-05T10:00:00Z'
  },
  {
    user_id: 'customer-3-uuid-emma',
    restaurant_id: 'rest-5-uuid-spice',
    created_at: '2024-04-10T10:00:00Z'
  },

  // Michael follows fine dining
  {
    user_id: 'customer-4-uuid-michael',
    restaurant_id: 'rest-2-uuid-sakura',
    created_at: '2024-04-15T10:00:00Z'
  },
  {
    user_id: 'customer-4-uuid-michael',
    restaurant_id: 'rest-4-uuid-pierre',
    created_at: '2024-04-20T10:00:00Z'
  },
  {
    user_id: 'customer-4-uuid-michael',
    restaurant_id: 'rest-1-uuid-dolce',
    created_at: '2024-05-01T10:00:00Z'
  },

  // Sarah follows family-friendly restaurants
  {
    user_id: 'customer-5-uuid-sarah',
    restaurant_id: 'rest-1-uuid-dolce',
    created_at: '2024-05-05T10:00:00Z'
  },
  {
    user_id: 'customer-5-uuid-sarah',
    restaurant_id: 'rest-3-uuid-loco',
    created_at: '2024-05-10T10:00:00Z'
  },
  {
    user_id: 'customer-5-uuid-sarah',
    restaurant_id: 'rest-5-uuid-spice',
    created_at: '2024-05-15T10:00:00Z'
  }
];

// =============================================
// EXPORT ALL MOCK DATA
// =============================================
export const mockData = {
  profiles: mockProfiles,
  customerProfiles: mockCustomerProfiles,
  restaurants: mockRestaurants,
  menuCategories: mockMenuCategories,
  menuItems: mockMenuItems,
  reviews: mockReviews,
  follows: mockFollows,
  restaurantFollows: mockRestaurantFollows
};

export default mockData;