/*
  # Enhanced Social Features and Real-Time Collaboration

  ## Overview
  This migration adds comprehensive social features including review comments with threading,
  user presence tracking, profile views, online status, and optimizations for real-time
  collaboration features.

  ## 1. New Tables

  ### `review_comments`
  Nested comments and discussions on reviews (separate from review_replies which are for restaurant owners)
  - `id` (uuid, primary key) - Unique comment identifier
  - `review_id` (uuid) - References reviews table
  - `user_id` (uuid) - References profiles (comment author)
  - `parent_comment_id` (uuid, nullable) - References review_comments for nested replies
  - `content` (text) - Comment text content
  - `mentions` (uuid[]) - Array of user IDs mentioned in comment
  - `edited_at` (timestamptz, nullable) - When comment was last edited
  - `is_deleted` (boolean) - Soft delete flag
  - `like_count` (integer) - Cached count of likes
  - `created_at` (timestamptz) - Comment creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `comment_likes`
  Likes on review comments
  - `user_id` (uuid) - References profiles
  - `comment_id` (uuid) - References review_comments
  - `created_at` (timestamptz) - When like was added
  - Primary key: (user_id, comment_id)

  ### `user_presence`
  Real-time user online status and activity
  - `user_id` (uuid, primary key) - References profiles
  - `status` (text) - online, away, offline
  - `last_seen` (timestamptz) - Last activity timestamp
  - `current_page` (text, nullable) - Current page/route user is on
  - `updated_at` (timestamptz) - Last presence update

  ### `profile_views`
  Track who viewed whose profile
  - `id` (uuid, primary key) - Unique view identifier
  - `profile_id` (uuid) - References profiles (profile being viewed)
  - `viewer_id` (uuid, nullable) - References profiles (who viewed, null for anonymous)
  - `view_duration` (integer, nullable) - Time spent viewing in seconds
  - `created_at` (timestamptz) - When view occurred

  ### `restaurant_view_analytics`
  Track restaurant page views for analytics
  - `id` (uuid, primary key) - Unique view identifier
  - `restaurant_id` (uuid) - References restaurants
  - `viewer_id` (uuid, nullable) - References profiles (null for anonymous)
  - `referrer` (text, nullable) - Where user came from
  - `view_duration` (integer, nullable) - Time spent on page
  - `created_at` (timestamptz) - When view occurred

  ## 2. Security
  - Enable RLS on all new tables
  - Policies for authenticated users to read/write their own data
  - Public read access for non-sensitive data
  - Optimized for real-time subscriptions

  ## 3. Indexes
  - Composite indexes for efficient queries
  - Support for real-time filtering and sorting
  - Optimized for follower feeds and activity streams

  ## 4. Important Notes
  - All tables use timestamptz for consistency
  - Soft deletes used where appropriate
  - Cached counts for performance
  - Ready for Supabase Realtime subscriptions
*/

-- ==============================================
-- 1. CREATE TABLES
-- ==============================================

-- Review Comments (nested discussions on reviews)
CREATE TABLE IF NOT EXISTS review_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES review_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  mentions uuid[] DEFAULT ARRAY[]::uuid[],
  edited_at timestamptz,
  is_deleted boolean DEFAULT false,
  like_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Comment Likes
CREATE TABLE IF NOT EXISTS comment_likes (
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment_id uuid NOT NULL REFERENCES review_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, comment_id)
);

-- User Presence (online status)
CREATE TABLE IF NOT EXISTS user_presence (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'away', 'offline')),
  last_seen timestamptz DEFAULT now(),
  current_page text,
  updated_at timestamptz DEFAULT now()
);

-- Profile Views
CREATE TABLE IF NOT EXISTS profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  view_duration integer,
  created_at timestamptz DEFAULT now()
);

-- Restaurant View Analytics
CREATE TABLE IF NOT EXISTS restaurant_view_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  viewer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  referrer text,
  view_duration integer,
  created_at timestamptz DEFAULT now()
);

-- ==============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ==============================================

ALTER TABLE review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_view_analytics ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 3. ROW LEVEL SECURITY POLICIES
-- ==============================================

-- Review Comments Policies
CREATE POLICY "Anyone can view non-deleted comments"
  ON review_comments FOR SELECT
  USING (is_deleted = false);

CREATE POLICY "Authenticated users can create comments"
  ON review_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON review_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON review_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comment Likes Policies
CREATE POLICY "Anyone can view comment likes"
  ON comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like comments"
  ON comment_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes"
  ON comment_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User Presence Policies
CREATE POLICY "Anyone can view user presence"
  ON user_presence FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own presence"
  ON user_presence FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify own presence"
  ON user_presence FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Profile Views Policies
CREATE POLICY "Users can view their own profile views"
  ON profile_views FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid() OR viewer_id = auth.uid());

CREATE POLICY "Anyone can record profile views"
  ON profile_views FOR INSERT
  WITH CHECK (true);

-- Restaurant View Analytics Policies
CREATE POLICY "Restaurant owners can view their analytics"
  ON restaurant_view_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = restaurant_view_analytics.restaurant_id
      AND restaurants.profile_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can record restaurant views"
  ON restaurant_view_analytics FOR INSERT
  WITH CHECK (true);

-- ==============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ==============================================

-- Review Comments indexes
CREATE INDEX IF NOT EXISTS idx_review_comments_review ON review_comments(review_id) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_review_comments_user ON review_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_review_comments_parent ON review_comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_review_comments_created ON review_comments(created_at DESC);

-- Comment Likes indexes
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user ON comment_likes(user_id);

-- User Presence indexes
CREATE INDEX IF NOT EXISTS idx_user_presence_status ON user_presence(status) WHERE status = 'online';
CREATE INDEX IF NOT EXISTS idx_user_presence_last_seen ON user_presence(last_seen DESC);

-- Profile Views indexes
CREATE INDEX IF NOT EXISTS idx_profile_views_profile ON profile_views(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer ON profile_views(viewer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profile_views_recent ON profile_views(created_at DESC);

-- Restaurant View Analytics indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_views_restaurant ON restaurant_view_analytics(restaurant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_restaurant_views_viewer ON restaurant_view_analytics(viewer_id, created_at DESC);

-- ==============================================
-- 5. CREATE TRIGGERS AND FUNCTIONS
-- ==============================================

-- Update updated_at timestamp for review_comments
CREATE OR REPLACE FUNCTION update_review_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_review_comments_timestamp
  BEFORE UPDATE ON review_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_review_comments_updated_at();

-- Update like_count on comment_likes changes
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE review_comments
    SET like_count = like_count + 1
    WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE review_comments
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comment_likes_count
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_like_count();

-- Auto-update user presence timestamp
CREATE OR REPLACE FUNCTION update_user_presence_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_seen = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_presence_timestamp_trigger
  BEFORE UPDATE ON user_presence
  FOR EACH ROW
  EXECUTE FUNCTION update_user_presence_timestamp();

-- ==============================================
-- 6. HELPER FUNCTIONS FOR REALTIME
-- ==============================================

-- Get comment count for a review
CREATE OR REPLACE FUNCTION get_review_comment_count(review_uuid uuid)
RETURNS integer AS $$
  SELECT COUNT(*)::integer
  FROM review_comments
  WHERE review_id = review_uuid AND is_deleted = false;
$$ LANGUAGE sql STABLE;

-- Get online users count
CREATE OR REPLACE FUNCTION get_online_users_count()
RETURNS integer AS $$
  SELECT COUNT(*)::integer
  FROM user_presence
  WHERE status = 'online' AND last_seen > (now() - interval '5 minutes');
$$ LANGUAGE sql STABLE;

-- Get profile view count for last 24 hours
CREATE OR REPLACE FUNCTION get_recent_profile_views(profile_uuid uuid)
RETURNS integer AS $$
  SELECT COUNT(*)::integer
  FROM profile_views
  WHERE profile_id = profile_uuid
  AND created_at > (now() - interval '24 hours');
$$ LANGUAGE sql STABLE;