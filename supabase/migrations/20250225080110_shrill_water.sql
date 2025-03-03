/*
  # Initial Schema Setup for MockMaster

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `role` (text) - either 'user' or 'expert'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `expert_profiles`
      - `id` (uuid, primary key, references profiles)
      - `title` (text) - e.g., "Senior Software Engineer"
      - `company` (text)
      - `expertise` (text[]) - array of expertise areas
      - `hourly_rate` (numeric)
      - `bio` (text)
      - `image_url` (text)

    - `availability`
      - `id` (uuid, primary key)
      - `expert_id` (uuid, references expert_profiles)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `is_booked` (boolean)
      - `created_at` (timestamp)

    - `appointments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `expert_id` (uuid, references expert_profiles)
      - `availability_id` (uuid, references availability)
      - `status` (text) - 'scheduled', 'completed', 'cancelled'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for experts to manage their availability
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL CHECK (role IN ('user', 'expert')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create expert_profiles table
CREATE TABLE expert_profiles (
  id uuid PRIMARY KEY REFERENCES profiles ON DELETE CASCADE,
  title text NOT NULL,
  company text,
  expertise text[] NOT NULL,
  hourly_rate numeric NOT NULL,
  bio text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE expert_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view expert profiles"
  ON expert_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Experts can update own profile"
  ON expert_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Create availability table
CREATE TABLE availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id uuid REFERENCES expert_profiles ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  is_booked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view availability"
  ON availability
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Experts can manage own availability"
  ON availability
  FOR ALL
  TO authenticated
  USING (expert_id = auth.uid());

-- Create appointments table
CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  expert_id uuid REFERENCES expert_profiles ON DELETE CASCADE,
  availability_id uuid REFERENCES availability ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR expert_id = auth.uid());

CREATE POLICY "Users can create appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR expert_id = auth.uid());

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_expert_profiles_updated_at
  BEFORE UPDATE ON expert_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create function to handle appointment booking
CREATE OR REPLACE FUNCTION book_appointment(
  p_availability_id uuid,
  p_user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_expert_id uuid;
  v_appointment_id uuid;
BEGIN
  -- Get the expert_id from availability
  SELECT expert_id INTO v_expert_id
  FROM availability
  WHERE id = p_availability_id AND NOT is_booked;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Availability slot not found or already booked';
  END IF;

  -- Start transaction
  BEGIN
    -- Mark availability as booked
    UPDATE availability
    SET is_booked = true
    WHERE id = p_availability_id;

    -- Create appointment
    INSERT INTO appointments (
      user_id,
      expert_id,
      availability_id,
      status
    )
    VALUES (
      p_user_id,
      v_expert_id,
      p_availability_id,
      'scheduled'
    )
    RETURNING id INTO v_appointment_id;

    RETURN v_appointment_id;
  END;
END;
$$;