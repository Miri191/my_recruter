const KEY = 'recruiter_app_data';
const VERSION = 2; // bumped from 1 when adding tier support + new IPIP item IDs

function emptyState() {
  return { version: VERSION, candidates: [] };
}

function readRaw() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return emptyState();
    // Schema bump — old data (v1, integer-keyed answers) is incompatible
    // with the new tier-based questionnaires. Wipe and re-seed.
    if (parsed.version !== VERSION) return emptyState();
    if (!Array.isArray(parsed.candidates)) parsed.candidates = [];
    return parsed;
  } catch {
    return emptyState();
  }
}

function writeRaw(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function loadAll() {
  return readRaw();
}

export function saveAll(state) {
  writeRaw({ version: VERSION, candidates: state.candidates || [] });
}

export function getCandidates() {
  return readRaw().candidates;
}

export function getCandidate(id) {
  return readRaw().candidates.find((c) => c.id === id);
}

export function saveCandidate(candidate) {
  const state = readRaw();
  const idx = state.candidates.findIndex((c) => c.id === candidate.id);
  if (idx >= 0) state.candidates[idx] = candidate;
  else state.candidates.push(candidate);
  writeRaw(state);
  return candidate;
}

export function updateCandidate(id, updates) {
  const state = readRaw();
  const idx = state.candidates.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  state.candidates[idx] = { ...state.candidates[idx], ...updates };
  writeRaw(state);
  return state.candidates[idx];
}

export function deleteCandidate(id) {
  const state = readRaw();
  state.candidates = state.candidates.filter((c) => c.id !== id);
  writeRaw(state);
}

export function clearAll() {
  writeRaw(emptyState());
}

// ============================================================
// AUDIT LOG — compliance trail of recruiter views
// ============================================================
const AUDIT_KEY = 'recruiter_audit_log';
const AUDIT_MAX_ENTRIES = 200;

function readAuditLog() {
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function logView(entry) {
  const log = readAuditLog();
  log.push({
    ...entry,
    viewedAt: entry.viewedAt || new Date().toISOString(),
  });
  const trimmed = log.slice(-AUDIT_MAX_ENTRIES);
  try {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full or unavailable — fail silent
  }
}

export function getViewHistory(candidateId) {
  const log = readAuditLog();
  if (!candidateId) return log;
  return log.filter((e) => e.candidateId === candidateId);
}

export function clearAuditLog() {
  localStorage.removeItem(AUDIT_KEY);
}

// ============================================================
// CUSTOM ROLES — overrides for default roles + new user-created roles
// ============================================================
const ROLES_KEY = 'recruiter_custom_roles';

export function loadCustomRoles() {
  try {
    const raw = localStorage.getItem(ROLES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCustomRoles(roles) {
  try {
    localStorage.setItem(ROLES_KEY, JSON.stringify(roles || []));
  } catch {
    // localStorage full — fail silent
  }
}

export function upsertCustomRole(role) {
  const list = loadCustomRoles();
  const idx = list.findIndex((r) => r.id === role.id);
  if (idx >= 0) list[idx] = role;
  else list.push(role);
  saveCustomRoles(list);
  return role;
}

export function removeCustomRole(id) {
  const list = loadCustomRoles().filter((r) => r.id !== id);
  saveCustomRoles(list);
}
