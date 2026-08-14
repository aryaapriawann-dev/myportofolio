-- ============================================================
--  grant-only.sql  —  Jalankan SEKALI di Supabase Dashboard
--  (SQL Editor → New query → paste → Run)
--
--  Tujuannya: beri hak akses ke role "anon" (yang dipakai
--  anon key di frontend) supaya bisa SELECT/INSERT/UPDATE/DELETE.
--  Tanpa ini, error "42501 permission denied" akan terus muncul
--  meskipun tabel sudah ada dan RLS sudah dimatikan.
--
--  Aman dijalankan berulang kali (idempoten).
-- ============================================================

-- 1) Pastikan RLS mati agar anon key langsung punya akses
ALTER TABLE reviews      DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects     DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE timeline     DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts     DISABLE ROW LEVEL SECURITY;

-- 2) GRANT eksplisit ke role anon & authenticated
--    (INI bagian wajib yang selama ini terlewat)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE reviews      TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE projects     TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE certificates TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE timeline     TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE contacts     TO anon, authenticated;

-- 3) Realtime: daftarkan tabel ke publication supabase_realtime
--    agar upload dari admin langsung tampil di homepage (tanpa refresh)
DO $$
DECLARE
  r RECORD;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    FOR r IN
      SELECT 'certificates' AS t UNION ALL
      SELECT 'projects'     AS t UNION ALL
      SELECT 'timeline'     AS t UNION ALL
      SELECT 'reviews'      AS t UNION ALL
      SELECT 'contacts'     AS t
    LOOP
      BEGIN
        EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', r.t);
      EXCEPTION WHEN duplicate_object THEN
        NULL; -- sudah terdaftar, abaikan
      END;
    END LOOP;
  END IF;
END $$;

-- ============================================================
--  VERIFIKASI (jalankan terpisah di SQL Editor):
--  SELECT pubname, tablename
--  FROM pg_publication_tables
--  WHERE pubname = 'supabase_realtime';
--  → pastikan certificates, projects, timeline muncul.
-- ============================================================
