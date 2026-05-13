import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthGate from './AuthGate';

/**
 * Route guard. Two modes:
 *
 *  - Supabase enabled (env vars set): require a real authenticated user.
 *    Unauthenticated visitors are redirected to /login.
 *
 *  - Supabase NOT enabled (current state): defer to the legacy AuthGate
 *    password screen so the app keeps working in localStorage-only mode.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, isSupabaseEnabled } = useAuth();
  const location = useLocation();

  if (!isSupabaseEnabled) {
    return <AuthGate>{children}</AuthGate>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto border-2 border-petrol border-t-transparent rounded-full animate-spin mb-3" />
          <div className="eyebrow text-ink-mute">טוענת...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
