
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import { Entry } from './pages/Entry';
import { Onboarding } from './pages/Onboarding';
import { ProtectedLayout } from './components/ProtectedLayout';
import { Dashboard } from './pages/Dashboard';
import { WorkoutView } from './pages/WorkoutView';
import { AdminPanel } from './pages/AdminPanel';
import { Settings } from './pages/Settings';

const AppRoutes = () => {
  const { loading } = useUser();
  if (loading) return <div className="h-screen w-screen bg-background flex items-center justify-center text-foreground">Loading Protocol...</div>;

  return (
    <Routes>
      <Route path="/" element={<Entry />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/app" element={<ProtectedLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="workout/:week/:day" element={<WorkoutView />} />
        <Route path="settings" element={<Settings />} />
        {/* Default logic handles redirecting to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;
