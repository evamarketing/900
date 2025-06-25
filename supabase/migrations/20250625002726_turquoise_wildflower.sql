/*
  # Complete SEDP Database Schema Setup

  1. New Tables
    - `categories` - Program categories with fees and images
    - `panchayaths` - Panchayath locations for registration
    - `announcements` - Program announcements and updates
    - `photo_gallery` - Photo gallery for program showcase
    - `push_notifications` - Push notifications system
    - `profiles` - User profiles linked to auth.users
    - `user_roles` - User role management
    - `registrations` - Main registration table with proper relationships

  2. Storage
    - Create storage buckets for file uploads
    - Set up proper storage policies

  3. Security
    - Enable RLS on all tables
    - Admin universal access policies
    - Public read access for categories and panchayaths
    - User-specific access for registrations
    - Real-time subscriptions enabled

  4. Functions
    - Admin role checking function
    - Admin user creation function
    - Role assignment function
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE app_role AS ENUM ('admin', 'user');
CREATE TYPE registration_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  label text NOT NULL,
  actual_fee integer DEFAULT 0,
  offer_fee integer DEFAULT 0,
  has_offer boolean DEFAULT false,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create panchayaths table
CREATE TABLE IF NOT EXISTS panchayaths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  malayalam_name text NOT NULL,
  english_name text NOT NULL,
  pincode text,
  district text DEFAULT 'Malappuram',
  created_at timestamptz DEFAULT now()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  mobile_number text NOT NULL,
  whatsapp_number text NOT NULL,
  address text NOT NULL,
  panchayath_details text NOT NULL,
  panchayath_id uuid REFERENCES panchayaths(id) ON DELETE SET NULL,
  category text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  status registration_status DEFAULT 'pending',
  unique_id text,
  submitted_at timestamptz DEFAULT now(),
  approved_at timestamptz
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  link text,
  category text,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create photo_gallery table
CREATE TABLE IF NOT EXISTS photo_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  description text,
  category text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- Create push_notifications table
CREATE TABLE IF NOT EXISTS push_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  target_audience text NOT NULL CHECK (target_audience IN ('all', 'category', 'panchayath', 'admin')),
  target_value text,
  scheduled_at timestamptz,
  sent_at timestamptz,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Insert default categories
INSERT INTO categories (name, label, actual_fee, offer_fee, has_offer, image_url) VALUES
  ('pennyekart-free', 'Pennyekart Free Registration', 0, 0, false, 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('pennyekart-paid', 'Pennyekart Paid Registration', 800, 300, true, 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('farmelife', 'FarmeLife', 1000, 400, true, 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('foodelife', 'FoodeLife', 1200, 500, true, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('organelife', 'OrganeLife', 1500, 600, true, 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('entrelife', 'EntreLife', 900, 350, true, 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('job-card', 'Job Card (All Categories)', 2000, 800, true, 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT (name) DO NOTHING;

-- Insert default panchayaths
INSERT INTO panchayaths (malayalam_name, english_name, pincode, district) VALUES
  ('കൊണ്ടോട്ടി', 'Kondotty', '673638', 'Malappuram'),
  ('മലപ്പുറം', 'Malappuram', '676505', 'Malappuram'),
  ('മഞ്ചേരി', 'Manjeri', '676121', 'Malappuram'),
  ('പെരിന്തൽമണ്ണ', 'Perinthalmanna', '679322', 'Malappuram'),
  ('തിരുരങ്ങാടി', 'Tirurangadi', '676306', 'Malappuram'),
  ('തൃപ്രാങ്കോട്', 'Triprangode', '676303', 'Malappuram'),
  ('താനൂർ', 'Tanur', '676302', 'Malappuram'),
  ('പൊൻമുണ്ടം', 'Ponmundam', '679577', 'Malappuram'),
  ('ഇടപ്പാൽ', 'Edappal', '679576', 'Malappuram'),
  ('കുറ്റിപ്പുറം', 'Kuttippuram', '679571', 'Malappuram')
ON CONFLICT DO NOTHING;

-- Create utility functions
CREATE OR REPLACE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin user exists
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'evamarketingsolutions@gmail.com';
  
  IF admin_user_id IS NOT NULL THEN
    -- Ensure admin role exists
    INSERT INTO user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION assign_admin_role(user_email text)
RETURNS void AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF target_user_id IS NOT NULL THEN
    -- Assign admin role
    INSERT INTO user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT DO NOTHING;
  ELSE
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function for profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Assign default user role
  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Check if this is the main admin
  IF NEW.email = 'evamarketingsolutions@gmail.com' THEN
    UPDATE user_roles SET role = 'admin' WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE panchayaths ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin universal access on profiles" ON profiles
  FOR ALL USING (
    has_role(auth.uid(), 'admin') OR 
    auth.email() = 'evamarketingsolutions@gmail.com'
  );

-- User roles policies
CREATE POLICY "Users can read own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin universal access on user_roles" ON user_roles
  FOR ALL USING (
    has_role(auth.uid(), 'admin') OR 
    auth.email() = 'evamarketingsolutions@gmail.com'
  );

-- Categories policies (public read, admin write)
CREATE POLICY "Allow public read on categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admin universal access on categories" ON categories
  FOR ALL USING (
    has_role(auth.uid(), 'admin') OR 
    auth.email() = 'evamarketingsolutions@gmail.com'
  );

-- Panchayaths policies (public read, admin write)
CREATE POLICY "Allow public read on panchayaths" ON panchayaths
  FOR SELECT USING (true);

CREATE POLICY "Admin universal access on panchayaths" ON panchayaths
  FOR ALL USING (
    has_role(auth.uid(), 'admin') OR 
    auth.email() = 'evamarketingsolutions@gmail.com'
  );

-- Registrations policies
CREATE POLICY "Allow public insert on registrations" ON registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read own registrations" ON registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin universal access on registrations" ON registrations
  FOR ALL USING (
    has_role(auth.uid(), 'admin') OR 
    auth.email() = 'evamarketingsolutions@gmail.com'
  );

-- Announcements policies (public read active, admin all)
CREATE POLICY "Allow public read active announcements" ON announcements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin universal access on announcements" ON announcements
  FOR ALL USING (
    has_role(auth.uid(), 'admin') OR 
    auth.email() = 'evamarketingsolutions@gmail.com'
  );

-- Photo gallery policies (public read, admin write)
CREATE POLICY "Allow public read on photo_gallery" ON photo_gallery
  FOR SELECT USING (true);

CREATE POLICY "Admin universal access on photo_gallery" ON photo_gallery
  FOR ALL USING (
    has_role(auth.uid(), 'admin') OR 
    auth.email() = 'evamarketingsolutions@gmail.com'
  );

-- Push notifications policies (admin only)
CREATE POLICY "Admin universal access on push_notifications" ON push_notifications
  FOR ALL USING (
    has_role(auth.uid(), 'admin') OR 
    auth.email() = 'evamarketingsolutions@gmail.com'
  );

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('uploads', 'uploads', true),
  ('sedp-assets', 'sedp-assets', true)
ON CONFLICT DO NOTHING;

-- Storage policies for uploads bucket
CREATE POLICY "Allow public read on uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Allow authenticated upload to uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'uploads' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Admin universal access on uploads" ON storage.objects
  FOR ALL USING (
    bucket_id = 'uploads' AND (
      has_role(auth.uid(), 'admin') OR 
      auth.email() = 'evamarketingsolutions@gmail.com'
    )
  );

-- Storage policies for sedp-assets bucket
CREATE POLICY "Allow public read on sedp-assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'sedp-assets');

CREATE POLICY "Admin universal access on sedp-assets" ON storage.objects
  FOR ALL USING (
    bucket_id = 'sedp-assets' AND (
      has_role(auth.uid(), 'admin') OR 
      auth.email() = 'evamarketingsolutions@gmail.com'
    )
  );

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE panchayaths;
ALTER PUBLICATION supabase_realtime ADD TABLE registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE photo_gallery;
ALTER PUBLICATION supabase_realtime ADD TABLE push_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE user_roles;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_category ON registrations(category);
CREATE INDEX IF NOT EXISTS idx_registrations_submitted_at ON registrations(submitted_at);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_panchayaths_malayalam_name ON panchayaths(malayalam_name);