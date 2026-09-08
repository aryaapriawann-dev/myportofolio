-- ============================================================================
-- SECURITY LOCKDOWN — jalankan SEKALI di Supabase SQL Editor (idempoten)
-- Pengganti grant-quick.sql / grant-only.sql yang lama (JANGAN dipakai lagi).
--
-- Model akses:
--   * anon (publik, tanpa login):
--       - BACA: projects, certificates, timeline, reviews
--       - TULIS: hanya INSERT contacts (via fungsi aman submit_contact)
--                dan INSERT reviews dengan validasi ketat
--       - TIDAK BISA: update/delete/truncate apa pun, baca contacts
--   * authenticated (admin login via Supabase Auth):
--       - PENUH: projects, certificates, timeline, reviews (kelola konten)
--       - BACA+DELETE: contacts (pesan masuk pengunjung)
-- ============================================================================

-- 1. RLS AKTIF di semua tabel
ALTER TABLE reviews      ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline     ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts     ENABLE ROW LEVEL SECURITY;

-- 2. Bersihkan policy lama (idempoten)
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN SELECT schemaname, tablename, policyname
           FROM pg_policies WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
  END LOOP;
END $$;

-- 3. Tarik kembali hak tulis dari anon (defense-in-depth; RLS tetap penjaga utama)
REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON SCHEMA public FROM anon;
GRANT USAGE ON SCHEMA public TO anon;

-- 4. Policies — publik boleh BACA tabel konten
CREATE POLICY "public read projects"     ON projects     FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read certificates" ON certificates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read timeline"     ON timeline     FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read reviews"      ON reviews      FOR SELECT TO anon, authenticated USING (true);

-- 5. Policies — publik hanya boleh KIRIM review (validasi di policy)
CREATE POLICY "anon insert reviews" ON reviews FOR INSERT TO anon WITH CHECK (
  char_length(name) BETWEEN 1 AND 100
  AND char_length(text) BETWEEN 1 AND 1000
  AND stars BETWEEN 1 AND 5
);

-- 6. Policies — admin terautentikasi mengelola konten
CREATE POLICY "admin write projects" ON projects FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
CREATE POLICY "admin write certificates" ON certificates FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
CREATE POLICY "admin write timeline" ON timeline FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
CREATE POLICY "admin write reviews" ON reviews FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 7. Policies — pesan kontak HANYA untuk admin (anon tidak pernah baca/kirim langsung)
CREATE POLICY "admin read contacts"   ON contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin delete contacts" ON contacts FOR DELETE TO authenticated USING (true);

-- 8. Fungsi aman untuk form kontak: pola standar "RPC publik" Supabase.
--    SECURITY DEFINER karena anon sengaja TIDAK punya INSERT policy di contacts;
--    pengamanannya: search_path terkunci, validasi input ketat, rate limit per IP,
--    EXECUTE hanya utk anon/authenticated, dan pemilik fungsi = postgres (bypass
--    RLS hanya untuk fungsi ini, bukan tabelnya).
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS client_ip TEXT;

CREATE OR REPLACE FUNCTION public.submit_contact(
  p_name TEXT, p_email TEXT, p_message TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ip TEXT := nullif(trim(split_part(coalesce(current_setting('request.header.x-forwarded-for', true), ''), ',', 1)), ' ');
BEGIN
  IF NULLIF(btrim(coalesce(p_name, '')), '') IS NULL
     OR NULLIF(btrim(coalesce(p_email, '')), '') IS NULL
     OR NULLIF(btrim(coalesce(p_message, '')), '') IS NULL THEN
    RAISE EXCEPTION 'invalid input';
  END IF;
  IF char_length(p_name) > 100 OR char_length(p_email) > 200 OR char_length(p_message) > 5000 THEN
    RAISE EXCEPTION 'input too long';
  END IF;
  IF p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'invalid email';
  END IF;
  -- rate limit per IP (atau global 1 menit bila IP tak terbaca)
  IF v_ip IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM public.contacts
               WHERE client_ip = v_ip AND created_at > now() - interval '10 minutes') THEN
      RAISE EXCEPTION 'rate limited';
    END IF;
  ELSE
    IF EXISTS (SELECT 1 FROM public.contacts
               WHERE created_at > now() - interval '1 minute') THEN
      RAISE EXCEPTION 'rate limited';
    END IF;
  END IF;
  INSERT INTO public.contacts (name, email, message, client_ip)
  VALUES (btrim(p_name), lower(btrim(p_email)), btrim(p_message), v_ip);
END;
$$;

-- Cabut grant EXECUTE dari PUBLIC lalu beri eksplisit (agar tidak bisa dipanggil role lain)
REVOKE ALL ON FUNCTION public.submit_contact(TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_contact(TEXT, TEXT, TEXT) TO anon, authenticated;

-- 9. Kontak dari halaman publik diproses lewat fungsi → tabel contacts tidak
--    boleh disentuh anon sama sekali (RLS sudah menolak; tambah penolakan eksplisit
--    di GRANT level tabel juga).
