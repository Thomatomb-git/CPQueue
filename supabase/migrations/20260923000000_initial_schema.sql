-- 1. Buat tabel profil pengguna (sinkron dengan auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Buat tipe ENUM cp_platform jika belum ada
DO $$ BEGIN
    CREATE TYPE cp_platform AS ENUM ('codeforces', 'atcoder', 'tlx', 'vjudge', 'luogu', 'cses', 'others');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Buat tabel problems (quests)
CREATE TABLE IF NOT EXISTS public.problems (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    normalized_url TEXT NOT NULL,
    platform cp_platform NOT NULL,
    title VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Mencegah URL ganda per pengguna
    CONSTRAINT unique_user_problem_url UNIQUE (user_id, normalized_url)
);

-- Indeks performa untuk LIFO sorting dan filtering status
CREATE INDEX IF NOT EXISTS idx_problems_queue ON public.problems (user_id, is_completed, created_at DESC);

-- 4. Row-Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for problems
DROP POLICY IF EXISTS "Users can view their own problems" ON public.problems;
CREATE POLICY "Users can view their own problems" 
ON public.problems FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own problems" ON public.problems;
CREATE POLICY "Users can insert their own problems" 
ON public.problems FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own problems" ON public.problems;
CREATE POLICY "Users can update their own problems" 
ON public.problems FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own problems" ON public.problems;
CREATE POLICY "Users can delete their own problems" 
ON public.problems FOR DELETE USING (auth.uid() = user_id);

-- 5. Trigger otomatis pembuatan profil saat registrasi auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Storage Bucket setup untuk avatar (Jalankan di Supabase jika belum ada)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policy untuk storage avatars
CREATE POLICY "Avatar images are publicly accessible."
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar."
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Anyone can update their own avatar."
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND auth.uid() = owner );
