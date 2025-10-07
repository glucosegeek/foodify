/*
  # Fix Infinite Recursion in Profiles RLS Policies

  ## Problem
  The "Admins can view all profiles" policy causes infinite recursion because it queries
  the profiles table to check if a user is an admin, but accessing profiles requires
  passing the RLS check, which queries profiles again.

  ## Solution
  Drop the problematic admin policy. If admin functionality is needed later, it should
  use a different approach (e.g., checking auth.jwt() metadata or a separate admin table).

  ## Changes
  - Drop "Admins can view all profiles" policy to fix 500 error and infinite recursion
  - Keep "Users can view own profile" policy for normal users
  - Keep "Users can update own profile" policy for profile updates
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
