-- 1. Table Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role TEXT,
  text VARCHAR(1000) NOT NULL,
  stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table Projects
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  "desc" TEXT,
  tech TEXT[],
  image TEXT,
  "liveUrl" TEXT,
  "githubUrl" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT,
  year TEXT,
  description TEXT,
  image TEXT,
  "credentialId" TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table Timeline (Experiences/Milestones)
CREATE TABLE IF NOT EXISTS timeline (
  id TEXT PRIMARY KEY,
  q TEXT NOT NULL,
  title TEXT NOT NULL,
  "desc" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hapus policy lama jika ada
DROP POLICY IF EXISTS "Public insert/update/delete certificates" ON certificates;
DROP POLICY IF EXISTS "Public read certificates" ON certificates;
DROP POLICY IF EXISTS "Public insert/update/delete projects" ON projects;
DROP POLICY IF EXISTS "Public read projects" ON projects;
DROP POLICY IF EXISTS "Public insert/update/delete timeline" ON timeline;
DROP POLICY IF EXISTS "Public read timeline" ON timeline;

-- Matikan RLS
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE timeline DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- ───────────────────────────────────────────────────────────────
-- GRANT: Wajib! DISABLE RLS saja TIDAK cukup di Postgres/Supabase.
-- Tanpa GRANT ini, role "anon" (yang dipakai anon key di frontend)
-- tetap ditolak dengan error "42501 permission denied".
-- Ini penyebab utama upload gagal & "sering gak ketampil".
-- Idempoten: aman dijalankan berulang.
-- ───────────────────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE reviews TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE projects TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE certificates TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE timeline TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE contacts TO anon, authenticated;

-- ───────────────────────────────────────────────────────────────
-- REALTIME: supaya upload dari admin langsung tampil di homepage
-- Tanpa ini, postgres_changes di page.tsx/AdminPanel tidak akan
-- memicu refresh -> upload "sering gak ketampil" sampai refresh manual.
-- Idempoten: aman dijalankan berulang kali.
-- ───────────────────────────────────────────────────────────────
DO $$
DECLARE
  r RECORD;
BEGIN
  -- Pastikan replikasi realtime aktif di level database (Supabase managed)
  IF EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    FOR r IN
      SELECT 'certificates' AS t UNION ALL
      SELECT 'projects' AS t UNION ALL
      SELECT 'timeline' AS t UNION ALL
      SELECT 'reviews' AS t UNION ALL
      SELECT 'contacts' AS t
    LOOP
      BEGIN
        EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', r.t);
      EXCEPTION WHEN duplicate_object THEN
        -- sudah terdaftar, abaikan
        NULL;
      END;
    END LOOP;
  END IF;
END $$;
