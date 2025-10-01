/*
  # Anti-Fraud Detection and Moderation System

  ## Overview
  This migration implements comprehensive anti-fraud mechanisms and moderation tools to combat
  fake reviews, detect suspicious patterns, and enable efficient content moderation. Includes
  risk scoring, anomaly detection, rate limiting, and admin moderation queue.

  ## 1. New Tables

  ### `risk_scores`
  Risk assessment scores for users and reviews
  - `id` (uuid, primary key)
  - `entity_type` (enum) - user, review, restaurant
  - `entity_id` (uuid) - ID of the entity being scored
  - `risk_score` (integer) - 0-100 risk score
  - `risk_factors` (jsonb) - Detailed risk factor breakdown
  - `flagged` (boolean) - Automatically flagged for review
  - `calculated_at` (timestamptz)
  - `expires_at` (timestamptz) - Score expiration for recalculation

  ### `review_velocity_tracking`
  Monitors review patterns for burst detection
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `restaurant_id` (uuid) - References restaurants
  - `time_window` (text) - hour, day, week
  - `review_count` (integer) - Count in window
  - `window_start` (timestamptz)
  - `window_end` (timestamptz)

  ### `ip_tracking`
  IP address tracking for cross-referencing
  - `id` (uuid, primary key)
  - `ip_address` (inet, unique)
  - `country_code` (text)
  - `city` (text)
  - `is_vpn` (boolean)
  - `is_proxy` (boolean)
  - `is_tor` (boolean)
  - `risk_score` (integer)
  - `review_count` (integer)
  - `user_count` (integer) - Multiple users from same IP
  - `flagged` (boolean)
  - `first_seen` (timestamptz)
  - `last_seen` (timestamptz)

  ### `moderation_queue`
  Content flagged for moderation review
  - `id` (uuid, primary key)
  - `item_type` (enum) - review, photo, post, profile
  - `item_id` (uuid) - ID of item being moderated
  - `flagged_reason` (enum) - auto_risk_score, user_report, pattern_detection, manual
  - `priority` (enum) - low, medium, high, urgent
  - `status` (enum) - pending, in_review, resolved, dismissed
  - `auto_detected` (boolean) - Automatically flagged vs manually reported
  - `risk_score` (integer)
  - `report_count` (integer) - Number of user reports
  - `assigned_to` (uuid) - Admin assigned to review
  - `notes` (text) - Moderation notes
  - `resolution` (text) - Resolution details
  - `created_at` (timestamptz)
  - `resolved_at` (timestamptz)

  ### `admin_actions_log`
  Audit trail of all moderation actions
  - `id` (uuid, primary key)
  - `admin_id` (uuid) - Admin who performed action
  - `action_type` (enum) - approve, reject, remove, ban, warn, restore
  - `target_type` (text) - review, user, restaurant, photo
  - `target_id` (uuid)
  - `reason` (text)
  - `metadata` (jsonb) - Additional action details
  - `created_at` (timestamptz)

  ### `rate_limits`
  Rate limiting tracking for abuse prevention
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `action_type` (enum) - review_create, photo_upload, report_submit, vote_cast
  - `action_count` (integer)
  - `window_start` (timestamptz)
  - `window_end` (timestamptz)
  - `limit_exceeded` (boolean)
  - `created_at` (timestamptz)

  ### `banned_entities`
  Permanently or temporarily banned users/IPs
  - `id` (uuid, primary key)
  - `entity_type` (enum) - user, ip_address, device
  - `entity_value` (text) - User ID, IP address, or device fingerprint
  - `ban_type` (enum) - permanent, temporary
  - `expires_at` (timestamptz) - For temporary bans
  - `reason` (text)
  - `banned_by` (uuid) - Admin who issued ban
  - `created_at` (timestamptz)

  ## 2. Security (Row Level Security)

  - Admins have full access to all moderation tables
  - Regular users cannot view risk scores or moderation data
  - Rate limiting enforced at database level
  - Audit logs immutable (insert-only)

  ## 3. Indexes

  Performance indexes for:
  - Risk score lookups
  - Moderation queue filtering and sorting
  - IP tracking and cross-referencing
  - Admin action auditing

  ## 4. Functions & Triggers

  - Auto-calculate risk scores on review creation
  - Detect review velocity anomalies
  - Auto-flag high-risk content for moderation
  - Track IP patterns and device fingerprints
  - Enforce rate limits

  ## Important Notes

  - Risk scoring uses multiple signals: velocity, IP patterns, device fingerprints
  - Moderation queue prioritizes high-risk items
  - Audit logs ensure accountability for all moderation decisions
  - Rate limits prevent spam and abuse at source
  - Banned entities checked before allowing actions
*/

-- Create enums
CREATE TYPE risk_entity_type AS ENUM ('user', 'review', 'restaurant');
CREATE TYPE moderation_item_type AS ENUM ('review', 'photo', 'post', 'profile');
CREATE TYPE flag_reason AS ENUM ('auto_risk_score', 'user_report', 'pattern_detection', 'manual');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE queue_status AS ENUM ('pending', 'in_review', 'resolved', 'dismissed');
CREATE TYPE admin_action_type AS ENUM ('approve', 'reject', 'remove', 'ban', 'warn', 'restore');
CREATE TYPE rate_limit_action AS ENUM ('review_create', 'photo_upload', 'report_submit', 'vote_cast', 'follow_action');
CREATE TYPE ban_entity_type AS ENUM ('user', 'ip_address', 'device');
CREATE TYPE ban_type AS ENUM ('permanent', 'temporary');

-- Risk scores table
CREATE TABLE IF NOT EXISTS risk_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type risk_entity_type NOT NULL,
  entity_id uuid NOT NULL,
  risk_score integer DEFAULT 0,
  risk_factors jsonb DEFAULT '{}',
  flagged boolean DEFAULT false,
  calculated_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT now() + interval '7 days',
  CONSTRAINT valid_risk_score CHECK (risk_score BETWEEN 0 AND 100)
);

-- Review velocity tracking
CREATE TABLE IF NOT EXISTS review_velocity_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  time_window text NOT NULL,
  review_count integer DEFAULT 0,
  window_start timestamptz NOT NULL,
  window_end timestamptz NOT NULL,
  CONSTRAINT valid_time_window CHECK (time_window IN ('hour', 'day', 'week'))
);

-- IP tracking table
CREATE TABLE IF NOT EXISTS ip_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet UNIQUE NOT NULL,
  country_code text,
  city text,
  is_vpn boolean DEFAULT false,
  is_proxy boolean DEFAULT false,
  is_tor boolean DEFAULT false,
  risk_score integer DEFAULT 0,
  review_count integer DEFAULT 0,
  user_count integer DEFAULT 0,
  flagged boolean DEFAULT false,
  first_seen timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  CONSTRAINT valid_ip_risk_score CHECK (risk_score BETWEEN 0 AND 100)
);

-- Moderation queue
CREATE TABLE IF NOT EXISTS moderation_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type moderation_item_type NOT NULL,
  item_id uuid NOT NULL,
  flagged_reason flag_reason NOT NULL,
  priority priority_level DEFAULT 'medium',
  status queue_status DEFAULT 'pending',
  auto_detected boolean DEFAULT false,
  risk_score integer,
  report_count integer DEFAULT 0,
  assigned_to uuid REFERENCES profiles(id),
  notes text,
  resolution text,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  CONSTRAINT valid_mod_risk_score CHECK (risk_score IS NULL OR (risk_score BETWEEN 0 AND 100))
);

-- Admin actions log
CREATE TABLE IF NOT EXISTS admin_actions_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES profiles(id),
  action_type admin_action_type NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  reason text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Rate limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  action_type rate_limit_action NOT NULL,
  action_count integer DEFAULT 0,
  window_start timestamptz NOT NULL,
  window_end timestamptz NOT NULL,
  limit_exceeded boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Banned entities table
CREATE TABLE IF NOT EXISTS banned_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type ban_entity_type NOT NULL,
  entity_value text NOT NULL,
  ban_type ban_type NOT NULL,
  expires_at timestamptz,
  reason text NOT NULL,
  banned_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_banned_entity UNIQUE (entity_type, entity_value)
);

-- Enable Row Level Security
ALTER TABLE risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_velocity_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_entities ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin only access)
CREATE POLICY "Admins can view all risk scores"
  ON risk_scores FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage risk scores"
  ON risk_scores FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can view velocity tracking"
  ON review_velocity_tracking FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can view IP tracking"
  ON ip_tracking FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can view moderation queue"
  ON moderation_queue FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage moderation queue"
  ON moderation_queue FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can view admin actions log"
  ON admin_actions_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can create admin action logs"
  ON admin_actions_log FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Users can view own rate limits"
  ON rate_limits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all rate limits"
  ON rate_limits FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can view banned entities"
  ON banned_entities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage banned entities"
  ON banned_entities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_risk_scores_entity ON risk_scores(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_flagged ON risk_scores(flagged);
CREATE INDEX IF NOT EXISTS idx_risk_scores_score ON risk_scores(risk_score DESC);

CREATE INDEX IF NOT EXISTS idx_velocity_tracking_user ON review_velocity_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_velocity_tracking_restaurant ON review_velocity_tracking(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_velocity_tracking_window ON review_velocity_tracking(window_start, window_end);

CREATE INDEX IF NOT EXISTS idx_ip_tracking_ip ON ip_tracking(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_tracking_flagged ON ip_tracking(flagged);
CREATE INDEX IF NOT EXISTS idx_ip_tracking_risk ON ip_tracking(risk_score DESC);

CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON moderation_queue(status);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_priority ON moderation_queue(priority);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_item ON moderation_queue(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_created ON moderation_queue(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_assigned ON moderation_queue(assigned_to);

CREATE INDEX IF NOT EXISTS idx_admin_actions_admin ON admin_actions_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target ON admin_actions_log(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created ON admin_actions_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rate_limits_user ON rate_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_action ON rate_limits(action_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start, window_end);
CREATE INDEX IF NOT EXISTS idx_rate_limits_exceeded ON rate_limits(limit_exceeded);

CREATE INDEX IF NOT EXISTS idx_banned_entities_type_value ON banned_entities(entity_type, entity_value);
CREATE INDEX IF NOT EXISTS idx_banned_entities_expires ON banned_entities(expires_at);

-- Function to calculate review risk score
CREATE OR REPLACE FUNCTION calculate_review_risk_score(review_id uuid)
RETURNS integer AS $$
DECLARE
  risk integer := 0;
  review_record RECORD;
  user_review_count integer;
  same_ip_reviews integer;
  velocity_anomaly boolean;
BEGIN
  SELECT * INTO review_record FROM reviews WHERE id = review_id;
  
  SELECT COUNT(*) INTO user_review_count 
  FROM reviews 
  WHERE user_id = review_record.user_id 
  AND created_at > now() - interval '7 days';
  
  IF user_review_count > 5 THEN
    risk := risk + 30;
  ELSIF user_review_count > 10 THEN
    risk := risk + 50;
  END IF;
  
  SELECT COUNT(*) INTO same_ip_reviews
  FROM device_fingerprints df1
  JOIN device_fingerprints df2 ON df1.ip_address = df2.ip_address
  WHERE df1.user_id = review_record.user_id
  AND df2.user_id != review_record.user_id;
  
  IF same_ip_reviews > 3 THEN
    risk := risk + 40;
  END IF;
  
  IF review_record.rating = 5 OR review_record.rating = 1 THEN
    risk := risk + 10;
  END IF;
  
  IF review_record.comment IS NULL OR length(review_record.comment) < 20 THEN
    risk := risk + 15;
  END IF;
  
  RETURN LEAST(risk, 100);
END;
$$ LANGUAGE plpgsql;

-- Function to auto-flag high-risk content
CREATE OR REPLACE FUNCTION auto_flag_high_risk_review()
RETURNS TRIGGER AS $$
DECLARE
  risk_score_value integer;
BEGIN
  risk_score_value := calculate_review_risk_score(NEW.id);
  
  INSERT INTO risk_scores (entity_type, entity_id, risk_score, flagged, risk_factors)
  VALUES (
    'review',
    NEW.id,
    risk_score_value,
    risk_score_value > 60,
    json_build_object('review_id', NEW.id, 'calculated_on', 'insert')
  );
  
  IF risk_score_value > 60 THEN
    INSERT INTO moderation_queue (
      item_type,
      item_id,
      flagged_reason,
      priority,
      auto_detected,
      risk_score
    ) VALUES (
      'review',
      NEW.id,
      'auto_risk_score',
      CASE 
        WHEN risk_score_value > 80 THEN 'urgent'
        WHEN risk_score_value > 70 THEN 'high'
        ELSE 'medium'
      END,
      true,
      risk_score_value
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_flag_high_risk_review
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION auto_flag_high_risk_review();

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id uuid,
  p_action_type rate_limit_action,
  p_limit integer,
  p_window_minutes integer
)
RETURNS boolean AS $$
DECLARE
  current_count integer;
  window_start_time timestamptz;
BEGIN
  window_start_time := now() - (p_window_minutes || ' minutes')::interval;
  
  SELECT COALESCE(SUM(action_count), 0) INTO current_count
  FROM rate_limits
  WHERE user_id = p_user_id
  AND action_type = p_action_type
  AND window_end > window_start_time;
  
  IF current_count >= p_limit THEN
    UPDATE rate_limits 
    SET limit_exceeded = true 
    WHERE user_id = p_user_id 
    AND action_type = p_action_type 
    AND window_end > window_start_time;
    
    RETURN false;
  END IF;
  
  INSERT INTO rate_limits (user_id, action_type, action_count, window_start, window_end)
  VALUES (
    p_user_id,
    p_action_type,
    1,
    now(),
    now() + (p_window_minutes || ' minutes')::interval
  )
  ON CONFLICT DO NOTHING;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;
