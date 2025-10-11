/*
  # Update handle_new_user function to properly cast role enum

  ## Problem
  The handle_new_user() function may not be properly casting the role value
  to the user_role enum type, which could cause insert failures.

  ## Solution
  Update the function to explicitly cast 'CUSTOMER' to user_role enum type.

  ## Changes
  1. Recreate handle_new_user function with explicit type casting
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    'CUSTOMER'::user_role  -- Explicit cast to enum type
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
