/*
  # Create signin_logs table and fix RLS policies

  1. New Tables
    - `signin_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable, references auth.users)
      - `email` (text)
      - `signin_method` (text)
      - `ip_address` (text)
      - `user_agent` (text)
      - `success` (boolean)
      - `error_message` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `signin_logs` table
    - Add policy for authenticated users to insert their own logs
    - Add policy for anonymous users to insert logs (for failed attempts)
    - Add policy for authenticated users to insert logs with null user_id
    - Add policy for users to read their own logs

  3. Indexes
    - Add index on user_id for performance
    - Add index on email for performance
    - Add index on created_at for performance
*/

-- Create signin_logs table
CREATE TABLE IF NOT EXISTS signin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  signin_method text NOT NULL DEFAULT 'email',
  ip_address text,
  user_agent text,
  success boolean NOT NULL DEFAULT false,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE signin_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own signin logs" ON signin_logs;
DROP POLICY IF EXISTS "Users can insert own signin logs" ON signin_logs;
DROP POLICY IF EXISTS "Authenticated users can insert own signin logs" ON signin_logs;
DROP POLICY IF EXISTS "Anonymous users can insert null signin logs" ON signin_logs;
DROP POLICY IF EXISTS "Authenticated users can insert logs with null user_id" ON signin_logs;

-- Policy for users to read their own logs
CREATE POLICY "Users can read own signin logs"
  ON signin_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for authenticated users to insert their own logs
CREATE POLICY "Authenticated users can insert own signin logs"
  ON signin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for anonymous users to insert logs (for failed sign-in attempts)
CREATE POLICY "Anonymous users can insert signin logs"
  ON signin_logs
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for authenticated users to insert logs with null user_id (for failed attempts while authenticated)
CREATE POLICY "Authenticated users can insert logs with null user_id"
  ON signin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IS NULL);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS signin_logs_user_id_idx ON signin_logs(user_id);
CREATE INDEX IF NOT EXISTS signin_logs_email_idx ON signin_logs(email);
CREATE INDEX IF NOT EXISTS signin_logs_created_at_idx ON signin_logs(created_at DESC);

-- Grant necessary permissions
GRANT ALL ON signin_logs TO authenticated;
GRANT ALL ON signin_logs TO anon;