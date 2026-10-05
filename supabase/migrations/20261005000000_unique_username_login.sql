-- =====================================================================
-- Username unik (case-insensitive) + dukungan login via username
-- Jalankan di Supabase SQL Editor setelah initial_schema.
-- =====================================================================

-- 1. Username unik tanpa memedulikan huruf besar/kecil
--    ("Tourist" dan "tourist" dianggap sama).
--    CATATAN: akan gagal jika sudah ada data duplikat beda-kapital.
--    Cek dulu dengan:
--      SELECT lower(username), count(*) FROM public.profiles
--      GROUP BY 1 HAVING count(*) > 1;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_key
  ON public.profiles (lower(username));

-- 2. Cek ketersediaan username (dipakai saat register).
--    SECURITY DEFINER karena RLS profiles hanya mengizinkan baca profil sendiri.
--    Hanya mengembalikan boolean, tidak membocorkan data lain.
CREATE OR REPLACE FUNCTION public.is_username_available(p_username TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE lower(username) = lower(trim(p_username))
  );
$$;

REVOKE ALL ON FUNCTION public.is_username_available(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_username_available(TEXT) TO anon, authenticated;

-- 3. Resolve username -> email untuk login.
--    HANYA boleh dipanggil oleh service_role (server action), supaya email
--    user tidak bisa di-scrape oleh anon lewat REST API.
CREATE OR REPLACE FUNCTION public.get_email_by_username(p_username TEXT)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT u.email::TEXT
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE lower(p.username) = lower(trim(p_username))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_email_by_username(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_email_by_username(TEXT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_email_by_username(TEXT) TO service_role;

-- 4. Trigger pembuatan profil: trim username dari metadata.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'username'), ''), split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
