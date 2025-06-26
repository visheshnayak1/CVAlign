/*
  # Create sign-in activity logging table

  1. New Tables
    - `signin_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `email` (text)
      - `signin_method` (text) - email/password, google, etc.
      - `ip_address` (text)
      - `user_agent` (text)
      - `success` (boolean) - whether the sign-in was successful
      - `error_message` (text) - error details if sign-in failed
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `signin_logs` table
    - Add policy for users to read their own sign-in logs
    - Add policy for service role to insert logs

  3. Indexes
    - Index on user_id for faster queries
    - Index on created_at for time-based queries
*/

CREATE TABLE IF NOT EXISTS signin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Policy for users to read their own sign-in logs
CREATE POLICY "Users can read own signin logs"
  ON signin_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for service role to insert logs (for server-side logging)
CREATE POLICY "Service role can insert signin logs"
  ON signin_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy for authenticated users to insert their own logs
CREATE POLICY "Users can insert own signin logs"
  ON signin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS signin_logs_user_id_idx ON signin_logs(user_id);
CREATE INDEX IF NOT EXISTS signin_logs_created_at_idx ON signin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS signin_logs_email_idx ON signin_logs(email);