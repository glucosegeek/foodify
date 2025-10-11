# Database Seeding Guide

This guide explains how to populate your database with mock data for testing the restaurant review application.

## Overview

The application includes a comprehensive seed script that creates:
- 3 customer profiles with diverse preferences
- 3 restaurant profiles with complete business information
- Menu items for each restaurant with categories
- Reviews and social interactions
- User follows and restaurant follows

## Test Accounts

### Customer Accounts

1. **Alice Johnson (@alice_foodie)**
   - Email: `alice.food@example.com`
   - Password: `Password123!`
   - Bio: Food enthusiast and blogger
   - Location: Warsaw, Poland
   - Favorite Cuisines: Italian, Japanese

2. **Bob Smith (@bob_chef)**
   - Email: `bob.chef@example.com`
   - Password: `Password123!`
   - Bio: Amateur chef and restaurant reviewer
   - Location: Krakow, Poland
   - Favorite Cuisines: French, Thai

3. **Carol Williams (@carol_vegan)**
   - Email: `carol.vegan@example.com`
   - Password: `Password123!`
   - Bio: Vegan lifestyle advocate
   - Location: Gdansk, Poland
   - Favorite Cuisines: Mediterranean, Thai
   - Dietary Restrictions: Vegan, Dairy-Free

### Restaurant Accounts

1. **Bella Italia**
   - Email: `bella.italia@example.com`
   - Password: `Password123!`
   - Slug: `bella-italia`
   - Cuisine: Italian
   - Location: ul. Nowy Świat 25, Warsaw
   - Price Level: $$ (2/4)
   - Features: Vegetarian-friendly, Outdoor seating, Wine bar
   - Menu Items: 6 items including Margherita Pizza, Spaghetti Carbonara, Tiramisu

2. **Tokyo Sushi House**
   - Email: `tokyo.sushi@example.com`
   - Password: `Password123!`
   - Slug: `tokyo-sushi`
   - Cuisine: Japanese
   - Location: ul. Marszałkowska 104, Warsaw
   - Price Level: $$$ (3/4)
   - Features: Gluten-free options, Takeout, Delivery
   - Menu Items: 6 items including Omakase Sushi Set, Tonkotsu Ramen, Mochi Ice Cream

3. **Thai Garden**
   - Email: `thai.garden@example.com`
   - Password: `Password123!`
   - Slug: `thai-garden`
   - Cuisine: Thai
   - Location: ul. Krakowskie Przedmieście 15, Warsaw
   - Price Level: $$ (2/4)
   - Features: Vegan options, Spicy, Casual dining
   - Menu Items: 6 items including Pad Thai, Green Curry, Mango Sticky Rice

## Seeding Methods

### Method 1: Manual Account Creation (Recommended)

Due to Supabase Auth requiring email confirmation settings, the easiest way to test is to manually create accounts through the application:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the signup page and create accounts using the credentials listed above

3. For each account:
   - Sign up with the email and password
   - Complete the profile based on the information above
   - For restaurant accounts, make sure to select "Restaurant" as the account type

### Method 2: Automated Seed Script (Requires Configuration)

If your Supabase project has email confirmation disabled:

1. Run the seed script:
   ```bash
   npm run seed
   ```

2. The script will automatically create:
   - All user accounts
   - Customer and restaurant profiles
   - Menu items with categories
   - Reviews with different verification levels
   - Social follows and interactions
   - User presence data

## What Gets Created

### Menu Items

Each restaurant has 6 menu items organized into categories:

**Bella Italia:**
- Appetizers: Bruschetta al Pomodoro
- Main Courses: Margherita Pizza, Spaghetti Carbonara, Risotto ai Funghi
- Desserts: Tiramisu, Panna Cotta

**Tokyo Sushi House:**
- Sushi & Sashimi: Omakase Sushi Set, Salmon Nigiri, Tuna Sashimi
- Hot Dishes: Tonkotsu Ramen, Tempura Moriawase
- Desserts: Mochi Ice Cream

**Thai Garden:**
- Noodles: Pad Thai
- Curries: Green Curry, Massaman Curry
- Soups: Tom Yum Goong
- Salads: Som Tam
- Desserts: Mango Sticky Rice

### Social Interactions

- Alice follows Bob and Carol
- Bob follows Alice
- Alice follows Bella Italia and Tokyo Sushi House
- Bob follows Tokyo Sushi House
- Carol follows Thai Garden
- Each restaurant has 2 reviews with different verification levels
- Some reviews have comments from other users

## Verification Status

All restaurants are pre-verified (`verification_status: 'verified'`) so they appear immediately in search results and are accessible to all users.

## Testing Scenarios

With this mock data, you can test:

1. **Customer Features:**
   - Browsing restaurants by cuisine type
   - Viewing restaurant details and menus
   - Writing and reading reviews
   - Following other users and restaurants
   - Viewing activity feeds
   - Managing favorite restaurants

2. **Restaurant Features:**
   - Managing restaurant profile
   - Editing menu items and categories
   - Responding to reviews
   - Viewing follower count
   - Posting restaurant updates

3. **Social Features:**
   - User-to-user follows
   - Restaurant follows
   - Review comments
   - Activity feeds
   - User presence indicators

## Cleanup

To remove all mock data and start fresh:

```sql
-- Run in Supabase SQL Editor
DELETE FROM reviews;
DELETE FROM restaurant_follows;
DELETE FROM user_follows;
DELETE FROM menu_items;
DELETE FROM menu_categories;
DELETE FROM restaurants;
DELETE FROM customer_profiles;
DELETE FROM restaurant_profiles;
DELETE FROM profiles WHERE email LIKE '%@example.com';
```

## Troubleshooting

### Seed Script Fails with "Database error saving new user"

This means email confirmation is enabled in your Supabase project. Use Method 1 (Manual Account Creation) instead.

### Users Created But No Profiles

Check that the `handle_new_user` trigger is active in your database. This trigger automatically creates profile entries when auth users are created.

### Restaurant Not Visible

Ensure the restaurant's `verification_status` is set to 'verified' and `is_active` is true in the restaurants table.

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Policies](https://supabase.com/docs/guides/auth/row-level-security)
- Main README: See `README.md` for general application information
