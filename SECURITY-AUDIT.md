# Audit Keamanan — SOFTVISION Website (portofolio-arya-apriawan.web.app)

Tanggal: 8 September 2026
Status: SEMUA temuan di bawah sudah diverifikasi langsung terhadap build `out/`, situs live, dan API Supabase (probe write/delete sudah dibersihkan).

---

## KRITIS — harus segera ditangani

### K1. Password admin bocor di JavaScript publik (TERKONFIRMASI LIVE)
- `src/app/admin/login/page.tsx:179` membandingkan password di browser dengan
  `process.env.NEXT_PUBLIC_ADMIN_PASSWORD`.
- Semua variabel `NEXT_PUBLIC_*` di-inline oleh Next.js ke bundle JS. Build statis
  (`output: "export"`) menaruhnya di file publik.
- Terkonfirmasi: password admin ADA di file live
  `https://portofolio-arya-apriawan.web.app/_next/static/chunks/3kitpfyf2yf09.js`
  (juga di `out/_next/static/chunks/3kitpfyf2yf09.js`). Panjang password hanya 10 karakter.
- Siapapun cukup "View Source" → buka chunk itu → password admin terbaca.
- FIX: ganti password sekarang (yang lama dianggap bocor total), dan JANGAN pernah
  pakai `NEXT_PUBLIC_` untuk rahasia. Gunakan Supabase Auth (lihat K3).

### K2. Database Supabase terbuka penuh untuk siapa pun (TERUJI NYATA)
- `supabase/schema.sql`, `supabase/grant-quick.sql`, `supabase/grant-only.sql`:
  RLS **DISABLED** untuk semua tabel + `GRANT SELECT, INSERT, UPDATE, DELETE TO anon`.
- Anon/publishable key ada di bundle publik → siapa pun bisa memanggil REST API langsung.
- Bukti probe (menggunakan key publik dari `.env.local`, tidak butuh login apa pun):
  - `SELECT contacts` → **HTTP 200** (baca nama+email+pesan pengunjung = kebocoran PII)
  - `INSERT contacts` → **HTTP 201** (spam bebas)
  - `DELETE contacts` → **HTTP 204** (hapus data bebas; baris probe sudah dibersihkan)
- Artinya: seluruh data kontak bisa dibaca/dihapus siapa pun; projects, certificates,
  timeline, reviews bisa dihapus massal atau diisi konten palsu (deface homepage).
- FIX: `ENABLE ROW LEVEL SECURITY` semua tabel + policy per kebutuhan (lihat K5).

### K3. "Login admin" tidak melindungi apa pun (client-side-only)
- Verifikasi password terjadi di browser (`admin/login/page.tsx:174-188`), lalu hanya
  set cookie `oft_admin=1` — nilai tetap, tanpa signature, tanpa sesi server.
- `src/middleware.ts` memeriksa cookie itu, TAPI: production adalah static export
  (`next.config.ts` → `output: "export"`) yang di-host di Firebase Hosting.
  Middleware Next.js TIDAK berjalan di sana.
- Terverifikasi live: `https://portofolio-arya-apriawan.web.app/admin` → HTTP 200,
  `out/admin.html` ikut ter-deploy.
- Bahkan tanpa cookie sama sekali, semua aksi admin (insert/update/delete) bisa dilakukan
  siapa pun langsung lewat REST API dengan anon key (K2) — panel admin hanyalah hiasan.
- FIX: pakai Supabase Auth. Panel admin cek `supabase.auth.getSession()`; RLS policy
  menulis hanya untuk user dengan `app_metadata.role = 'admin'`.

### K4. Homepage bisa diracuni konten oleh siapa pun (stored defacement/phishing)
- Kombinasi K2+K3: penyisip bisa INSERT row `projects`/`timeline`/`certificates`
  dengan teks dan link `liveUrl`/`githubUrl` sembarang → langsung tampil di homepage
  publik (realtime subscription memperbarui tanpa refresh).
- Ini jalur phishing: "proyek" palsu dengan link ke situs jahat akan tampil sebagai
  konten resmi SOFTVISION.

---

## TINGGI

### T1. Tidak ada pembatasan tulis/spam di form kontak
- Endpoint tulis kontak (langsung dari client / route `/api/send-contact`) tidak punya
  rate limit, captcha, atau honeypot. Database bisa dibanjiri spam dalam hitungan menit.

### T2. Rute `/api/send-contact` mati + menyimpan data secara meragukan
- Dengan `output: "export"`, route handler TIDAK ikut ter-deploy — kode ini hidup hanya
  di dev. Jika nanti dipindah ke host dengan server, route ini menulis pakai klien anon
  dan `console.log` data PII pengunjung.
- Dependensi `resend` + `RESEND_API_KEY` di `.env.local` tidak terpakai sama sekali
  (tidak ada satu pun import `resend` di `src/`). Key yang tidak terpakai = risiko
  bocor yang tidak perlu — hapus dependensi dan cabut key-nya.

### T3. Cookie sesi admin tidak httpOnly / secure / signed
- `document.cookie = 'oft_admin=1; ...'` — bisa disuntik manual oleh siapa pun,
  terbaca XSS, tak punya masa berlaku server-side. Sekali lagi: satu-satunya pertahanan
  sejati adalah RLS + Supabase Auth.

### T4. `firestore.rules` rusak dan tetap bocor
- Baris 37: `match}contacts/{docId}` — syntax error; deploy rules kemungkinan gagal
  sehingga rules lama (longgar) tetap aktif di project Firebase.
- `projects`, `certificates`, `timeline`: `allow write: if true` — terbuka juga.
- Firestore sudah ditinggalkan (migrasi ke Supabase) — hapus blok `firestore` dari
  `firebase.json`, dan disable Firestore di console supaya tidak jadi attack surface
  menganggur.

---

## SEDANG

### M1. Gambar disimpan sebagai base64 di kolom TEXT database
- `compressImage()` → data URI disimpan langsung ke row. Akibat: baris bisa membengkak
  ~MB, mudah dipakai DoS/cost-attack begitu akses tulis terbuka (lihat K2), dan lambat
  di-fetch realtime. Pindahkan ke Supabase Storage dengan policy yang benar.

### M2. Tidak ada security headers sama sekali
- Firebase Hosting menyajikan statis tanpa CSP, `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`. Tambahkan blok `headers` di
  `firebase.json`.

### M3. Realtime untuk semua tabel tanpa RLS
- `supabase_realtime` publication mendaftarkan kelima tabel; dengan RLS mati, siapa pun
  bisa berlangganan perubahan data (termasuk kontak baru masuk) via realtime API.

### M4. File sisa yang membingungkan / risiko kecil
- `src/middleware.ts.bak` — hapus.
- `.env.example` memberi sinyal pola `NEXT_PUBLIC_ADMIN_PASSWORD` yang salah — perbaiki
  template-nya supaya tidak diulang.
- Positif: `.env*` di-gitignore dan TIDAK pernah masuk riwayat git (sudah diverifikasi).

---

## URUTAN PERBAIKAN YANG DISARANKAN

1. **SEKARANG**: ganti password admin (yang lama sudah dibaca publik).
2. **SEKARANG**: kunci database — jalankan SQL lockdown (contoh di bawah). RLS ON untuk
   semua tabel; publik hanya SELECT tabel konten + INSERT `contacts`; tanpa UPDATE/DELETE
   untuk anon.
3. Pasang **Supabase Auth**: buat 1 akun admin, set `app_metadata.role='admin'`; panel
   admin pakai `supabase.auth.getSession()`; logout pakai `supabase.auth.signOut()`.
   Hapus cookie `oft_admin`, `middleware.ts`, dan login banding-string lama.
4. Form kontak: tulis ke fungsi **Edge** (service role di server, bukan key publik),
   tambah rate-limit sederhana + honeypot/captcha.
5. Bersihkan: cabut `RESEND_API_KEY`, hapus dependensi `resend`, hapus
   `api/send-contact` (atau pindahkan ke Edge Function), hapus Firestore dari project.
6. Pindahkan gambar ke **Supabase Storage**; ganti data URI dengan URL publik bucket.
7. Tambah `headers` keamanan di `firebase.json`; redeploy.

### SQL lockdown (contoh kerangka — jalankan di Supabase SQL Editor)

```sql
ALTER TABLE reviews      ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline     ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts     ENABLE ROW LEVEL SECURITY;

-- baca publik untuk tabel konten
CREATE POLICY "public read projects"     ON projects     FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read certificates" ON certificates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read timeline"     ON timeline     FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read reviews"      ON reviews      FOR SELECT TO anon, authenticated USING (true);

-- publik hanya boleh KIRIM review/kontak, tidak boleh baca/ubah/hapus
CREATE POLICY "anon insert contacts" ON contacts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert reviews"  ON reviews  FOR INSERT TO anon
  WITH CHECK (name IS NOT NULL AND char_length(name) <= 100
              AND char_length(text) BETWEEN 1 AND 1000);

-- tulis konten hanya oleh admin terautentikasi (Supabase Auth, role di app_metadata)
CREATE POLICY "admin write projects" ON projects FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "admin write certificates" ON certificates FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "admin write timeline" ON timeline FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- admin saja yang boleh baca pesan kontak
CREATE POLICY "admin read contacts" ON contacts FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "admin delete contacts" ON contacts FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- tarik kembali hak tulis dari anon (ganti GRANT lama)
REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE INSERT ON TABLE contacts, reviews FROM authenticated; -- kontak masuk via server function saja (opsional)
```

Catatan: setelah RLS ON, GRANT lama ke anon tidak berbahaya lagi untuk UPDATE/DELETE
karena policy menolaknya; jalankan `REVOKE` di atas sebagai defense-in-depth dan hapus
kebiasaan menjalankan `grant-only.sql`/`grant-quick.sql` di dashboard.

---

## Ringkasan bukti verifikasi

| Bukti | Hasil |
|---|---|
| Password admin di chunk live situs | DITEMUKAN di `/_next/static/chunks/3kitpfyf2yf09.js` |
| Anon key `SELECT contacts` via REST | HTTP 200 (data PII terbaca) |
| Anon key `INSERT contacts` | HTTP 201 (spam bebas; baris probe dihapus lagi) |
| Anon key `DELETE contacts` | HTTP 204 (hapus bebas) |
| `/admin` live tanpa login | HTTP 200 (middleware tidak jalan di static export) |
| `.env.local` / env lain di riwayat git | TIDAK pernah ter-commit (aman) |
