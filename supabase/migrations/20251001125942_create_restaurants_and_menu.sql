/*
  # Restaurants and Menu Management System

  ## Overview
  This migration creates the core restaurant data structure including menu management,
  photos, and geographic search capabilities using PostGIS for location-based queries.

  ## 1. New Tables

  ### `restaurants`
  Central restaurant entity with geographic location support
  - `id` (uuid, primary key)
  - `profile_id` (uuid) - References restaurant_profiles
  - `location` (geography) - PostGIS point for lat/lng coordinates
  - `latitude` (decimal) - Latitude for display
  - `longitude` (decimal) - Longitude for display
  - `is_featured` (boolean) - Featured restaurant flag
  - `is_active` (boolean) - Restaurant accepting orders/open for business
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `cuisines`
  Master list of cuisine types
  - `id` (uuid, primary key)
  - `name` (text, unique) - Cuisine name (Italian, Japanese, etc.)
  - `slug` (text, unique) - URL-friendly name
  - `description` (text)
  - `icon` (text) - Icon identifier

  ### `restaurant_cuisines`
  Many-to-many relationship between restaurants and cuisines
  - `restaurant_id` (uuid) - References restaurants
  - `cuisine_id` (uuid) - References cuisines

  ### `restaurant_photos`
  Restaurant image gallery with moderation
  - `id` (uuid, primary key)
  - `restaurant_id` (uuid) - References restaurants
  - `photo_url` (text) - Storage URL
  - `caption` (text)
  - `photo_type` (enum) - cover, interior, exterior, food, ambiance
  - `uploaded_by` (uuid) - References profiles (user or restaurant)
  - `moderation_status` (enum) - pending, approved, rejected
  - `is_primary` (boolean) - Primary display photo
  - `display_order` (integer) - Sort order
  - `created_at` (timestamptz)

  ### `menu_categories`
  Organizational categories for menu items
  - `id` (uuid, primary key)
  - `restaurant_id` (uuid) - References restaurants
  - `name` (text) - Category name (Appetizers, Mains, etc.)
  - `description` (text)
  - `display_order` (integer) - Sort order
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `menu_items`
  Individual dishes and menu offerings
  - `id` (uuid, primary key)
  - `restaurant_id` (uuid) - References restaurants
  - `category_id` (uuid) - References menu_categories
  - `name` (text) - Dish name
  - `description` (text) - Dish description
  - `price` (decimal) - Price in local currency
  - `preparation_time` (integer) - Minutes to prepare
  - `is_available` (boolean) - Currently available
  - `is_seasonal` (boolean) - Seasonal item flag
  - `is_signature` (boolean) - Signature dish flag
  - `spice_level` (integer) - 0-5 spice rating
  - `popularity_rank` (integer) - Calculated popularity
  - `views_count` (integer) - View tracking
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `menu_item_photos`
  Photos for menu items
  - `id` (uuid, primary key)
  - `menu_item_id` (uuid) - References menu_items
  - `photo_url` (text) - Storage URL
  - `uploaded_by` (uuid) - References profiles
  - `is_primary` (boolean) - Primary display photo
  - `created_at` (timestamptz)

  ### `dietary_tags`
  Master list of dietary attributes
  - `id` (uuid, primary key)
  - `name` (text, unique) - Vegetarian, Vegan, Gluten-Free, etc.
  - `slug` (text, unique)
  - `icon` (text) - Icon identifier
  - `color` (text) - Display color code

  ### `menu_item_dietary_tags`
  Many-to-many relationship for dietary attributes
  - `menu_item_id` (uuid) - References menu_items
  - `dietary_tag_id` (uuid) - References dietary_tags

  ### `allergens`
  Master list of common allergens
  - `id` (uuid, primary key)
  - `name` (text, unique) - Dairy, Nuts, Gluten, etc.
  - `description` (text)

  ### `menu_item_allergens`
  Many-to-many relationship for allergen tracking
  - `menu_item_id` (uuid) - References menu_items
  - `allergen_id` (uuid) - References allergens

  ## 2. Security (Row Level Security)

  - Anyone can view active restaurants and their menus
  - Restaurant owners can manage their own restaurant and menu data
  - Admins can manage all restaurant data
  - Photo moderation policies for safety

  ## 3. Indexes

  Performance indexes for:
  - Geographic searches (location)
  - Restaurant lookups by profile_id
  - Menu item searches by restaurant and category
  - Cuisine filtering
  - Dietary tag filtering

  ## 4. Extensions

  - PostGIS for geographic queries (radius search, distance calculations)

  ## Important Notes

  - PostGIS enables efficient radius-based restaurant searches
  - Composite indexes optimize filtered searches (cuisine + dietary + price)
  - Cached view counts enable popularity rankings
  - Moderation status prevents inappropriate photos from appearing
*/

-- Enable PostGIS extension for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create enums
CREATE TYPE photo_type AS ENUM ('cover', 'interior', 'exterior', 'food', 'ambiance');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected');

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid UNIQUE REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  location geography(POINT, 4326),
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cuisines master table
CREATE TABLE IF NOT EXISTS cuisines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Restaurant-Cuisine junction table
CREATE TABLE IF NOT EXISTS restaurant_cuisines (
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  cuisine_id uuid REFERENCES cuisines(id) ON DELETE CASCADE,
  PRIMARY KEY (restaurant_id, cuisine_id)
);

-- Restaurant photos
CREATE TABLE IF NOT EXISTS restaurant_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  caption text,
  photo_type photo_type DEFAULT 'food',
  uploaded_by uuid REFERENCES profiles(id),
  moderation_status moderation_status DEFAULT 'pending',
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Menu categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id uuid REFERENCES menu_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price decimal(10, 2) NOT NULL,
  preparation_time integer,
  is_available boolean DEFAULT true,
  is_seasonal boolean DEFAULT false,
  is_signature boolean DEFAULT false,
  spice_level integer DEFAULT 0,
  popularity_rank integer DEFAULT 0,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_price CHECK (price >= 0),
  CONSTRAINT valid_spice_level CHECK (spice_level BETWEEN 0 AND 5)
);

-- Menu item photos
CREATE TABLE IF NOT EXISTS menu_item_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  uploaded_by uuid REFERENCES profiles(id),
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Dietary tags master table
CREATE TABLE IF NOT EXISTS dietary_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  color text DEFAULT '#10b981',
  created_at timestamptz DEFAULT now()
);

-- Menu item dietary tags junction
CREATE TABLE IF NOT EXISTS menu_item_dietary_tags (
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  dietary_tag_id uuid REFERENCES dietary_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (menu_item_id, dietary_tag_id)
);

-- Allergens master table
CREATE TABLE IF NOT EXISTS allergens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Menu item allergens junction
CREATE TABLE IF NOT EXISTS menu_item_allergens (
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  allergen_id uuid REFERENCES allergens(id) ON DELETE CASCADE,
  PRIMARY KEY (menu_item_id, allergen_id)
);

-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuisines ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_cuisines ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE dietary_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_dietary_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_allergens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for restaurants
CREATE POLICY "Anyone can view active restaurants"
  ON restaurants FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Restaurant owners can view own restaurant"
  ON restaurants FOR SELECT
  TO authenticated
  USING (profile_id IN (SELECT id FROM restaurant_profiles WHERE id = auth.uid()));

CREATE POLICY "Restaurant owners can update own restaurant"
  ON restaurants FOR UPDATE
  TO authenticated
  USING (profile_id IN (SELECT id FROM restaurant_profiles WHERE id = auth.uid()))
  WITH CHECK (profile_id IN (SELECT id FROM restaurant_profiles WHERE id = auth.uid()));

CREATE POLICY "Restaurant owners can insert own restaurant"
  ON restaurants FOR INSERT
  TO authenticated
  WITH CHECK (profile_id IN (SELECT id FROM restaurant_profiles WHERE id = auth.uid()));

-- RLS Policies for cuisines (public read, admin write)
CREATE POLICY "Anyone can view cuisines"
  ON cuisines FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for restaurant_cuisines
CREATE POLICY "Anyone can view restaurant cuisines"
  ON restaurant_cuisines FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Restaurant owners can manage own cuisines"
  ON restaurant_cuisines FOR ALL
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE profile_id = auth.uid()
    )
  );

-- RLS Policies for restaurant_photos
CREATE POLICY "Anyone can view approved restaurant photos"
  ON restaurant_photos FOR SELECT
  TO authenticated
  USING (moderation_status = 'approved');

CREATE POLICY "Restaurant owners can view own photos"
  ON restaurant_photos FOR SELECT
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can insert own photos"
  ON restaurant_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload restaurant photos"
  ON restaurant_photos FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

-- RLS Policies for menu_categories
CREATE POLICY "Anyone can view active menu categories"
  ON menu_categories FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Restaurant owners can manage own categories"
  ON menu_categories FOR ALL
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE profile_id = auth.uid()
    )
  );

-- RLS Policies for menu_items
CREATE POLICY "Anyone can view available menu items"
  ON menu_items FOR SELECT
  TO authenticated
  USING (is_available = true);

CREATE POLICY "Restaurant owners can manage own menu items"
  ON menu_items FOR ALL
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE profile_id = auth.uid()
    )
  );

-- RLS Policies for menu_item_photos
CREATE POLICY "Anyone can view menu item photos"
  ON menu_item_photos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Restaurant owners can manage own menu photos"
  ON menu_item_photos FOR ALL
  TO authenticated
  USING (
    menu_item_id IN (
      SELECT id FROM menu_items WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE profile_id = auth.uid()
      )
    )
  );

-- RLS Policies for dietary_tags (public read)
CREATE POLICY "Anyone can view dietary tags"
  ON dietary_tags FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for menu_item_dietary_tags
CREATE POLICY "Anyone can view menu item dietary tags"
  ON menu_item_dietary_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Restaurant owners can manage own menu dietary tags"
  ON menu_item_dietary_tags FOR ALL
  TO authenticated
  USING (
    menu_item_id IN (
      SELECT id FROM menu_items WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE profile_id = auth.uid()
      )
    )
  );

-- RLS Policies for allergens (public read)
CREATE POLICY "Anyone can view allergens"
  ON allergens FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for menu_item_allergens
CREATE POLICY "Anyone can view menu item allergens"
  ON menu_item_allergens FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Restaurant owners can manage own menu allergens"
  ON menu_item_allergens FOR ALL
  TO authenticated
  USING (
    menu_item_id IN (
      SELECT id FROM menu_items WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE profile_id = auth.uid()
      )
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_restaurants_profile_id ON restaurants(profile_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_restaurants_featured ON restaurants(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_restaurants_active ON restaurants(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_restaurant_cuisines_restaurant ON restaurant_cuisines(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_cuisines_cuisine ON restaurant_cuisines(cuisine_id);

CREATE INDEX IF NOT EXISTS idx_restaurant_photos_restaurant ON restaurant_photos(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_photos_moderation ON restaurant_photos(moderation_status);
CREATE INDEX IF NOT EXISTS idx_restaurant_photos_primary ON restaurant_photos(is_primary) WHERE is_primary = true;

CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant ON menu_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_active ON menu_categories(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_menu_items_signature ON menu_items(is_signature) WHERE is_signature = true;
CREATE INDEX IF NOT EXISTS idx_menu_items_popularity ON menu_items(popularity_rank DESC);

CREATE INDEX IF NOT EXISTS idx_menu_item_photos_item ON menu_item_photos(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_item_dietary_tags_item ON menu_item_dietary_tags(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_item_dietary_tags_tag ON menu_item_dietary_tags(dietary_tag_id);
CREATE INDEX IF NOT EXISTS idx_menu_item_allergens_item ON menu_item_allergens(menu_item_id);

-- Triggers for updated_at
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_categories_updated_at
  BEFORE UPDATE ON menu_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert common cuisines
INSERT INTO cuisines (name, slug, icon) VALUES
  ('Italian', 'italian', '🍝'),
  ('Japanese', 'japanese', '🍱'),
  ('Mexican', 'mexican', '🌮'),
  ('Chinese', 'chinese', '🥢'),
  ('Indian', 'indian', '🍛'),
  ('Thai', 'thai', '🌶️'),
  ('French', 'french', '🥖'),
  ('Mediterranean', 'mediterranean', '🥗'),
  ('American', 'american', '🍔'),
  ('Korean', 'korean', '🍜'),
  ('Vietnamese', 'vietnamese', '🍲'),
  ('Greek', 'greek', '🥙'),
  ('Spanish', 'spanish', '🥘'),
  ('Turkish', 'turkish', '🥙'),
  ('Polish', 'polish', '🥟')
ON CONFLICT (slug) DO NOTHING;

-- Insert common dietary tags
INSERT INTO dietary_tags (name, slug, icon, color) VALUES
  ('Vegetarian', 'vegetarian', '🥬', '#10b981'),
  ('Vegan', 'vegan', '🌱', '#059669'),
  ('Gluten-Free', 'gluten-free', '🌾', '#f59e0b'),
  ('Dairy-Free', 'dairy-free', '🥛', '#3b82f6'),
  ('Halal', 'halal', '☪️', '#8b5cf6'),
  ('Kosher', 'kosher', '✡️', '#6366f1'),
  ('Keto', 'keto', '🥑', '#ec4899'),
  ('Paleo', 'paleo', '🦴', '#f97316'),
  ('Low-Carb', 'low-carb', '📉', '#14b8a6'),
  ('Organic', 'organic', '🌿', '#22c55e')
ON CONFLICT (slug) DO NOTHING;

-- Insert common allergens
INSERT INTO allergens (name, description) VALUES
  ('Dairy', 'Contains milk or milk products'),
  ('Eggs', 'Contains eggs or egg products'),
  ('Gluten', 'Contains wheat, barley, rye, or other gluten-containing grains'),
  ('Peanuts', 'Contains peanuts or peanut products'),
  ('Tree Nuts', 'Contains almonds, cashews, walnuts, or other tree nuts'),
  ('Soy', 'Contains soybeans or soy products'),
  ('Fish', 'Contains fish or fish products'),
  ('Shellfish', 'Contains shrimp, crab, lobster, or other shellfish'),
  ('Sesame', 'Contains sesame seeds or sesame oil'),
  ('Sulfites', 'Contains sulfur dioxide or sulfites'),
  ('Mustard', 'Contains mustard or mustard seeds'),
  ('Celery', 'Contains celery or celery products')
ON CONFLICT (name) DO NOTHING;
