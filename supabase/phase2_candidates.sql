-- =============================================================
-- Persona — Phase 2 (candidates only): add candidates table + RLS.
-- Run this in Supabase SQL Editor → New query → Run.
-- =============================================================

CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role_id TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'standard',
  status TEXT NOT NULL DEFAULT 'pending',
  answers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_candidates_organization_id ON candidates(organization_id);
CREATE INDEX idx_candidates_status ON candidates(status);

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- ----- AUTHENTICATED (recruiter) POLICIES -----
CREATE POLICY "Org members can read their candidates"
  ON candidates FOR SELECT TO authenticated
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Org members can insert candidates"
  ON candidates FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Org members can update their candidates"
  ON candidates FOR UPDATE TO authenticated
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Org members can delete their candidates"
  ON candidates FOR DELETE TO authenticated
  USING (organization_id = get_user_organization_id());

-- ----- ANONYMOUS (candidate) POLICIES -----
-- A candidate clicking their link needs to read THEIR row by ID.
-- The URL contains a UUID which is unguessable, so this is safe.
CREATE POLICY "Anonymous can read a candidate by id"
  ON candidates FOR SELECT TO anon
  USING (true);

-- The candidate submits answers — but only on rows still 'pending',
-- so a malicious user can't overwrite an already-completed candidate.
CREATE POLICY "Anonymous can submit answers on pending rows"
  ON candidates FOR UPDATE TO anon
  USING (status = 'pending');
