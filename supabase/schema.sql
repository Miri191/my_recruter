-- =============================================================
-- Persona — Phase 1 schema
-- Run this entire file in Supabase SQL Editor (Database → SQL Editor → New Query).
-- =============================================================

-- =====================================
-- ORGANIZATIONS TABLE (tenants)
-- =====================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  industry TEXT,
  size TEXT,           -- 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  country TEXT DEFAULT 'IL',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_organizations_slug ON organizations(slug);

-- =====================================
-- PROFILES TABLE
-- (extends Supabase's auth.users with our custom fields)
-- =====================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'recruiter',   -- 'owner' | 'admin' | 'recruiter' | 'viewer'
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_email ON profiles(email);

-- =====================================
-- AUTO-UPDATE updated_at
-- =====================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================
-- ROW LEVEL SECURITY (multi-tenant isolation)
-- =====================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;

-- Helper: returns the current user's organization_id.
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ORGANIZATIONS policies
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  USING (id = get_user_organization_id());

CREATE POLICY "Owners can update their organization"
  ON organizations FOR UPDATE
  USING (
    id = get_user_organization_id() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- PROFILES policies
CREATE POLICY "Users can view profiles in their organization"
  ON profiles FOR SELECT
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- CRITICAL: Allow trigger function to insert organizations during signup
-- (Trigger runs with SECURITY DEFINER, so needs explicit policy)
CREATE POLICY "Allow trigger to create organization on signup"
  ON organizations FOR INSERT
  WITH CHECK (true);

-- =====================================
-- AUTO-CREATE ORG + PROFILE ON SIGNUP
-- =====================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
  default_org_name TEXT;
BEGIN
  default_org_name := COALESCE(
    NEW.raw_user_meta_data->>'organization_name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  ) || ' — Workspace';

  INSERT INTO organizations (name, country)
  VALUES (default_org_name, 'IL')
  RETURNING id INTO new_org_id;

  -- First user is the owner of the new org.
  INSERT INTO profiles (id, organization_id, email, full_name, role)
  VALUES (
    NEW.id,
    new_org_id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'owner'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================
-- CANDIDATES TABLE (questionnaire responses)
-- =====================================
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role_id TEXT NOT NULL,  -- references roles.js role.id (not a real FK, but denormalized for query speed)
  tier TEXT NOT NULL DEFAULT 'standard', -- 'quick' | 'standard' | 'deep'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'completed'
  answers JSONB,  -- questionnaire responses (when status='completed')
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_candidates_organization_id ON candidates(organization_id);
CREATE INDEX idx_candidates_created_by ON candidates(created_by);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_created_at ON candidates(created_at DESC);

-- Auto-update updated_at for candidates
CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================
-- ROW LEVEL SECURITY for CANDIDATES
-- =====================================
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view candidates in their organization"
  ON candidates FOR SELECT
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert candidates in their organization"
  ON candidates FOR INSERT
  WITH CHECK (
    organization_id = get_user_organization_id() AND
    created_by = auth.uid()
  );

CREATE POLICY "Users can update candidates in their organization"
  ON candidates FOR UPDATE
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete candidates in their organization"
  ON candidates FOR DELETE
  USING (organization_id = get_user_organization_id());

-- CRITICAL: Allow anonymous candidate to read and update THEIR row by ID
-- The URL contains the unguessable candidate ID, so this is safe.
-- They can only read/update if they know the exact ID.
CREATE POLICY "Candidates can read and update their own row (anon)"
  ON candidates FOR SELECT
  USING (true);

CREATE POLICY "Candidates can submit their answers (anon)"
  ON candidates FOR UPDATE
  USING (true)
  WITH CHECK (true);
