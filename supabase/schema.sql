-- 1. Table Reviews
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role TEXT,
  text VARCHAR(1000) NOT NULL,
  stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table Projects
CREATE TABLE projects (
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
CREATE TABLE certificates (
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
CREATE TABLE timeline (
  id TEXT PRIMARY KEY,
  q TEXT NOT NULL,
  title TEXT NOT NULL,
  "desc" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table Contacts
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Rules
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Public Policies
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public insert/update/delete projects" ON projects FOR ALL USING (true);

CREATE POLICY "Public read certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public insert/update/delete certificates" ON certificates FOR ALL USING (true);

CREATE POLICY "Public read timeline" ON timeline FOR SELECT USING (true);
CREATE POLICY "Public insert/update/delete timeline" ON timeline FOR ALL USING (true);

CREATE POLICY "Public insert contacts" ON contacts FOR INSERT WITH CHECK (true);
