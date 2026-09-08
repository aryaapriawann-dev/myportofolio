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

-- PENTING: kebijakan akses ada di supabase/hardening.sql (RLS + policy).
-- JANGAN lagi menjalankan skrip 'DISABLE RLS + GRANT ALL ke anon'.
