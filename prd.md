# Product Requirement Document (PRD)

**Proyek:** CP Upsolve Quest

**Versi:** 1.0.0 (Final Architecture Spec)

**Tujuan Dokumen:** Spesifikasi teknis dan desain komprehensif sebagai acuan kerja *coding agent* / developer untuk membangun aplikasi web antrean soal *competitive programming* secara terstruktur.

---

## 1. Ringkasan & Tujuan Produk

Aplikasi web *multi-user* untuk membantu praktisi *competitive programming* (CP) mencatat, mengelola, dan menyelesaikan antrean soal pasca-kontes (*upsolving*). Sistem berfokus pada efisiensi input (cukup *paste* URL), deteksi otomatis platform dan judul soal, pencegahan duplikasi data, serta visual bergaya **Cartoon Neobrutalism Dark Mode** yang responsif di desktop maupun perangkat seluler.

---

## 2. Tech Stack & Arsitektur Sistem

* **Frontend Framework:** Next.js (App Router, React 19 / TypeScript)
* **Styling & UI:** Tailwind CSS v4 / v3.4 + Lucide React (ikon) + Canvas Confetti (efek gamifikasi saat menyelesaikan soal)
* **Backend & Database:** Supabase (PostgreSQL, Row-Level Security, Supabase Auth)
* **Penyimpanan Berkas (Storage):** Supabase Storage (Bucket publik/terproteksi untuk foto profil pengguna)
* **Hosting & Deployment:** Vercel (Frontend & Server Actions)

---

## 3. Design System: Cartoon Neobrutalism Dark Mode

Desain memadukan kontras tinggi *dark mode* dengan estetika kartun/komik retro: garis tepi tebal (*bold border*), sudut membulat tegas (*rounded-lg*), bayangan blok kaku tanpa blur (*hard shadow*), dan interaksi taktil saat ditekan (*press-down tactile feedback*).

### 3.1. Variabel Warna Dasar

* **Latar Belakang Halaman (Canvas):** `#0F0F12` (Pitch Charcoal)
* **Latar Belakang Kartu/Panel (Surface):** `#18181B` (Zinc-900)
* **Latar Belakang Input/Elemen Sekunder:** `#27272A` (Zinc-800)
* **Warna Garis Tepi (Border):** `#FFFFFF` atau `#E4E4E7` (tebal 2,5px solid)
* **Teks Primer:** `#FAFAFA`
* **Teks Sekunder (Muted):** `#A1A1AA`

### 3.2. Pemetaan Warna Platform (Brand Colors)

Setiap platform memiliki identitas warna aksen yang diterapkan pada **Badge**, **Garis Aksen**, dan **Hard Shadow**:

| Platform | Brand Color | Hex Code | Karakteristik Visual |
| --- | --- | --- | --- |
| **TLX** | Biru TOKI | `#2563EB` | Badge biru royal, teks putih, hard shadow `#2563EB` |
| **VJudge** | Kuning VJudge | `#FACC15` | Badge kuning cerah, teks hitam tebal, hard shadow `#FACC15` |
| **Codeforces** | Off-White / Flag Accent | `#F8FAFC` | Badge putih solid, teks hitam, hard shadow `#F8FAFC` |
| **AtCoder** | Slate Gray (Monokrom) | `#94A3B8` | Badge abu-abu dingin, teks hitam, hard shadow `#94A3B8` |
| **Luogu** | Sky Blue (Luogu Cyan) | `#0EA5E9` | Badge biru muda menyala, teks putih, hard shadow `#0EA5E9` |
| **CSES** | Emerald Green (Accepted) | `#22C55E` | Badge hijau terang, teks hitam tebal, hard shadow `#22C55E` |
| **Others** | Muted Dark Slate | `#475569` | Badge abu-abu redup, teks putih, hard shadow `#475569` |

### 3.3. Spesifikasi Komponen Neobrutalisme

* **Border:** `border-2 border-white` atau `border-[2.5px] border-zinc-100`
* **Hard Shadow (Default):** `shadow-[4px_4px_0px_0px_#HEX_AKSEN]`
* **Hard Shadow (Hover):** `hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#HEX_AKSEN]`
* **Active / Clicked:** `active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#HEX_AKSEN]`
* **Tipografi:** Font Sans tegas (misal: Plus Jakarta Sans atau Inter) dipadukan dengan aksen Monospace (JetBrains Mono) untuk kode soal.

---

## 4. Logika URL Parsing, Deteksi Platform, & Ekstraksi Label

Saat pengguna memasukkan URL, sistem mengeksekusi fungsi *normalizer* dan *parser* di sisi klien/server:

### 4.1. Normalisasi URL

Sebelum disimpan, URL harus dibersihkan:

1. Hapus spasi di awal dan akhir.
2. Hapus parameter pelacak (*query params* seperti `?utm_source`, `?ref`, dsb.).
3. Hapus garis miring penutup (*trailing slash*).

### 4.2. Regex Matching & Label Extraction

Sistem memotong slug URL untuk menghasilkan label ringkas (Opsi B):

| Platform | Domain Identifier | Regex Matcher & Extractor | Format Judul Otomatis |
| --- | --- | --- | --- |
| **Codeforces** | `codeforces.com` | `/(?:contest|problemset\/problem)\/(\d+)\/([A-Za-z0-9]+)/` | `CF {match[1]} - {match[2]}` *(cth: CF 1985 - C)* |
| **AtCoder** | `atcoder.jp` | `/contests\/([^\/]+)\/tasks\/([^\/]+)/` | `AtCoder {match[1]} - {match[2]}` *(cth: AtCoder abc350 - C)* |
| **TLX** | `tlx.toki.id` | `/courses\/basic\/chapters\/[^\/]+\/problems\/([^\/]+)|problems\/([^\/]+)\/([^\/]+)/` | `TLX {slug}` *(cth: TLX troc-35-A)* |
| **VJudge** | `vjudge.net` | `/problem\/([^\/]+)/` | `VJudge {match[1]}` *(cth: VJudge POJ-1001)* |
| **Luogu** | `luogu.com.cn` / `luogu.com` | `/problem\/([A-Za-z0-9]+)/` | `Luogu {match[1]}` *(cth: Luogu P1001)* |
| **CSES** | `cses.fi` | `/problemset\/task\/(\d+)/` | `CSES Task {match[1]}` *(cth: CSES Task 1068)* |
| **Others** | *Domain di luar 6 di atas* | Mengambil `hostname` + *path string* terakhir | `{hostname} - {last_path_segment}` |

---

## 5. Fitur Utama & Kebutuhan Fungsional

### 5.1. Autentikasi & Profil Pengguna

* **Metode Masuk:** Email dan Password via Supabase Auth (bebas Google OAuth).
* **Profil:**
* Pengaturan Username.
* Unggah Foto Profil (Avatar): Komponen kartu bulat/kotak neobrutalisme. Berkas diunggah ke Supabase Storage bucket `avatars`, menghasilkan URL publik yang disimpan di kolom profil `users`.
* Fallback foto profil: Inisial nama dengan latar belakang warna platform acak.



### 5.2. Antrean Soal Aktif (Active Queue)

* **Penambahan Soal (Input Bar):**
* Satu kolom input URL utama dengan tombol aksi tebal: `+ ADD QUEST`.
* Pengecekan Duplikasi: Sistem mengecek URL yang dinormalisasi pada basis data pengguna tersebut (`user_id`). Jika URL sudah ada (baik di antrean aktif maupun di histori), sistem menolak penambahan dan memunculkan *toast notification* bernuansa komik: *"Quest ini sudah ada di log latihanmu!"*.


* **Urutan Antrean (Sorting):** Wajib **LIFO (Last-In, First-Out)**—soal yang baru ditambahkan langsung berada di paling atas.
* **Tampilan Kartu Soal (Quest Card):**
* Grid responsif: 1 kolom (Mobile), 2–3 kolom (Desktop).
* Menampilkan: Badge Platform (dengan warna spesifik), Judul Hasil Parsing, Tautan mentah yang dapat diklik (membuka di tab baru via `target="_blank"`), dan tombol silang hapus `[X]`.
* **Checkbox Penyelesaian:** Checkbox kotak bergaris tebal. Ketika diklik:
1. Efek partikel mikro / animasi garis silang (*strike-through*).
2. Kartu memudar keluar (*slide-out / fade-out*).
3. Status pada database berganti menjadi `is_completed = true` dan mencatat `completed_at`.




* **Paginasi:** Mengakomodasi 20–25 kartu per halaman. Bagian bawah dilengkapi kontrol paginasi retro (`[ Prev ]  Page 1 of N  [ Next ]`).

### 5.3. Riwayat Pengerjaan (History Tab)

* **Tampilan Format List (Bukan Card Besar):** Tabel baris kompak yang efisien untuk memuat ratusan catatan riwayat.
* **Fitur Multi-Select & Bulk Delete:**
* Checkbox "Pilih Semua" (*Select All*) di header tabel.
* Ketika satu atau beberapa baris dipilih, muncul tombol melayang: `Hapus [N] Terpilih` berwarna merah dengan konfirmasi modal.


* **Menu Titik Tiga Vertikal (`⋮`):** Terletak di ujung kanan setiap baris riwayat dengan menu *dropdown*:
* **Add Back to Queue:** Mengubah status `is_completed` kembali menjadi `false`, mengembalikan soal ke antrean aktif sesuai urutan LIFO.
* **Delete Permanently:** Menghapus rekaman soal dari basis data secara permanen.



---

## 6. Skema Basis Data (Supabase / PostgreSQL)

Jalankan skrip DDL berikut pada Supabase SQL Editor:

```sql
-- 1. Buat tabel profil pengguna (sinkron dengan auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Buat tabel problems (quests)
CREATE TYPE cp_platform AS ENUM ('codeforces', 'atcoder', 'tlx', 'vjudge', 'luogu', 'cses', 'others');

CREATE TABLE public.problems (
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
CREATE INDEX idx_problems_queue ON public.problems (user_id, is_completed, created_at DESC);

-- 3. Row-Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own problems" 
ON public.problems FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own problems" 
ON public.problems FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own problems" 
ON public.problems FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own problems" 
ON public.problems FOR DELETE USING (auth.uid() = user_id);

-- 4. Trigger otomatis pembuatan profil saat registrasi auth.users
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

```

---

## 7. Desain Antarmuka & Tata Letak Komponen

### 7.1. Navigasi Atas (Navbar)

* Kiri: Judul aplikasi **CP QUEST** dengan teks bergaya kartun retro bergaris tebal.
* Kanan:
* Tombol navigasi tab aktif: `[ QUEUE ]` dan `[ HISTORY ]`.
* Foto profil avatar bulat (border 2px putih) yang membuka menu setelan profil/logout.



### 7.2. Struktur Layar Antrean (Queue View)

```
+-----------------------------------------------------------------------+
|  [Input URL: "https://codeforces.com/contest/1985/problem/C"] [+ ADD] |
+-----------------------------------------------------------------------+
|  Filter: [ALL] [Codeforces] [TLX] [AtCoder] [VJudge] [Luogu] [CSES]   |
+-----------------------------------------------------------------------+
|  Grid Cards (LIFO Order):                                             |
|  +---------------------------+  +---------------------------+         |
|  | [CF BADGE (White)]    [X] |  | [TLX BADGE (Blue)]    [X] |         |
|  | CF 1985 - C               |  | TLX troc-35-A             |         |
|  | [Open External Link ->]   |  | [Open External Link ->]   |         |
|  | [ ] Mark as Solved        |  | [ ] Mark as Solved        |         |
|  +---------------------------+  +---------------------------+         |
+-----------------------------------------------------------------------+
|                 Pagination: [ << ] Page 1 of 4 [ >> ]                 |
+-----------------------------------------------------------------------+

```

### 7.3. Struktur Layar Riwayat (History View)

```
+-----------------------------------------------------------------------+
|  [x] Pilih Semua              | [ Hapus Terpilih (3) ] (Tombol Merah) |
+-----------------------------------------------------------------------+
| [x] | [VJudge Badge] | VJudge POJ-1001   | Solved 2 jam lalu | [ ⋮ ]  |
| [ ] | [CSES Badge]   | CSES Task 1068    | Solved Kemarin    | [ ⋮ ]  |
| [ ] | [AtCoder Badge]| AtCoder abc350 - C| Solved 3 hari lalu| [ ⋮ ]  |
+-----------------------------------------------------------------------+

```

---

## 8. Alur & Kasus Uji Khusus (Edge Cases)

1. **Penanganan Duplikasi URL:**
* Jika pengguna menginput `[https://codeforces.com/contest/123/problem/A](https://codeforces.com/contest/123/problem/A)` yang sudah ada di antrean, sistem menangkap *unique violation* dari Supabase (`unique_user_problem_url`) lalu merender pesan galat tanpa melakukan mutasi data.


2. **Penanganan URL Non-Standar:**
* Jika dimasukkan tautan dari platform di luar daftar (misal `[spoj.com/problems/TEST](https://spoj.com/problems/TEST)`), sistem otomatis menetapkan *enum* `others`, memakai warna `#475569`, dan memformat judul menjadi `spoj.com - TEST`.


3. **Pembalikkan Status (Revert):**
* Mengklik "Add back to queue" dari menu titik tiga di halaman riwayat langsung memperbarui status `is_completed = false`, menghapus `completed_at`, dan menempatkannya kembali di urutan paling atas antrean aktif (karena `created_at` atau sistem *re-queue timestamp*).


4. **Penyimpanan Gambar Profil:**
* Batasi berkas gambar maksimal 2 MB dengan format `.jpg`, `.png`, atau `.webp`. Berkas dikompresi di sisi klien sebelum diunggah ke Supabase Storage.