import { createContext, useContext, useEffect, useReducer, useState, useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { loadAll, saveAll, upsertCustomRole, removeCustomRole } from '../lib/storage';
import { getRoles, isDefaultRoleId } from '../data/roles';
import { STANDARD_ITEMS } from '../data/questionnaires';

const AppContext = createContext(null);

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

// Generate plausible answers for a target BIG5 profile (0-100 per dim).
// Used to populate the seeded demo candidate so the report shows
// meaningful data on first load.
function generateDemoAnswers(targets) {
  const answers = {};
  STANDARD_ITEMS.forEach((item) => {
    const dim = item.dimension === 'N' ? 'S' : item.dimension;
    const target = targets[dim] ?? 50;
    // Convert 0-100 target into a 1-5 scale value.
    const v15 = Math.round((target / 100) * 4 + 1);
    let answer;
    if (item.dimension === 'N') {
      // Scoring flips N → S, so for N+ items respond inversely to target.
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

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    candidates: [],
    ready: false,
    toast: null,
  });

  useEffect(() => {
    const stored = loadAll();
    const seeded = seedIfEmpty(stored.candidates);
    if (seeded !== stored.candidates) saveAll({ candidates: seeded });
    dispatch({ type: 'HYDRATE', payload: seeded });
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    saveAll({ candidates: state.candidates });
  }, [state.candidates, state.ready]);

  const createCandidate = useCallback(({ name, email, phone, roleId, tier }) => {
    const c = {
      id: uuid(),
      name,
      email,
      phone,
      roleId,
      tier: tier || 'standard',
      status: 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null,
      answers: null,
    };
    dispatch({ type: 'ADD', payload: c });
    return c;
  }, []);

  const updateCandidate = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE', id, updates });
  }, []);

  const submitAnswers = useCallback((id, answers) => {
    dispatch({
      type: 'UPDATE',
      id,
      updates: {
        answers,
        status: 'completed',
        completedAt: new Date().toISOString(),
      },
    });
  }, []);

  const deleteCandidate = useCallback((id) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const getCandidate = useCallback(
    (id) => state.candidates.find((c) => c.id === id),
    [state.candidates]
  );

  const showToast = useCallback((message, tone = 'success') => {
    dispatch({ type: 'TOAST', payload: { message, tone, id: Date.now() } });
  }, []);

  const clearToast = useCallback(() => {
    dispatch({ type: 'TOAST', payload: null });
  }, []);

  // ----- Roles -----
  const [rolesVersion, setRolesVersion] = useState(0);
  const roles = useMemo(() => getRoles(), [rolesVersion]);
  const getRole = useCallback((id) => roles.find((r) => r.id === id), [roles]);

  const saveRole = useCallback((role) => {
    upsertCustomRole(role);
    setRolesVersion((v) => v + 1);
  }, []);

  const deleteRole = useCallback(
    (id) => {
      removeCustomRole(id);
      setRolesVersion((v) => v + 1);
    },
    []
  );

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
      createCandidate,
      updateCandidate,
      submitAnswers,
      deleteCandidate,
      getCandidate,
      showToast,
      clearToast,
      // Roles
      roles,
      getRole,
      saveRole,
      deleteRole,
      resetRole,
    }),
    [
      state,
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
