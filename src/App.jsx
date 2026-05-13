import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';
import NewInvitation from './pages/NewInvitation';
import CandidateLink from './pages/CandidateLink';
import Questionnaire from './pages/Questionnaire';
import ThankYou from './pages/ThankYou';
import Report from './pages/Report';
import Roles from './pages/Roles';
import Toast from './components/ui/Toast';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          {/* Public — marketing + candidate flow */}
          <Route path="/" element={<Landing />} />
          <Route path="/q/:id" element={<Questionnaire />} />
          <Route path="/q/:id/done" element={<ThankYou />} />

          {/* Public — auth flows (Supabase mode) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected — recruiter routes */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new"
            element={
              <ProtectedRoute>
                <NewInvitation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute>
                <Roles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/link/:id"
            element={
              <ProtectedRoute>
                <CandidateLink />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report/:id"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toast />
      </AppProvider>
    </AuthProvider>
  );
}
