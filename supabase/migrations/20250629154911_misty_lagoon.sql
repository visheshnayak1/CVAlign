/*
  # CVAlign Backend System Schema

  1. New Tables
    - `jobs` - Job postings with requirements and vacancies
    - `candidates` - Candidate profiles and CV data
    - `cv_embeddings` - Vector embeddings for semantic search
    - `rankings` - ATS scores, feedback, and rankings
    - `interviews` - Interview scheduling and status
    - `tavus_configs` - Tavus AI integration settings

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access

  3. Indexes
    - Performance indexes for search and filtering
    - Vector similarity search indexes
*/

-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  requirements text NOT NULL,
  vacancies integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  cv_text text NOT NULL,
  cv_filename text NOT NULL,
  extracted_skills text[] DEFAULT '{}',
  experience_years integer DEFAULT 0,
  education text,
  created_at timestamptz DEFAULT now()
);

-- CV embeddings for semantic search
CREATE TABLE IF NOT EXISTS cv_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  cv_embedding vector(1536),
  job_embedding vector(1536),
  created_at timestamptz DEFAULT now()
);

-- Rankings with ATS scores and feedback
CREATE TABLE IF NOT EXISTS rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  ats_score integer NOT NULL CHECK (ats_score >= 0 AND ats_score <= 100),
  semantic_score float NOT NULL CHECK (semantic_score >= 0 AND semantic_score <= 1),
  overall_score integer NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  feedback jsonb NOT NULL DEFAULT '{}',
  match_category text NOT NULL DEFAULT 'fair' CHECK (match_category IN ('excellent', 'good', 'fair', 'poor')),
  ranking_position integer NOT NULL,
  is_recommended boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  ranking_id uuid REFERENCES rankings(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  scheduled_at timestamptz,
  interview_type text NOT NULL DEFAULT 'standard' CHECK (interview_type IN ('standard', 'tavus_ai')),
  interview_link text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tavus AI configuration
CREATE TABLE IF NOT EXISTS tavus_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_enabled boolean DEFAULT false,
  interview_duration integer DEFAULT 30,
  interview_questions text[] DEFAULT '{}',
  evaluation_criteria text[] DEFAULT '{}',
  tavus_settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id)
);

-- Enable RLS on all tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tavus_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jobs
CREATE POLICY "Users can manage their own jobs"
  ON jobs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for candidates
CREATE POLICY "Users can manage candidates for their jobs"
  ON candidates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = candidates.job_id 
      AND jobs.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = candidates.job_id 
      AND jobs.user_id = auth.uid()
    )
  );

-- RLS Policies for cv_embeddings
CREATE POLICY "Users can manage embeddings for their jobs"
  ON cv_embeddings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = cv_embeddings.job_id 
      AND jobs.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = cv_embeddings.job_id 
      AND jobs.user_id = auth.uid()
    )
  );

-- RLS Policies for rankings
CREATE POLICY "Users can manage rankings for their jobs"
  ON rankings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = rankings.job_id 
      AND jobs.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = rankings.job_id 
      AND jobs.user_id = auth.uid()
    )
  );

-- RLS Policies for interviews
CREATE POLICY "Users can manage interviews for their jobs"
  ON interviews
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = interviews.job_id 
      AND jobs.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = interviews.job_id 
      AND jobs.user_id = auth.uid()
    )
  );

-- RLS Policies for tavus_configs
CREATE POLICY "Users can manage their own tavus configs"
  ON tavus_configs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS jobs_user_id_idx ON jobs(user_id);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
CREATE INDEX IF NOT EXISTS candidates_job_id_idx ON candidates(job_id);
CREATE INDEX IF NOT EXISTS candidates_email_idx ON candidates(email);
CREATE INDEX IF NOT EXISTS cv_embeddings_candidate_id_idx ON cv_embeddings(candidate_id);
CREATE INDEX IF NOT EXISTS cv_embeddings_job_id_idx ON cv_embeddings(job_id);
CREATE INDEX IF NOT EXISTS rankings_job_id_idx ON rankings(job_id);
CREATE INDEX IF NOT EXISTS rankings_overall_score_idx ON rankings(overall_score DESC);
CREATE INDEX IF NOT EXISTS rankings_ranking_position_idx ON rankings(ranking_position);
CREATE INDEX IF NOT EXISTS interviews_job_id_idx ON interviews(job_id);
CREATE INDEX IF NOT EXISTS interviews_status_idx ON interviews(status);
CREATE INDEX IF NOT EXISTS interviews_scheduled_at_idx ON interviews(scheduled_at);

-- Vector similarity search index
CREATE INDEX IF NOT EXISTS cv_embeddings_cv_embedding_idx ON cv_embeddings USING ivfflat (cv_embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS cv_embeddings_job_embedding_idx ON cv_embeddings USING ivfflat (job_embedding vector_cosine_ops);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_rankings_updated_at
  BEFORE UPDATE ON rankings
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_tavus_configs_updated_at
  BEFORE UPDATE ON tavus_configs
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();