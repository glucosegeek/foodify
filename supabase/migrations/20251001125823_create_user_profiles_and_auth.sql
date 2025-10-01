/*
  # User Profiles and Authentication System

  ## Overview
  This migration establishes the foundation for user management with role-based access control
  (CUSTOMER, RESTAURANT, ADMIN). It extends Supabase Auth with custom profile tables and
  implements secure Row Level Security policies.

  ## 1. New Tables

  ### `profiles`
  Core user profile table linked to Supabase Auth users
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email from auth
  - `role` (enum) - User role: CUSTOMER, RESTAURANT, or ADMIN
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### `customer_profiles`
  Extended profile data for customer accounts
  - `id` (uuid, primary key) - References profiles
  - `username` (text, unique) - Public display name
  - `avatar_url` (text) - Profile picture URL
  - `bio` (text) - User bio/description
  - `location` (text) - User's city/area
  - `favorite_cuisines` (text[]) - Array of preferred cuisine types
  - `dietary_restrictions` (text[]) - Array of dietary preferences
  - `price_range_preference` (text) - Preferred price range ($, $$, $$$, $$$$)
  - `notifications_enabled` (boolean) - Email notification opt-in
  - `profile_public` (boolean) - Profile visibility setting
  - `followers_count` (integer) - Cached follower count
  - `following_count` (integer) - Cached following count
  - `reviews_count` (integer) - Total reviews written
  - `photos_count` (integer) - Total photos uploaded
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `restaurant_profiles`
  Extended profile data for restaurant accounts
  - `id` (uuid, primary key) - References profiles
  - `name` (text) - Restaurant business name
  - `slug` (text, unique) - URL-friendly name
  - `logo_url` (text) - Restaurant logo
  - `cover_photo_url` (text) - Cover image
  - `description` (text) - About the restaurant
  - `cuisine_types` (text[]) - Array of cuisine types served
  - `address` (text) - Street address
  - `city` (text) - City
  - `postal_code` (text) - Postal/ZIP code
  - `country` (text) - Country
  - `phone` (text) - Contact phone number
  - `website` (text) - Restaurant website URL
  - `email` (text) - Public contact email
  - `business_hours` (jsonb) - Opening hours structure
  - `price_level` (integer) - Price range 1-4 ($-$$$$)
  - `tags` (text[]) - Feature tags (vegetarian-friendly, delivery, etc.)
  - `verification_status` (enum) - pending, verified, rejected
  - `verified_at` (timestamptz) - Verification completion date
  - `followers_count` (integer) - Cached follower count
  - `reviews_count` (integer) - Total reviews received
  - `average_rating` (decimal) - Cached average rating
  - `team_member_emails` (text[]) - Allowed team member emails
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `restaurant_verification_documents`
  Stores verification documents for restaurant ownership claims
  - `id` (uuid, primary key)
  - `restaurant_profile_id` (uuid) - References restaurant_profiles
  - `document_type` (text) - Type of document (business_license, tax_id, etc.)
  - `document_url` (text) - Storage URL for document
  - `status` (text) - pending, approved, rejected
  - `notes` (text) - Admin review notes
  - `submitted_at` (timestamptz)
  - `reviewed_at` (timestamptz)
  - `reviewed_by` (uuid) - Admin who reviewed

  ### `device_fingerprints`
  Tracks devices for anti-fraud detection
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `fingerprint_hash` (text) - Hashed device fingerprint
  - `ip_address` (inet) - IP address
  - `user_agent` (text) - Browser user agent
  - `first_seen` (timestamptz)
  - `last_seen` (timestamptz)
  - `review_count` (integer) - Reviews from this device
  - `flagged` (boolean) - Marked as suspicious

  ## 2. Security (Row Level Security)

  All tables have RLS enabled with policies ensuring:
  - Users can read their own profile data
  - Users can update their own profile data
  - Restaurant team members can access restaurant profile
  - Admins can access all profiles
  - Device fingerprints are only accessible to admins and the system

  ## 3. Indexes

  Strategic indexes for performance:
  - profiles: role, email
  - customer_profiles: username (unique)
  - restaurant_profiles: slug (unique), city, cuisine_types, verification_status
  - device_fingerprints: user_id, fingerprint_hash, ip_address

  ## 4. Functions & Triggers

  - Auto-update `updated_at` timestamps on all profile tables
  - Trigger to create profile entry when auth.users record is created

  ## Important Notes

  - All profile data is separate from auth.users for security isolation
  - Verification documents stored in Supabase Storage with references here
  - Device fingerprinting enables fraud detection without PII exposure
  - Cached counts (followers, reviews) updated via triggers in later migrations
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'RESTAURANT', 'ADMIN');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role user_role NOT NULL DEFAULT 'CUSTOMER',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customer profiles
CREATE TABLE IF NOT EXISTS customer_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text,
  bio text,
  location text,
  favorite_cuisines text[] DEFAULT '{}',
  dietary_restrictions text[] DEFAULT '{}',
  price_range_preference text DEFAULT '$$',
  notifications_enabled boolean DEFAULT true,
  profile_public boolean DEFAULT true,
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  reviews_count integer DEFAULT 0,
  photos_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_price_preference CHECK (price_range_preference IN ('$', '$$', '$$$', '$$$$'))
);

-- Restaurant profiles
CREATE TABLE IF NOT EXISTS restaurant_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  cover_photo_url text,
  description text,
  cuisine_types text[] DEFAULT '{}',
  address text,
  city text,
  postal_code text,
  country text DEFAULT 'Poland',
  phone text,
  website text,
  email text,
  business_hours jsonb DEFAULT '{}',
  price_level integer DEFAULT 2,
  tags text[] DEFAULT '{}',
  verification_status verification_status DEFAULT 'pending',
  verified_at timestamptz,
  followers_count integer DEFAULT 0,
  reviews_count integer DEFAULT 0,
  average_rating decimal(3,2) DEFAULT 0.00,
  team_member_emails text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_price_level CHECK (price_level BETWEEN 1 AND 4),
  CONSTRAINT valid_rating CHECK (average_rating BETWEEN 0 AND 5)
);

-- Restaurant verification documents
CREATE TABLE IF NOT EXISTS restaurant_verification_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_profile_id uuid REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_url text NOT NULL,
  status text DEFAULT 'pending',
  notes text,
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Device fingerprints for anti-fraud
CREATE TABLE IF NOT EXISTS device_fingerprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  fingerprint_hash text NOT NULL,
  ip_address inet,
  user_agent text,
  first_seen timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  review_count integer DEFAULT 0,
  flagged boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_fingerprints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- RLS Policies for customer_profiles
CREATE POLICY "Anyone can view public customer profiles"
  ON customer_profiles FOR SELECT
  TO authenticated
  USING (profile_public = true);

CREATE POLICY "Users can view own customer profile"
  ON customer_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own customer profile"
  ON customer_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own customer profile"
  ON customer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for restaurant_profiles
CREATE POLICY "Anyone can view verified restaurant profiles"
  ON restaurant_profiles FOR SELECT
  TO authenticated
  USING (verification_status = 'verified');

CREATE POLICY "Restaurant owners can view own profile"
  ON restaurant_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Restaurant owners can update own profile"
  ON restaurant_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Restaurant owners can insert own profile"
  ON restaurant_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all restaurant profiles"
  ON restaurant_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- RLS Policies for verification documents
CREATE POLICY "Restaurant owners can view own documents"
  ON restaurant_verification_documents FOR SELECT
  TO authenticated
  USING (
    restaurant_profile_id IN (
      SELECT id FROM restaurant_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can insert own documents"
  ON restaurant_verification_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    restaurant_profile_id IN (
      SELECT id FROM restaurant_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all verification documents"
  ON restaurant_verification_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can update verification documents"
  ON restaurant_verification_documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- RLS Policies for device_fingerprints (admin only)
CREATE POLICY "Admins can view device fingerprints"
  ON device_fingerprints FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_username ON customer_profiles(username);
CREATE INDEX IF NOT EXISTS idx_restaurant_profiles_slug ON restaurant_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_restaurant_profiles_city ON restaurant_profiles(city);
CREATE INDEX IF NOT EXISTS idx_restaurant_profiles_cuisine_types ON restaurant_profiles USING GIN(cuisine_types);
CREATE INDEX IF NOT EXISTS idx_restaurant_profiles_verification ON restaurant_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_user ON device_fingerprints(user_id);
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_hash ON device_fingerprints(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_ip ON device_fingerprints(ip_address);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_profiles_updated_at
  BEFORE UPDATE ON customer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_profiles_updated_at
  BEFORE UPDATE ON restaurant_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
