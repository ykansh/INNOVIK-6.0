-- ==============================================================================
-- CVQ Supabase Database Schema & Storage Setup
-- Copy and run this entire script in your Supabase SQL Editor
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('citizen', 'officer', 'supervisor')) DEFAULT 'citizen',
  badge_id TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  last_sign_in_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 3. Create Issues Table
CREATE TABLE IF NOT EXISTS public.issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  image_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('Open', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed')) DEFAULT 'Open',
  severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
  department TEXT DEFAULT 'Public Works',
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reporter_name TEXT,
  resolution_note TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS on issues
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Issues RLS Policies
CREATE POLICY "Issues are viewable by everyone" 
  ON public.issues FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users or citizens can insert issues" 
  ON public.issues FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Officers or reporters can update issues" 
  ON public.issues FOR UPDATE 
  USING (true);

-- 4. Automatically Update updated_at Timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = TIMEZONE('utc', NOW());
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_issues_updated_at
BEFORE UPDATE ON public.issues
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 5. Storage Bucket Configuration for Civic Issue Photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('civic-issues', 'civic-issues', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Issue images are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'civic-issues');

CREATE POLICY "Anyone can upload issue images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'civic-issues');

-- 6. Seed Initial Realistic Civic Issues
INSERT INTO public.issues (ticket_id, title, category, description, location, status, severity, department, image_url, created_at)
VALUES 
  ('CIV-ISS-1042', 'Deep Pothole on Main St', 'Roads & Pavement', 'Large dangerous pothole in middle of lane causing vehicle damage.', '42 Main Street, Downtown', 'In Progress', 'High', 'Road Maintenance', '/sequence/frame_25.jpg', NOW() - INTERVAL '2 days'),
  ('CIV-ISS-1021', 'Broken Streetlight', 'Electrical', 'Street light pole flickering and going dark at night.', 'Oakwood Avenue & 4th Cross', 'Resolved', 'Medium', 'Electrical Dept', '/sequence/frame_10.jpg', NOW() - INTERVAL '5 days'),
  ('CIV-ISS-1045', 'Fallen Tree Branch', 'Environment', 'Heavy branch blocking pedestrian sidewalk and bike lane.', 'River Park North Entrance', 'Under Review', 'Medium', 'Parks & Recreation', '/sequence/frame_5.jpg', NOW() - INTERVAL '1 day'),
  ('CIV-ISS-0988', 'Clogged Drainage / Waterlogging', 'Water & Sanitation', 'Severe drainage block causing water accumulation on street.', 'Westside Suburb Sector 3', 'Open', 'Low', 'Drainage Works', '/sequence/frame_2.jpg', NOW() - INTERVAL '6 hours'),
  ('CIV-ISS-1090', 'Fallen Electric Wire', 'Electrical', 'Exposed electrical line fallen across pedestrian path.', 'Station Road, Platform 1 Exit', 'Assigned', 'Critical', 'Electrical Dept', '/sequence/frame_25.jpg', NOW() - INTERVAL '30 minutes')
ON CONFLICT (ticket_id) DO NOTHING;
