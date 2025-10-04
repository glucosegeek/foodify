-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geographic coordinates
CREATE EXTENSION IF NOT EXISTS postgis;

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE user_role AS ENUM ('customer', 'restaurant');
CREATE TYPE dining_style AS ENUM ('fine_dining', 'casual', 'fast_casual');
CREATE TYPE dietary_tag AS ENUM ('vegetarian', 'vegan', 'gluten_free', 'halal', 'kosher');

-- =============================================
-- USERS & PROFILES
-- =============================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'customer',
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer-specific data
CREATE TABLE customer_profiles (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    preferred_cuisines TEXT[],
    dietary_restrictions dietary_tag[],
    favorite_restaurants UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RESTAURANTS
-- =============================================

CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cuisine_type VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(50),
    email VARCHAR(255),
    website TEXT,
    logo_url TEXT,
    cover_photo_url TEXT,
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    price_range VARCHAR(10),
    dining_style dining_style DEFAULT 'casual',
    dietary_options dietary_tag[],
    is_featured BOOLEAN DEFAULT FALSE,
    opening_hours JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add geographic index for location queries
CREATE INDEX idx_restaurants_location ON restaurants USING GIST(
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);

CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine_type);
CREATE INDEX idx_restaurants_featured ON restaurants(is_featured);

-- =============================================
-- MENU SYSTEM
-- =============================================

CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    dietary_tags dietary_tag[],
    allergens TEXT[],
    is_available BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);

-- =============================================
-- SOCIAL FEATURES
-- =============================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    photos TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id, user_id)
);

CREATE TABLE follows (
    follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE restaurant_follows (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, restaurant_id)
);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at
    BEFORE UPDATE ON restaurants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update restaurant rating when review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE restaurants
    SET 
        rating = (SELECT AVG(rating) FROM reviews WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)),
        review_count = (SELECT COUNT(*) FROM reviews WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id))
    WHERE id = COALESCE(NEW.restaurant_id, OLD.restaurant_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_restaurant_rating_on_review
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_restaurant_rating();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, role, username, full_name)
    VALUES (
        NEW.id,
        'customer',
        SPLIT_PART(NEW.email, '@', 1),
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_follows ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update only their own
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Restaurants: Public read, owners can manage
CREATE POLICY "Restaurants are viewable by everyone"
    ON restaurants FOR SELECT
    USING (true);

CREATE POLICY "Restaurant owners can manage their restaurants"
    ON restaurants FOR ALL
    USING (auth.uid() = user_id);

-- Menu: Public read, restaurant owners can manage
CREATE POLICY "Menu items are viewable by everyone"
    ON menu_items FOR SELECT
    USING (true);

CREATE POLICY "Restaurant owners can manage menu items"
    ON menu_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM restaurants
            WHERE restaurants.id = menu_items.restaurant_id
            AND restaurants.user_id = auth.uid()
        )
    );

-- Reviews: Public read, authors can manage their own
CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = user_id);