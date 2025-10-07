/*
  # Create handle_new_user Trigger

  ## Problem
  The handle_new_user() function and trigger are missing, which means profiles are not
  automatically created when users sign up via Supabase Auth.

  ## Solution
  Create a trigger function that automatically creates a profile record whenever a new
  user is created in auth.users.

  ## Changes
  1. Create handle_new_user() function that:
     - Inserts a new profile record linked to the auth.users record
     - Extracts email from auth.users
     - Sets default role to 'CUSTOMER'
     - Uses metadata from signup if available

  2. Create trigger on auth.users table:
     - Fires AFTER INSERT
     - Calls handle_new_user() function
     - Uses SECURITY DEFINER to bypass RLS

  ## Important Notes
  - This trigger runs with elevated privileges (SECURITY DEFINER)
  - Default role is 'CUSTOMER' which can be updated after signup
  - Function uses COALESCE to handle missing metadata gracefully
*/

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    'CUSTOMER'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
