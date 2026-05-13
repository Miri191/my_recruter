import { createContext, useContext, useEffect, useReducer, useState, useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { loadAll, saveAll, upsertCustomRole, removeCustomRole } from '../lib/storage';
import { getRoles, isDefaultRoleId } from '../data/roles';
import { STANDARD_ITEMS } from '../data/questionnaires';
import { supabase, isSupabaseEnabled } from '../lib/supabase';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

// ---------- transformers between DB (snake_case) and JS (camelCase) ----------
function fromDbRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    roleId: row.role_id,
    tier: row.tier || 'standard',
    status: row.status,
    answers: row.answers,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, candidates: action.payload, ready: true };
    case 'ADD':
      return { ...state, candidates: [action.payload, ...state.candidates] };
    case 'UPDATE':
      return {
        ...state,
        candidates: state.candidates.map((c) =>
          c.id === action.id ? { ...c, ...action.updates } : c
        ),
      };
    case 'REMOVE':
      return {
        ...state,
        candidates: state.candidates.filter((c) => c.id !== action.id),
      };
    case 'TOAST':
      return { ...state, toast: action.payload };
    default:
      return state;
  }
}

// ---------- localStorage-mode seed ----------
function generateDemoAnswers(targets) {
  const answers = {};
  STANDARD_ITEMS.forEach((item) => {
    const dim = item.dimension === 'N' ? 'S' : item.dimension;
    const target = targets[dim] ?? 50;
    const v15 = Math.round((target / 100) * 4 + 1);
    let answer;
    if (item.dimension === 'N') {
      answer = item.reverse ? v15 : 6 - v15;
    } else {
      answer = item.reverse ? 6 - v15 : v15;
    }
    answers[item.id] = Math.max(1, Math.min(5, answer));
  });
  return answers;
}

function seedIfEmpty(existing) {
  if (existing.length > 0) return existing;
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  return [
    {
      id: uuid(),
      name: 'מירי כהן',
      email: 'miri@example.com',
      phone: '0501234567',
      roleId: 'pm',
      tier: 'standard',
      status: 'completed',
      createdAt: twoDaysAgo.toISOString(),
      completedAt: dayAgo.toISOString(),
      answers: generateDemoAnswers({ E: 68, A: 72, C: 82, S: 82, O: 78 }),
    },
    {
      id: uuid(),
      name: 'יוסי לוי',
      email: 'yossi@example.com',
      phone: '0529876543',
      roleId: 'sales',
      tier: 'standard',
      status: 'pending',
      createdAt: dayAgo.toISOString(),
      completedAt: null,
      answers: null,
    },
    {
      id: uuid(),
      name: 'דנה כץ',
      email: 'dana@example.com',
      phone: '0547654321',
      roleId: 'designer',
      tier: 'standard',
      status: 'pending',
      createdAt: now.toISOString(),
      completedAt: null,
      answers: null,
    },
  ];
}

// ============================================================
// PROVIDER
// ============================================================
export function AppProvider({ children }) {
  const auth = useAuth();
  const { isAuthenticated, organization, user, loading: authLoading } = auth;

  // Cloud mode: real user in an org via Supabase.
  // Otherwise: local mode (legacy AuthGate + localStorage demo data).
  const cloudMode = isSupabaseEnabled && isAuthenticated && !!organization;

  const [state, dispatch] = useReducer(reducer, {
    candidates: [],
    ready: false,
    toast: null,
  });

  // Load candidates whenever mode/auth changes.
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    async function load() {
      if (cloudMode) {
        const { data, error } = await supabase
          .from('candidates')
          .select('*')
          .order('created_at', { ascending: false });
        if (cancelled) return;
        if (error) {
          console.error('Failed to load candidates from Supabase:', error);
          dispatch({ type: 'HYDRATE', payload: [] });
          return;
        }
        dispatch({ type: 'HYDRATE', payload: data.map(fromDbRow) });
      } else {
        // Local mode: load from localStorage + seed demo candidates if empty
        const stored = loadAll();
        const seeded = seedIfEmpty(stored.candidates);
        if (seeded !== stored.candidates) saveAll({ candidates: seeded });
        dispatch({ type: 'HYDRATE', payload: seeded });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [authLoading, cloudMode]);

  // Persist to localStorage in local mode only.
  useEffect(() => {
    if (!state.ready) return;
    if (cloudMode) return;
    saveAll({ candidates: state.candidates });
  }, [state.candidates, state.ready, cloudMode]);

  // ---------- CRUD ----------
  const createCandidate = useCallback(
    async ({ name, email, phone, roleId, tier }) => {
      const cleanTier = tier || 'standard';
      if (cloudMode) {
        if (!organization || !user) {
          throw new Error('Organization or user not loaded');
        }
        const { data, error } = await supabase
          .from('candidates')
          .insert({
            organization_id: organization.id,
            created_by: user.id,
            name,
            email,
            phone,
            role_id: roleId,
            tier: cleanTier,
            status: 'pending',
          })
          .select()
          .single();
        if (error) {
          console.error('Failed to create candidate:', error);
          throw error;
        }
        const c = fromDbRow(data);
        dispatch({ type: 'ADD', payload: c });
        return c;
      }
      const c = {
        id: uuid(),
        name,
        email,
        phone,
        roleId,
        tier: cleanTier,
        status: 'pending',
        createdAt: new Date().toISOString(),
        completedAt: null,
        answers: null,
      };
      dispatch({ type: 'ADD', payload: c });
      return c;
    },
    [cloudMode, organization, user]
  );

  const updateCandidate = useCallback(
    async (id, updates) => {
      if (cloudMode) {
        if (!organization) {
          throw new Error('Organization not loaded');
        }
        const dbUpdates = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.email !== undefined) dbUpdates.email = updates.email;
        if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
        if (updates.roleId !== undefined) dbUpdates.role_id = updates.roleId;
        if (updates.tier !== undefined) dbUpdates.tier = updates.tier;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.answers !== undefined) dbUpdates.answers = updates.answers;
        if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;
        // SECURITY: Only update candidates that belong to this organization
        const { error } = await supabase
          .from('candidates')
          .update(dbUpdates)
          .eq('id', id)
          .eq('organization_id', organization.id);
        if (error) {
          console.error('Failed to update candidate:', error);
          throw error;
        }
      }
      dispatch({ type: 'UPDATE', id, updates });
    },
    [cloudMode, organization]
  );

  const submitAnswers = useCallback(
    async (id, answers) => {
      const completedAt = new Date().toISOString();
      if (cloudMode) {
        if (!organization) {
          throw new Error('Organization not loaded');
        }
        // SECURITY: Only update candidates that belong to this organization
        const { error } = await supabase
          .from('candidates')
          .update({ answers, status: 'completed', completed_at: completedAt })
          .eq('id', id)
          .eq('organization_id', organization.id);
        if (error) {
          console.error('Failed to submit answers:', error);
          throw error;
        }
      }
      dispatch({
        type: 'UPDATE',
        id,
        updates: { answers, status: 'completed', completedAt },
      });
    },
    [cloudMode, organization]
  );

  const deleteCandidate = useCallback(
    async (id) => {
      if (cloudMode) {
        if (!organization) {
          throw new Error('Organization not loaded');
        }
        // SECURITY: Only delete candidates that belong to this organization
        const { error } = await supabase
          .from('candidates')
          .delete()
          .eq('id', id)
          .eq('organization_id', organization.id);
        if (error) {
          console.error('Failed to delete candidate:', error);
          throw error;
        }
      }
      dispatch({ type: 'REMOVE', id });
    },
    [cloudMode, organization]
  );

  const getCandidate = useCallback(
    (id) => state.candidates.find((c) => c.id === id),
    [state.candidates]
  );

  // ---------- Toast ----------
  const showToast = useCallback((message, tone = 'success') => {
    dispatch({ type: 'TOAST', payload: { message, tone, id: Date.now() } });
  }, []);
  const clearToast = useCallback(() => {
    dispatch({ type: 'TOAST', payload: null });
  }, []);

  // ---------- Roles (still localStorage in Phase 2 — no roles table yet) ----------
  const [rolesVersion, setRolesVersion] = useState(0);
  const roles = useMemo(() => getRoles(), [rolesVersion]);
  const getRole = useCallback((id) => roles.find((r) => r.id === id), [roles]);
  const saveRole = useCallback((role) => {
    upsertCustomRole(role);
    setRolesVersion((v) => v + 1);
  }, []);
  const deleteRole = useCallback((id) => {
    removeCustomRole(id);
    setRolesVersion((v) => v + 1);
  }, []);
  const resetRole = useCallback((id) => {
    if (!isDefaultRoleId(id)) return;
    removeCustomRole(id);
    setRolesVersion((v) => v + 1);
  }, []);

  const value = useMemo(
    () => ({
      candidates: state.candidates,
      ready: state.ready,
      toast: state.toast,
      cloudMode,
      createCandidate,
      updateCandidate,
      submitAnswers,
      deleteCandidate,
      getCandidate,
      showToast,
      clearToast,
      roles,
      getRole,
      saveRole,
      deleteRole,
      resetRole,
    }),
    [
      state,
      cloudMode,
      createCandidate,
      updateCandidate,
      submitAnswers,
      deleteCandidate,
      getCandidate,
      showToast,
      clearToast,
      roles,
      getRole,
      saveRole,
      deleteRole,
      resetRole,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
