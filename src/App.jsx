import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import NewInvitation from './pages/NewInvitation';
import CandidateLink from './pages/CandidateLink';
import Questionnaire from './pages/Questionnaire';
import ThankYou from './pages/ThankYou';
import Report from './pages/Report';
import Toast from './components/ui/Toast';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<NewInvitation />} />
        <Route path="/link/:id" element={<CandidateLink />} />
        <Route path="/q/:id" element={<Questionnaire />} />
        <Route path="/q/:id/done" element={<ThankYou />} />
        <Route path="/report/:id" element={<Report />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </AppProvider>
  );
}
