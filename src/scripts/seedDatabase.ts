import { supabase } from '../lib/supabase';

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
    { email: 'alice.food@example.com', username: 'alice_foodie', fullName: 'Alice Johnson', bio: 'Food enthusiast and blogger. Always looking for the next great meal!' },
    { email: 'bob.chef@example.com', username: 'bob_chef', fullName: 'Bob Smith', bio: 'Amateur chef and restaurant reviewer.' },
    { email: 'carol.vegan@example.com', username: 'carol_vegan', fullName: 'Carol Williams', bio: 'Vegan lifestyle advocate. Plant-based food lover.' },
    { email: 'david.travel@example.com', username: 'david_traveler', fullName: 'David Brown', bio: 'Traveling the world one restaurant at a time.' },
    { email: 'emma.baker@example.com', username: 'emma_baker', fullName: 'Emma Davis', bio: 'Pastry chef and dessert connoisseur.' },
    { email: 'frank.critic@example.com', username: 'frank_critic', fullName: 'Frank Miller', bio: 'Professional food critic with 15 years experience.' },
    { email: 'grace.health@example.com', username: 'grace_healthy', fullName: 'Grace Wilson', bio: 'Health-conscious foodie. Nutrition expert.' },
    { email: 'henry.bbq@example.com', username: 'henry_bbq', fullName: 'Henry Moore', bio: 'BBQ enthusiast and grill master.' },
    { email: 'isabel.wine@example.com', username: 'isabel_sommelier', fullName: 'Isabel Taylor', bio: 'Wine sommelier and food pairing expert.' },
    { email: 'jack.pizza@example.com', username: 'jack_pizza', fullName: 'Jack Anderson', bio: 'Pizza lover and Italian cuisine expert.' },
  ];

  const createdProfiles = [];

  for (const customer of customers) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: customer.email,
        password: 'Password123!',
        options: {
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
        .update({
          username: customer.username,
          full_name: customer.fullName,
          bio: customer.bio,
          avatar_url: SAMPLE_AVATARS[createdProfiles.length % SAMPLE_AVATARS.length],
        })
        .eq('id', authData.user.id)
        .select()
        .single();

      if (profileError) {
        console.warn(`⚠️  Could not update profile for ${customer.email}:`, profileError.message);
        continue;
      }

      const { error: customerProfileError } = await supabase
        .from('customer_profiles')
        .insert({
          id: authData.user.id,
          username: customer.username,
          favorite_cuisines: [CUISINES[Math.floor(Math.random() * CUISINES.length)]],
          dietary_restrictions: [],
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
    { email: 'bella.italia@example.com', name: 'Bella Italia', slug: 'bella-italia', cuisine: 'Italian', description: 'Authentic Italian cuisine in the heart of the city.' },
    { email: 'tokyo.sushi@example.com', name: 'Tokyo Sushi House', slug: 'tokyo-sushi', cuisine: 'Japanese', description: 'Fresh sushi and traditional Japanese dishes.' },
    { email: 'taco.fiesta@example.com', name: 'Taco Fiesta', slug: 'taco-fiesta', cuisine: 'Mexican', description: 'Vibrant Mexican street food and tacos.' },
    { email: 'le.bistro@example.com', name: 'Le Bistro Parisien', slug: 'le-bistro', cuisine: 'French', description: 'Classic French bistro with modern twists.' },
    { email: 'thai.garden@example.com', name: 'Thai Garden', slug: 'thai-garden', cuisine: 'Thai', description: 'Aromatic Thai dishes with authentic flavors.' },
  ];

  const createdRestaurants = [];

  for (const restaurant of restaurants) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: restaurant.email,
        password: 'Password123!',
        options: {
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
        .update({
          role: 'RESTAURANT',
          full_name: restaurant.name,
        })
        .eq('id', authData.user.id)
        .select()
        .single();

      if (profileError) {
        console.warn(`⚠️  Could not update profile for ${restaurant.email}:`, profileError.message);
        continue;
      }

      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .insert({
          profile_id: authData.user.id,
          location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
          is_featured: Math.random() > 0.5,
          is_active: true,
        })
        .select()
        .single();

      if (restaurantError) {
        console.warn(`⚠️  Could not create restaurant for ${restaurant.email}:`, restaurantError.message);
        continue;
      }

      const { error: restaurantProfileError } = await supabase
        .from('restaurant_profiles')
        .insert({
          id: authData.user.id,
          name: restaurant.name,
          slug: restaurant.slug,
          cuisine_type: restaurant.cuisine,
          description: restaurant.description,
          cover_photo_url: RESTAURANT_COVERS[createdRestaurants.length % RESTAURANT_COVERS.length],
          price_range: '$$',
          rating: (Math.random() * 2 + 3).toFixed(1),
        });

      if (restaurantProfileError) {
        console.warn(`⚠️  Could not create restaurant profile for ${restaurant.email}:`, restaurantProfileError.message);
      }

      createdRestaurants.push({ ...restaurantData, profile, name: restaurant.name, slug: restaurant.slug });

    } catch (error) {
      console.warn(`⚠️  Error creating restaurant ${restaurant.email}:`, error);
    }
  }

  return createdRestaurants;
}

async function seedMenuItems(restaurants: any[]): Promise<any[]> {
  const menuItemsByCategory: { [key: string]: any[] } = {
    'Italian': [
      { name: 'Margherita Pizza', price: 14.99, description: 'Classic tomato, mozzarella, and basil' },
      { name: 'Spaghetti Carbonara', price: 16.99, description: 'Creamy pasta with pancetta and parmesan' },
      { name: 'Tiramisu', price: 8.99, description: 'Coffee-soaked ladyfingers with mascarpone' },
    ],
    'Japanese': [
      { name: 'Salmon Nigiri', price: 12.99, description: 'Fresh salmon over sushi rice' },
      { name: 'Chicken Ramen', price: 15.99, description: 'Rich broth with tender chicken and noodles' },
      { name: 'Mochi Ice Cream', price: 6.99, description: 'Sweet rice cake filled with ice cream' },
    ],
    'Mexican': [
      { name: 'Beef Tacos', price: 10.99, description: 'Seasoned beef with fresh toppings' },
      { name: 'Chicken Burrito', price: 12.99, description: 'Grilled chicken with rice, beans, and salsa' },
      { name: 'Churros', price: 5.99, description: 'Fried dough with cinnamon sugar' },
    ],
    'French': [
      { name: 'Coq au Vin', price: 22.99, description: 'Chicken braised in red wine' },
      { name: 'French Onion Soup', price: 9.99, description: 'Caramelized onions with melted gruyere' },
      { name: 'Crème Brûlée', price: 8.99, description: 'Vanilla custard with caramelized sugar' },
    ],
    'Thai': [
      { name: 'Pad Thai', price: 13.99, description: 'Stir-fried noodles with shrimp and peanuts' },
      { name: 'Green Curry', price: 14.99, description: 'Spicy coconut curry with vegetables' },
      { name: 'Mango Sticky Rice', price: 7.99, description: 'Sweet coconut rice with fresh mango' },
    ],
  };

  const allMenuItems = [];

  for (const restaurant of restaurants) {
    const { data: restaurantProfile } = await supabase
      .from('restaurant_profiles')
      .select('cuisine_type')
      .eq('id', restaurant.profile_id)
      .single();

    if (!restaurantProfile) continue;

    const items = menuItemsByCategory[restaurantProfile.cuisine_type] || [];

    for (const item of items) {
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          restaurant_id: restaurant.id,
          name: item.name,
          description: item.description,
          price: item.price,
          is_available: true,
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
    'Amazing food and great atmosphere! Highly recommend.',
    'The service was excellent and the food was delicious.',
    'Good experience overall, will definitely come back.',
    'Outstanding dishes with authentic flavors.',
    'A bit pricey but worth it for the quality.',
  ];

  const createdReviews = [];

  for (const restaurant of restaurants) {
    const numReviews = Math.floor(Math.random() * 3) + 2;
    const reviewers = customers.sort(() => 0.5 - Math.random()).slice(0, numReviews);

    for (const reviewer of reviewers) {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: reviewer.id,
          restaurant_id: restaurant.id,
          rating: Math.floor(Math.random() * 2) + 4,
          comment: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
          verification_level: 'unverified',
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
    'I completely agree! The atmosphere was wonderful.',
    'Thanks for the recommendation!',
    'Great review, very helpful.',
    'Did you try the dessert? It was amazing!',
    'I had a similar experience when I visited.',
  ];

  const comments = [];

  for (const review of reviews) {
    if (Math.random() > 0.6) continue;

    const numComments = Math.floor(Math.random() * 2) + 1;
    const commenters = customers
      .filter(c => c.id !== review.user_id)
      .sort(() => 0.5 - Math.random())
      .slice(0, numComments);

    for (const commenter of commenters) {
      const { data, error } = await supabase
        .from('review_comments')
        .insert({
          review_id: review.id,
          user_id: commenter.id,
          content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        })
        .select()
        .single();

      if (!error && data) {
        comments.push(data);
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
