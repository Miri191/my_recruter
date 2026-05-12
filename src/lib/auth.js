/**
 * Lightweight password gate.
 *
 * IMPORTANT: this is client-side only — adds friction against casual
 * visitors, not real security. Anyone with DevTools can bypass by
 * modifying localStorage. For real auth, add a backend (Supabase/etc).
 *
 * The password lives in:
 *   - VITE_APP_PASSWORD env var (set in Vercel → Settings → Env Vars)
 *   - falls back to DEFAULT_PASSWORD below if the env var isn't set
 */

const DEFAULT_PASSWORD = 'persona2026';
const STORAGE_KEY = 'persona_unlocked';

function activePassword() {
  return (import.meta.env.VITE_APP_PASSWORD || DEFAULT_PASSWORD).trim();
}

export function isUnlocked() {
  return localStorage.getItem(STORAGE_KEY) === 'yes';
}

export function unlock(input) {
  if ((input || '').trim() === activePassword()) {
    localStorage.setItem(STORAGE_KEY, 'yes');
    return true;
  }
  return false;
}

export function lock() {
  localStorage.removeItem(STORAGE_KEY);
}
