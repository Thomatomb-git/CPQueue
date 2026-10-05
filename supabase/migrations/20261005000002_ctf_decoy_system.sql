-- =====================================================================
-- Migrasi CTF: Setup Kolom is_decoy & Tandai Akun Dummy
-- (Bebas Trigger, tidak membutuhkan hak owner tabel profiles)
-- =====================================================================

-- 1. Tambah kolom is_decoy jika belum ada
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_decoy BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Tandai 3 akun dummy agar menampilkan UI khusus 'DUMMY ACCOUNT'
UPDATE public.profiles 
SET is_decoy = TRUE 
WHERE username IN ('cpq_guest', 'admin_tester', 'dev_user');

-- 3. Pastikan akun target utama isthisreal bernilai FALSE
UPDATE public.profiles 
SET is_decoy = FALSE 
WHERE username = 'isthisreal';
