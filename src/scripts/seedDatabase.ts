import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

const SAMPLE_AVATARS = [
  'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1484810/pexels-photo-1484810.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1547971/pexels-photo-1547971.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=200',
];

const RESTAURANT_COVERS = [
  'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

const CUISINES = ['Italian', 'Japanese', 'Mexican', 'French', 'Thai', 'Indian', 'Chinese', 'Mediterranean'];
const LOCATIONS = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Austin, TX', 'Seattle, WA', 'Miami, FL'];

interface SeedData {
  customers: any[];
  restaurants: any[];
  reviews: any[];
  follows: any[];
  restaurantFollows: any[];
  comments: any[];
}

export async function seedDatabase(): Promise<void> {
  console.log('🌱 Starting database seeding...');

  const seedData: SeedData = {
    customers: [],
    restaurants: [],
    reviews: [],
    follows: [],
    restaurantFollows: [],
    comments: [],
  };

  try {
    const customerProfiles = await seedCustomerProfiles();
    seedData.customers = customerProfiles;
    console.log(`✅ Created ${customerProfiles.length} customer profiles`);

    const restaurantProfiles = await seedRestaurantProfiles();
    seedData.restaurants = restaurantProfiles;
    console.log(`✅ Created ${restaurantProfiles.length} restaurant profiles`);

    const menuItems = await seedMenuItems(restaurantProfiles);
    console.log(`✅ Created ${menuItems.length} menu items`);

    const reviews = await seedReviews(customerProfiles, restaurantProfiles);
    seedData.reviews = reviews;
    console.log(`✅ Created ${reviews.length} reviews`);

    const follows = await seedFollows(customerProfiles);
    seedData.follows = follows;
    console.log(`✅ Created ${follows.length} user follows`);

    const restaurantFollows = await seedRestaurantFollows(customerProfiles, restaurantProfiles);
    seedData.restaurantFollows = restaurantFollows;
    console.log(`✅ Created ${restaurantFollows.length} restaurant follows`);

    const comments = await seedComments(customerProfiles, reviews);
    seedData.comments = comments;
    console.log(`✅ Created ${comments.length} review comments`);

    await seedUserPresence(customerProfiles);
    console.log(`✅ Created presence for ${customerProfiles.length} users`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${seedData.customers.length} customers`);
    console.log(`   - ${seedData.restaurants.length} restaurants`);
    console.log(`   - ${menuItems.length} menu items`);
    console.log(`   - ${seedData.reviews.length} reviews`);
    console.log(`   - ${seedData.follows.length} user follows`);
    console.log(`   - ${seedData.restaurantFollows.length} restaurant follows`);
    console.log(`   - ${seedData.comments.length} comments`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

async function seedCustomerProfiles(): Promise<any[]> {
  const customers = [
    {
      email: 'alice.food@example.com',
      username: 'alice_foodie',
      fullName: 'Alice Johnson',
      bio: 'Food enthusiast and blogger. Always looking for the next great meal!',
      location: 'Warsaw, Poland',
      favoriteCuisines: ['Italian', 'Japanese'],
      dietaryRestrictions: [] as string[]
    },
    {
      email: 'bob.chef@example.com',
      username: 'bob_chef',
      fullName: 'Bob Smith',
      bio: 'Amateur chef and restaurant reviewer. Love trying new flavors!',
      location: 'Krakow, Poland',
      favoriteCuisines: ['French', 'Thai'],
      dietaryRestrictions: [] as string[]
    },
    {
      email: 'carol.vegan@example.com',
      username: 'carol_vegan',
      fullName: 'Carol Williams',
      bio: 'Vegan lifestyle advocate. Plant-based food lover.',
      location: 'Gdansk, Poland',
      favoriteCuisines: ['Mediterranean', 'Thai'],
      dietaryRestrictions: ['Vegan', 'Dairy-Free']
    },
  ];

  const createdProfiles = [];

  for (const customer of customers) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: customer.email,
        password: 'Password123!',
        options: {
          emailRedirectTo: undefined,
          data: {
            full_name: customer.fullName,
            role: 'CUSTOMER',
          },
        },
      });

      if (authError || !authData.user) {
        console.warn(`⚠️  Could not create auth user for ${customer.email}:`, authError?.message);
        continue;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.warn(`⚠️  Could not fetch profile for ${customer.email}:`, profileError.message);
        continue;
      }

      const { error: customerProfileError } = await supabase
        .from('customer_profiles')
        .insert({
          id: authData.user.id,
          username: customer.username,
          avatar_url: SAMPLE_AVATARS[createdProfiles.length % SAMPLE_AVATARS.length],
          bio: customer.bio,
          location: customer.location,
          favorite_cuisines: customer.favoriteCuisines,
          dietary_restrictions: customer.dietaryRestrictions,
          profile_public: true,
          notifications_enabled: true,
        });

      if (customerProfileError) {
        console.warn(`⚠️  Could not create customer profile for ${customer.email}:`, customerProfileError.message);
      }

      createdProfiles.push({ ...profile, email: customer.email });

    } catch (error) {
      console.warn(`⚠️  Error creating customer ${customer.email}:`, error);
    }
  }

  return createdProfiles;
}

async function seedRestaurantProfiles(): Promise<any[]> {
  const restaurants = [
    {
      email: 'bella.italia@example.com',
      name: 'Bella Italia',
      slug: 'bella-italia',
      cuisineTypes: ['Italian'],
      description: 'Authentic Italian cuisine in the heart of Warsaw. Family recipes passed down through generations, featuring handmade pasta and wood-fired pizzas.',
      address: 'ul. Nowy Świat 25',
      city: 'Warsaw',
      postalCode: '00-029',
      phone: '+48 22 123 4567',
      website: 'https://bella-italia-warsaw.example.com',
      businessHours: {
        monday: { open: '12:00', close: '22:00' },
        tuesday: { open: '12:00', close: '22:00' },
        wednesday: { open: '12:00', close: '22:00' },
        thursday: { open: '12:00', close: '22:00' },
        friday: { open: '12:00', close: '23:00' },
        saturday: { open: '12:00', close: '23:00' },
        sunday: { open: '12:00', close: '21:00' }
      },
      priceLevel: 2,
      tags: ['vegetarian-friendly', 'outdoor-seating', 'wine-bar'],
      latitude: 52.2337,
      longitude: 21.0182
    },
    {
      email: 'tokyo.sushi@example.com',
      name: 'Tokyo Sushi House',
      slug: 'tokyo-sushi',
      cuisineTypes: ['Japanese'],
      description: 'Traditional Japanese sushi restaurant with master chefs trained in Tokyo. Fresh fish delivered daily, authentic omakase experience.',
      address: 'ul. Marszałkowska 104',
      city: 'Warsaw',
      postalCode: '00-017',
      phone: '+48 22 234 5678',
      website: 'https://tokyo-sushi-warsaw.example.com',
      businessHours: {
        monday: { open: '13:00', close: '22:00' },
        tuesday: { open: '13:00', close: '22:00' },
        wednesday: { open: '13:00', close: '22:00' },
        thursday: { open: '13:00', close: '22:00' },
        friday: { open: '13:00', close: '23:00' },
        saturday: { open: '13:00', close: '23:00' },
        sunday: { open: '14:00', close: '21:00' }
      },
      priceLevel: 3,
      tags: ['gluten-free-options', 'takeout', 'delivery'],
      latitude: 52.2293,
      longitude: 21.0148
    },
    {
      email: 'thai.garden@example.com',
      name: 'Thai Garden',
      slug: 'thai-garden',
      cuisineTypes: ['Thai'],
      description: 'Aromatic Thai dishes with authentic flavors. Experience the perfect balance of sweet, sour, salty, and spicy in every dish.',
      address: 'ul. Krakowskie Przedmieście 15',
      city: 'Warsaw',
      postalCode: '00-071',
      phone: '+48 22 345 6789',
      website: 'https://thai-garden-warsaw.example.com',
      businessHours: {
        monday: { open: '11:30', close: '22:00' },
        tuesday: { open: '11:30', close: '22:00' },
        wednesday: { open: '11:30', close: '22:00' },
        thursday: { open: '11:30', close: '22:00' },
        friday: { open: '11:30', close: '23:00' },
        saturday: { open: '12:00', close: '23:00' },
        sunday: { open: '12:00', close: '21:00' }
      },
      priceLevel: 2,
      tags: ['vegan-options', 'spicy', 'casual-dining'],
      latitude: 52.2395,
      longitude: 21.0173
    }
  ];

  const createdRestaurants = [];

  for (const restaurant of restaurants) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: restaurant.email,
        password: 'Password123!',
        options: {
          emailRedirectTo: undefined,
          data: {
            full_name: restaurant.name,
            role: 'RESTAURANT',
          },
        },
      });

      if (authError || !authData.user) {
        console.warn(`⚠️  Could not create auth user for ${restaurant.email}:`, authError?.message);
        continue;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.warn(`⚠️  Could not fetch profile for ${restaurant.email}:`, profileError.message);
        continue;
      }

      const { error: restaurantProfileError } = await supabase
        .from('restaurant_profiles')
        .insert({
          id: authData.user.id,
          name: restaurant.name,
          slug: restaurant.slug,
          cuisine_types: restaurant.cuisineTypes,
          description: restaurant.description,
          address: restaurant.address,
          city: restaurant.city,
          postal_code: restaurant.postalCode,
          country: 'Poland',
          phone: restaurant.phone,
          website: restaurant.website,
          email: restaurant.email,
          business_hours: restaurant.businessHours,
          price_level: restaurant.priceLevel,
          tags: restaurant.tags,
          cover_photo_url: RESTAURANT_COVERS[createdRestaurants.length % RESTAURANT_COVERS.length],
          verification_status: 'verified',
          verified_at: new Date().toISOString(),
        });

      if (restaurantProfileError) {
        console.warn(`⚠️  Could not create restaurant profile for ${restaurant.email}:`, restaurantProfileError.message);
        continue;
      }

      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .insert({
          profile_id: authData.user.id,
          location: `POINT(${restaurant.longitude} ${restaurant.latitude})`,
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
          is_featured: createdRestaurants.length === 0,
          is_active: true,
        })
        .select()
        .single();

      if (restaurantError) {
        console.warn(`⚠️  Could not create restaurant for ${restaurant.email}:`, restaurantError.message);
        continue;
      }

      createdRestaurants.push({ ...restaurantData, profile, name: restaurant.name, slug: restaurant.slug, cuisineTypes: restaurant.cuisineTypes });

    } catch (error) {
      console.warn(`⚠️  Error creating restaurant ${restaurant.email}:`, error);
    }
  }

  return createdRestaurants;
}

async function seedMenuItems(restaurants: any[]): Promise<any[]> {
  const menuItemsByCategory: { [key: string]: any[] } = {
    'Italian': [
      { name: 'Margherita Pizza', price: 42.00, description: 'Classic Neapolitan pizza with San Marzano tomatoes, buffalo mozzarella, and fresh basil', category: 'Main Courses', isSignature: true, spiceLevel: 0 },
      { name: 'Spaghetti Carbonara', price: 48.00, description: 'Traditional Roman pasta with guanciale, Pecorino Romano, and organic eggs', category: 'Main Courses', isSignature: true, spiceLevel: 0 },
      { name: 'Bruschetta al Pomodoro', price: 28.00, description: 'Grilled ciabatta with fresh tomatoes, garlic, and extra virgin olive oil', category: 'Appetizers', isSignature: false, spiceLevel: 0 },
      { name: 'Risotto ai Funghi', price: 52.00, description: 'Creamy Arborio rice with wild mushrooms and Parmigiano-Reggiano', category: 'Main Courses', isSignature: false, spiceLevel: 0 },
      { name: 'Tiramisu', price: 32.00, description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream', category: 'Desserts', isSignature: true, spiceLevel: 0 },
      { name: 'Panna Cotta', price: 28.00, description: 'Silky vanilla cream pudding with berry compote', category: 'Desserts', isSignature: false, spiceLevel: 0 },
    ],
    'Japanese': [
      { name: 'Omakase Sushi Set', price: 180.00, description: '12-piece chef\'s selection of premium sushi with seasonal fish', category: 'Sushi & Sashimi', isSignature: true, spiceLevel: 0 },
      { name: 'Salmon Nigiri', price: 45.00, description: 'Fresh Norwegian salmon over hand-pressed sushi rice (2 pieces)', category: 'Sushi & Sashimi', isSignature: false, spiceLevel: 0 },
      { name: 'Tuna Sashimi', price: 55.00, description: 'Premium bluefin tuna belly served raw (6 pieces)', category: 'Sushi & Sashimi', isSignature: true, spiceLevel: 0 },
      { name: 'Tonkotsu Ramen', price: 52.00, description: 'Rich pork bone broth with chashu, soft egg, and bamboo shoots', category: 'Hot Dishes', isSignature: true, spiceLevel: 1 },
      { name: 'Tempura Moriawase', price: 48.00, description: 'Assorted vegetable and shrimp tempura with tentsuyu sauce', category: 'Hot Dishes', isSignature: false, spiceLevel: 0 },
      { name: 'Mochi Ice Cream', price: 28.00, description: 'Sweet rice cake filled with green tea or vanilla ice cream (3 pieces)', category: 'Desserts', isSignature: false, spiceLevel: 0 },
    ],
    'Thai': [
      { name: 'Pad Thai', price: 42.00, description: 'Stir-fried rice noodles with shrimp, tofu, peanuts, and tamarind sauce', category: 'Noodles', isSignature: true, spiceLevel: 2 },
      { name: 'Green Curry', price: 48.00, description: 'Spicy green curry with chicken, Thai basil, and coconut milk', category: 'Curries', isSignature: true, spiceLevel: 4 },
      { name: 'Tom Yum Goong', price: 38.00, description: 'Hot and sour soup with jumbo prawns, lemongrass, and galangal', category: 'Soups', isSignature: true, spiceLevel: 3 },
      { name: 'Som Tam', price: 32.00, description: 'Spicy green papaya salad with cherry tomatoes and peanuts', category: 'Salads', isSignature: false, spiceLevel: 4 },
      { name: 'Massaman Curry', price: 45.00, description: 'Mild curry with beef, potatoes, and roasted peanuts', category: 'Curries', isSignature: false, spiceLevel: 1 },
      { name: 'Mango Sticky Rice', price: 28.00, description: 'Sweet glutinous rice with fresh mango and coconut cream', category: 'Desserts', isSignature: true, spiceLevel: 0 },
    ],
  };

  const allMenuItems = [];
  const allCategories: { [key: string]: any } = {};

  for (const restaurant of restaurants) {
    const cuisineType = restaurant.cuisineTypes?.[0];
    if (!cuisineType) continue;

    const items = menuItemsByCategory[cuisineType] || [];
    const categoryNames = [...new Set(items.map(item => item.category))];

    for (const categoryName of categoryNames) {
      const { data: categoryData, error: categoryError } = await supabase
        .from('menu_categories')
        .insert({
          restaurant_id: restaurant.id,
          name: categoryName,
          display_order: categoryNames.indexOf(categoryName),
          is_active: true,
        })
        .select()
        .single();

      if (!categoryError && categoryData) {
        allCategories[`${restaurant.id}_${categoryName}`] = categoryData;
      }
    }

    for (const item of items) {
      const category = allCategories[`${restaurant.id}_${item.category}`];
      if (!category) continue;

      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          restaurant_id: restaurant.id,
          category_id: category.id,
          name: item.name,
          description: item.description,
          price: item.price,
          is_available: true,
          is_signature: item.isSignature,
          spice_level: item.spiceLevel,
          preparation_time: 20 + Math.floor(Math.random() * 20),
        })
        .select()
        .single();

      if (!error && data) {
        allMenuItems.push(data);
      }
    }
  }

  return allMenuItems;
}

async function seedReviews(customers: any[], restaurants: any[]): Promise<any[]> {
  const reviewTexts = [
    'Amazing food and great atmosphere! The staff was incredibly friendly and attentive. Every dish we tried was perfectly prepared.',
    'The service was excellent and the food was delicious. I especially loved the signature dishes - you can tell the chef puts real care into each plate.',
    'Good experience overall, will definitely come back. The ambiance is perfect for a date night or special occasion.',
    'Outstanding dishes with authentic flavors. As someone who has traveled extensively, I can say this is the real deal!',
    'A bit pricey but absolutely worth it for the quality. The ingredients are clearly fresh and high-quality.',
    'Best meal I\'ve had in months! The presentation was beautiful and the flavors were incredible. Highly recommend the tasting menu.',
    'Cozy atmosphere and fantastic food. The staff made great recommendations and everything exceeded our expectations.',
  ];

  const createdReviews = [];

  for (const restaurant of restaurants) {
    const numReviews = 2;
    const reviewers = [...customers].sort(() => 0.5 - Math.random()).slice(0, numReviews);

    for (const reviewer of reviewers) {
      const rating = Math.floor(Math.random() * 2) + 4;
      const verificationLevels = ['unverified', 'verified_visit', 'verified_purchase'];
      const verificationLevel = verificationLevels[Math.floor(Math.random() * verificationLevels.length)];

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: reviewer.id,
          restaurant_id: restaurant.id,
          rating: rating,
          comment: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
          verification_level: verificationLevel,
          visit_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          moderation_status: 'active',
        })
        .select()
        .single();

      if (!error && data) {
        createdReviews.push(data);
      }
    }
  }

  return createdReviews;
}

async function seedFollows(customers: any[]): Promise<any[]> {
  const follows = [];

  for (let i = 0; i < customers.length; i++) {
    const numFollows = Math.floor(Math.random() * 3) + 1;
    const followees = customers
      .filter((_, index) => index !== i)
      .sort(() => 0.5 - Math.random())
      .slice(0, numFollows);

    for (const followee of followees) {
      const { data, error } = await supabase
        .from('user_follows')
        .insert({
          follower_id: customers[i].id,
          followee_id: followee.id,
        })
        .select()
        .single();

      if (!error && data) {
        follows.push(data);
      }
    }
  }

  return follows;
}

async function seedRestaurantFollows(customers: any[], restaurants: any[]): Promise<any[]> {
  const follows = [];

  for (const customer of customers) {
    const numFollows = Math.floor(Math.random() * 3) + 1;
    const favoriteRestaurants = restaurants
      .sort(() => 0.5 - Math.random())
      .slice(0, numFollows);

    for (const restaurant of favoriteRestaurants) {
      const { data, error } = await supabase
        .from('restaurant_follows')
        .insert({
          user_id: customer.id,
          restaurant_id: restaurant.id,
        })
        .select()
        .single();

      if (!error && data) {
        follows.push(data);
      }
    }
  }

  return follows;
}

async function seedComments(customers: any[], reviews: any[]): Promise<any[]> {
  const commentTexts = [
    'I completely agree! The atmosphere was wonderful. We went last week and had such a great time.',
    'Thanks for the recommendation! Adding this to my must-visit list.',
    'Great review, very helpful. Did they accommodate dietary restrictions?',
    'Did you try the dessert? It was amazing! Best I\'ve ever had.',
    'I had a similar experience when I visited. The service really stands out.',
    'This review convinced me to book a table for next weekend!',
    'Couldn\'t agree more about the quality. Worth every penny.',
  ];

  const comments = [];

  for (const review of reviews) {
    if (Math.random() > 0.5) continue;

    const numComments = 1;
    const commenters = customers
      .filter(c => c.id !== review.user_id)
      .sort(() => 0.5 - Math.random())
      .slice(0, numComments);

    for (const commenter of commenters) {
      const { data: commentData } = await supabase
        .from('review_comments')
        .insert({
          review_id: review.id,
          user_id: commenter.id,
          content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        })
        .select()
        .single();

      if (commentData) {
        comments.push(commentData);
      }
    }
  }

  return comments;
}

async function seedUserPresence(customers: any[]): Promise<void> {
  const statuses = ['online', 'away', 'offline'];

  for (const customer of customers) {
    await supabase
      .from('user_presence')
      .upsert({
        user_id: customer.id,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        last_seen: new Date().toISOString(),
      });
  }
}

if (typeof window === 'undefined') {
  seedDatabase().catch(console.error);
}
