const KEY = 'recruiter_app_data';
const VERSION = 1;

function emptyState() {
  return { version: VERSION, candidates: [] };
}

function readRaw() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return emptyState();
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
