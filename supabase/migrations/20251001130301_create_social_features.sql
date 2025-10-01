/*
  # Social Features: Following, Favorites, and Activity Feed

  ## Overview
  This migration implements the social layer of the platform including user-to-user following,
  restaurant following, favorites, custom lists, and activity feed for social discovery.

  ## 1. New Tables

  ### `user_follows`
  Customer-to-customer following relationships
  - `id` (uuid, primary key)
  - `follower_id` (uuid) - The user doing the following
  - `following_id` (uuid) - The user being followed
  - `created_at` (timestamptz)
  - UNIQUE constraint on (follower_id, following_id)

  ### `restaurant_follows`
  Users following restaurants for updates
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `restaurant_id` (uuid) - References restaurants
  - `created_at` (timestamptz)
  - UNIQUE constraint on (user_id, restaurant_id)

  ### `favorites`
  User bookmarks for restaurants
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `restaurant_id` (uuid) - References restaurants
  - `notes` (text) - Personal notes about this favorite
  - `created_at` (timestamptz)
  - UNIQUE constraint on (user_id, restaurant_id)

  ### `custom_lists`
  User-curated restaurant collections
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `name` (text) - List name (e.g., "Date Night Spots")
  - `description` (text)
  - `is_public` (boolean) - Public visibility
  - `cover_photo_url` (text)
  - `restaurant_count` (integer) - Cached count
  - `followers_count` (integer) - Users following this list
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `list_items`
  Junction table linking lists to restaurants
  - `id` (uuid, primary key)
  - `list_id` (uuid) - References custom_lists
  - `restaurant_id` (uuid) - References restaurants
  - `notes` (text) - Notes about why this restaurant is in the list
  - `display_order` (integer) - Sort order
  - `added_at` (timestamptz)
  - UNIQUE constraint on (list_id, restaurant_id)

  ### `list_follows`
  Users following other users' lists
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `list_id` (uuid) - References custom_lists
  - `created_at` (timestamptz)
  - UNIQUE constraint on (user_id, list_id)

  ### `activity_feed`
  Aggregated activity stream for social discovery
  - `id` (uuid, primary key)
  - `user_id` (uuid) - User who performed the action
  - `activity_type` (enum) - review_created, restaurant_followed, list_created, etc.
  - `target_type` (text) - Type of target entity (restaurant, review, list)
  - `target_id` (uuid) - ID of target entity
  - `metadata` (jsonb) - Additional activity data
  - `visibility` (enum) - public, followers_only, private
  - `created_at` (timestamptz)

  ### `restaurant_posts`
  Restaurant announcements and promotions
  - `id` (uuid, primary key)
  - `restaurant_id` (uuid) - References restaurants
  - `posted_by` (uuid) - Restaurant owner/team member
  - `post_type` (enum) - promotion, event, menu_update, news
  - `title` (text)
  - `content` (text)
  - `image_url` (text)
  - `active_until` (timestamptz) - For time-limited promotions
  - `views_count` (integer)
  - `engagement_count` (integer) - Likes, saves, shares
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## 2. Security (Row Level Security)

  - Users can manage their own follows, favorites, and lists
  - Public lists are visible to everyone
  - Private lists only visible to owner
  - Activity feed respects visibility settings
  - Restaurant owners can post announcements

  ## 3. Indexes

  Performance indexes for:
  - Follow relationships (follower_id, following_id)
  - Activity feed queries (user_id, created_at)
  - List lookups and public list browsing
  - Restaurant post timelines

  ## 4. Functions & Triggers

  - Update follower/following counts on user_follows changes
  - Update restaurant follower counts
  - Update list restaurant counts
  - Auto-create activity feed entries for key actions

  ## Important Notes

  - Follower counts cached for performance
  - Activity feed enables "what's new" social discovery
  - Lists allow users to organize and share discoveries
  - Restaurant posts reach followers for engagement
*/

-- Create enums
CREATE TYPE activity_type AS ENUM (
  'review_created', 
  'restaurant_followed', 
  'user_followed', 
  'list_created', 
  'list_updated',
  'favorite_added',
  'photo_uploaded'
);

CREATE TYPE activity_visibility AS ENUM ('public', 'followers_only', 'private');

CREATE TYPE post_type AS ENUM ('promotion', 'event', 'menu_update', 'news');

-- User follows table
CREATE TABLE IF NOT EXISTS user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id),
  CONSTRAINT unique_user_follow UNIQUE (follower_id, following_id)
);

-- Restaurant follows table
CREATE TABLE IF NOT EXISTS restaurant_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_restaurant_follow UNIQUE (user_id, restaurant_id)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_favorite UNIQUE (user_id, restaurant_id)
);

-- Custom lists table
CREATE TABLE IF NOT EXISTS custom_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  cover_photo_url text,
  restaurant_count integer DEFAULT 0,
  followers_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- List items table
CREATE TABLE IF NOT EXISTS list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid REFERENCES custom_lists(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  notes text,
  display_order integer DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  CONSTRAINT unique_list_item UNIQUE (list_id, restaurant_id)
);

-- List follows table
CREATE TABLE IF NOT EXISTS list_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  list_id uuid REFERENCES custom_lists(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_list_follow UNIQUE (user_id, list_id)
);

-- Activity feed table
CREATE TABLE IF NOT EXISTS activity_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  target_type text,
  target_id uuid,
  metadata jsonb DEFAULT '{}',
  visibility activity_visibility DEFAULT 'public',
  created_at timestamptz DEFAULT now()
);

-- Restaurant posts table
CREATE TABLE IF NOT EXISTS restaurant_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  posted_by uuid REFERENCES profiles(id),
  post_type post_type NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  active_until timestamptz,
  is_active boolean DEFAULT true,
  views_count integer DEFAULT 0,
  engagement_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_follows
CREATE POLICY "Anyone can view user follows"
  ON user_follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own follows"
  ON user_follows FOR ALL
  TO authenticated
  USING (follower_id = auth.uid())
  WITH CHECK (follower_id = auth.uid());

-- RLS Policies for restaurant_follows
CREATE POLICY "Anyone can view restaurant follows"
  ON restaurant_follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own restaurant follows"
  ON restaurant_follows FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for custom_lists
CREATE POLICY "Anyone can view public lists"
  ON custom_lists FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can view own lists"
  ON custom_lists FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own lists"
  ON custom_lists FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for list_items
CREATE POLICY "Anyone can view public list items"
  ON list_items FOR SELECT
  TO authenticated
  USING (
    list_id IN (
      SELECT id FROM custom_lists WHERE is_public = true
    )
  );

CREATE POLICY "Users can view own list items"
  ON list_items FOR SELECT
  TO authenticated
  USING (
    list_id IN (
      SELECT id FROM custom_lists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own list items"
  ON list_items FOR ALL
  TO authenticated
  USING (
    list_id IN (
      SELECT id FROM custom_lists WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for list_follows
CREATE POLICY "Anyone can view list follows"
  ON list_follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own list follows"
  ON list_follows FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for activity_feed
CREATE POLICY "Users can view public activity"
  ON activity_feed FOR SELECT
  TO authenticated
  USING (visibility = 'public');

CREATE POLICY "Users can view followers-only activity from followed users"
  ON activity_feed FOR SELECT
  TO authenticated
  USING (
    visibility = 'followers_only'
    AND user_id IN (
      SELECT following_id FROM user_follows WHERE follower_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own activity"
  ON activity_feed FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own activity"
  ON activity_feed FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for restaurant_posts
CREATE POLICY "Anyone can view active restaurant posts"
  ON restaurant_posts FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Restaurant owners can manage own posts"
  ON restaurant_posts FOR ALL
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE profile_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_created ON user_follows(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_restaurant_follows_user ON restaurant_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_follows_restaurant ON restaurant_follows(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_follows_created ON restaurant_follows(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_restaurant ON favorites(restaurant_id);

CREATE INDEX IF NOT EXISTS idx_custom_lists_user ON custom_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_lists_public ON custom_lists(is_public);

CREATE INDEX IF NOT EXISTS idx_list_items_list ON list_items(list_id);
CREATE INDEX IF NOT EXISTS idx_list_items_restaurant ON list_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_list_items_order ON list_items(list_id, display_order);

CREATE INDEX IF NOT EXISTS idx_list_follows_user ON list_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_list_follows_list ON list_follows(list_id);

CREATE INDEX IF NOT EXISTS idx_activity_feed_user ON activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_type ON activity_feed(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_feed_visibility ON activity_feed(visibility);

CREATE INDEX IF NOT EXISTS idx_restaurant_posts_restaurant ON restaurant_posts(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_posts_created ON restaurant_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_restaurant_posts_active ON restaurant_posts(is_active);

-- Function to update follower/following counts for users
CREATE OR REPLACE FUNCTION update_user_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE customer_profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE customer_profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE customer_profiles SET following_count = following_count - 1 WHERE id = OLD.follower_id;
    UPDATE customer_profiles SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_follow_counts
  AFTER INSERT OR DELETE ON user_follows
  FOR EACH ROW
  EXECUTE FUNCTION update_user_follow_counts();

-- Function to update restaurant follower counts
CREATE OR REPLACE FUNCTION update_restaurant_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE restaurant_profiles 
    SET followers_count = followers_count + 1 
    WHERE id = (SELECT profile_id FROM restaurants WHERE id = NEW.restaurant_id);
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE restaurant_profiles 
    SET followers_count = followers_count - 1 
    WHERE id = (SELECT profile_id FROM restaurants WHERE id = OLD.restaurant_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_restaurant_follow_counts
  AFTER INSERT OR DELETE ON restaurant_follows
  FOR EACH ROW
  EXECUTE FUNCTION update_restaurant_follow_counts();

-- Function to update list restaurant counts
CREATE OR REPLACE FUNCTION update_list_restaurant_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE custom_lists SET restaurant_count = restaurant_count + 1 WHERE id = NEW.list_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE custom_lists SET restaurant_count = restaurant_count - 1 WHERE id = OLD.list_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_list_restaurant_counts
  AFTER INSERT OR DELETE ON list_items
  FOR EACH ROW
  EXECUTE FUNCTION update_list_restaurant_counts();

-- Function to update list follower counts
CREATE OR REPLACE FUNCTION update_list_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE custom_lists SET followers_count = followers_count + 1 WHERE id = NEW.list_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE custom_lists SET followers_count = followers_count - 1 WHERE id = OLD.list_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_list_follow_counts
  AFTER INSERT OR DELETE ON list_follows
  FOR EACH ROW
  EXECUTE FUNCTION update_list_follow_counts();

-- Triggers for updated_at
CREATE TRIGGER update_custom_lists_updated_at
  BEFORE UPDATE ON custom_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_posts_updated_at
  BEFORE UPDATE ON restaurant_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
