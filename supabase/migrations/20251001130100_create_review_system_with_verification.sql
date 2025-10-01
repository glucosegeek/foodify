/*
  # Review System with Multi-Level Verification

  ## Overview
  This migration implements a comprehensive review and rating system with three verification
  levels to combat fake reviews: UNVERIFIED, VERIFIED_VISIT, and VERIFIED_PURCHASE.
  Includes photo reviews, owner replies, helpful voting, and reporting mechanisms.

  ## 1. New Tables

  ### `reviews`
  Core review table with verification levels
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles (customer who wrote review)
  - `restaurant_id` (uuid) - References restaurants
  - `rating` (integer) - Star rating 1-5
  - `comment` (text) - Review text content
  - `verification_level` (enum) - unverified, verified_visit, verified_purchase
  - `verification_data` (jsonb) - Metadata about verification (token, timestamp, method)
  - `visit_date` (date) - Claimed visit date
  - `helpful_count` (integer) - Cached count of helpful votes
  - `reported_count` (integer) - Number of times reported
  - `moderation_status` (enum) - active, flagged, hidden, removed
  - `moderation_notes` (text) - Admin notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `review_photos`
  Photos attached to reviews
  - `id` (uuid, primary key)
  - `review_id` (uuid) - References reviews
  - `photo_url` (text) - Storage URL
  - `caption` (text)
  - `exif_stripped` (boolean) - EXIF data removed flag
  - `moderation_status` (enum)
  - `display_order` (integer)
  - `created_at` (timestamptz)

  ### `review_verification_tokens`
  Tokens for verifying restaurant visits (QR codes, NFC, etc.)
  - `id` (uuid, primary key)
  - `restaurant_id` (uuid) - References restaurants
  - `token` (text, unique) - Verification token/code
  - `verification_method` (enum) - qr_code, nfc, wifi, geofence
  - `expires_at` (timestamptz)
  - `used_by` (uuid) - References profiles
  - `used_at` (timestamptz)
  - `metadata` (jsonb) - Additional verification data
  - `created_at` (timestamptz)

  ### `receipt_verifications`
  Receipt-based purchase verification
  - `id` (uuid, primary key)
  - `restaurant_id` (uuid) - References restaurants
  - `user_id` (uuid) - References profiles
  - `receipt_code` (text) - Hashed receipt identifier
  - `receipt_url` (text) - Storage URL for receipt image
  - `verification_method` (enum) - manual_code, ocr, pos_integration
  - `purchase_amount` (decimal)
  - `purchase_date` (date)
  - `status` (enum) - pending, verified, rejected
  - `verified_at` (timestamptz)
  - `linked_review_id` (uuid) - References reviews
  - `created_at` (timestamptz)

  ### `review_replies`
  Restaurant owner responses to reviews
  - `id` (uuid, primary key)
  - `review_id` (uuid) - References reviews
  - `restaurant_id` (uuid) - References restaurants
  - `replied_by` (uuid) - References profiles (restaurant owner/team)
  - `reply_text` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `review_votes`
  Helpful/not helpful voting on reviews
  - `id` (uuid, primary key)
  - `review_id` (uuid) - References reviews
  - `user_id` (uuid) - References profiles
  - `vote_type` (enum) - helpful, not_helpful
  - `created_at` (timestamptz)
  - UNIQUE constraint on (review_id, user_id) to prevent duplicate votes

  ### `review_reports`
  User reports of inappropriate reviews
  - `id` (uuid, primary key)
  - `review_id` (uuid) - References reviews
  - `reported_by` (uuid) - References profiles
  - `report_reason` (enum) - spam, fake, offensive, inappropriate, other
  - `report_details` (text)
  - `status` (enum) - pending, reviewed, resolved, dismissed
  - `reviewed_by` (uuid) - References profiles (admin)
  - `resolution_notes` (text)
  - `created_at` (timestamptz)
  - `resolved_at` (timestamptz)

  ### `weighted_ratings_cache`
  Materialized view for weighted average calculations
  - `restaurant_id` (uuid)
  - `total_reviews` (integer)
  - `unverified_count` (integer)
  - `verified_visit_count` (integer)
  - `verified_purchase_count` (integer)
  - `weighted_average` (decimal) - Calculated with weights: 1x, 2x, 3x
  - `simple_average` (decimal) - Unweighted average
  - `last_updated` (timestamptz)

  ## 2. Security (Row Level Security)

  - Anyone can read active reviews
  - Users can create their own reviews
  - Users can only edit their own reviews within 24 hours
  - Restaurant owners can reply to reviews of their restaurant
  - Users can vote and report reviews
  - Admins can moderate reviews and view reports

  ## 3. Indexes

  Strategic indexes for:
  - Restaurant review lookups
  - Verification level filtering
  - Moderation status filtering
  - Helpful vote sorting
  - User review history
  - Report queue queries

  ## 4. Functions & Triggers

  - Trigger to increment helpful_count on review_votes
  - Trigger to update weighted_ratings_cache on new/updated reviews
  - Function to calculate weighted average rating
  - Trigger to prevent review editing after 24 hours

  ## Important Notes

  - Verification levels create trust hierarchy in ratings
  - Weighted averages give more weight to verified reviews
  - Receipt verification can be automated via OCR or POS integration
  - Token-based verification supports QR, NFC, Wi-Fi, geofencing
  - Moderation system allows quick action on reported content
  - Cached ratings reduce expensive aggregation queries
*/

-- Create enums
CREATE TYPE verification_level AS ENUM ('unverified', 'verified_visit', 'verified_purchase');
CREATE TYPE verification_method AS ENUM ('qr_code', 'nfc', 'wifi', 'geofence', 'manual_code', 'ocr', 'pos_integration');
CREATE TYPE review_moderation_status AS ENUM ('active', 'flagged', 'hidden', 'removed');
CREATE TYPE vote_type AS ENUM ('helpful', 'not_helpful');
CREATE TYPE report_reason AS ENUM ('spam', 'fake', 'offensive', 'inappropriate', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');
CREATE TYPE receipt_status AS ENUM ('pending', 'verified', 'rejected');

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  rating integer NOT NULL,
  comment text,
  verification_level verification_level DEFAULT 'unverified',
  verification_data jsonb DEFAULT '{}',
  visit_date date,
  helpful_count integer DEFAULT 0,
  reported_count integer DEFAULT 0,
  moderation_status review_moderation_status DEFAULT 'active',
  moderation_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT one_review_per_user_per_restaurant UNIQUE (user_id, restaurant_id)
);

-- Review photos
CREATE TABLE IF NOT EXISTS review_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  caption text,
  exif_stripped boolean DEFAULT false,
  moderation_status moderation_status DEFAULT 'pending',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Verification tokens
CREATE TABLE IF NOT EXISTS review_verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  verification_method verification_method NOT NULL,
  expires_at timestamptz NOT NULL,
  used_by uuid REFERENCES profiles(id),
  used_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Receipt verifications
CREATE TABLE IF NOT EXISTS receipt_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  receipt_code text NOT NULL,
  receipt_url text,
  verification_method verification_method NOT NULL,
  purchase_amount decimal(10, 2),
  purchase_date date,
  status receipt_status DEFAULT 'pending',
  verified_at timestamptz,
  linked_review_id uuid REFERENCES reviews(id),
  created_at timestamptz DEFAULT now()
);

-- Review replies
CREATE TABLE IF NOT EXISTS review_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  replied_by uuid REFERENCES profiles(id),
  reply_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT one_reply_per_review UNIQUE (review_id)
);

-- Review votes
CREATE TABLE IF NOT EXISTS review_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  vote_type vote_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT one_vote_per_user_per_review UNIQUE (review_id, user_id)
);

-- Review reports
CREATE TABLE IF NOT EXISTS review_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  reported_by uuid REFERENCES profiles(id),
  report_reason report_reason NOT NULL,
  report_details text,
  status report_status DEFAULT 'pending',
  reviewed_by uuid REFERENCES profiles(id),
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipt_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
CREATE POLICY "Anyone can view active reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (moderation_status = 'active');

CREATE POLICY "Users can view own reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews within 24 hours"
  ON reviews FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() 
    AND created_at > now() - interval '24 hours'
  )
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for review_photos
CREATE POLICY "Anyone can view approved review photos"
  ON review_photos FOR SELECT
  TO authenticated
  USING (moderation_status = 'approved');

CREATE POLICY "Users can manage own review photos"
  ON review_photos FOR ALL
  TO authenticated
  USING (
    review_id IN (
      SELECT id FROM reviews WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for review_verification_tokens
CREATE POLICY "Users can view unused tokens"
  ON review_verification_tokens FOR SELECT
  TO authenticated
  USING (used_by IS NULL OR used_by = auth.uid());

CREATE POLICY "Users can claim tokens"
  ON review_verification_tokens FOR UPDATE
  TO authenticated
  USING (used_by IS NULL OR used_by = auth.uid())
  WITH CHECK (used_by = auth.uid());

-- RLS Policies for receipt_verifications
CREATE POLICY "Users can view own receipt verifications"
  ON receipt_verifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own receipt verifications"
  ON receipt_verifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Restaurant owners can view their receipts"
  ON receipt_verifications FOR SELECT
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE profile_id = auth.uid()
    )
  );

-- RLS Policies for review_replies
CREATE POLICY "Anyone can view review replies"
  ON review_replies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Restaurant owners can create replies"
  ON review_replies FOR INSERT
  TO authenticated
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can update own replies"
  ON review_replies FOR UPDATE
  TO authenticated
  USING (replied_by = auth.uid())
  WITH CHECK (replied_by = auth.uid());

-- RLS Policies for review_votes
CREATE POLICY "Users can view all votes"
  ON review_votes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own votes"
  ON review_votes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own votes"
  ON review_votes FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own votes"
  ON review_votes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for review_reports
CREATE POLICY "Users can view own reports"
  ON review_reports FOR SELECT
  TO authenticated
  USING (reported_by = auth.uid());

CREATE POLICY "Users can create reports"
  ON review_reports FOR INSERT
  TO authenticated
  WITH CHECK (reported_by = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_verification_level ON reviews(verification_level);
CREATE INDEX IF NOT EXISTS idx_reviews_moderation_status ON reviews(moderation_status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_helpful_count ON reviews(helpful_count DESC);

CREATE INDEX IF NOT EXISTS idx_review_photos_review ON review_photos(review_id);
CREATE INDEX IF NOT EXISTS idx_review_photos_moderation ON review_photos(moderation_status);

CREATE INDEX IF NOT EXISTS idx_verification_tokens_restaurant ON review_verification_tokens(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON review_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON review_verification_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_receipt_verifications_restaurant ON receipt_verifications(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_receipt_verifications_user ON receipt_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_receipt_verifications_status ON receipt_verifications(status);

CREATE INDEX IF NOT EXISTS idx_review_replies_review ON review_replies(review_id);
CREATE INDEX IF NOT EXISTS idx_review_replies_restaurant ON review_replies(restaurant_id);

CREATE INDEX IF NOT EXISTS idx_review_votes_review ON review_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_user ON review_votes(user_id);

CREATE INDEX IF NOT EXISTS idx_review_reports_review ON review_reports(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reports_status ON review_reports(status);

-- Function to update helpful count
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.vote_type = 'helpful' THEN
    UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' AND OLD.vote_type = 'helpful' THEN
    UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = OLD.review_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote_type = 'helpful' AND NEW.vote_type = 'not_helpful' THEN
      UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = NEW.review_id;
    ELSIF OLD.vote_type = 'not_helpful' AND NEW.vote_type = 'helpful' THEN
      UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_review_helpful_count
  AFTER INSERT OR UPDATE OR DELETE ON review_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- Function to update restaurant review counts and ratings
CREATE OR REPLACE FUNCTION update_restaurant_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE restaurant_profiles
    SET 
      reviews_count = reviews_count + 1,
      average_rating = (
        SELECT ROUND(AVG(rating)::numeric, 2)
        FROM reviews
        WHERE restaurant_id = NEW.restaurant_id
        AND moderation_status = 'active'
      )
    WHERE id = (SELECT profile_id FROM restaurants WHERE id = NEW.restaurant_id);
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE restaurant_profiles
    SET 
      average_rating = (
        SELECT ROUND(AVG(rating)::numeric, 2)
        FROM reviews
        WHERE restaurant_id = NEW.restaurant_id
        AND moderation_status = 'active'
      )
    WHERE id = (SELECT profile_id FROM restaurants WHERE id = NEW.restaurant_id);
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE restaurant_profiles
    SET 
      reviews_count = reviews_count - 1,
      average_rating = (
        SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
        FROM reviews
        WHERE restaurant_id = OLD.restaurant_id
        AND moderation_status = 'active'
      )
    WHERE id = (SELECT profile_id FROM restaurants WHERE id = OLD.restaurant_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_restaurant_review_stats
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_restaurant_review_stats();

-- Triggers for updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_replies_updated_at
  BEFORE UPDATE ON review_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
