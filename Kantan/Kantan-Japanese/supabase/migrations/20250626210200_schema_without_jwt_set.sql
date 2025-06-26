-- Enable Row Level Security
-- ALTER DATABASE postgres SET "app.jwt_secret" TO 'Nb1TC8djFaWzeAjAfvtYDo8ENUV2FB6hBjfPcMJUT30hxC32ZU6hpspaX/8N+NDjX741Sj8iArNgQbMHqHG5KQ==';

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study_progress table
CREATE TABLE IF NOT EXISTS study_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  total_studied INTEGER DEFAULT 0,
  easy_cards INTEGER DEFAULT 0,
  medium_cards INTEGER DEFAULT 0,
  hard_cards INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  study_time INTEGER DEFAULT 0,
  last_study_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create card_progress table
CREATE TABLE IF NOT EXISTS card_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  card_id TEXT NOT NULL,
  level TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty INTEGER DEFAULT 0,
  times_studied INTEGER DEFAULT 0,
  last_studied TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  level TEXT NOT NULL,
  cards_studied INTEGER DEFAULT 0,
  session_duration INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own progress" ON study_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON study_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own card progress" ON card_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own card progress" ON card_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own study sessions" ON study_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study sessions" ON study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile with error handling
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = NOW();
  
  -- Insert initial study progress with error handling
  INSERT INTO public.study_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_progress_updated_at
  BEFORE UPDATE ON study_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_card_progress_updated_at
  BEFORE UPDATE ON card_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_study_progress_user_id ON study_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_card_progress_user_id ON card_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_card_progress_card_id ON card_progress(card_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON study_sessions(date);
