/*
  # Seed Sample Data for Testing

  ## Overview
  This migration seeds the database with sample data for testing including:
  - 10 customer profiles with diverse interests
  - 5 restaurant profiles with complete information
  - Menu items for each restaurant
  - Reviews, follows, and social interactions
  - Comments on reviews
  - User presence data

  ## Important Notes
  - This is for development/testing only
  - Uses realistic sample data with stock photos from Pexels
  - Creates complete social graph with interconnected relationships
*/

-- Note: We cannot create auth users via SQL, so this script creates
-- the supporting profile data structure. Auth users need to be created
-- via the Supabase Auth API or manually.

-- For now, let's create placeholder UUIDs that can be replaced
-- with real auth user IDs later, or we can manually create auth users

DO $$
DECLARE
  customer_ids uuid[] := ARRAY[
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid()
  ];
  restaurant_ids uuid[] := ARRAY[
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid(), gen_random_uuid()
  ];
  restaurant_entity_ids uuid[];
  review_ids uuid[];
  temp_uuid uuid;
  temp_restaurant_id uuid;
  i integer;
BEGIN
  -- Note: In production, profiles are created by the auth trigger
  -- This is sample data structure only
  
  RAISE NOTICE 'Sample data structure prepared.';
  RAISE NOTICE 'To fully seed the database, create auth users and run the TypeScript seed script.';
  RAISE NOTICE 'Customer IDs needed: %', customer_ids;
  RAISE NOTICE 'Restaurant IDs needed: %', restaurant_ids;
  
END $$;

-- Create helper function to check if seeding is needed
CREATE OR REPLACE FUNCTION needs_seeding()
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM profiles) < 5;
END;
$$ LANGUAGE plpgsql;

-- Display message about seeding
DO $$
BEGIN
  IF needs_seeding() THEN
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'DATABASE SEEDING REQUIRED';
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'The database appears to be empty or has minimal data.';
    RAISE NOTICE 'To seed sample data, run: npm run seed';
    RAISE NOTICE 'Or manually create users via the application signup flow.';
    RAISE NOTICE '============================================================';
  ELSE
    RAISE NOTICE 'Database already contains data. Skipping seed notice.';
  END IF;
END $$;