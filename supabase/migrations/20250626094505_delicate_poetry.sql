/*
  # Fix authentication and logging errors

  1. RLS Policy Updates
    - Drop existing restrictive signin_logs policies
    - Create new policies that allow:
      - Authenticated users to insert their own logs
      - Anonymous users to insert logs with null user_id (for failed attempts)

  2. Function Privileges
    - Set proper ownership for handle_new_user function to ensure it can bypass RLS

  3. Additional Policies
    - Ensure anon users can insert signin logs for failed attempts
*/

-- Fix signin_logs RLS policies
DROP POLICY IF EXISTS "Users can insert own signin logs" ON signin_logs;

-- Policy for authenticated users to insert their own logs
CREATE POLICY "Authenticated users can insert own signin logs"
  ON signin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for anonymous users to insert logs with null user_id (for failed attempts)
CREATE POLICY "Anonymous users can insert null signin logs"
  ON signin_logs
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Set proper ownership for the handle_new_user function
ALTER FUNCTION handle_new_user() OWNER TO postgres;

-- Ensure the function has SECURITY DEFINER to run with elevated privileges
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

-- Set the function owner to postgres for proper privileges
ALTER FUNCTION handle_new_user() OWNER TO postgres;

-- Recreate the trigger to ensure it uses the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();