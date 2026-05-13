/**
 * Data access abstraction — currently delegates to localStorage but
 * provides a stable API the rest of the app calls. Phase 2 will swap
 * the internals to Supabase queries without touching callers.
 *
 * For now, this just wraps `storage.js` so the app's data flow is
 * already routed through the abstraction.
 */

import {
  getCandidates as getCandidatesLocal,
  getCandidate as getCandidateLocal,
  saveCandidate as saveCandidateLocal,
  updateCandidate as updateCandidateLocal,
  deleteCandidate as deleteCandidateLocal,
  loadCustomRoles,
  upsertCustomRole,
  removeCustomRole,
} from './storage';

export const dataLayer = {
  // Candidates
  async getCandidates() {
    return getCandidatesLocal();
  },
  async getCandidate(id) {
    return getCandidateLocal(id);
  },
  async saveCandidate(candidate) {
    return saveCandidateLocal(candidate);
  },
  async updateCandidate(id, updates) {
    return updateCandidateLocal(id, updates);
  },
  async deleteCandidate(id) {
    deleteCandidateLocal(id);
  },

  // Custom roles
  async getCustomRoles() {
    return loadCustomRoles();
  },
  async upsertCustomRole(role) {
    return upsertCustomRole(role);
  },
  async deleteCustomRole(id) {
    removeCustomRole(id);
  },
};
