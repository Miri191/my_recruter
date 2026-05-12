import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AuthGate from './components/auth/AuthGate';
import Dashboard from './pages/Dashboard';
import NewInvitation from './pages/NewInvitation';
import CandidateLink from './pages/CandidateLink';
import Questionnaire from './pages/Questionnaire';
import ThankYou from './pages/ThankYou';
import Report from './pages/Report';
import Roles from './pages/Roles';
import Toast from './components/ui/Toast';

function Protected({ children }) {
  return <AuthGate>{children}</AuthGate>;
}

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Public — candidate questionnaire flow */}
        <Route path="/q/:id" element={<Questionnaire />} />
        <Route path="/q/:id/done" element={<ThankYou />} />

        {/* Protected — recruiter routes */}
        <Route path="/" element={<Protected><Dashboard /></Protected>} />
        <Route path="/new" element={<Protected><NewInvitation /></Protected>} />
        <Route path="/roles" element={<Protected><Roles /></Protected>} />
        <Route path="/link/:id" element={<Protected><CandidateLink /></Protected>} />
        <Route path="/report/:id" element={<Protected><Report /></Protected>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </AppProvider>
  );
}
