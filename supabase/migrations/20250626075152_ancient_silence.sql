/*
  # Fix user signup database error

  1. Database Functions
    - Create or replace the handle_new_user function that creates a profile when a user signs up
    - Create or replace the handle_updated_at function for timestamp updates

  2. Triggers
    - Create trigger to automatically create user profile on auth.users insert
    - Ensure updated_at trigger is properly set up

  3. Security
    - Ensure RLS policies allow the trigger to insert new user profiles
    - Add service role policy for automatic user creation
*/

-- Create or replace the updated_at function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the new user handler function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    now(),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Ensure the updated_at trigger exists on users table
DROP TRIGGER IF EXISTS handle_users_updated_at ON public.users;
CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Add service role policy to allow automatic user creation
DO $$
BEGIN
  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Service role can insert users'
  ) THEN
    CREATE POLICY "Service role can insert users"
      ON users
      FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

-- Ensure the users table has the correct structure
DO $$
BEGIN
  -- Check if full_name column allows NULL (it should for flexibility)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' 
    AND column_name = 'full_name' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE users ALTER COLUMN full_name DROP NOT NULL;
  END IF;
END $$;