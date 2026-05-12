import { createContext, useContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { loadAll, saveAll } from '../lib/storage';

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

function seedIfEmpty(existing) {
  if (existing.length > 0) return existing;
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const completedAnswers = {};
  for (let i = 1; i <= 50; i++) {
    completedAnswers[i] = ((i * 7) % 5) + 1;
  }

  return [
    {
      id: uuid(),
      name: 'מירי כהן',
      email: 'miri@example.com',
      phone: '0501234567',
      roleId: 'pm',
      status: 'completed',
      createdAt: twoDaysAgo.toISOString(),
      completedAt: dayAgo.toISOString(),
      answers: completedAnswers,
    },
    {
      id: uuid(),
      name: 'יוסי לוי',
      email: 'yossi@example.com',
      phone: '0529876543',
      roleId: 'sales',
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

  const createCandidate = useCallback(({ name, email, phone, roleId }) => {
    const c = {
      id: uuid(),
      name,
      email,
      phone,
      roleId,
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
    }),
    [state, createCandidate, updateCandidate, submitAnswers, deleteCandidate, getCandidate, showToast, clearToast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
