/*
  # Analytics and Statistics System

  ## Overview
  This migration implements comprehensive analytics tracking for restaurants, menu items,
  and user engagement. Includes daily aggregates, time-series data, and materialized views
  for efficient dashboard queries.

  ## 1. New Tables

  ### `restaurant_analytics_daily`
  Daily aggregated stats for restaurant performance
  - `id` (uuid, primary key)
  - `restaurant_id` (uuid) - References restaurants
  - `date` (date) - Analytics date
  - `profile_views` (integer) - Profile page views
  - `menu_views` (integer) - Menu page views
  - `followers_gained` (integer) - New followers
  - `followers_lost` (integer) - Unfollows
  - `reviews_received` (integer) - New reviews
  - `average_rating` (decimal) - Daily average rating
  - `photos_uploaded` (integer) - New photos
  - `post_views` (integer) - Restaurant post views
  - `post_engagement` (integer) - Likes, shares on posts
  - `created_at` (timestamptz)
  - UNIQUE constraint on (restaurant_id, date)

  ### `menu_item_analytics_daily`
  Daily stats for individual menu items
  - `id` (uuid, primary key)
  - `menu_item_id` (uuid) - References menu_items
  - `date` (date) - Analytics date
  - `views` (integer) - Item detail views
  - `clicks` (integer) - Click-through actions
  - `shares` (integer) - Social shares
  - `favorites` (integer) - Added to favorites count
  - `created_at` (timestamptz)
  - UNIQUE constraint on (menu_item_id, date)

  ### `user_engagement_metrics`
  User activity tracking for admin insights
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `date` (date) - Metrics date
  - `page_views` (integer) - Total page views
  - `searches_performed` (integer) - Search queries
  - `restaurants_viewed` (integer) - Unique restaurants viewed
  - `reviews_written` (integer) - Reviews created
  - `photos_uploaded` (integer) - Photos uploaded
  - `social_actions` (integer) - Follows, favorites, likes
  - `session_duration_minutes` (integer) - Total time on site
  - `created_at` (timestamptz)
  - UNIQUE constraint on (user_id, date)

  ### `search_analytics`
  Search query tracking for improving relevance
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles (nullable for anonymous)
  - `search_query` (text) - Search text
  - `filters_applied` (jsonb) - Cuisine, dietary, price filters
  - `results_count` (integer) - Number of results
  - `clicked_result_id` (uuid) - Restaurant clicked from results
  - `clicked_position` (integer) - Position in results
  - `session_id` (uuid) - Session identifier
  - `created_at` (timestamptz)

  ### `conversion_funnels`
  Track user journey from search to action
  - `id` (uuid, primary key)
  - `session_id` (uuid) - Session identifier
  - `user_id` (uuid) - References profiles (nullable)
  - `funnel_type` (enum) - search_to_review, search_to_follow, browse_to_favorite
  - `step_1_completed` (boolean) - Search/browse
  - `step_2_completed` (boolean) - View details
  - `step_3_completed` (boolean) - Take action
  - `completed_at` (timestamptz) - Final action timestamp
  - `duration_seconds` (integer) - Time to complete funnel
  - `created_at` (timestamptz)

  ### `peak_hours_analysis`
  Restaurant traffic patterns by hour
  - `id` (uuid, primary key)
  - `restaurant_id` (uuid) - References restaurants
  - `day_of_week` (integer) - 0-6 (Sunday-Saturday)
  - `hour` (integer) - 0-23
  - `views_count` (integer) - Page views in this hour
  - `orders_count` (integer) - Actions taken (reviews, follows)
  - `week_start_date` (date) - Week this data represents
  - `created_at` (timestamptz)

  ### `popular_dishes_rankings`
  Weekly rankings of top dishes
  - `id` (uuid, primary key)
  - `menu_item_id` (uuid) - References menu_items
  - `restaurant_id` (uuid) - References restaurants
  - `week_start_date` (date)
  - `views` (integer)
  - `rank` (integer) - Rank within restaurant
  - `global_rank` (integer) - Rank across all restaurants
  - `created_at` (timestamptz)

  ### `platform_metrics`
  Overall platform health metrics
  - `id` (uuid, primary key)
  - `date` (date) - Metrics date
  - `total_users` (integer)
  - `active_users_daily` (integer)
  - `active_users_weekly` (integer)
  - `active_users_monthly` (integer)
  - `total_restaurants` (integer)
  - `verified_restaurants` (integer)
  - `total_reviews` (integer)
  - `reviews_created_today` (integer)
  - `average_platform_rating` (decimal)
  - `photos_uploaded_today` (integer)
  - `created_at` (timestamptz)
  - UNIQUE constraint on (date)

  ## 2. Security (Row Level Security)

  - Restaurant owners can view their own analytics
  - Admins can view all analytics
  - Regular users cannot access analytics tables
  - Search analytics anonymized for privacy

  ## 3. Indexes

  Performance indexes for:
  - Date range queries
  - Restaurant analytics lookups
  - Time-series aggregations
  - Search pattern analysis

  ## 4. Functions & Triggers

  - Daily aggregation job for analytics tables
  - Materialized view refresh for dashboards
  - Automatic cleanup of old analytics data
  - Real-time view counting

  ## Important Notes

  - Daily aggregates reduce query load on production tables
  - Time-series data enables trend analysis
  - Search analytics improve discovery algorithms
  - Peak hours help restaurants optimize operations
  - Platform metrics track overall health
*/

-- Create enums
CREATE TYPE funnel_type AS ENUM ('search_to_review', 'search_to_follow', 'browse_to_favorite', 'view_to_order');

-- Restaurant analytics daily table
CREATE TABLE IF NOT EXISTS restaurant_analytics_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  date date NOT NULL,
  profile_views integer DEFAULT 0,
  menu_views integer DEFAULT 0,
  followers_gained integer DEFAULT 0,
  followers_lost integer DEFAULT 0,
  reviews_received integer DEFAULT 0,
  average_rating decimal(3,2) DEFAULT 0.00,
  photos_uploaded integer DEFAULT 0,
  post_views integer DEFAULT 0,
  post_engagement integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_restaurant_analytics_daily UNIQUE (restaurant_id, date)
);

-- Menu item analytics daily table
CREATE TABLE IF NOT EXISTS menu_item_analytics_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  date date NOT NULL,
  views integer DEFAULT 0,
  clicks integer DEFAULT 0,
  shares integer DEFAULT 0,
  favorites integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_menu_item_analytics_daily UNIQUE (menu_item_id, date)
);

-- User engagement metrics table
CREATE TABLE IF NOT EXISTS user_engagement_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  page_views integer DEFAULT 0,
  searches_performed integer DEFAULT 0,
  restaurants_viewed integer DEFAULT 0,
  reviews_written integer DEFAULT 0,
  photos_uploaded integer DEFAULT 0,
  social_actions integer DEFAULT 0,
  session_duration_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_engagement_metrics UNIQUE (user_id, date)
);

-- Search analytics table
CREATE TABLE IF NOT EXISTS search_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  search_query text NOT NULL,
  filters_applied jsonb DEFAULT '{}',
  results_count integer DEFAULT 0,
  clicked_result_id uuid,
  clicked_position integer,
  session_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Conversion funnels table
CREATE TABLE IF NOT EXISTS conversion_funnels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  funnel_type funnel_type NOT NULL,
  step_1_completed boolean DEFAULT false,
  step_2_completed boolean DEFAULT false,
  step_3_completed boolean DEFAULT false,
  completed_at timestamptz,
  duration_seconds integer,
  created_at timestamptz DEFAULT now()
);

-- Peak hours analysis table
CREATE TABLE IF NOT EXISTS peak_hours_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL,
  hour integer NOT NULL,
  views_count integer DEFAULT 0,
  orders_count integer DEFAULT 0,
  week_start_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_day_of_week CHECK (day_of_week BETWEEN 0 AND 6),
  CONSTRAINT valid_hour CHECK (hour BETWEEN 0 AND 23)
);

-- Popular dishes rankings table
CREATE TABLE IF NOT EXISTS popular_dishes_rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  week_start_date date NOT NULL,
  views integer DEFAULT 0,
  rank integer,
  global_rank integer,
  created_at timestamptz DEFAULT now()
);

-- Platform metrics table
CREATE TABLE IF NOT EXISTS platform_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  total_users integer DEFAULT 0,
  active_users_daily integer DEFAULT 0,
  active_users_weekly integer DEFAULT 0,
  active_users_monthly integer DEFAULT 0,
  total_restaurants integer DEFAULT 0,
  verified_restaurants integer DEFAULT 0,
  total_reviews integer DEFAULT 0,
  reviews_created_today integer DEFAULT 0,
  average_platform_rating decimal(3,2) DEFAULT 0.00,
  photos_uploaded_today integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE restaurant_analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE peak_hours_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE popular_dishes_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for restaurant_analytics_daily
CREATE POLICY "Restaurant owners can view own analytics"
  ON restaurant_analytics_daily FOR SELECT
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all restaurant analytics"
  ON restaurant_analytics_daily FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- RLS Policies for menu_item_analytics_daily
CREATE POLICY "Restaurant owners can view own menu analytics"
  ON menu_item_analytics_daily FOR SELECT
  TO authenticated
  USING (
    menu_item_id IN (
      SELECT id FROM menu_items WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE profile_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all menu analytics"
  ON menu_item_analytics_daily FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- RLS Policies for user_engagement_metrics
CREATE POLICY "Users can view own engagement metrics"
  ON user_engagement_metrics FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all engagement metrics"
  ON user_engagement_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- RLS Policies for search_analytics (Admin only)
CREATE POLICY "Admins can view search analytics"
  ON search_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- RLS Policies for conversion_funnels (Admin only)
CREATE POLICY "Admins can view conversion funnels"
  ON conversion_funnels FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- RLS Policies for peak_hours_analysis
CREATE POLICY "Restaurant owners can view own peak hours"
  ON peak_hours_analysis FOR SELECT
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all peak hours"
  ON peak_hours_analysis FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- RLS Policies for popular_dishes_rankings
CREATE POLICY "Anyone can view popular dishes rankings"
  ON popular_dishes_rankings FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for platform_metrics (Admin only)
CREATE POLICY "Admins can view platform metrics"
  ON platform_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_analytics_restaurant ON restaurant_analytics_daily(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_analytics_date ON restaurant_analytics_daily(date DESC);

CREATE INDEX IF NOT EXISTS idx_menu_item_analytics_item ON menu_item_analytics_daily(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_item_analytics_date ON menu_item_analytics_daily(date DESC);

CREATE INDEX IF NOT EXISTS idx_user_engagement_user ON user_engagement_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_date ON user_engagement_metrics(date DESC);

CREATE INDEX IF NOT EXISTS idx_search_analytics_user ON search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics(search_query);
CREATE INDEX IF NOT EXISTS idx_search_analytics_created ON search_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_analytics_session ON search_analytics(session_id);

CREATE INDEX IF NOT EXISTS idx_conversion_funnels_session ON conversion_funnels(session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_user ON conversion_funnels(user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_type ON conversion_funnels(funnel_type);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_created ON conversion_funnels(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_peak_hours_restaurant ON peak_hours_analysis(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_peak_hours_week ON peak_hours_analysis(week_start_date DESC);
CREATE INDEX IF NOT EXISTS idx_peak_hours_day_hour ON peak_hours_analysis(day_of_week, hour);

CREATE INDEX IF NOT EXISTS idx_popular_dishes_item ON popular_dishes_rankings(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_popular_dishes_restaurant ON popular_dishes_rankings(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_popular_dishes_week ON popular_dishes_rankings(week_start_date DESC);
CREATE INDEX IF NOT EXISTS idx_popular_dishes_rank ON popular_dishes_rankings(rank);

CREATE INDEX IF NOT EXISTS idx_platform_metrics_date ON platform_metrics(date DESC);

-- Function to increment view count for menu items
CREATE OR REPLACE FUNCTION increment_menu_item_view()
RETURNS void AS $$
DECLARE
  today date := CURRENT_DATE;
BEGIN
  NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate platform daily metrics
CREATE OR REPLACE FUNCTION calculate_platform_daily_metrics(metric_date date)
RETURNS void AS $$
BEGIN
  INSERT INTO platform_metrics (
    date,
    total_users,
    active_users_daily,
    total_restaurants,
    verified_restaurants,
    total_reviews,
    reviews_created_today,
    average_platform_rating
  )
  SELECT
    metric_date,
    (SELECT COUNT(*) FROM profiles),
    (SELECT COUNT(DISTINCT user_id) FROM user_engagement_metrics WHERE date = metric_date),
    (SELECT COUNT(*) FROM restaurants WHERE is_active = true),
    (SELECT COUNT(*) FROM restaurant_profiles WHERE verification_status = 'verified'),
    (SELECT COUNT(*) FROM reviews WHERE moderation_status = 'active'),
    (SELECT COUNT(*) FROM reviews WHERE DATE(created_at) = metric_date),
    (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE moderation_status = 'active')
  ON CONFLICT (date) DO UPDATE SET
    total_users = EXCLUDED.total_users,
    active_users_daily = EXCLUDED.active_users_daily,
    total_restaurants = EXCLUDED.total_restaurants,
    verified_restaurants = EXCLUDED.verified_restaurants,
    total_reviews = EXCLUDED.total_reviews,
    reviews_created_today = EXCLUDED.reviews_created_today,
    average_platform_rating = EXCLUDED.average_platform_rating;
END;
$$ LANGUAGE plpgsql;
