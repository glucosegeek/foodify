/*
  # Fix profiles table INSERT policy

  ## Problem
  The `handle_new_user()` trigger cannot insert into `profiles` table because
  there is no INSERT policy defined. This causes "Database error saving new user"
  when users try to sign up.

  ## Solution
  Add an INSERT policy that allows the trigger function to create profile records.
  Since the trigger runs with SECURITY DEFINER, we need a policy that allows
  service role or the trigger itself to insert.

  ## Changes
  1. Add INSERT policy for profiles table that allows inserting during user creation
*/

-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for authentication" ON public.profiles;

-- Allow inserts for new user creation (triggered by auth.users insert)
-- This policy allows anyone to insert as long as the id matches a real auth.users id
CREATE POLICY "Enable insert for authentication"
  ON public.profiles
  FOR INSERT
  TO public
  WITH CHECK (
    -- Allow insert if the ID exists in auth.users
    EXISTS (
      SELECT 1 FROM auth.users WHERE auth.users.id = profiles.id
    )
  );
