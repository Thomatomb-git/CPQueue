-- =====================================================================
-- Tambah kolom is_decoy ke tabel profiles untuk akun dummy CTF
-- =====================================================================

-- Nilai DEFAULT FALSE menjamin semua akun user asli di production
-- dan user yang baru mendaftar otomatis BUKAN akun dummy.
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_decoy BOOLEAN NOT NULL DEFAULT FALSE;
