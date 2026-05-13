/**
 * Migration detection from localStorage to Supabase.
 * Phase 1: detect + flag. Phase 2 will copy the actual rows.
 */

const STORAGE_KEY = 'recruiter_app_data';
const ROLES_KEY = 'recruiter_custom_roles';
const FLAG_KEY = 'migrationComplete';
const FLAG_DATE_KEY = 'migrationDate';

function readCandidates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.candidates) ? parsed.candidates : [];
  } catch {
    return [];
  }
}

function readCustomRoles() {
  try {
    const raw = localStorage.getItem(ROLES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLocalStorageStats() {
  const candidates = readCandidates();
  const customRoles = readCustomRoles();
  const reports = candidates.filter((c) => c.status === 'completed').length;
  return {
    candidatesCount: candidates.length,
    reportsCount: reports,
    customRolesCount: customRoles.length,
    hasData: candidates.length > 0 || customRoles.length > 0,
  };
}

export function hasLocalStorageData() {
  return getLocalStorageStats().hasData;
}

export function isMigrationComplete() {
  return localStorage.getItem(FLAG_KEY) === 'true';
}

export function flagMigrationComplete() {
  localStorage.setItem(FLAG_KEY, 'true');
  localStorage.setItem(FLAG_DATE_KEY, new Date().toISOString());
}

export function flagMigrationSkipped() {
  localStorage.setItem(FLAG_KEY, 'skipped');
  localStorage.setItem(FLAG_DATE_KEY, new Date().toISOString());
}

/**
 * Phase 1: marks the migration as "noted" without moving data yet.
 * Phase 2 will replace this with real row-by-row insertion to Supabase.
 */
export async function migrateLocalStorageToSupabase(_userId) {
  flagMigrationComplete();
  return {
    success: true,
    message:
      'הנתונים סומנו להעברה. ההעברה המלאה למסד הנתונים תתבצע בעדכון הבא של המערכת.',
  };
}
